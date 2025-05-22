const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");

// Ethereal test account setup
async function createTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

// Compile the Handlebars template
function compileTemplate(templatePath, data) {
  const source = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(source);
  return template(data);
}

// Send email
async function sendFoundItemNotification(to, data) {
  const transporter = await createTransporter();

  const htmlContent = compileTemplate(
    "./template.hbs",
    data
  );

  const info = await transporter.sendMail({
    from: '"Lost & Found" <no-reply@lostfound.com>',
    to,
    subject: "🚨 We've Found Your Item!",
    html: htmlContent,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = { sendFoundItemNotification };
