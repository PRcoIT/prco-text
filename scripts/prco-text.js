const npm = require("npm");
const { getOptions } = require("../src/config/get-options");
const { twilioSend, signalwireSend } = require("../src/text-outbound");

const isRunningTests = typeof jest !== "undefined";

const handleInbound = async (options) => {
  const isServerStart = options.serverCommand === "start";

  isServerStart ? npm.load(() => npm.run("server-start")) : npm.load(() => npm.run("server-stop"));

  return options;
};

const handleOutbound = async (options) => {
  const response = options.isUsingTwilio
    ? await twilioSend(options)
    : await signalwireSend(options);

  if (!isRunningTests) console.log(response);

  return response;
};

const prcoText = () => {
  return Promise.resolve()
    .then(getOptions)
    .then((options) => {
      const isServerCommand = !!options.serverCommand;

      return isServerCommand ? handleInbound(options) : handleOutbound(options);
    });
};

prcoText();
