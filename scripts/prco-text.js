const npm = require("npm");
const { getOptions } = require("../src/config/get-options");
const { twilioSend, signalwireSend } = require("../src/text-outbound");

const isRunningTests = typeof jest !== "undefined";

const handleInboundText = async (options) => {
  const isServerStart = options.serverCommand === "start";
  const args = [
    "--opt-out",
    options.env.optOut,
    "--opt-in",
    options.env.optIn,
    "--opt-none",
    options.env.optNone,
  ];

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

const prcoText = () => {
  return Promise.resolve()
    .then(getOptions)
    .then((options) => {
      const isServerCommand = !!options.serverCommand;

      return isServerCommand ? handleInboundText(options) : handleOutboundText(options);
    });
};

prcoText();
