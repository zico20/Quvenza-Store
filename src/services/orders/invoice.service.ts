import PDFDocument from 'pdfkit';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/lib/errors';

export const invoiceService = {
  async generateInvoice(orderId: string): Promise<Buffer> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, price: true } },
          },
        },
      },
    });

    if (!order) throw new AppError('Order not found', 404);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
      doc.moveDown(0.5);

      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#E5E7EB');
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica');

      const infoStartY = doc.y;

      // Left — store info
      doc.text('From:', 50, infoStartY);
      doc.font('Helvetica-Bold').text('Store Name');
      doc.font('Helvetica').text('support@store.com');
      doc.text('Baghdad, Iraq');

      // Right — order info
      doc.font('Helvetica').text(`Invoice #: ${order.id.slice(-8).toUpperCase()}`, 350, infoStartY);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US')}`);
      doc.text(`Status: ${order.status}`);
      doc.text(`Payment: ${order.paymentStatus}`);

      doc.moveDown(2);

      // Bill To
      doc.font('Helvetica-Bold').text('Bill To:', 50);
      doc.font('Helvetica');
      doc.text(order.user.name);
      doc.text(order.user.email);
      if (order.shippingAddress) {
        const addr = order.shippingAddress as any;
        if (addr.address) doc.text(addr.address);
        if (addr.city) doc.text(`${addr.city}, ${addr.country || 'Iraq'}`);
        if (addr.phone) doc.text(`Phone: ${addr.phone}`);
      }

      doc.moveDown(1.5);

      // Product table
      const tableTop = doc.y;
      const colX    = [50, 80, 310, 360, 440];
      const colW    = [30, 230, 50, 80, 80];
      const headers = ['#', 'Product', 'Qty', 'Unit Price', 'Total'];

      // Header row background
      doc.rect(50, tableTop, 495, 25).fill('#1F2937');

      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
      headers.forEach((h, i) => {
        doc.text(h, colX[i] + 5, tableTop + 7, {
          width: colW[i],
          align: i >= 2 ? 'center' : 'left',
        });
      });

      // Data rows
      doc.fillColor('#000000').font('Helvetica').fontSize(9);
      let rowY = tableTop + 30;

      order.items.forEach((item, index) => {
        const unitPrice = Number(item.price);
        const lineTotal = unitPrice * item.quantity;
        const bg = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF';

        doc.rect(50, rowY - 3, 495, 22).fill(bg);
        doc.fillColor('#000000');

        doc.text(`${index + 1}`, colX[0] + 5, rowY, { width: colW[0] });
        doc.text(item.product.name, colX[1] + 5, rowY, { width: colW[1] });
        doc.text(`${item.quantity}`, colX[2] + 5, rowY, { width: colW[2], align: 'center' });
        doc.text(`$${unitPrice.toFixed(2)}`, colX[3] + 5, rowY, { width: colW[3], align: 'center' });
        doc.text(`$${lineTotal.toFixed(2)}`, colX[4] + 5, rowY, { width: colW[4], align: 'center' });

        rowY += 22;
      });

      doc.moveTo(50, rowY + 5).lineTo(545, rowY + 5).stroke('#E5E7EB');

      rowY += 15;
      doc.font('Helvetica-Bold').fontSize(11);
      doc.fillColor('#000000');
      doc.text('Total:', 360, rowY);
      doc.text(`$${Number(order.total).toFixed(2)}`, 440, rowY, { width: 80, align: 'center' });

      // Footer
      doc.moveDown(4);
      doc.font('Helvetica').fontSize(8).fillColor('#9CA3AF');
      doc.text('Thank you for your purchase!', 50, undefined, { align: 'center' });
      doc.text('This is a computer-generated invoice.', { align: 'center' });

      doc.end();
    });
  },
};
