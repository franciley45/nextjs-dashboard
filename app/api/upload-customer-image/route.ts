import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const fileType = file.type;
  if (fileType !== 'image/png' && fileType !== 'image/jpeg') {
    return NextResponse.json({ error: 'Apenas imagens PNG ou JPG são permitidas.' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  let fileName = `${Date.now()}-${file.name}`;
  let filePath = path.join(process.cwd(), 'public', 'customers', fileName);
  let imageUrl = `/customers/${fileName}`;

  if (fileType === 'image/jpeg') {
    // Converte JPG para PNG
    fileName = fileName.replace(/\.(jpg|jpeg)$/i, '.png');
    filePath = path.join(process.cwd(), 'public', 'customers', fileName);
    imageUrl = `/customers/${fileName}`;
    await sharp(buffer).png().toFile(filePath);
  } else {
    await writeFile(filePath, buffer);
  }
  return NextResponse.json({ imageUrl });
}
