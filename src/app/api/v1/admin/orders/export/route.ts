import { NextRequest, NextResponse } from 'next/server';
import { orderExportService } from '@/services/orders/order-export.service';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const { searchParams } = new URL(request.url);
    const buffer = await orderExportService.exportToExcel({
      status: searchParams.get('status') ?? undefined,
      paymentStatus: searchParams.get('paymentStatus') ?? undefined,
      dateFrom: searchParams.get('dateFrom') ?? undefined,
      dateTo: searchParams.get('dateTo') ?? undefined,
    });
    const filename = `orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
