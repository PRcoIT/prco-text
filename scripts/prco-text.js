const npm = require("npm");
const { getOptions } = require("../src/config/get-options");
const { twilioSend, signalwireSend } = require("../src/text-outbound");

const isRunningTests = typeof jest !== "undefined";

const handleInboundText = async (options) => {
  const isServerStart = options.serverCommand === "start";

  isServerStart
    ? npm.load(() => npm.run("server-start", ...args))
    : npm.load(() => npm.run("server-stop"));

  console.log("options: ", options);
  return options;
};

const handleOutboundText = async (options) => {
  const response = options.isUsingTwilio
    ? await twilioSend(options)
    : await signalwireSend(options);

  if (!isRunningTests) console.log(response);

  return response;
};

// ###########################################

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

const startServer = () => npm.load(() => npm.run("server-start", ...args));

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

const prcoText = () => {
  return Promise.resolve()
    .then(getOptions)
    .then((options) => {
      const isServerCommand = !!options.serverCommand;

      return isServerCommand ? handleInboundText(options) : handleOutboundText(options);
    });
};

prcoText();
