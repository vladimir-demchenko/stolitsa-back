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
  async sendEmail(to, text, subject) {
    const message = {
      from: 'Дирекция STOлица.Лето <stolitsaleto@anogn.ru>',
      to: to,
      subject: subject,
      text: text,
      html: `<p>
      Привет!<br/>
      Поздравляем! Ты зарегистрировался на сайте <a href="http://столица-лето.рф">http://столица-лето.рф</a><br/>  
      Твой пароль для входа в личный кабинет: ${text}<br/>  
      <br/>  
      Доступ в личный кабинет откроется через 3 дня<br/>   
      <br/>
      Если у тебя возникнут вопросы, ты можешь их адресовать сюда <a href="https://t.me/STOlitsa_Leto" target="_blank">https://t.me/STOlitsa_Leto</a>
      </p>`,
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
