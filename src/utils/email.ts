import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmailOTP = async (
  email: string,
  otp: string,
  purpose: number,
) => {
  const purposeText =
    purpose === 1 ? "complete your registration" : "login to your account";

  await transporter.sendMail({
    from: `"Muthu Vive Properties" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP - Muthu Vive Properties",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>OTP Verification</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f5f7fa;
          font-family: Arial, Helvetica, sans-serif;
        ">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="padding: 40px 15px;"
          >
            <tr>
              <td align="center">

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                  "
                >

                  <!-- Header -->
                  <tr>
                    <td style="
                      background-color: #077442;
                      padding: 25px;
                      text-align: center;
                    ">
                      <h1 style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 24px;
                      ">
                        Muthu Vive Properties
                      </h1>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 35px 30px;">

                      <h2 style="
                        margin: 0 0 15px;
                        color: #222222;
                        font-size: 22px;
                      ">
                        OTP Verification
                      </h2>

                      <p style="
                        margin: 0 0 15px;
                        color: #555555;
                        font-size: 15px;
                        line-height: 1.6;
                      ">
                        Hello,
                      </p>

                      <p style="
                        margin: 0 0 25px;
                        color: #555555;
                        font-size: 15px;
                        line-height: 1.6;
                      ">
                        Use the following One-Time Password (OTP) to
                        ${purposeText}:
                      </p>

                      <!-- OTP -->
                      <div style="
                        text-align: center;
                        margin: 25px 0;
                      ">
                        <span style="
                          display: inline-block;
                          padding: 15px 30px;
                          background-color: #f0fdf4;
                          border: 1px solid #077442;
                          border-radius: 8px;
                          color: #077442;
                          font-size: 30px;
                          font-weight: bold;
                          letter-spacing: 8px;
                        ">
                          ${otp}
                        </span>
                      </div>

                      <p style="
                        margin: 20px 0 0;
                        color: #666666;
                        font-size: 14px;
                        line-height: 1.6;
                        text-align: center;
                      ">
                        This OTP is valid for a limited time.
                      </p>

                      <p style="
                        margin: 20px 0 0;
                        color: #777777;
                        font-size: 13px;
                        line-height: 1.6;
                      ">
                        For your security, please do not share this OTP
                        with anyone.
                      </p>

                      <p style="
                        margin: 20px 0 0;
                        color: #777777;
                        font-size: 13px;
                        line-height: 1.6;
                      ">
                        If you did not request this OTP, please ignore
                        this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="
                      background-color: #f8fafc;
                      padding: 20px;
                      text-align: center;
                    ">
                      <p style="
                        margin: 0;
                        color: #777777;
                        font-size: 12px;
                      ">
                        © ${new Date().getFullYear()} Muthu Vive Properties.
                        All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
};
