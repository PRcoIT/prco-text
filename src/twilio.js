require("dotenv").config();

const client = require("twilio")(process.env.accountSid, process.env.authToken);

client.messages
  .create({
    body: `.
A message from PRCO!
Run Forest run!!

`,
    from: "+16507294319",
    to: "+14159353327",
  })
  .then((message) => console.log(message.sid))
  .catch((e) => console.log(e));
