#!/usr/bin/env node

const twilioSend = require("./modules").twilioSend;
const signalwireSend = require("./modules").signalwireSend;

/*
    prcoText
*/
const prcoText = async () => {
  const options = require("./utils/get-options.js").getOptions();

  options.service === "twilio" ? await twilioSend(options) : await signalwireSend(options);
};

prcoText();
