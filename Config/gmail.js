const nodemailer = require("nodemailer");

global.transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "uppacloud@gmail.com",
    pass: "#",
  },
});
module.exports = {
  sendMail(data, callback) {
    const mailOptions = {
      from: "uppacloud@gmail.com", // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      html: `<p>${data.message}</p>`, // plain text body
    };
    transport.sendMail(mailOptions, callback);
  },
};
