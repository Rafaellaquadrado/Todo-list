const nodemailer = require('nodemailer');

exports.sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lararafaella@gmail.com',
      pass: 'smxl pvik mzov dkcz'
    }
  });

  await transporter.sendMail({
    from: '"Todo List" <lararafaella@gmail.com>',
    to,
    subject,
    text
  });
};
