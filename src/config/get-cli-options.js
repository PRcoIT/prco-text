const fs = require("fs");
const path = require("path");
const parseArgs = require("minimist");
const validator = require("validator");
const phone = require("phone");

const { getFilteredObject, hasProps } = require("../utils");
const { usage } = require("../utils/usage");

const validOptions = [
  "start-server",
  "stop-server",
  "configure-service-name",
  "configure-service-phone-number",
  "outbound-message",
  "get-message-status",
  "source-phone-number",
  "target-phone-number",
  "get-incoming-messages",
  "clear-incoming-messages",
  "help",
];

const isRunningTests = typeof jest !== "undefined";

const abort = (message, options = {}) => {
  throw {
    errorMessage: `${message}\n${usage()}`,
    error: new Error(message),
    options,
  };
};

const processArgs = async () => {
  const options = parseArgs(process.argv.slice(2), {
    string: validOptions,
  });

  const whitelist = Object.keys(options).filter((o) => validOptions.includes(o));
  if (!whitelist.length) return {};

  const filteredOptions = getFilteredObject(options, whitelist);

  return filteredOptions;
};

const getCliOptions = async () => {
  return Promise.resolve()
    .then(processArgs)
    .catch((e) => {
      if (!isRunningTests) console.log(e.errorMessage);

      throw e.error;
    });
};

module.exports = {
  getCliOptions,
};
