const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // ✅ Your email
                pass: process.env.EMAIL_PASS, // ✅ Your email app password
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });

        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

module.exports = sendEmail;
