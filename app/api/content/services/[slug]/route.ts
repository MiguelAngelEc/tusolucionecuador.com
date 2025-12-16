import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Construir la ruta al archivo markdown
    const filePath = path.join(process.cwd(), 'content', 'services', `${slug}.md`);

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    // Leer el contenido del archivo
    const content = fs.readFileSync(filePath, 'utf8');

    // Devolver el contenido como texto plano
    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Error loading markdown file:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}