import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import nodemailer from 'nodemailer';

@Processor('email-queue')
export class EmailProcessor {
  @Process('sendEmail')
  async handleSendEmail(job: Job) {
    const { email, verifyCode } = job.data;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // .env에 설정
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '이메일 인증 코드',
      text: `인증 코드: ${verifyCode}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(` 이메일 발송 성공: ${email}`, info.response);
    } catch (error) {
      console.error(` 이메일 발송 실패: ${email}`, error);
    }
  }
}
