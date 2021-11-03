const express = require("express");
const app = express();
const path = require("path");
const API_KEY = "sk_test_51J9Vl5EC8QUyIKkd1m0MbchhkEpBD2gCn4ZOdKL4jB83kHu6WcUpXOvQvnmIyNCqtUS7ulSW8gSa1GwUPWy7bKdX005mhMGqDf";
const stripe = require("stripe")(API_KEY);
const nodemailer = require("nodemailer");

const MAIN_DOMAIN = "http://localhost:8080";

// email data
const SMTP_HOST="defitt.org"
const SMTP_PORT=465
const SMTP_EMAIL="payments@defitt.org"
const SMTP_PASSWORD="@Ozj7bd(BUE^"
const FROM_EMAIL="payment@defitt.org"
const FROM_NAME="Defitt"

// middleware
app.use(express.json());

const senderAddress = "Defitt <payment@defitt.org>";

// Replace smtp_username with your Amazon SES SMTP user name.
const smtpUsername = "AKIAYEX6P5S4YK6EEACD";

// Replace smtp_password with your Amazon SES SMTP password.
const smtpPassword = "BAMHZhpcY4oWSjFk5jYAXBQJz9vhgOaXt";

async function sendEmailPayment(name, email, amount){

    // The subject line of the email
    var subject = "Fitt Payment received";

    // The email body for recipients with non-HTML email clients.
    var body_text = "Payment received successfullt!!!"
    var body_html = "<h1> Congrats  "+ name +", </h1> <p>Payment of "+amount+" received successfully!!!</p>"


        // Create the SMTP transport.
        let transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: true, // true for 465, false for other ports
          auth: {
            user: smtpUsername,
            pass: smtpPassword
          }
        });
      
        // Specify the fields in the email.
        let mailOptions = {
          from: senderAddress,
          to: email,
          subject: subject,
          text: body_text,
          html: body_html
        };
      
        // Send the email.
        let info = await transporter.sendMail(mailOptions)
      
        console.log("Message sent! Message ID: ", info.messageId);
}

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/views/index.html'));
  });

// routes
app.post("/charge", (req, res) => {
    try {
      stripe.customers
        .create({
          name: req.body.name,
          email: req.body.email,
          source: req.body.stripeToken
        })
        .then(customer =>
          stripe.charges.create({
            amount: req.body.amount * 100,
            currency: "aed",
            customer: customer.id
          })
        )
        .then(() => {
            
            // send an email to the person
            sendEmailPayment(req.body.name, req.body.email, req.body.amount);
            res.render("/views/success.html")
        })
        .catch(err => { 
            console.log(err)
            res.render("/views/success.html")
        });
    } catch (err) {
      res.send(err);
    }
  });

// listening...
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
