const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const MessagingResponse = require("twilio").twiml.MessagingResponse;

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

const client = require("twilio")(twilioAccountSid, twilioAuthToken);

// create and configure express server
const app = express();

// create application/json parser
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// create log functions
const incomingLogFile = `${process.env.HOME}/protected/incoming.txt`;
let stream = fs.createWriteStream(incomingLogFile, { flags: "a" });
const appendIncomingLog = (logMessage) => stream.write(logMessage);
const getIncomingLog = () => fs.readFileSync(incomingLogFile);
const clearIncomingLog = () => fs.truncateSync(incomingLogFile);

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
  const { outboundMessage, sourcePhoneNumber, targetPhoneNumber } = { ...req.body };
  const messageData = {
    messagingServiceSid: twilioServiceSid,
    body: outboundMessage,
    from: sourcePhoneNumber,
    to: targetPhoneNumber,
  };

  client.messages
    .create(messageData)
    .then((message) => {
      // console.log("OK:", message);
      res.send(`ok: ${message.sid}`);
    })
    .catch((e) => {
      // console.log("ERROR:", e);
      res.send(`ERROR: ${e}`);
    });
});

app.post("/sms", (req, res) => {
  const incomingMsgData = { ...req.body };
  const { SmsSid, From, To, Body } = incomingMsgData;
  console.log("incomingMsgData: ", incomingMsgData);
  const logMessage = `SmsSid:'${SmsSid}' From:'${From}' To:'${To}' Body:'${Body}'\n`;

  appendIncomingLog(logMessage);
  if (twilioIncomingMessageResponse.length) outgoingResponse(res, twilioIncomingMessageResponse);
});

app.get("/get-incoming", (req, res) => {
  const incomingLog = getIncomingLog();
  res.send(incomingLog);
});

app.post("/clear-incoming", (req, res) => {
  clearIncomingLog();
  res.send("ok");
});

app.get("/", (req, res) => {
  res.send("PRCO incoming message server is alive!\n");
});

http.createServer(app).listen(1337, () => {
  console.log("Express server listening on port 1337");
});
