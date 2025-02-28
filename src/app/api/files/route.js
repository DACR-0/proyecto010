import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get('file');

  if (!fileName) {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 400 });
  }

  const filePath = join(process.cwd(), 'server', 'upload', fileName);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: 'Archivo no encontrado en el servidor' }, { status: 404 });
  }

  return new NextResponse(createReadStream(filePath), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}
