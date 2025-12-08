import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getContentModel } from '@/lib/content-models';
import prisma from '@/lib/prisma';
import { uploadFile, parseFormData } from '@/lib/file-upload';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest } from 'next/server';

interface ContentField {
  id: string;
  type: string;
  required?: boolean;
  label?: string;
  [key: string]: any;
}

interface ContentModel {
  id: string;
  name: string;
  fields: ContentField[];
}

// Helper function to validate content against model
export async function validateContentData(data: Record<string, any>, model: ContentModel) {
  const errors: Record<string, string> = {};
  
  for (const field of model.fields) {
    const value = data[field.id];
    const fieldLabel = field.label || field.id;
    
    // Check required fields
    if (field.required && (value === undefined || value === '' || value === null)) {
      errors[field.id] = `${field.label} is required`;
      continue;
    }
    
    // Add more validation as needed
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
}

// GET /api/admin/content-models/[modelId] - Get all content items for a model
export async function GET(
  request: NextRequest,
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
      return new NextResponse('Model not found', { status: 404 });
    }

    const items = await prisma.contentItem.findMany({
      where: { modelId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching content items:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/content-models/[modelId] - Create a new content item
export async function POST(
  request: NextRequest,
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
      return new NextResponse('Model not found', { status: 404 });
    }

    const formData = await parseFormData(request);
    const formDataObj = await formData.data;
    
    // Validate the data against the model
    const errors = await validateContentData(formDataObj, model);
    if (errors) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Handle file uploads if needed
    const files: Record<string, File> = {};
    for (const field of model.fields) {
      if ((field as any).type === 'file' && formDataObj[field.id] instanceof File) {
        files[field.id] = formDataObj[field.id] as File;
      }
    }

    // Upload files and update data with file URLs
    const updatedData = { ...formDataObj };
    for (const [fieldName, file] of Object.entries(files)) {
      const fileUrl = await uploadFile(file, `content/${modelId}`);
      updatedData[fieldName] = fileUrl;
    }

    // Create the content item
    const item = await prisma.contentItem.create({
      data: {
        id: uuidv4(),
        modelId,
        data: updatedData,
        order: 0, // Will be updated if needed
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating content item:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT /api/admin/content-models/[modelId] - Bulk update content items
export async function PUT(
  request: NextRequest,
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
      return new NextResponse('Model not found', { status: 404 });
    }

    const { items } = await request.json();
    
    if (!Array.isArray(items)) {
      return new NextResponse('Invalid request body', { status: 400 });
    }

    // Update items in a transaction
    const updatedItems = await prisma.$transaction(
      items.map((item) =>
        prisma.contentItem.update({
          where: { id: item.id },
          data: {
            data: item.data,
            order: item.order,
            isActive: item.isActive,
          },
        })
      )
    );

    return NextResponse.json(updatedItems);
  } catch (error) {
    console.error('Error updating content items:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
