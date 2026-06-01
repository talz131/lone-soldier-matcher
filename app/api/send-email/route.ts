import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'onboarding@resend.dev'

function approvalSoldierHtml(name: string) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #1D9E75; border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
        <p style="color: #fff; font-size: 28px; margin: 0;">🎖️</p>
        <h1 style="color: #fff; font-size: 22px; margin: 12px 0 0;">You've been approved!</h1>
      </div>
      <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
        <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          We're so glad you reached out — and we're excited to let you know that your application has been
          <strong style="color: #1D9E75;">approved</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          One of our coordinators will be in touch with you soon to discuss next steps and find the right
          family match for you. In the meantime, know that we're here and we've got you.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          You're not alone — and you never have to be. 🇮🇱
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 32px;">
          With warmth,<br/>
          <strong>The Lone Soldier Matcher Team</strong>
        </p>
      </div>
    </div>
  `
}

function approvalFamilyHtml(name: string) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #534AB7; border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
        <p style="color: #fff; font-size: 28px; margin: 0;">🏠</p>
        <h1 style="color: #fff; font-size: 22px; margin: 12px 0 0;">You've been approved!</h1>
      </div>
      <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
        <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you so much for offering to open your home — your generosity truly means everything.
          We're happy to share that your application has been
          <strong style="color: #534AB7;">approved</strong>.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          One of our coordinators will be in touch with you soon to talk through next steps and find
          the right soldier match for your family.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          What you're doing makes a real difference. Thank you. 🇮🇱
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 32px;">
          With gratitude,<br/>
          <strong>The Lone Soldier Matcher Team</strong>
        </p>
      </div>
    </div>
  `
}

function declineSoldierHtml(name: string) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #f3f4f6; border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
        <p style="color: #6b7280; font-size: 28px; margin: 0;">💙</p>
        <h1 style="color: #374151; font-size: 22px; margin: 12px 0 0;">Thank you for applying</h1>
      </div>
      <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
        <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you so much for reaching out and for everything you do. It means a great deal to us
          that you chose to connect with our programme.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          After reviewing your application, we don't have a suitable match available for you right now —
          but please know this is not a reflection of you in any way. We will keep your details on file
          and will be in touch if the right match comes up.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          We see you, we appreciate you, and we're rooting for you. 🇮🇱
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 32px;">
          With respect and warmth,<br/>
          <strong>The Lone Soldier Matcher Team</strong>
        </p>
      </div>
    </div>
  `
}

function declineFamilyHtml(name: string) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #f3f4f6; border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
        <p style="color: #6b7280; font-size: 28px; margin: 0;">💙</p>
        <h1 style="color: #374151; font-size: 22px; margin: 12px 0 0;">Thank you for applying</h1>
      </div>
      <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 32px;">
        <p style="font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Thank you so much for your willingness to open your home — it's a beautiful and generous thing
          to offer, and we're truly grateful.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          After reviewing your application, we don't have a suitable match for your family at this time.
          We will hold on to your details and reach out if that changes.
        </p>
        <p style="font-size: 16px; line-height: 1.6;">
          Your kindness doesn't go unnoticed. Thank you for caring. 🇮🇱
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 32px;">
          With gratitude,<br/>
          <strong>The Lone Soldier Matcher Team</strong>
        </p>
      </div>
    </div>
  `
}

export async function POST(request: Request) {
  try {
    const { email, name, entityType, status } = await request.json() as {
      email: string
      name: string
      entityType: 'soldier' | 'family'
      status: 'approved' | 'declined'
    }

    const subject =
      status === 'approved'
        ? 'Your application has been approved 🎉'
        : 'Thank you for your application'

    const html =
      status === 'approved' && entityType === 'soldier' ? approvalSoldierHtml(name)
      : status === 'approved' && entityType === 'family' ? approvalFamilyHtml(name)
      : status === 'declined' && entityType === 'soldier' ? declineSoldierHtml(name)
      : declineFamilyHtml(name)

    const { error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Email route error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
