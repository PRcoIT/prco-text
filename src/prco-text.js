#!/usr/bin/env node

const twilioSend = require("./modules").twilioSend;
const signalwireSend = require("./modules").signalwireSend;
const { usage, getOptions } = require("./utils/get-options.js");

const isRunningTests = typeof jest !== "undefined";

/*
    prcoText
*/
const prcoText = async () => {
  return getOptions()
    .then(async (options) => {
      const response =
        options.service === "twilio" ? await twilioSend(options) : await signalwireSend(options);
      if (!isRunningTests) console.log(response);
      return response;
    })
    .catch((e) => {
      if (!isRunningTests) console.log(e.errorMessage);
      return e;
    });
};

prcoText();

module.exports = {
  prcoText,
};
