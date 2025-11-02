import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

// 初始化 SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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
    // 检查 SendGrid API Key 是否配置
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not configured. Please set SENDGRID_API_KEY environment variable.');
    }

    const recipientEmail = process.env.FEEDBACK_EMAIL || 'f.shera.09@gmail.com';
    const fromEmailAddress = process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_FROM || 'noreply@mygantt.com';
    const fromNameDisplay = process.env.SENDGRID_FROM_NAME || 'My Gantt';

    const msg = {
      to: recipientEmail,
      from: {
        email: fromEmailAddress,
        name: fromNameDisplay,
      },
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
    };

    await sgMail.send(msg);
  } catch (error: any) {
    console.error('Error sending feedback email:', error);
    
    // 提供更详细的错误信息
    if (error.response) {
      const { body, statusCode } = error.response;
      throw new Error(`SendGrid API error (${statusCode}): ${JSON.stringify(body)}`);
    } else if (error.message) {
      throw new Error(`Failed to send feedback email: ${error.message}`);
    } else {
      throw new Error('Failed to send feedback email: Unknown error');
    }
  }
};

