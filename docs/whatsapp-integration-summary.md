# WhatsApp Integration Summary

Analysis for SIM-PALD customer notification system.

## Overview

WhatsApp has ~98% open rate in Indonesia, making it the most effective channel for customer notifications (order updates, payment confirmations, etc.).

## Options Comparison

### Option A: WhatsApp Cloud API (Official — Recommended)

**How it works:** Direct integration with Meta's official WhatsApp Business Platform. You send API requests to Meta's servers, they deliver messages to customers.

**Costs:**

| Component | Cost |
|-----------|------|
| API Access | Free (apply at business.facebook.com) |
| Utility messages (order updates) | ~$0.003–0.01/message (Indonesia rate) |
| Authentication messages (OTP) | ~$0.004–0.05/message |
| Marketing messages | ~$0.02–0.14/message (most expensive) |
| Service messages (customer replies) | **Free** within 24h window |
| Monthly estimate (500 orders) | **~$5–25/month** |

**Requirements:**
- Meta Business Account (free)
- Verified business phone number (dedicated, not personal)
- Approved message templates (Meta reviews them)
- Facebook Business Verification (may take 1-2 weeks)

**Pros:**
- Official, no risk of number banning
- Reliable delivery
- Rich media support (images, documents, buttons)
- Very cheap for Indonesia market
- Free for customer-initiated conversations

**Cons:**
- Template messages must be pre-approved by Meta (takes 24-48h)
- Cannot send free-form messages outside 24h window
- Business verification process can be slow

**Laravel packages:**
- [`sevenspan/laravel-whatsapp`](https://packagist.org/packages/sevenspan/laravel-whatsapp)
- [`MissaelAnda/laravel-whatsapp`](https://github.com/MissaelAnda/laravel-whatsapp)

### Option B: BSP (Business Solution Provider)

**Examples:** Twilio, Vonage, WATI, Respond.io

**How it works:** Third-party platform that wraps Meta's API with additional features (dashboard, chatbot builder, analytics, multi-agent inbox).

**Costs:**

| Component | Cost |
|-----------|------|
| Platform subscription | $50–200/month |
| Per-message fees | Meta fees + BSP markup (~10-30% more) |
| Monthly estimate (500 orders) | **~$70–250/month** |

**Pros:**
- Dashboard for non-technical team to manage messages
- Built-in chatbot/automation features
- Analytics and reporting
- Multi-agent inbox for customer support

**Cons:**
- Significantly more expensive
- Vendor lock-in
- Overkill for simple notification use case

### Option C: Evolution API (Unofficial — NOT Recommended)

**How it works:** Open-source project that emulates WhatsApp Web protocol via Baileys library. Self-hosted with Docker.

**Costs:** Free (self-hosted)

**Cons — Critical risks:**
- **Violates WhatsApp Terms of Service**
- Risk of permanent number banning
- No official support
- May break when WhatsApp updates their protocol
- Not suitable for production customer-facing apps

## Recommendation

### Phase 1: Web Push Notifications (via PWA)
- **Cost:** Free
- **Effort:** 1-2 days
- Use Web Push API + service worker (part of PWA setup)
- Works on Android Chrome, Firefox, Edge
- Limited on iOS Safari (requires iOS 16.4+, user must add to home screen)
- Good for: real-time status updates while app is open or in background

### Phase 2: WhatsApp Cloud API (Official)
- **Cost:** ~$5-25/month for 500 orders
- **Effort:** 2-3 days
- Direct integration, no BSP needed
- Use for critical notifications only (keep costs low):
  - Order confirmed (ticket number)
  - Driver assigned & on the way
  - Service completed
  - Payment confirmed
- Use Laravel notification channel for clean integration

### Skip for now:
- BSP platforms (too expensive for current scale)
- Evolution API (too risky)
- Marketing messages via WhatsApp (expensive, not needed yet)

## Implementation Plan (Phase 2)

### Prerequisites
1. Create Meta Business Account at [business.facebook.com](https://business.facebook.com)
2. Complete Facebook Business Verification
3. Register a dedicated phone number for WhatsApp Business
4. Apply for WhatsApp Cloud API access

### Message Templates to Create
Templates must be approved by Meta before use.

```
1. order_confirmed (Utility)
   "Pesanan Anda telah dikonfirmasi! No. Tiket: {{ticket_number}}.
    Kami akan segera menugaskan petugas. Lacak di: {{tracking_url}}"

2. driver_assigned (Utility)
   "Petugas {{driver_name}} telah ditugaskan untuk pesanan {{ticket_number}}.
    Estimasi tiba: {{eta}}. Hubungi petugas: {{driver_phone}}"

3. service_completed (Utility)
   "Layanan untuk pesanan {{ticket_number}} telah selesai!
    Volume: {{volume}} m³. Total: Rp {{total_price}}.
    Terima kasih telah menggunakan layanan kami."

4. payment_confirmed (Utility)
   "Pembayaran untuk pesanan {{ticket_number}} sebesar Rp {{amount}}
    telah dikonfirmasi. Terima kasih!"
```

### Technical Architecture
```
Customer places order
       ↓
Laravel dispatches notification
       ↓
NotificationChannel checks preference
       ├── WebPush → Service Worker → Browser notification
       └── WhatsApp → Cloud API → WhatsApp message
```

### Laravel Integration Sketch
```php
// config/services.php
'whatsapp' => [
    'api_url' => env('WHATSAPP_API_URL', 'https://graph.facebook.com/v21.0'),
    'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
    'access_token' => env('WHATSAPP_ACCESS_TOKEN'),
],

// App notification using Laravel's notification system
class OrderConfirmedNotification extends Notification
{
    public function via($notifiable): array
    {
        return ['database', WhatsAppChannel::class];
    }

    public function toWhatsApp($notifiable): WhatsAppMessage
    {
        return (new WhatsAppMessage)
            ->template('order_confirmed')
            ->to($notifiable->phone)
            ->parameters([
                $this->order->ticket_number,
                route('tracking', $this->order->ticket_number),
            ]);
    }
}
```

## Cost Summary

| Scale | Web Push | WhatsApp (Official) | BSP |
|-------|----------|-------------------|-----|
| 100 orders/mo | Free | ~$1-5/mo | ~$60-100/mo |
| 500 orders/mo | Free | ~$5-25/mo | ~$70-250/mo |
| 2000 orders/mo | Free | ~$20-100/mo | ~$150-500/mo |

## Sources

- [WhatsApp Business Platform Pricing](https://business.whatsapp.com/products/platform-pricing)
- [Meta Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [WhatsApp API Pricing 2026 - respond.io](https://respond.io/blog/whatsapp-business-api-pricing)
- [WhatsApp Business API Costs 2026 - Chatarmin](https://chatarmin.com/en/blog/whatsapp-business-api-costs)
- [laravel-whatsapp package](https://github.com/MissaelAnda/laravel-whatsapp)
