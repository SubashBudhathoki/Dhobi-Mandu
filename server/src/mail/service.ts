import { createTransport } from "nodemailer";

const transport = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

console.log("SMTP_EMAIL", process.env.SMTP_EMAIL);
console.log("SMTP_PASSWORD", process.env.SMTP_PASSWORD);

export default {
  sendMail: async function ({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await transport.sendMail({
      from: `no-reply@${process.env.APP_NAME?.toLowerCase() || "app"}.com`,
      to,
      subject,
      html,
    });
  },
};
