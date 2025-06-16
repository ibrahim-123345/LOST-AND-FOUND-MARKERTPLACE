const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

async function createTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.gmail.com" || "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "ibrahimmohamed0784@gmail.com" || testAccount.user,
      pass: "kzge djpr drci rfip" || testAccount.pass,
    },
  });
}

// Compile Handlebars template with provided data
function compileTemplate(templatePath, data) {
  const absolutePath = path.join(__dirname, "..", templatePath);
  const source = fs.readFileSync(absolutePath, "utf8");
  const template = handlebars.compile(source);
  return template(data);
}

// Send email using compiled HTML content
async function sendFoundItemNotification(to, data) {
  const transporter = await createTransporter();

  const htmlContent = compileTemplate("./template.hbs", data);

  const info = await transporter.sendMail({
    from: '"Lost & Found" <no-reply@lostfound.com>',
    to,
    subject: "🚨 We've Found Your Item!",
    html: htmlContent,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function sendFoundItemNotificationController(req, res) {
  const { email, data } = req.body;

  if (!email || !data) {
    return res.status(400).json({ error: "Missing email or data." });
  }

  const {
    lostUsername,
    foundUsername,
    lostItemId,
    foundItemId,
    explanation,
    claimLink,
  } = data;

  const templateData = {
    lostUsername,
    foundUsername,
    lostItemId,
    foundItemId,
    explanation,
    claimLink,
    year: new Date().getFullYear(),
  };

  try {
    await sendFoundItemNotification(email, templateData);
    res.status(200).json({ message: "Email sent successfully." });
  } catch (err) {
    console.error("Email sending failed:", err);
    res.status(500).json({ error: "Failed to send email." });
  }
}

module.exports = { sendFoundItemNotificationController };
