import {
  NextRequest,
  NextResponse,
  unstable_revalidatePath,
} from 'next/server';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');
  if (path) {
    unstable_revalidatePath(path);
    return NextResponse.json({ revalidated: path });
  }
  return NextResponse.json({ revalidated: false });
}
