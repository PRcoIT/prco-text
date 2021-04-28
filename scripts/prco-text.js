#!/usr/bin/env node

const npm = require("npm");
const fetch = require("node-fetch");

const fs = require("fs");
const path = require("path");

const getEnvVars = () => {
  const config_env_file = path.join(process.env.HOME, "protected", "prco-text-env");
  if (!fs.existsSync(config_env_file)) throwError(`Missing env file: ${config_env_file}`);
  require("dotenv").config({ path: config_env_file });

  return process.env;
};

// collect env info
const { twilioAccountSid, twilioAuthToken } = getEnvVars();

const { getCliOptions } = require("../src/config/get-cli-options");
const { getFilteredObject } = require("../src/utils");
const { usage } = require("../src/utils/usage");

process.chdir(__dirname);

const isRunningTests = typeof jest !== "undefined";

const serviceBaseUrl = "http://localhost:1337";

const getOptions = { method: "get" };

const postOptions = {
  method: "post",
  headers: { "Content-Type": "application/json" },
};

const fetchInfo = async (fetchUrl, fetchOptions) => {
  const response = fetch(fetchUrl, fetchOptions)
    .then(async (response) => {
      const responseText = await response.text();
      return responseText;
    })
    .catch((e) => console.log(e));

  return response;
};

const startServer = () => npm.load(() => npm.run("server-start"));

const stopServer = () => npm.load(() => npm.run("server-stop"));

const configServiceName = () => {
  const messagingServiceName = "PRCO Messaging Service";
  const fetchUrl = serviceBaseUrl + "set-service-name";
  const fetchOptions = { ...postOptions, body: { messagingServiceName } };

  return fetchInfo(fetchUrl, fetchOptions);
};

const configServicePhoneNumber = () => {
  const fetchUrl = serviceBaseUrl + "set-service-phone";
  const fetchOptions = getOptions;

  return fetchInfo(fetchUrl, fetchOptions);
};

const getOutgoingMessageStatus = async (messageId) => {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages/${messageId}.json`;
  const fetchOptions = {
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${twilioAccountSid}: ${twilioAuthToken}`).toString("base64"),
    },
  };

  const response = await fetch(url, fetchOptions);
  const result = await response.json();

  return result;
};

const getMessageStatusToConsole = async (messageObj) => {
  const messageId = messageObj["get-message-status"];
  const messageInfo = await getOutgoingMessageStatus(messageId);
  console.log("messageInfo: ", messageInfo);
  const status = messageInfo["status"];
  console.log(`message ID: ${messageId}\nstatus: ${status}`);
};

const delayMs = (ms) => {
  return new Promise((resolve, reject) => setTimeout(() => resolve(true), ms));
};

const sendOutgoingMessage = async (options) => {
  const outboundMessage = options["outbound-message"];
  const sourcePhoneNumber = options["source-phone-number"];
  const targetPhoneNumber = options["target-phone-number"];
  const fetchUrl = serviceBaseUrl + "/send-outgoing";
  const fetchOptions = {
    ...postOptions,
    body: JSON.stringify({ outboundMessage, sourcePhoneNumber, targetPhoneNumber }),
  };

  const messageId = await fetchInfo(fetchUrl, fetchOptions);

  await delayMs(15000);

  let { status, error_message, error_code } = await getOutgoingMessageStatus(messageId.slice(4));

  if (error_code == "21608") {
    error_message = "Developer account must use validated numbers.";
  }

  const result = `
  message_id: ${messageId.slice(4)}
  status: ${status}
  error_message: ${error_message}
  error_code: ${error_code}
  `;

  console.log(result);
};

const getIncomingMessages = () => {
  const fetchUrl = serviceBaseUrl + "/get-incoming";
  const fetchOptions = getOptions;

  return fetchInfo(fetchUrl, fetchOptions);
};

const clearIncomingMessages = () => {
  const fetchUrl = serviceBaseUrl + "/clear-incoming";
  const fetchOptions = postOptions;

  return fetchInfo(fetchUrl, fetchOptions);
};

const help = () => {
  console.log(usage());
  process.exit(0);
};

const commandsMap = {
  ["start-server"]: startServer,
  ["stop-server"]: stopServer,
  ["config-service-name"]: configServiceName,
  ["config-service-phone-number"]: configServicePhoneNumber,
  ["outbound-message"]: sendOutgoingMessage,
  ["get-message-status"]: getMessageStatusToConsole,
  ["get-incoming-messages"]: getIncomingMessages,
  ["clear-incoming-messages"]: clearIncomingMessages,
  ["help"]: help,
};

const validCommands = Object.keys(commandsMap);

const executeCommand = async (options) => {
  const args = Object.keys(options);
  const isValidCommand = validCommands.some((e) => args.includes(e));
  if (!isValidCommand) help();
  const command = validCommands.find((e) => args.includes(e));
  const response = commandsMap[command](options);

  return response;
};

const prcoText = () => {
  return Promise.resolve()
    .then(getCliOptions) // get options
    .then(executeCommand) // execute
    .catch(console.log); // catch errors
};

prcoText();
