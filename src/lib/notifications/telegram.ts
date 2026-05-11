/**
 * Telegram Bot notifications for new orders.
 */

interface TelegramConfig {
  token: string;
  chatId: string;
}

function getConfig(): TelegramConfig | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return null;
  return { token, chatId };
}

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const config = getConfig();
  if (!config) {
    console.warn('[Telegram] Missing credentials');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${config.token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Telegram] API error:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error('[Telegram] Send failed:', error);
    return false;
  }
}

export interface OrderNotificationData {
  id: string;
  total: number | string;
  paymentMethod?: string;
  itemsCount: number;
  items?: Array<{ name: string; quantity: number; price: number | string }>;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  address?: string;
  governorate?: string;
  createdAt: Date | string;
}

function formatOrderMessage(order: OrderNotificationData): string {
  const shortId = order.id.slice(-8).toUpperCase();
  const total = typeof order.total === 'string'
    ? order.total
    : Number(order.total).toLocaleString('ar-IQ');

  const date = new Date(order.createdAt).toLocaleString('ar-IQ', {
    timeZone: 'Asia/Baghdad',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  let itemsList = '';
  if (order.items && order.items.length > 0) {
    const display = order.items.slice(0, 5);
    itemsList = '\n\n🛍️ <b>المنتجات:</b>\n' + display
      .map((item, i) => {
        const price = typeof item.price === 'string'
          ? item.price
          : Number(item.price).toLocaleString('ar-IQ');
        return `  ${i + 1}. ${item.name} × ${item.quantity} (${price} د.ع)`;
      })
      .join('\n');
    if (order.items.length > 5) {
      itemsList += `\n  ... و ${order.items.length - 5} منتج آخر`;
    }
  }

  const customerInfo = [
    `👤 <b>الاسم:</b> ${order.customerName}`,
    order.customerPhone ? `📱 <b>الهاتف:</b> <code>${order.customerPhone}</code>` : null,
    order.customerEmail ? `📧 <b>البريد:</b> ${order.customerEmail}` : null,
    order.governorate ? `📍 <b>المحافظة:</b> ${order.governorate}` : null,
    order.address ? `🏠 <b>العنوان:</b> ${order.address}` : null,
  ].filter(Boolean).join('\n');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecommerce-platform-sage-pi.vercel.app';

  return `🛒 <b>طلب جديد!</b>
━━━━━━━━━━━━━━━━━━━

📋 <b>رقم الطلب:</b> <code>#${shortId}</code>
🕐 <b>الوقت:</b> ${date}

${customerInfo}${itemsList}

━━━━━━━━━━━━━━━━━━━
💰 <b>المجموع:</b> ${total} د.ع
💳 <b>الدفع:</b> ${order.paymentMethod || 'غير محدد'}
📦 <b>عدد المنتجات:</b> ${order.itemsCount}

⚡ <a href="${siteUrl}/admin/dashboard/orders">افتح لوحة التحكم</a>`;
}

export async function notifyNewOrder(order: OrderNotificationData): Promise<void> {
  try {
    const message = formatOrderMessage(order);
    const sent = await sendTelegramMessage(message);
    if (sent) {
      console.log('[Telegram] Order notification sent:', order.id);
    } else {
      console.warn('[Telegram] Order notification failed:', order.id);
    }
  } catch (error) {
    console.error('[Telegram] Unexpected error:', error);
  }
}
