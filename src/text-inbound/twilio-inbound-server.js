const http = require("http");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const parseArgs = require("minimist");

const incomingTextFile = `${process.env.HOME}/protected/incoming.txt`;
const stream = fs.createWriteStream(incomingTextFile, { flags: "a" });

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

// HELPER FUNCTIONS

const twilioReply = (res, message) => {
  const twiml = new MessagingResponse();

  twiml.message(message);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};

const getTwilioSendReply = (res) => (message) => twilioReply(res, message);

const appendIncomingTextFile = (json) => stream.write(JSON.stringify(json, null, 2));

// API ENDPOINTS

app.post("/sms", (req, res) => {
  const twilioSendReply = getTwilioSendReply(res);
  const reqDataObject = { ...req.body };
  const isOptingOut = RegExp(/STOP/).test(reqDataObject.Body);
  const isOptingIn = RegExp(/START/).test(reqDataObject.Body);
  const messageKey = isOptingOut ? "optOut" : isOptingIn ? "optIn" : "optNone";
  const replyMessage = messages[messageKey];
  reqDataObject.replyMessage = replyMessage;

  appendIncomingTextFile(reqDataObject);
  twilioSendReply(replyMessage);
});

app.get("/", (req, res) => {
  res.send("hello world");
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});
