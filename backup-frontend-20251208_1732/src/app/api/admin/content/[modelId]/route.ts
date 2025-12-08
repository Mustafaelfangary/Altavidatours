import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getContentModel, ContentModel } from '@/lib/content-models';
import prisma from '@/lib/prisma';
import { uploadFile, parseFormData, deleteFile } from '@/lib/file-upload';
import { v4 as uuidv4 } from 'uuid';

// Helper function to validate content against model
export async function validateContentData(data: any, model: ContentModel) {
  const errors: Record<string, string> = {};
  
  for (const field of model.fields) {
    const value = data[field.id];
    
    // Check required fields
    if (field.required && (value === undefined || value === '' || value === null)) {
      errors[field.id] = `${field.label} is required`;
      continue;
    }
    
    // Type-specific validation
    if (value !== undefined && value !== null && value !== '') {
      switch (field.type) {
        case 'number':
          if (isNaN(Number(value))) {
            errors[field.id] = `${field.label} must be a number`;
          } else if (field.validation?.min !== undefined && Number(value) < field.validation.min) {
            errors[field.id] = `${field.label} must be at least ${field.validation.min}`;
          } else if (field.validation?.max !== undefined && Number(value) > field.validation.max) {
            errors[field.id] = `${field.label} must be at most ${field.validation.max}`;
          }
          break;
          
        case 'string':
          if (typeof value !== 'string') {
            errors[field.id] = `${field.label} must be a string`;
          } else if (field.validation?.minLength && value.length < field.validation.minLength) {
            errors[field.id] = `${field.label} must be at least ${field.validation.minLength} characters`;
          } else if (field.validation?.maxLength && value.length > field.validation.maxLength) {
            errors[field.id] = `${field.label} must be at most ${field.validation.maxLength} characters`;
          }
          break;
          
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors[field.id] = 'Please enter a valid email address';
          }
          break;
          
        case 'url':
          try {
            new URL(value);
          } catch (e) {
            errors[field.id] = 'Please enter a valid URL';
          }
          break;
      }
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

// GET /api/admin/content/[modelId] - Get all content items for a model
export async function GET(
  request: Request,
  { params }: { params: { modelId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { modelId } = params;
    const model = getContentModel(modelId);

    if (!model) {
      return new NextResponse('Content model not found', { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = { modelId };
    
    // Add search
    if (search) {
      where.OR = model.searchFields?.map(field => ({
        data: {
          path: [field],
          string_contains: search
        }
      })) || [];
    }
    
    // Add status filter
    if (status) {
      where.status = status;
    }

    // Get total count for pagination
    const total = await prisma.contentItem.count({ where });
    
    // Get paginated items
    const items = await prisma.contentItem.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
          select: { id: true, version: true, createdAt: true }
        },
        createdByUser: {
          select: { name: true, email: true, image: true }
        },
        updatedByUser: {
          select: { name: true, email: true, image: true }
        }
      }
    });

    return NextResponse.json({
      data: items,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error(`Error fetching content for model ${params.modelId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/content/[modelId] - Create a new content item
export async function POST(
  request: Request,
  { params }: { params: { modelId: string } }
) {
  let fileUploads: { field: string; file: any }[] = [];
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { modelId } = params;
    const model = getContentModel(modelId);

    if (!model) {
      return new NextResponse('Content model not found', { status: 404 });
    }

    // Handle file uploads if present
    const formData = await parseFormData(request);
    let data = formData.data;
    
    // Process file uploads
    for (const [field, file] of Object.entries(formData.files)) {
      const fieldConfig = model.fields.find(f => f.id === field);
      if (fieldConfig && (fieldConfig.type === 'image' || fieldConfig.type === 'file')) {
        const uploadedFile = await uploadFile(file, `${modelId}/${field}`);
        fileUploads.push({ field, file: uploadedFile });
        data[field] = uploadedFile.url;
      }
    }

    // Validate data against model
    const validationErrors = await validateContentData(data, model);
    if (validationErrors) {
      // Clean up any uploaded files
      await Promise.all(
        fileUploads.map(({ file }) => 
          deleteFile(file.path).catch(console.error)
        )
      );
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // Create a transaction to handle both content and version creation
    const [newItem] = await prisma.$transaction([
      // Create the content item
      prisma.contentItem.create({
        data: {
          id: uuidv4(),
          modelId,
          data,
          status: data.status || 'draft',
          publishedAt: data.status === 'published' ? new Date() : null,
          createdById: session.user.id,
          updatedById: session.user.id,
          // Create initial version
          versions: {
            create: {
              version: 1,
              data,
              createdById: session.user.id,
            },
          },
        },
        include: {
          createdByUser: {
            select: { name: true, email: true, image: true },
          },
          updatedByUser: {
            select: { name: true, email: true, image: true },
          },
        },
      }),
    ]);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(`Error creating content for model ${params.modelId}:`, error);
    
    // Clean up any uploaded files in case of error
    await Promise.all(
      fileUploads.map(({ file }) => 
        deleteFile(file.path).catch(console.error)
      )
    );
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/admin/content/[modelId] - Bulk update content items
export async function PUT(
  request: Request,
  { params }: { params: { modelId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { modelId } = params;
    const { ids, action, data } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return new NextResponse('No items selected', { status: 400 });
    }

    let result;
    const now = new Date();

    switch (action) {
      case 'publish':
        result = await prisma.contentItem.updateMany({
          where: { id: { in: ids }, modelId },
          data: { 
            status: 'published',
            publishedAt: now,
            updatedAt: now,
            updatedById: session.user.id
          },
        });
        break;

      case 'unpublish':
        result = await prisma.contentItem.updateMany({
          where: { id: { in: ids }, modelId },
          data: { 
            status: 'draft',
            updatedAt: now,
            updatedById: session.user.id
          },
        });
        break;

      case 'delete':
        // Get items to delete files
        const itemsToDelete = await prisma.contentItem.findMany({
          where: { id: { in: ids }, modelId },
          select: { id: true, data: true }
        });
        
        // Delete files
        for (const item of itemsToDelete) {
          const model = getContentModel(modelId);
          if (model) {
            for (const field of model.fields) {
              if ((field.type === 'image' || field.type === 'file') && item.data[field.id]) {
                try {
                  await deleteFile(item.data[field.id]);
                } catch (error) {
                  console.error(`Error deleting file ${item.data[field.id]}:`, error);
                }
              }
            }
          }
        }
        
        // Delete items
        result = await prisma.contentItem.deleteMany({
          where: { id: { in: ids }, modelId },
        });
        break;

      case 'update':
        result = await prisma.contentItem.updateMany({
          where: { id: { in: ids }, modelId },
          data: { 
            data: { ...data },
            updatedAt: now,
            updatedById: session.user.id
          },
        });
        break;

      default:
        return new NextResponse('Invalid action', { status: 400 });
    }

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error(`Error performing bulk action on model ${params.modelId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
