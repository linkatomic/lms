import { google } from 'googleapis'

// ── Gmail client ──────────────────────────────────────────────────────────────
function getGmailClient() {
  const oauth2 = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
  )
  oauth2.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
  return google.gmail({ version: 'v1', auth: oauth2 })
}

function buildRawEmail(to: string, subject: string, html: string): string {
  const from = process.env.GMAIL_FROM_EMAIL ?? 'me'
  const fromName = process.env.GMAIL_FROM_NAME ?? 'Team Learning Hub'
  const encodedSubject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
  const message = [
    `From: "${fromName}" <${from}>`,
    `To: ${to}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    `Subject: ${encodedSubject}`,
    '',
    html,
  ].join('\r\n')
  return Buffer.from(message).toString('base64url')
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_REFRESH_TOKEN) {
    console.warn('[Gmail] Missing credentials — email not sent to:', to)
    return
  }
  try {
    const gmail = getGmailClient()
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: buildRawEmail(to, subject, html) },
    })
    console.log('[Gmail] Sent to:', to, '|', subject)
  } catch (err) {
    console.error('[Gmail] sendEmail failed:', err)
  }
}

// ── Base layout ───────────────────────────────────────────────────────────────
function emailBase(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#F0F2FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0F2FF;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%);border-radius:16px 16px 0 0;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.2);border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;padding:0 8px;">
                          <span style="font-size:18px;">📚</span>
                        </td>
                        <td style="padding-left:12px;">
                          <span style="color:rgba(255,255,255,0.95);font-size:15px;font-weight:700;letter-spacing:-0.3px;">Team Learning Hub</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 16px 16px;padding:40px;box-shadow:0 4px 24px rgba(79,70,229,0.08);">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 8px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94A3B8;line-height:1.6;">
                This email was sent by <strong style="color:#6366F1;">Team Learning Hub</strong>.<br/>
                If you have questions, reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── 1. Welcome email ──────────────────────────────────────────────────────────
export function welcomeEmail(params: {
  displayName: string
  email: string
  password: string
  loginUrl: string
  team?: string | null
}): string {
  const teamLabel = params.team
    ? params.team.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : null

  const content = `
    <!-- Hero -->
    <div style="text-align:center;margin-bottom:36px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#EEF2FF,#F5F3FF);border-radius:50%;width:72px;height:72px;line-height:72px;text-align:center;margin-bottom:16px;">
        <span style="font-size:32px;">🎉</span>
      </div>
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0F172A;letter-spacing:-0.5px;">Welcome aboard, ${params.displayName}!</h1>
      <p style="margin:0;font-size:15px;color:#64748B;line-height:1.6;">Your learning account is ready. Here are your login details.</p>
    </div>

    ${teamLabel ? `
    <!-- Team badge -->
    <div style="text-align:center;margin-bottom:28px;">
      <span style="display:inline-block;background:#EEF2FF;border:1px solid #C7D2FE;color:#4338CA;font-size:12px;font-weight:700;padding:6px 16px;border-radius:100px;letter-spacing:0.5px;text-transform:uppercase;">
        ${teamLabel} Team
      </span>
    </div>` : ''}

    <!-- Credentials box -->
    <div style="background:#F8FAFF;border:1px solid #E0E7FF;border-radius:12px;padding:28px;margin-bottom:28px;">
      <p style="margin:0 0 20px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6366F1;">Your Login Credentials</p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-bottom:16px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Email Address</p>
            <p style="margin:0;font-size:15px;font-weight:600;color:#1E293B;font-family:monospace;">${params.email}</p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #E0E7FF;padding-top:16px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Temporary Password</p>
            <p style="margin:0;font-size:16px;font-weight:700;color:#4F46E5;font-family:monospace;letter-spacing:1px;">${params.password}</p>
            <p style="margin:6px 0 0;font-size:12px;color:#F59E0B;font-weight:500;">⚠ Please change your password after your first login.</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA Button -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="${params.loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 40px;border-radius:10px;letter-spacing:-0.2px;box-shadow:0 4px 14px rgba(79,70,229,0.35);">
        Log In to Your Account →
      </a>
    </div>

    <!-- What's inside -->
    <div style="border-top:1px solid #F1F5F9;padding-top:28px;">
      <p style="margin:0 0 16px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94A3B8;">What's waiting for you</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="width:32px;vertical-align:top;padding-bottom:12px;"><span style="font-size:18px;">📖</span></td>
          <td style="padding-left:12px;padding-bottom:12px;vertical-align:top;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#1E293B;">Structured Learning Modules</p>
            <p style="margin:2px 0 0;font-size:13px;color:#64748B;">3 modules covering digital marketing, SEO, and more</p>
          </td>
        </tr>
        <tr>
          <td style="width:32px;vertical-align:top;padding-bottom:12px;"><span style="font-size:18px;">📝</span></td>
          <td style="padding-left:12px;padding-bottom:12px;vertical-align:top;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#1E293B;">Quizzes & Assessments</p>
            <p style="margin:2px 0 0;font-size:13px;color:#64748B;">Test your knowledge with interactive quizzes and a final assessment</p>
          </td>
        </tr>
        <tr>
          <td style="width:32px;vertical-align:top;"><span style="font-size:18px;">📊</span></td>
          <td style="padding-left:12px;vertical-align:top;">
            <p style="margin:0;font-size:14px;font-weight:600;color:#1E293B;">Track Your Progress</p>
            <p style="margin:2px 0 0;font-size:13px;color:#64748B;">See your scores and manager feedback in My Results</p>
          </td>
        </tr>
      </table>
    </div>
  `
  return emailBase('Welcome to Team Learning Hub', content)
}

// ── 2. Admin: quiz submitted (MCQ — score final) ──────────────────────────────
export function quizSubmittedAdminEmail(params: {
  userName: string
  userEmail: string
  lessonId: number
  lessonTitle: string
  score: number
  totalQuestions: number
  passed: boolean
  reviewUrl: string
}): string {
  const pct = params.totalQuestions > 0 ? Math.round((params.score / params.totalQuestions) * 100) : 0
  const passColor = params.passed ? '#10B981' : '#EF4444'
  const passBg = params.passed ? '#ECFDF5' : '#FEF2F2'
  const passBorder = params.passed ? '#A7F3D0' : '#FECACA'
  const passLabel = params.passed ? '✅ Passed' : '❌ Did Not Pass'

  const content = `
    <!-- Alert badge -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:#EEF2FF;border-radius:50%;width:60px;height:60px;line-height:60px;text-align:center;margin-bottom:12px;">
        <span style="font-size:28px;">📊</span>
      </div>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0F172A;">Quiz Completed</h1>
      <p style="margin:0;font-size:14px;color:#64748B;">A team member has submitted a quiz</p>
    </div>

    <!-- User + quiz info -->
    <div style="background:#F8FAFF;border:1px solid #E0E7FF;border-radius:12px;padding:24px;margin-bottom:20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-bottom:14px;border-bottom:1px solid #E0E7FF;">
            <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Team Member</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#1E293B;">${params.userName}</p>
            <p style="margin:2px 0 0;font-size:13px;color:#64748B;">${params.userEmail}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;">
            <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Quiz</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#1E293B;">Lesson ${params.lessonId} — ${params.lessonTitle}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Score display -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#EEF2FF,#F5F3FF);border-radius:16px;padding:24px 40px;">
        <p style="margin:0 0 4px;font-size:48px;font-weight:900;color:#4F46E5;line-height:1;">${pct}%</p>
        <p style="margin:0;font-size:14px;color:#64748B;font-weight:500;">${params.score} / ${params.totalQuestions} correct</p>
      </div>
    </div>

    <!-- Pass/Fail badge -->
    <div style="text-align:center;margin-bottom:28px;">
      <span style="display:inline-block;background:${passBg};border:1px solid ${passBorder};color:${passColor};font-size:14px;font-weight:700;padding:8px 24px;border-radius:100px;">
        ${passLabel}
      </span>
    </div>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${params.reviewUrl}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 32px;border-radius:10px;">
        View Attempt Details →
      </a>
    </div>
  `
  return emailBase('Quiz Submitted — Team Learning Hub', content)
}

// ── 3. Admin: Final Assessment submitted (needs review) ───────────────────────
export function assessmentPendingAdminEmail(params: {
  userName: string
  userEmail: string
  lessonId: number
  lessonTitle: string
  reviewUrl: string
  submittedAt: string
}): string {
  const content = `
    <!-- Alert -->
    <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;margin-bottom:28px;text-align:center;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#92400E;">⏳ Written answers are awaiting your review</p>
    </div>

    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:#FEF3C7;border-radius:50%;width:60px;height:60px;line-height:60px;text-align:center;margin-bottom:12px;">
        <span style="font-size:28px;">📝</span>
      </div>
      <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0F172A;">Final Assessment Submitted</h1>
      <p style="margin:0;font-size:14px;color:#64748B;">Review required to release results to the team member</p>
    </div>

    <!-- User info -->
    <div style="background:#F8FAFF;border:1px solid #E0E7FF;border-radius:12px;padding:24px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-bottom:14px;border-bottom:1px solid #E0E7FF;">
            <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Submitted By</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#1E293B;">${params.userName}</p>
            <p style="margin:2px 0 0;font-size:13px;color:#64748B;">${params.userEmail}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;padding-bottom:14px;border-bottom:1px solid #E0E7FF;">
            <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Assessment</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#1E293B;">Lesson ${params.lessonId} — ${params.lessonTitle}</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top:14px;">
            <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Submitted At</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#1E293B;">${params.submittedAt}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Steps -->
    <div style="border:1px solid #E0E7FF;border-radius:12px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#6366F1;">How to review</p>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="width:24px;vertical-align:top;padding-bottom:10px;"><span style="font-size:14px;color:#4F46E5;font-weight:700;">1.</span></td>
          <td style="padding-left:8px;padding-bottom:10px;font-size:13px;color:#475569;">Click "Review Now" to open the attempt</td>
        </tr>
        <tr>
          <td style="width:24px;vertical-align:top;padding-bottom:10px;"><span style="font-size:14px;color:#4F46E5;font-weight:700;">2.</span></td>
          <td style="padding-left:8px;padding-bottom:10px;font-size:13px;color:#475569;">Mark each written answer as Correct / Partial / Incorrect</td>
        </tr>
        <tr>
          <td style="width:24px;vertical-align:top;"><span style="font-size:14px;color:#4F46E5;font-weight:700;">3.</span></td>
          <td style="padding-left:8px;font-size:13px;color:#475569;">Add feedback and submit — the team member will be notified automatically</td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${params.reviewUrl}" style="display:inline-block;background:linear-gradient(135deg,#D97706,#B45309);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;box-shadow:0 4px 14px rgba(217,119,6,0.3);">
        Review Now →
      </a>
    </div>
  `
  return emailBase('Final Assessment Submitted — Action Required', content)
}

// ── 4. User: review complete (results ready) ──────────────────────────────────
export function reviewCompleteUserEmail(params: {
  userName: string
  lessonId: number
  lessonTitle: string
  score: number
  totalQuestions: number
  passed: boolean
  feedback?: string | null
  resultsUrl: string
}): string {
  const pct = params.totalQuestions > 0 ? Math.round((params.score / params.totalQuestions) * 100) : 0
  const passColor = params.passed ? '#10B981' : '#EF4444'
  const passBg = params.passed ? '#ECFDF5' : '#FEF2F2'
  const passBorder = params.passed ? '#A7F3D0' : '#FECACA'
  const passLabel = params.passed ? '✅ Congratulations — You Passed!' : '📚 Keep Practising — You\'ll Get There!'
  const passMsg = params.passed
    ? 'Your answers have been reviewed and you have successfully passed the assessment.'
    : 'Your answers have been reviewed. Don\'t be discouraged — use this as a learning opportunity.'

  const content = `
    <!-- Hero -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:${passBg};border-radius:50%;width:68px;height:68px;line-height:68px;text-align:center;margin-bottom:14px;">
        <span style="font-size:32px;">${params.passed ? '🏆' : '💪'}</span>
      </div>
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#0F172A;">Your Results Are In, ${params.userName}!</h1>
      <p style="margin:0;font-size:14px;color:#64748B;line-height:1.6;">${passMsg}</p>
    </div>

    <!-- Score card -->
    <div style="background:linear-gradient(135deg,#EEF2FF,#F5F3FF);border-radius:16px;padding:32px;text-align:center;margin-bottom:20px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6366F1;">Your Score</p>
      <p style="margin:0;font-size:56px;font-weight:900;color:#4F46E5;line-height:1.1;">${pct}<span style="font-size:28px;">%</span></p>
      <p style="margin:6px 0 0;font-size:14px;color:#64748B;">${params.score} out of ${params.totalQuestions} questions</p>
    </div>

    <!-- Pass/Fail -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:${passBg};border:1px solid ${passBorder};border-radius:12px;padding:12px 28px;">
        <p style="margin:0;font-size:15px;font-weight:700;color:${passColor};">${passLabel}</p>
      </div>
    </div>

    <!-- Quiz info -->
    <div style="background:#F8FAFF;border:1px solid #E0E7FF;border-radius:12px;padding:20px;margin-bottom:${params.feedback ? '20px' : '28px'};">
      <p style="margin:0 0 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#94A3B8;">Assessment</p>
      <p style="margin:0;font-size:14px;font-weight:600;color:#1E293B;">Lesson ${params.lessonId} — ${params.lessonTitle}</p>
    </div>

    ${params.feedback ? `
    <!-- Manager feedback -->
    <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:20px;margin-bottom:28px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#92400E;">💬 Manager Feedback</p>
      <p style="margin:0;font-size:14px;color:#78350F;line-height:1.7;">${params.feedback}</p>
    </div>` : ''}

    <!-- CTA -->
    <div style="text-align:center;">
      <a href="${params.resultsUrl}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:10px;box-shadow:0 4px 14px rgba(79,70,229,0.3);">
        View Full Results →
      </a>
    </div>
  `
  return emailBase('Your Assessment Results Are Ready', content)
}
