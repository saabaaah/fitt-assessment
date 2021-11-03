const express = require("express");
const app = express();
const path = require("path");

const MAIN_DOMAIN = "http://localhost:8080";


// middleware
app.use(express.json());

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname+'/views/index.html'));
  });

// listening...
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
