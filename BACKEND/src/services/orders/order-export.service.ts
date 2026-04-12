import ExcelJS from 'exceljs';
import { prisma } from '../../config/database';

export const orderExportService = {
  async exportToExcel(filters: {
    status?: string;
    paymentStatus?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Buffer> {
    const where: any = {};

    if (filters.status && filters.status !== 'ALL') where.status = filters.status;
    if (filters.paymentStatus && filters.paymentStatus !== 'ALL') where.paymentStatus = filters.paymentStatus;
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) {
        const endDate = new Date(filters.dateTo);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDate;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'E-Commerce Admin';
    workbook.created = new Date();

    // Orders sheet
    const sheet = workbook.addWorksheet('Orders', {
      properties: { defaultRowHeight: 20 },
    });

    sheet.columns = [
      { header: 'رقم الطلب', key: 'id', width: 30 },
      { header: 'العميل', key: 'customerName', width: 25 },
      { header: 'الإيميل', key: 'customerEmail', width: 30 },
      { header: 'المبلغ', key: 'total', width: 15 },
      { header: 'حالة الطلب', key: 'status', width: 15 },
      { header: 'حالة الدفع', key: 'paymentStatus', width: 15 },
      { header: 'طريقة الدفع', key: 'paymentMethod', width: 15 },
      { header: 'عدد المنتجات', key: 'itemsCount', width: 15 },
      { header: 'المنتجات', key: 'products', width: 40 },
      { header: 'التاريخ', key: 'createdAt', width: 20 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2937' },
    } as ExcelJS.FillPattern;
    headerRow.alignment = { horizontal: 'center' };

    orders.forEach((order) => {
      const productNames = order.items
        .map((i) => `${i.product.name} (×${i.quantity})`)
        .join(', ');
      sheet.addRow({
        id: order.id,
        customerName: order.user.name,
        customerEmail: order.user.email,
        total: Number(order.total),
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        itemsCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
        products: productNames,
        createdAt: new Date(order.createdAt).toLocaleDateString('ar-IQ'),
      });
    });

    sheet.getColumn('total').numFmt = '#,##0.00';

    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'البيان', key: 'label', width: 30 },
      { header: 'القيمة', key: 'value', width: 20 },
    ];

    const summaryHeaderRow = summarySheet.getRow(1);
    summaryHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    summaryHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2937' },
    } as ExcelJS.FillPattern;

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
    const pendingOrders = orders.filter((o) => o.status === 'PENDING');

    summarySheet.addRows([
      { label: 'إجمالي الطلبات', value: orders.length },
      { label: 'إجمالي الإيرادات', value: totalRevenue },
      { label: 'طلبات مدفوعة', value: paidOrders.length },
      { label: 'طلبات معلقة', value: pendingOrders.length },
      { label: 'تاريخ التصدير', value: new Date().toLocaleDateString('ar-IQ') },
    ]);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  },
};
