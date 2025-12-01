#!/usr/bin/env python3
"""
Create a circular logo from the Altavida logo
"""
from PIL import Image, ImageDraw
import os

# Source logo
source_path = "f:\\Altavidatours\\public\\altavida-logo-1.png"
output_dir = "f:\\Altavidatours\\public\\logos"
output_path = os.path.join(output_dir, "altavida-circular.png")

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Load the original logo
try:
    img = Image.open(source_path)
    print(f"Loaded logo: {img.size}")
    
    # Create a new square image for the circular logo
    size = max(img.size)
    circular = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    
    # Create a white background circle
    background = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(background)
    draw.ellipse([0, 0, size-1, size-1], fill=(243, 244, 246, 255), outline=(229, 231, 235, 255))
    
    # Paste the original image in the center
    offset = ((size - img.width) // 2, (size - img.height) // 2)
    background.paste(img, offset, img if img.mode == 'RGBA' else None)
    
    # Create a mask for circular crop
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse([0, 0, size-1, size-1], fill=255)
    
    # Apply circular mask
    output = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    output.paste(background, (0, 0), mask)
    
    # Save the circular logo
    output = output.convert('RGB')
    output.save(output_path, 'PNG', quality=95)
    print(f"Circular logo created: {output_path}")
    print(f"Output size: {output.size}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
