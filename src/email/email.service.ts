import { Injectable } from '@nestjs/common';
const nodemailer = require('nodemailer');
const host = 'smtp.yandex.ru';
const user = 'stolitsaleto@anogn.ru';
const pass = 'ztulddfzxkkohmfo';
const transporter = nodemailer.createTransport({
  host: host,
  port: 465,
  auth: {
    user: user,
    pass: pass,
  },
});
@Injectable()
export class EmailService {
  constructor() { }
  async sendEmail(to, text, subject, html) {
    const message = {
      from: 'Дирекция STOлица.Лето <stolitsaleto@anogn.ru>',
      to: to,
      subject: subject,
      text: text,
      html: html,
    };
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log('Error occurred. ' + err.message);
        return err.message;
      }
      console.log(info);
    });
    return true;
  }
}
