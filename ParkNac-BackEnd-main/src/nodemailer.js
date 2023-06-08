const nodemailer = require("nodemailer");

const sendEmails = {};
sendEmails.sendAuthenticationCode = async (email, text, res, respuesta) => {
    // Añade el parámetro "res"
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pruebas05052023@gmail.com",
            pass: "bhfjfeiuvmthbhwd",
        },
    });

    const mailOptions = {
        from: "pruebas05052023@gmail.com",
        to: email,
        subject: "Código de autenticación",
        text: text,
    };

    try {
        //const info = await transporter.sendMail(mailOptions);
        console.log(`Correo electrónico enviado: ${email}`);
        //res.status(200).json({ success: true });
        console.log(respuesta);
        res.json(respuesta);

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Error al enviar el correo electrónico.",
        }); // Envía una respuesta de error
    }
};

module.exports = sendEmails;