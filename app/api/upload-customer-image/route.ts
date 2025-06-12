import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

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
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'customers', fileName);
  const imageUrl = `/customers/${fileName}`;

  // Apenas salva o arquivo como está, sem conversão
  await writeFile(filePath, buffer);

  return NextResponse.json({ imageUrl });
}
