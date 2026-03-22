import nodemailer from "nodemailer";
import dns from "dns";
import util from "util";

// Convert callback-based dns.lookup to a Promise so we can use async/await
const lookup = util.promisify(dns.lookup);

const sendEmail = async (to, subject, text, html = null) => {
  // 1. Manually resolve ONLY the IPv4 address for Gmail right before sending
  const { address } = await lookup("smtp.gmail.com", { family: 4 });

  // 2. Pass that exact IPv4 address into the Host so IPv6 never even attempts to connect
  const transporter = nodemailer.createTransport({
    host: address,
    port: 587,
    secure: false, // 587 uses STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      servername: "smtp.gmail.com", // Crucial: tells Google's TLS we are authorized despite using a raw IP
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
