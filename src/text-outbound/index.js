const twilioSend = require("./twilio");
const signalwireSend = require("./signalwire");

const { getOptions } = require("./utils/get-options.js");

const isRunningTests = typeof jest !== "undefined";

/*
    prcoText
*/
const prcoText = async () => {
  return getOptions()
    .then(async (options) => {
      const sendText = options.service === "twilio" ? twilioSend : signalwireSend;
      const response = await sendText(options);

      if (!isRunningTests) console.log(response);

      return response;
    })
    .catch((e) => {
      if (!isRunningTests) console.log(e.errorMessage);

      return e;
    });
};

module.exports = {
  prcoText,
};
