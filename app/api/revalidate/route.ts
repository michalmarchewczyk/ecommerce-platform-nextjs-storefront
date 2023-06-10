import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: path });
  }
  return NextResponse.json({ revalidated: false });
}
