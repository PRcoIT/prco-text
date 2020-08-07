const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

console.log("start");

const getEnvVars = () => {
  const config_env_file = path.join(process.env.HOME, "protected", "prco-text-env");
  if (!fs.existsSync(config_env_file)) throwError(`Missing env file: ${config_env_file}`);
  require("dotenv").config({ path: config_env_file });

  return process.env;
};

// collect env info
const {
  twilioAccountSid,
  twilioAuthToken,
  twilioServiceSid,
  twilioPhoneNumberSid,
  twilioIncomingMessageResponse,
} = getEnvVars();

console.log({
  twilioAccountSid,
  twilioAuthToken,
  twilioServiceSid,
  twilioPhoneNumberSid,
  twilioIncomingMessageResponse,
});

process.exit(0);

const client = require("twilio")(accountSid, authToken);

// create and configure express server
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// create appendIncomingLog function
const incomingLogFile = `${process.env.HOME}/protected/incoming.txt`;
const stream = fs.createWriteStream(incomingLogFile, { flags: "a" });
const appendIncomingLog = (json) => stream.write(JSON.stringify(json, null, 2));

// create twilioResponse function
const outgoingResponse = (res, message) => {
  const twiml = new MessagingResponse();
  twiml.message(message);
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};

// API ENDPOINTS

app.post("/set-service-name", (req, res) => {
  const { messagingServiceName } = { ...req.body };

  client.messaging.services
    .create({ friendlyName: messagingServiceName })
    .then((service) => res.send(`ok: ${service.sid}`))
    .catch((e) => res.send(e));
});

app.get("/set-service-phone", (req, res) => {
  client.messaging
    .services(twilioServiceSid)
    .phoneNumbers.create({ twilioPhoneNumberSid })
    .then((phone_number) => res.send(`ok: ${phone_number.sid}`))
    .catch((e) => res.send(e));
});

app.post("/send-outgoing", (req, res) => {
  const { outboundMessage, targetPhoneNumber } = { ...req.body };

  client.messages
    .create({
      messagingServiceSid: twilioServiceSid,
      body: outboundMessage,
      to: targetPhoneNumber,
    })
    .then((message) => res.send(`ok: ${message.sid}`))
    .catch((e) => res.send(e));
});

app.get("/get-incoming", (req, res) => {
  const incomingMessages = getIncomingMessages();
  res.send(incomingMessages);
});

app.post("/clear-incoming", (req, res) => {
  clearIncomingMessages();
  res.send("ok");
});

app.post("/sms", (req, res) => {
  const incomingMsgData = { ...req.body };

  appendIncomingLog(incomingMsgData);
  outgoingResponse(res, outgoingResponseMessage);
});

app.get("/", (req, res) => {
  appendIncomingLog({ message: "somebody is checking if we're alive." });
  res.send("PRCO incoming message server is alive!\n");
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});
