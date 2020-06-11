const fs = require("fs");
const path = require("path");
const parseArgs = require("minimist");
const validator = require("validator");
const phone = require("phone");

const { getFilteredObject, hasProps } = require("../utils");
const { usage } = require("../utils/usage");

const isRunningTests = typeof jest !== "undefined";

const requiredOptions = {
  outboundOptions: ["isUsingTwilio", "service", "from", "to", "message"],
  inboundOptions: ["isUsingTwilio", "serverCommand", "service"],
};

const requiredEnvVars = {
  signalwire: ["signalwireFrom", "signalwireSpaceUrl", "signalwireProjectId", "signalwireApiToken"],
  twilio: ["twilioAccountSid", "twilioAuthToken", "twilioFrom"],
};

const abort = (message, options = {}) => {
  throw {
    errorMessage: `${message}\n${usage()}`,
    error: new Error(message),
    options,
  };
};

const getCliOptions = async () => {
  const options = parseArgs(process.argv.slice(2), {
    string: ["config_env_file  ", "server-command", "service", "from", "to", "message", "help"],
    alias: { config_env_file: "c", service: "s", from: "f", to: "t", message: "m", help: "h" },
    default: { service: "twilio" },
  });

  options.isUsingTwilio = options.service === "twilio";
  options.serverCommand = options["server-command"];

  const originalOptions = { ...options };

  const filterProps = (options, whitelist) => getFilteredObject(options, whitelist);

  const result = options["server-command"]
    ? filterProps(options, requiredOptions.inboundOptions)
    : filterProps(options, requiredOptions.outboundOptions);

  return result;
};

const getEnvOptions = async (options) => {
  const processDotenvFile = (options) => {
    const config_env_file =
      options.config_env_file || path.join(process.env.HOME, "protected", "prco-text-env");

    if (!fs.existsSync(config_env_file)) {
      abort(`Missing env file: ${config_env_file}`);
    }

    require("dotenv").config({ path: config_env_file });

    options.config_env_file = config_env_file;
  };

  const extractEnvVars = (envVars) => {
    let result = {};
    envVars.forEach((envVar) => {
      result[envVar] = process.env[envVar];
    });

    return result;
  };

  const requiredList = options.isUsingTwilio ? requiredEnvVars.twilio : requiredEnvVars.signalwire;
  processDotenvFile(options);
  options.env = extractEnvVars(requiredList);

  return options;
};

const transformOptions = (options) => {
  const isServerCommand = !!options.serverCommand;
  if (isServerCommand) return options;

  // overwrite FROM option if necessary
  const fromKey = options.isUsingTwilio ? "twilioFrom" : "signalwireFrom";
  options.from = options.from ? options.from : options.env[fromKey];

  // format phone numbers
  options.from = phone(options.from)[0];
  options.to = phone(options.to)[0];

  return options;
};

const validateOptions = (options) => {
  const isServerCommand = !!options.serverCommand;

  const validateOptionsExist = () => {
    try {
      const whitelist = isServerCommand
        ? requiredOptions.inboundOptions
        : requiredOptions.outboundOptions;
      return hasProps(whitelist, options);
    } catch (e) {
      abort(`Missing option: '${e.missingProp}'`, options);
    }
  };

  const validateEnvVarsExist = () => {
    try {
      const whitelist = options.isUsingTwilio ? requiredEnvVars.twilio : requiredEnvVars.signalwire;
      return hasProps(whitelist, options.env);
    } catch (e) {
      abort(`Missing env var: '${e.missingProp}'`, options);
    }
  };

  const validateRules = () => {
    const rules = {
      outboundRules: [
        {
          optionName: "service",
          validatorName: "hasChoices",
          params: ["twilio", "signalwire"],
        },
        { optionName: "from", validatorName: "hasPhone" },
        { optionName: "to", validatorName: "hasPhone" },
        { optionName: "message", validatorName: "hasText" },
        {
          optionName: "isUsingTwilio",
          validatorName: "hasBoolean",
        },
      ],
      inboundRules: [
        {
          optionName: "service",
          validatorName: "hasChoices",
          params: ["twilio", "signalwire"],
        },
        {
          optionName: "isUsingTwilio",
          validatorName: "hasBoolean",
        },
        {
          optionName: "serverCommand",
          validatorName: "hasChoices",
          params: ["start", "stop"],
        },
      ],
    };

    const validatorList = {
      hasChoices: (option, params) => params.includes(option),
      hasPhone: (option) => /\+\d{11}$/.test(option),
      hasText: (option) => !!option.length,
      hasBoolean: (option) => option === true || option === false,
    };

    const processRules = (rules) => {
      rules.forEach(({ optionName, validatorName, params = [] }) => {
        const validator = validatorList[validatorName];
        const option = options[optionName];
        const valid = validator(option, params);
        if (!valid) abort(`Invalid option: '${optionName}'`);
      });
    };

    processRules(isServerCommand ? rules.inboundRules : rules.outboundRules);
  };

  validateOptionsExist();
  validateEnvVarsExist();
  validateRules();

  return options;
};

const getOptions = async () => {
  return Promise.resolve()
    .then(getCliOptions)
    .then(getEnvOptions)
    .then(transformOptions)
    .then(validateOptions)
    .then((options) => {
      if (!isRunningTests) console.log("RESOLVED");

      return options;
    })
    .catch((e) => {
      if (!isRunningTests) console.log(e.errorMessage);

      throw e.error;
    });
};

module.exports = {
  getOptions,
};
