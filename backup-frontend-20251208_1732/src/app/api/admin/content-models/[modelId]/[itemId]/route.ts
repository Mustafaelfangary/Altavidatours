import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getContentModel } from '@/lib/content-models';
import prisma from '@/lib/prisma';
import { uploadFile, parseFormData } from '@/lib/file-upload';
import { NextRequest } from 'next/server';
import { validateContentData } from '../route';

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


// GET /api/admin/content-models/[modelId]/[itemId] - Get a single content item
export async function GET(
  request: NextRequest,
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
      return new NextResponse('Model not found', { status: 404 });
    }

    const item = await prisma.contentItem.findUnique({
      where: { id: itemId, modelId },
    });

    if (!item) {
      return new NextResponse('Content item not found', { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching content item:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PATCH /api/admin/content-models/[modelId]/[itemId] - Update a content item
export async function PATCH(
  request: NextRequest,
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
      return new NextResponse('Model not found', { status: 404 });
    }

    // Check if the item exists
    const existingItem = await prisma.contentItem.findUnique({
      where: { id: itemId, modelId },
    });

    if (!existingItem) {
      return new NextResponse('Content item not found', { status: 404 });
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

    // Update the content item
    const updatedItem = await prisma.contentItem.update({
      where: { id: itemId },
      data: {
        data: updatedData,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating content item:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// DELETE /api/admin/content-models/[modelId]/[itemId] - Delete a content item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { modelId: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { modelId, itemId } = params;
    
    // Check if the item exists
    const existingItem = await prisma.contentItem.findUnique({
      where: { id: itemId, modelId },
    });

    if (!existingItem) {
      return new NextResponse('Content item not found', { status: 404 });
    }

    // Delete the content item
    await prisma.contentItem.delete({
      where: { id: itemId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting content item:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

