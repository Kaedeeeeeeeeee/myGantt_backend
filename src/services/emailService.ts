import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 创建邮件传输器
const createTransporter = () => {
  // 如果配置了SMTP，使用SMTP
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 30000, // 30 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 30000, // 30 seconds
      tls: {
        rejectUnauthorized: false, // 在生产环境中可能需要设置为 true
      },
    });
  }

  // 如果没有配置SMTP，尝试使用Gmail（需要应用密码）
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
    });
  }

  throw new Error('Email configuration not found. Please configure SMTP or Gmail credentials.');
};

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
    const transporter = createTransporter();
    const recipientEmail = process.env.FEEDBACK_EMAIL || 'f.shera.09@gmail.com';

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"${fromName || 'My Gantt User'}" <${fromEmail}>`,
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
    };

    // 发送邮件（不验证连接，避免超时）
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error('Error sending feedback email:', error);
    
    // 提供更详细的错误信息
    if (error.code === 'ETIMEDOUT') {
      throw new Error('Email service connection timeout. Please check your SMTP configuration.');
    } else if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your SMTP credentials.');
    } else if (error.response) {
      throw new Error(`Email service error: ${error.response}`);
    } else {
      throw new Error(`Failed to send feedback email: ${error.message || 'Unknown error'}`);
    }
  }
};

