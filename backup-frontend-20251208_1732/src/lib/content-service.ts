import { prisma } from './prisma';
import { getContentModel } from './content-models';

export interface ContentItem {
  id: string;
  modelId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export async function getContentItems(modelId: string): Promise<ContentItem[]> {
  const model = getContentModel(modelId);
  if (!model) {
    throw new Error(`Content model '${modelId}' not found`);
  }

  const items = await prisma.pageContent.findMany({
    where: { key: { startsWith: `${modelId}:` } },
    orderBy: { createdAt: 'desc' },
  });

  return items.map(item => ({
    id: item.id,
    modelId,
    data: JSON.parse(item.content),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdBy: item.createdBy || 'system',
    updatedBy: item.updatedBy || 'system',
  }));
}

export async function getContentItem(modelId: string, id: string): Promise<ContentItem | null> {
  const item = await prisma.pageContent.findUnique({
    where: { id },
  });

  if (!item || !item.key.startsWith(`${modelId}:`)) {
    return null;
  }

  return {
    id: item.id,
    modelId,
    data: JSON.parse(item.content),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdBy: item.createdBy || 'system',
    updatedBy: item.updatedBy || 'system',
  };
}

export async function createContentItem(
  modelId: string, 
  data: Record<string, any>,
  userId: string
): Promise<ContentItem> {
  const model = getContentModel(modelId);
  if (!model) {
    throw new Error(`Content model '${modelId}' not found`);
  }

  // Generate a unique ID for this content item
  const contentId = `${modelId}:${Date.now()}`;
  
  const item = await prisma.pageContent.create({
    data: {
      key: contentId,
      title: data.title || `New ${model.name}`,
      content: JSON.stringify(data),
      createdBy: userId,
      updatedBy: userId,
    },
  });

  return {
    id: item.id,
    modelId,
    data,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    createdBy: userId,
    updatedBy: userId,
  };
}

export async function updateContentItem(
  modelId: string,
  id: string,
  data: Record<string, any>,
  userId: string
): Promise<ContentItem> {
  const existing = await prisma.pageContent.findUnique({
    where: { id },
  });

  if (!existing || !existing.key.startsWith(`${modelId}:`)) {
    throw new Error('Content item not found');
  }

  const updated = await prisma.pageContent.update({
    where: { id },
    data: {
      content: JSON.stringify(data),
      updatedBy: userId,
    },
  });

  return {
    id: updated.id,
    modelId,
    data: JSON.parse(updated.content),
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
    createdBy: updated.createdBy || 'system',
    updatedBy: userId,
  };
}

export async function deleteContentItem(modelId: string, id: string): Promise<void> {
  const existing = await prisma.pageContent.findUnique({
    where: { id },
  });

  if (!existing || !existing.key.startsWith(`${modelId}:`)) {
    throw new Error('Content item not found');
  }

  await prisma.pageContent.delete({
    where: { id },
  });
}

// Helper function to get content by key
export async function getContentByKey<T = any>(key: string): Promise<T | null> {
  const item = await prisma.pageContent.findUnique({
    where: { key },
  });

  if (!item) {
    return null;
  }

  try {
    return JSON.parse(item.content);
  } catch (error) {
    console.error(`Error parsing content for key ${key}:`, error);
    return null;
  }
}

// Helper function to set content by key
export async function setContentByKey<T = any>(
  key: string, 
  data: T,
  userId: string = 'system'
): Promise<void> {
  await prisma.pageContent.upsert({
    where: { key },
    update: {
      content: JSON.stringify(data),
      updatedBy: userId,
    },
    create: {
      key,
      title: key,
      content: JSON.stringify(data),
      createdBy: userId,
      updatedBy: userId,
    },
  });
}
