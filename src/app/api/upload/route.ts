import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: NextRequest) {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const ext = path.extname(file.name) || '.bin';
    const safeBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .slice(0, 40);
    const filename = `${Date.now()}-${safeBase || 'midia'}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, filename);

    const arrayBuffer = await file.arrayBuffer();
    fs.writeFileSync(targetPath, Buffer.from(arrayBuffer));

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao gravar arquivo em disco.' },
      { status: 500 }
    );
  }
}

