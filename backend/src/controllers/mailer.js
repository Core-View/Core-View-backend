const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.MAIL_CLIENTID,
  process.env.MAIL_SECRET, // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.MAIL_REFRESH,
});

const accessToken = oauth2Client.getAccessToken();

const sendMail = async (to, subject, html,res) => {
  const googleTransporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: "coreview.team@gmail.com",
        clientId: process.env.MAIL_CLIENTID,
        clientSecret: process.env.MAIL_SECRET,
        refreshToken: process.env.MAIL_REFRESH,
        accessToken: accessToken,
        expirse: 3600,
      },
    }),
    mailOptions = {
      from: "<core-view, coreview.team@gmail.com>",
      to,
      subject,
      html,
    };
  try {
    await googleTransporter.sendMail(mailOptions);
    googleTransporter.close();
    console.log(`mail have sent to ${to}`);
  } catch (err) {
    res.status(500).send({success: false, message: "잠시후 다시 시도해주세요"})
    console.log(err);
  }
};

module.exports = {
  sendMail,
};
