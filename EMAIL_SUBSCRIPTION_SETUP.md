# Email Subscription Setup Guide
## MQ Studio - Newsletter and Contact Form Integration

**Last Updated:** November 14, 2025
**Platform:** Hostinger Email + SMTP
**Application:** Next.js 14 API Routes
**Estimated Setup Time:** 1-2 hours

---

## Overview

This guide covers setting up email functionality for MQ Studio:
- Newsletter subscriptions
- Contact form submissions
- Email notifications
- DNS configuration for deliverability

---

## Hostinger Email Setup

### Step 1: Create Email Account

1. **Log into hPanel:**
   - Visit: https://hpanel.hostinger.com
   - Navigate to "Emails" section

2. **Create Email Account:**
   - Click "Create Email Account"
   - **Email:** `contact@mouraquayle.ca`
   - **Password:** Generate strong password (16+ characters)
   - **Storage:** 1 GB (free tier) or upgrade
   - Click "Create"

3. **Save Credentials:**
   - Store email address and password securely
   - You'll need these for SMTP configuration

### Step 2: Configure DNS Records

**For better email deliverability, configure SPF, DKIM, and DMARC:**

1. **Access DNS Zone:**
   - hPanel → Domains → Your domain → DNS Zone

2. **Add SPF Record:**
   ```
   Type: TXT
   Name: @
   Content: v=spf1 include:spf.hostinger.com ~all
   TTL: 14400
   ```

3. **Add DKIM Record:**
   - Hostinger auto-generates DKIM
   - Check Email settings for DKIM record
   - Add to DNS zone if not already present

4. **Add DMARC Record:**
   ```
   Type: TXT
   Name: _dmarc
   Content: v=DMARC1; p=quarantine; rua=mailto:contact@mouraquayle.ca
   TTL: 14400
   ```

**Wait 1-24 hours for DNS propagation.**

### Step 3: Configure Environment Variables

**On VPS, edit .env.production:**

```bash
# Email Configuration (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@mouraquayle.ca
SMTP_PASSWORD=your-secure-password-here
SMTP_FROM_EMAIL=contact@mouraquayle.ca
SMTP_FROM_NAME=MQ Studio
```

---

## Implementation

### Newsletter Subscription API Route

**Create: `app/api/subscribe/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Rate limiting (simple in-memory, consider Redis for production)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const requests = rateLimit.get(ip) || [];
    const recentRequests = requests.filter((time: number) => now - time < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    recentRequests.push(now);
    rateLimit.set(ip, recentRequests);

    // Configure SMTP transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to MQ Studio Newsletter',
      text: `Thank you for subscribing to the MQ Studio newsletter!\n\nYou'll receive updates about new musings, publications, and artworks from Moura Quayle.\n\nBest regards,\nMQ Studio Team`,
      html: `
        <h2>Welcome to MQ Studio Newsletter!</h2>
        <p>Thank you for subscribing. You'll receive updates about:</p>
        <ul>
          <li>New musings and reflections</li>
          <li>Academic publications</li>
          <li>Visual artwork and exhibitions</li>
        </ul>
        <p>Best regards,<br>MQ Studio Team</p>
      `,
    });

    // Notify admin of new subscriber
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: 'New Newsletter Subscriber',
      text: `New subscriber: ${email}`,
      html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
    });

    return NextResponse.json(
      { message: 'Subscription successful!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}
```

### Contact Form API Route

**Create: `app/api/contact/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Configure SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send email to admin
    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject || 'No Subject'}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
```

### Frontend Components

**Newsletter Subscription Form:**

```typescript
// components/NewsletterSubscribe.tsx
'use client';

import { useState } from 'react';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Subscription failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={status === 'loading'}
        className="px-4 py-2 border rounded"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && (
        <p className={status === 'success' ? 'text-green-600' : 'text-red-600'}>
          {message}
        </p>
      )}
    </form>
  );
}
```

---

## Testing

### Test Email Configuration

```bash
# Install dependencies
npm install nodemailer @types/nodemailer

# Create test script: scripts/test-email.ts
# (See ENVIRONMENT_VARIABLES_STRATEGY.md for test script)

# Run test
npx ts-node scripts/test-email.ts
```

### Test API Routes

```bash
# Test subscription endpoint
curl -X POST https://mouraquayle.ca/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test contact endpoint
curl -X POST https://mouraquayle.ca/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Test message"}'
```

---

## Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials in `.env.production`**
2. **Verify Hostinger email account exists**
3. **Check PM2 logs:** `pm2 logs mq-studio | grep -i smtp`
4. **Test SMTP connection:** `telnet smtp.hostinger.com 465`

### Emails Go to Spam

1. **Configure SPF, DKIM, DMARC records** (see Step 2 above)
2. **Use proper "From" address** (match domain)
3. **Avoid spam trigger words** in subject/content
4. **Test with mail-tester.com**

### Rate Limit Issues

- Hostinger free tier: 300 emails/day
- Upgrade to Business plan if needed ($0.99/month)
- Consider third-party service (SendGrid, Resend) for higher volume

---

**Complete guide. Ready for email functionality implementation!**

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
