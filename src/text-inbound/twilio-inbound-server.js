const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const parseArgs = require("minimist");

const options = parseArgs(process.argv.slice(2), {
  string: ["opt-out", "opt-in", "opt-none"],
});

const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const messages = {
  optOut: options["opt-out"],
  optIn: options["opt-in"],
  optNone: options["opt-none"],
};

const twilioReply = (res, message) => {
  const twiml = new MessagingResponse();

  twiml.message(message);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};

const getTwilioSend = (res) => (message) => twilioReply(res, message);

app.post("/sms", (req, res) => {
  const twilioSend = getTwilioSend(res);
  const reqDataObject = { ...req.body };
  const isOptingOut = RegExp(/STOP/).test(reqDataObject.Body);
  const isOptingIn = RegExp(/START/).test(reqDataObject.Body);
  const messageKey = isOptingOut ? "optOut" : isOptingIn ? "optIn" : "optNone";
  const replyMessage = messages[messageKey];

  twilioSend(replyMessage);
});

app.get("/", (req, res) => {
  res.send("hello world");
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});
