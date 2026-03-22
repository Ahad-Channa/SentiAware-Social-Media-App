import nodemailer from "nodemailer";
import dns from "dns";

// Force IPv4 because Render doesn't support outgoing IPv6 to Gmail
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (to, subject, text, html = null) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SentiAware" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  if (html) {
    mailOptions.html = html;
  }

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
