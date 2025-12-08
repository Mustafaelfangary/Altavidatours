import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import mime from 'mime-types';
import { NextRequest } from 'next/server';

const UPLOAD_DIR = join(process.cwd(), 'public/uploads');
const UPLOAD_PATH = '/uploads';

interface UploadedFile {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
}

export async function uploadFile(file: File, subfolder: string = ''): Promise<UploadedFile> {
  try {
    // Ensure upload directory exists
    const uploadDir = join(UPLOAD_DIR, subfolder);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;
    const relativePath = join(subfolder, filename);
    const filePath = join(uploadDir, filename);
    const fileUrl = `${UPLOAD_PATH}/${subfolder ? subfolder + '/' : ''}${filename}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return {
      url: fileUrl,
      path: relativePath,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fullPath = join(process.cwd(), 'public', filePath);
    await unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

export async function parseFormData(req: NextRequest) {
  const formData = await req.formData();
  const data: Record<string, any> = {};
  const files: Record<string, File> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      files[key] = value;
    } else {
      // Handle nested fields (e.g., 'field[subfield]')
      const keys = key.split(/\[|\]/).filter(Boolean);
      let current = data;
      
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (i === keys.length - 1) {
          current[k] = value;
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
      }
    }
  }

  return { data, files };
}
