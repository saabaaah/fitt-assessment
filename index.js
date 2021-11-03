const express = require("express");
const app = express();
const path = require("path");
const API_KEY = "sk_test_51J9Vl5EC8QUyIKkd1m0MbchhkEpBD2gCn4ZOdKL4jB83kHu6WcUpXOvQvnmIyNCqtUS7ulSW8gSa1GwUPWy7bKdX005mhMGqDf";
const stripe = require("stripe")(API_KEY);

const MAIN_DOMAIN = "http://localhost:8080";


// middleware
app.use(express.json());

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
            currency: "usd",
            customer: customer.id
          })
        )
        .then(() => res.render("/views/success.html"))
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
