const npm = require("npm");
const { getOptions } = require("../src/config/get-options");
const { twilioSend, signalwireSend } = require("../src/text-outbound");

const handleCommand = async (options) => {
  const isServerCommand = !!options.serverCommand;

  if (isServerCommand) {
    // INBOUND
    const isServerStart = options.serverCommand === "start";

    console.log(options);

    isServerStart
      ? npm.load(() => npm.run("server-start"))
      : npm.load(() => npm.run("server-stop"));

    return true;
  } else {
    // OUTBOUND
    const response = options.isUsingTwilio
      ? await twilioSend(options)
      : await signalwireSend(options);

    console.log(response);

    return response;
  }
};

const prcoText = () => Promise.resolve().then(getOptions).then(handleCommand);

prcoText();
