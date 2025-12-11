import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mediaItems = [];
    
    // Scan images directory
    const imagesDir = join(process.cwd(), "public", "images");
    if (existsSync(imagesDir)) {
      const imageFiles = await readdir(imagesDir);
      for (const file of imageFiles) {
        if (file.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
          const filePath = join(imagesDir, file);
          const stats = await stat(filePath);
          mediaItems.push({
            url: `/images/${file}`,
            type: "image",
            filename: file,
            size: stats.size,
            uploadedAt: stats.mtime.toISOString(),
          });
        }
      }
    }

    // Scan videos directory
    const videosDir = join(process.cwd(), "public", "videos");
    if (existsSync(videosDir)) {
      const videoFiles = await readdir(videosDir);
      for (const file of videoFiles) {
        if (file.match(/\.(mp4|webm|mov)$/i)) {
          const filePath = join(videosDir, file);
          const stats = await stat(filePath);
          mediaItems.push({
            url: `/videos/${file}`,
            type: "video",
            filename: file,
            size: stats.size,
            uploadedAt: stats.mtime.toISOString(),
          });
        }
      }
    }

    // Sort by upload date (newest first)
    mediaItems.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json(mediaItems);
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Extract filename from URL
    const filename = url.split("/").pop();
    if (!filename) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Determine directory based on file extension
    const isVideo = filename.match(/\.(mp4|webm|mov)$/i);
    const directory = isVideo ? "videos" : "images";
    const filePath = join(process.cwd(), "public", directory, filename);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete the file
    const { unlink } = await import("fs/promises");
    await unlink(filePath);

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Failed to delete media:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
} 

