import crypto from "crypto";
import nodemailer from "nodemailer";
import {
  insertUserVerificationTokens,
  findUserByEmail,
  findAndUpdate,
  insertPasswordVerificationTokens,
} from "../lib/dbRely";

function text({ url, host }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
function html({ url, host, email }) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

  // Some simple styling options
  const backgroundColor = "#f9f9f9";
  const textColor = "#444444";
  const mainBackgroundColor = "#ffffff";
  const buttonBackgroundColor = "#346df1";
  const buttonBorderColor = "#346df1";
  const buttonTextColor = "#ffffff";

  return `
  <body style="background: ${backgroundColor};">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          <strong>${escapedHost}</strong>
        </td>
      </tr>
    </table>
    <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          Sign in as <strong>${escapedEmail}</strong>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
          If you did not request this email you can safely ignore it.
        </td>
      </tr>
    </table>
  </body>
  `;
}
export const sendEmail = async (email, subject, url, host, res) => {
  try {
    const transporter = await nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      //service: process.env.EMAIL_FROM,
      port: process.env.EMAIL_SERVER_PORT,
      //secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const send = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      text: text({ url, host }),
      html: html({ url, host, email }),
    });

    return "OK";
  } catch (error) {
    return error;
  }
};

export default async function sendVerificationEmail(req, res) {
  try {
    // Save the verification token

    const emailExisted = await findUserByEmail(
      req.db,
      req.body.email,
      `verification_tokens_${new Date().getFullYear()}`
    );
    const emailExistedUserCol = await findUserByEmail(req.db, req.body.email);

    if (emailExisted) {
      return reSendVerificationEmail(req, res);
    }

    if (emailExistedUserCol) {
      return res
        .status(409)
        .json({ message: "تم استخدام البريد الإلكتروني بالفعل " });
    }
    const token = await crypto.randomBytes(32).toString("hex");

    let subject = await "Account Verification Token";
    let to = await req.body.email;
    //let from = process.env.FROM_EMAIL;
    let link =
      (await "http://") + req.headers.host + "/auth/verify-email/" + token;
    //let htmls = html(link,req.headers.host,to)

    const resSendEmail = await sendEmail(
      to,
      subject,
      link,
      req.headers.host,
      res
    );

    if (resSendEmail !== "OK") {
      return res.status(500).json({ message: "فشل الارسال" });
    }
    const user = await insertUserVerificationTokens(req, token);

    return res
      .status(201)
      .json({ message: "تم ارسال رسالة تأكيد الى " + to + "." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function reSendVerificationEmail(req, res) {
  const token = await crypto.randomBytes(32).toString("hex");
  try {
    // Save the verification token
    const emailExisted = await findAndUpdate(
      req,
      { email: req.body.email },
      { confirmationCode: token, expires: Date.now() + 3600000 },
      `verification_tokens_${new Date().getFullYear()}`
    );

    if (!emailExisted) {
      return res.status(201).json({ message: emailExisted });
    }

    let subject = await "Account Verification Token";
    let to = await req.body.email;
    //let from = process.env.FROM_EMAIL;
    let link =
      (await "http://") + req.headers.host + "/auth/verify-email/" + token;
    //let htmls = html(link,req.headers.host,to)

    const resSendEmail = await sendEmail(
      to,
      subject,
      link,
      req.headers.host,
      res
    );

    if (resSendEmail !== "OK") {
      return res.status(500).json({ message: "email not sent" });
    }

    return res
      .status(201)
      .json({ message: "A verification email has been sent to " + to + "." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function reSetPassword(req, res) {
  try {
    // Save the verification token
    const emailExisted = await findUserByEmail(
      req.db,
      req.body.email,
      `users_${new Date().getFullYear()}`
    );

    if (!emailExisted) {
      return res.status(200).json({ message: emailExisted });
    }
    const token = await crypto.randomBytes(32).toString("hex");

    let subject = await "Account Verification Token";
    let to = await req.body.email;
    //let from = process.env.FROM_EMAIL;
    let link =
      (await "http://") + req.headers.host + "/auth/resetpassword/" + token;
    //let htmls = html(link,req.headers.host,to)

    const resSendEmail = await sendEmail(
      to,
      subject,
      link,
      req.headers.host,
      res
    );

    if (resSendEmail !== "OK") {
      return res.status(500).json({ message: "email not sent" });
    }
    const user = await insertPasswordVerificationTokens(req, token);

    return res
      .status(201)
      .json({ message: "A verification email has been sent to " + to + "." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
