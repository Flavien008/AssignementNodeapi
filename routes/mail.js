const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tendryarivony@gmail.com',
        pass: 'kteiejdcyrifnltr'
    }
});

const sendMail = async (req, res) => {
    try {
        let { from, to, subject, html } = req.body;
        transporter.sendMail({
            from,
            to,
            subject,
            html
        }, (error, info) => {
            if (error) {
                console.log(error);
                res.send(error)
            } else {
                console.log(`Email sent: ${info.response}`);
                res.send(`Email sent: ${info.response}`);
            }
        });
    } catch (error) {
        console.log(error);
        res.status(501).json(error);
    }
};


module.exports = {
    sendMail
};