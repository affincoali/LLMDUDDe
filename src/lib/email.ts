/**
 * Email service using Resend API
 * 
 * Setup:
 * 1. Sign up at https://resend.com
 * 2. Get API key
 * 3. Add to wrangler.jsonc: 
 *    "vars": { "RESEND_API_KEY": "re_xxx" }
 * 4. Or use secrets: npx wrangler secret put RESEND_API_KEY
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface ResendResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

/**
 * Send email using Resend API
 */
export async function sendEmail(
  apiKey: string,
  options: EmailOptions
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const from = options.from || 'AI Agents Directory <noreply@aiagentsdirectory.com>';
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [options.to],
        subject: options.subject,
        html: options.html
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error: 'Failed to send email' };
    }

    const data = await response.json() as ResendResponse;
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

/**
 * Welcome email template
 */
export function getWelcomeEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 Welcome to AI Agents Directory!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Welcome to the largest community of AI agent creators and enthusiasts!</p>
          <p>Here's what you can do now:</p>
          <ul>
            <li>✅ Submit your AI agents for review</li>
            <li>✅ Discover and upvote amazing AI tools</li>
            <li>✅ Leave reviews to help the community</li>
            <li>✅ Track your submissions in your dashboard</li>
          </ul>
          <p style="text-align: center;">
            <a href="https://aiagentsdirectory.com/dashboard" class="button">Go to Dashboard</a>
          </p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The AI Agents Directory Team</p>
        </div>
        <div class="footer">
          <p>© 2024 AI Agents Directory. All rights reserved.</p>
          <p><a href="https://aiagentsdirectory.com/unsubscribe">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Submission confirmation email
 */
export function getSubmissionConfirmationEmail(
  name: string,
  agentName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .info-box { background: #f0f4ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Submission Received!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for submitting <strong>${agentName}</strong> to AI Agents Directory!</p>
          <div class="info-box">
            <strong>📋 What happens next?</strong>
            <ul>
              <li>Our team will review your submission within 24-48 hours</li>
              <li>We'll check for quality, accuracy, and completeness</li>
              <li>You'll receive an email once we've made a decision</li>
            </ul>
          </div>
          <p>You can track your submission status anytime in your dashboard:</p>
          <p style="text-align: center;">
            <a href="https://aiagentsdirectory.com/dashboard" class="button">View Dashboard</a>
          </p>
          <p>Thank you for contributing to our community!</p>
          <p>Best regards,<br>The AI Agents Directory Team</p>
        </div>
        <div class="footer">
          <p>© 2024 AI Agents Directory. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Agent approved email
 */
export function getAgentApprovedEmail(
  name: string,
  agentName: string,
  agentSlug: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .success-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Your Agent is Live!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Great news! <strong>${agentName}</strong> has been approved and is now live on AI Agents Directory!</p>
          <div class="success-box">
            <strong>🚀 Your agent is now:</strong>
            <ul>
              <li>Visible to thousands of visitors</li>
              <li>Searchable and discoverable</li>
              <li>Ready to receive upvotes and reviews</li>
            </ul>
          </div>
          <p>View your live listing:</p>
          <p style="text-align: center;">
            <a href="https://aiagentsdirectory.com/agents/${agentSlug}" class="button">View Agent Page</a>
          </p>
          <p><strong>💡 Tips to increase visibility:</strong></p>
          <ul>
            <li>Share your listing on social media</li>
            <li>Add a backlink from your website</li>
            <li>Encourage users to leave reviews</li>
            <li>Keep your agent information up-to-date</li>
          </ul>
          <p>Congratulations and thank you for being part of our community!</p>
          <p>Best regards,<br>The AI Agents Directory Team</p>
        </div>
        <div class="footer">
          <p>© 2024 AI Agents Directory. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Agent rejected email
 */
export function getAgentRejectedEmail(
  name: string,
  agentName: string,
  reason: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .warning-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Submission Update</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for submitting <strong>${agentName}</strong> to AI Agents Directory.</p>
          <p>After review, we're unable to approve your submission at this time.</p>
          <div class="warning-box">
            <strong>📋 Reason:</strong>
            <p>${reason}</p>
          </div>
          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Review our submission guidelines</li>
            <li>Make the necessary improvements</li>
            <li>Resubmit your agent</li>
          </ul>
          <p style="text-align: center;">
            <a href="https://aiagentsdirectory.com/submit" class="button">Submit Again</a>
          </p>
          <p>If you have questions about this decision, feel free to reply to this email.</p>
          <p>Best regards,<br>The AI Agents Directory Team</p>
        </div>
        <div class="footer">
          <p>© 2024 AI Agents Directory. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Password reset email
 */
export function getPasswordResetEmail(
  name: string,
  resetToken: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff7ed; border-left: 4px solid #fb923c; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 Reset Your Password</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset your password for AI Agents Directory.</p>
          <p style="text-align: center;">
            <a href="https://aiagentsdirectory.com/reset-password?token=${resetToken}" class="button">Reset Password</a>
          </p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul>
              <li>This link expires in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          <p>If the button doesn't work, copy and paste this link:</p>
          <p style="font-size: 12px; word-break: break-all; background: #f5f5f5; padding: 10px;">
            https://aiagentsdirectory.com/reset-password?token=${resetToken}
          </p>
          <p>Best regards,<br>The AI Agents Directory Team</p>
        </div>
        <div class="footer">
          <p>© 2024 AI Agents Directory. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Weekly performance digest email
 */
export function getWeeklyDigestEmail(
  name: string,
  stats: {
    agentName: string;
    views: number;
    upvotes: number;
    reviews: number;
  }[]
): string {
  const statsHtml = stats.map(stat => `
    <tr style="border-bottom: 1px solid #e0e0e0;">
      <td style="padding: 10px;"><strong>${stat.agentName}</strong></td>
      <td style="padding: 10px; text-align: center;">${stat.views}</td>
      <td style="padding: 10px; text-align: center;">${stat.upvotes}</td>
      <td style="padding: 10px; text-align: center;">${stat.reviews}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5f5f5; padding: 10px; text-align: left; font-weight: 600; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Your Weekly Performance</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Here's how your AI agents performed this week:</p>
          <table>
            <thead>
              <tr>
                <th>Agent Name</th>
                <th style="text-align: center;">Views</th>
                <th style="text-align: center;">Upvotes</th>
                <th style="text-align: center;">Reviews</th>
              </tr>
            </thead>
            <tbody>
              ${statsHtml}
            </tbody>
          </table>
          <p style="text-align: center;">
            <a href="https://aiagentsdirectory.com/dashboard" class="button">View Full Dashboard</a>
          </p>
          <p>Keep up the great work!</p>
          <p>Best regards,<br>The AI Agents Directory Team</p>
        </div>
        <div class="footer">
          <p>© 2024 AI Agents Directory. All rights reserved.</p>
          <p><a href="https://aiagentsdirectory.com/unsubscribe">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}
