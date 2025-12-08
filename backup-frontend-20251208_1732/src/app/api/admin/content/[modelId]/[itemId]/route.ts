import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getContentModel } from '@/lib/content-models';
import prisma from '@/lib/prisma';
import { uploadFile, parseFormData, deleteFile } from '@/lib/file-upload';

// GET /api/admin/content/[modelId]/[itemId] - Get a single content item
export async function GET(
  request: Request,
  { params }: { params: { modelId: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { modelId, itemId } = params;
    const model = getContentModel(modelId);

    if (!model) {
      return new NextResponse('Content model not found', { status: 404 });
    }

    const item = await prisma.contentItem.findUnique({
      where: { id: itemId, modelId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          include: {
            createdByUser: {
              select: { name: true, email: true, image: true },
            },
          },
        },
        createdByUser: {
          select: { name: true, email: true, image: true },
        },
        updatedByUser: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    if (!item) {
      return new NextResponse('Content item not found', { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error(`Error fetching content item ${params.itemId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH /api/admin/content/[modelId]/[itemId] - Update a content item
export async function PATCH(
  request: Request,
  { params }: { params: { modelId: string; itemId: string } }
) {
  let fileUploads: { field: string; file: any }[] = [];
  let oldData: any = null;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { modelId, itemId } = params;
    const model = getContentModel(modelId);

    if (!model) {
      return new NextResponse('Content model not found', { status: 404 });
    }

    // Get current item data
    const currentItem = await prisma.contentItem.findUnique({
      where: { id: itemId, modelId },
      select: { data: true, version: true },
    });

    if (!currentItem) {
      return new NextResponse('Content item not found', { status: 404 });
    }

    // Handle form data (including file uploads)
    const formData = await parseFormData(request);
    let data = { ...formData.data };
    oldData = { ...currentItem.data };

    // Track old files to clean up later if needed
    const oldFiles: Record<string, string> = {};
    
    // Process file uploads and track old files
    for (const [field, file] of Object.entries(formData.files)) {
      const fieldConfig = model.fields.find(f => f.id === field);
      if (fieldConfig && (fieldConfig.type === 'image' || fieldConfig.type === 'file')) {
        // Save old file path for cleanup
        if (currentItem.data[field]) {
          oldFiles[field] = currentItem.data[field];
        }
        // Upload new file
        const uploadedFile = await uploadFile(file, `${modelId}/${field}`);
        fileUploads.push({ field, file: uploadedFile });
        data[field] = uploadedFile.url;
      }
    }

    // Merge with existing data to preserve fields not in the form
    const mergedData = { ...currentItem.data, ...data };
    
    // Validate the merged data
    const validationErrors = await validateContentData(mergedData, model);
    if (validationErrors) {
      // Clean up any newly uploaded files
      await Promise.all(
        fileUploads.map(({ file }) => 
          deleteFile(file.path).catch(console.error)
        )
      );
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // Update the content item and create a new version
    const [updatedItem] = await prisma.$transaction([
      prisma.contentItem.update({
        where: { id: itemId },
        data: {
          data: mergedData,
          status: data.status || 'draft',
          publishedAt: data.status === 'published' ? new Date() : null,
          version: currentItem.version + 1,
          updatedAt: new Date(),
          updatedById: session.user.id,
          versions: {
            create: {
              version: currentItem.version + 1,
              data: mergedData,
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

    // Clean up old files that were replaced
    await Promise.all(
      Object.entries(oldFiles).map(async ([field, filePath]) => {
        try {
          await deleteFile(filePath);
        } catch (error) {
          console.error(`Error deleting old file ${filePath}:`, error);
        }
      })
    );

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(`Error updating content item ${params.itemId}:`, error);
    
    // Clean up any uploaded files in case of error
    await Promise.all(
      fileUploads.map(({ file }) => 
        deleteFile(file.path).catch(console.error)
      )
    );
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/admin/content/[modelId]/[itemId] - Delete a content item
export async function DELETE(
  request: Request,
  { params }: { params: { modelId: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { modelId, itemId } = params;
    const model = getContentModel(modelId);

    if (!model) {
      return new NextResponse('Content model not found', { status: 404 });
    }

    // Get the item to delete (for file cleanup)
    const item = await prisma.contentItem.findUnique({
      where: { id: itemId, modelId },
      select: { id: true, data: true },
    });

    if (!item) {
      return new NextResponse('Content item not found', { status: 404 });
    }

    // Delete associated files
    for (const field of model.fields) {
      if ((field.type === 'image' || field.type === 'file') && item.data[field.id]) {
        try {
          await deleteFile(item.data[field.id]);
        } catch (error) {
          console.error(`Error deleting file ${item.data[field.id]}:`, error);
        }
      }
    }

    // Delete the item and its versions
    await prisma.$transaction([
      prisma.contentVersion.deleteMany({
        where: { contentItemId: itemId },
      }),
      prisma.contentItem.delete({
        where: { id: itemId },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting content item ${params.itemId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/content/[modelId]/[itemId]/restore - Restore a previous version
export async function POST(
  request: Request,
  { params }: { params: { modelId: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { modelId, itemId } = params;
    const { version } = await request.json();

    if (!version) {
      return new NextResponse('Version is required', { status: 400 });
    }

    // Get the version to restore
    const versionToRestore = await prisma.contentVersion.findFirst({
      where: {
        contentItemId: itemId,
        version: parseInt(version),
      },
    });

    if (!versionToRestore) {
      return new NextResponse('Version not found', { status: 404 });
    }

    // Update the content item with the restored data
    const updatedItem = await prisma.contentItem.update({
      where: { id: itemId },
      data: {
        data: versionToRestore.data,
        version: versionToRestore.version,
        updatedAt: new Date(),
        updatedById: session.user.id,
      },
      include: {
        createdByUser: {
          select: { name: true, email: true, image: true },
        },
        updatedByUser: {
          select: { name: true, email: true, image: true },
        },
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error(`Error restoring version for item ${params.itemId}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Re-export the validation function from the model route
import { validateContentData } from '../route';

export { validateContentData };
