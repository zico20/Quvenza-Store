import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin(request);
    await context.params; // consumed but not needed for stub
    return NextResponse.json(
      {
        success: false,
        message: 'Image upload not yet implemented. Cloudinary integration scheduled for M4.',
      },
      { status: 501 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
