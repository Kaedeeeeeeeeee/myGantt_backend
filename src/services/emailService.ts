import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// 初始化 Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * 发送反馈邮件
 */
export const sendFeedbackEmail = async (
  fromEmail: string,
  fromName: string | null,
  subject: string,
  content: string
): Promise<void> => {
  try {
    // 检查 Resend API Key 是否配置
    if (!resend || !process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured. Please set RESEND_API_KEY environment variable.');
    }

    const recipientEmail = process.env.FEEDBACK_EMAIL || 'f.shera.09@gmail.com';
    const fromEmailAddress = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const fromNameDisplay = process.env.RESEND_FROM_NAME || 'My Gantt';

    const { data, error } = await resend.emails.send({
      from: `${fromNameDisplay} <${fromEmailAddress}>`,
      to: recipientEmail,
      replyTo: fromEmail,
      subject: `[反馈] ${subject}`,
      text: `反馈内容:\n\n${content}\n\n---\n发送者:\n邮箱: ${fromEmail}\n${fromName ? `姓名: ${fromName}` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">反馈内容</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="white-space: pre-wrap; margin: 0;">${content.replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            <strong>发送者:</strong><br>
            邮箱: ${fromEmail}<br>
            ${fromName ? `姓名: ${fromName}` : ''}
          </p>
        </div>
      `,
    });

    if (error) {
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    if (!data) {
      throw new Error('Failed to send email: No response from Resend');
    }
  } catch (error: any) {
    console.error('Error sending feedback email:', error);
    
    // 提供更详细的错误信息
    if (error.message) {
      throw new Error(`Failed to send feedback email: ${error.message}`);
    } else {
      throw new Error('Failed to send feedback email: Unknown error');
    }
  }
};

