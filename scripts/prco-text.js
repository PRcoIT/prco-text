#!/usr/bin/env node

const npm = require("npm");
const fetch = require("node-fetch");

const { getCliOptions } = require("../src/config/get-cli-options");
const { getFilteredObject } = require("../src/utils");
const { usage } = require("../src/utils/usage");

const isRunningTests = typeof jest !== "undefined";

const serviceBaseUrl = "https://37435e1d227e.ngrok.io";

const getOptions = { method: "get" };

const postOptions = {
  method: "post",
  headers: { "Content-Type": "application/json" },
};

const fetchInfo = async (fetchUrl, fetchOptions) => {
  const response = fetch(fetchUrl, fetchOptions)
    .then(async (response) => {
      const responseText = await response.text();
      console.log(`${response.status} -- ${response.statusText}\n${responseText}`);
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

const sendOutgoingMessage = () => {
  const outboundMessage = "Hello all good";
  const targetPhoneNumber = "+4159353327";
  const fetchUrl = serviceBaseUrl + "/send-outgoing";
  const fetchOptions = {
    ...postOptions,
    body: JSON.stringify({ outboundMessage, targetPhoneNumber }),
  };

  return fetchInfo(fetchUrl, fetchOptions);
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
