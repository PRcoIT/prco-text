#!/usr/bin/env node

const npm = require("npm");
const { getCliOptions } = require("../src/config/get-cli-options");
const { getFilteredObject } = require("../src/utils");
const { usage } = require("../src/utils/usage");

const isRunningTests = typeof jest !== "undefined";

const serviceBaseUrl = "https://ngrok.io/";

const getOptions = { method: "get" };

const postOptions = {
  method: "post",
  headers: {
    ["content-type"]: "text/json; charset=utf-8",
  },
};

const fetchInfo = (fetchUrl, fetchOptions) => {
  return fetch(fetchUrl, fetchOptions).then((response) => {
    console.log(response.body);
    return response;
  });
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

const sendOutgoingMessage = () => {
  const outboundMessage = "Hello all good";
  const targetPhoneNumber = "+4159353327";
  const fetchUrl = serviceBaseUrl + "send-outgoing";
  const fetchOptions = { ...postOptions, body: { outboundMessage, targetPhoneNumber } };

  return fetchInfo(fetchUrl, fetchOptions);
};

const getIncomingMessages = () => {
  const fetchUrl = serviceBaseUrl + "get-incoming";
  const fetchOptions = getOptions;

  return fetchInfo(fetchUrl, fetchOptions);
};

const clearIncomingMessages = () => {
  const fetchUrl = serviceBaseUrl + "clear-incoming";
  const fetchOptions = postOptions;

  return fetchInfo(fetchUrl, fetchOptions);
};

const help = () => console.log(usage());

const commandsMap = {
  ["start-server"]: startServer,
  ["stop-server"]: stopServer,
  ["config-service-name"]: configServiceName,
  ["config-service-phone-number"]: configServicePhoneNumber,
  ["outbound-message"]: sendOutgoingMessage,
  ["get-incoming-messages"]: getIncomingMessages,
  ["clear-incoming-messages"]: clearIncomingMessages,
  ["help"]: help,
};

const validCommands = Object.keys(commandsMap);

const executeCommand = (options) => {
  const args = Object.keys(options);
  const isValidCommand = validCommands.some((e) => args.includes(e));
  if (!isValidCommand) throw Error("Invalid command");
  const command = validCommands.find((e) => args.includes(e));

  return commandsMap[command](options);
};

const prcoText = () => {
  return Promise.resolve().then(getCliOptions).then(executeCommand).catch(console.log);
};

prcoText();
