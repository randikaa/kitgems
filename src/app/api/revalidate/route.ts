import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the secret token from the request
    const body = await request.json();
    const { secret, path } = body;

    // Verify the secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate the specified path (or default to home page)
    const pathToRevalidate = path || '/';
    revalidatePath(pathToRevalidate);

    return NextResponse.json({
      revalidated: true,
      path: pathToRevalidate,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
