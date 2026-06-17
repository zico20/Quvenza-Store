import { NextResponse } from 'next/server';
import { notifyNewOrder } from '@/lib/notifications/telegram';

export async function GET() {
  try {
    await notifyNewOrder({
      id: 'test-' + Date.now().toString(36),
      total: 75000,
      paymentMethod: 'ZainCash (اختبار)',
      itemsCount: 2,
      items: [
        { name: 'iPhone 15 Pro - 256GB', quantity: 1, price: 50000 },
        { name: 'AirPods Pro 2', quantity: 1, price: 25000 },
      ],
      customerName: 'عميل تجريبي',
      customerPhone: '+9647712345678',
      customerEmail: 'test@example.com',
      governorate: 'بغداد',
      address: 'حي الحارثية، شارع الكندي',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Test notification sent. Check Telegram!',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
