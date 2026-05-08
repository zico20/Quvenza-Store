import { NextRequest, NextResponse } from 'next/server';
import { invoiceService } from '@/services/orders/invoice.service';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const buffer = await invoiceService.generateInvoice(id);
    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
