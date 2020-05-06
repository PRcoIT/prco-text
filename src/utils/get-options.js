const fs = require("fs");
const path = require("path");
const parseArgs = require("minimist");
const validator = require("validator");
const phone = require("phone");

const usage = () => {
  const message = `
USAGE

    prco-text [options]

    OPTIONS

        -c,--config_env_file  location of file containing environment variables
                              defaults to $HOME/protected/prco-text-env
        -s,--service          twilio or signalwire -- default: signalwire
        -f,--from             originating phone number -- default: number in .env file
        -t,--to               destination phone number
        -m,--message          message to be sent
        -h,--help             display usage help

EXAMPLE

    $ prco-text --to 415-222-3333 --message 'hello,
    Your car is ready :)

    PRCO
    415-555-1212'


  `;

  return message;
};

const abort = (message, options = {}) => {
  throw {
    errorMessage: `${message}\n${usage()}`,
    error: new Error(message),
    options,
  };
};

const validatedEnv = async () => {
  const signalwireEnvVars = [
    "signalwireFrom",
    "signalwireSpaceUrl",
    "signalwireProjectId",
    "signalwireApiToken",
  ];

  const twilioEnvVars = ["twilioAccountSid", "twilioAuthToken", "twilioFrom"];

  const validEnvVars = {};
  let reason = "";
  [...signalwireEnvVars, ...twilioEnvVars].forEach((envVar) => {
    if (process.env[envVar] === undefined) {
      reason += `Invalid env variable: ${envVar}\n`;
    } else {
      validEnvVars[envVar] = process.env[envVar];
    }
  });

  if (reason) abort(reason);

  return validEnvVars;
};

const validatedOptions = async () => {
  var options = parseArgs(process.argv.slice(2), {
    string: ["config_env_file  ", "service", "from", "to", "message", "help"],
    alias: { config_env_file: "c", service: "s", from: "f", to: "t", message: "m", help: "h" },
    default: { service: "signalwire" },
  });

  const config_env_file =
    options.config_env_file || path.join(process.env.HOME, "protected", "prco-text-env");

  if (!fs.existsSync(config_env_file)) abort(`Missing env file: ${config_env_file}`);

  require("dotenv").config({ path: config_env_file });

  const envVars = await validatedEnv();
  const { twilioFrom, signalwireFrom } = envVars;

  let reason = "";

  if (options.help !== undefined) abort("", options);

  if (options.service !== "signalwire" && options.service !== "twilio") {
    abort("Invalid service: use twilio or signalwire.\n", options);
  }

  const defaultFrom = options.service === "signalwire" ? signalwireFrom : twilioFrom;
  const { service, from = defaultFrom, to = "", message = "" } = options;
  options.from = from;

  ["from", "to", "message"].forEach((option) => {
    if (!options[option]) abort(`Missing '${option}' option.\n`, options);
  });

  options.from = phone(options.from, "")[0];
  options.to = phone(options.to, "")[0];

  if (!options.from || !validator.isMobilePhone(options.from, "", { strictMode: true })) {
    reason += `Invalid 'from' field: invalid phone format: ${options.f}\n`;
  }

  if (!options.to || !validator.isMobilePhone(options.to, "", { strictMode: true })) {
    reason += `Invalid 'to' field: invalid phone format: ${options.t}\n`;
  }

  if (reason) abort(reason, options);

  const result = { ...envVars, service, from: options.from, to: options.to, message };

  return result;
};

const getOptions = async () => validatedOptions();

module.exports = {
  usage,
  getOptions,
};
