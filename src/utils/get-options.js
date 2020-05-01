const parseArgs = require("minimist");
const validator = require("validator");
require("dotenv").config();

const usage = () => {
  const message = `
USAGE

    prco-text [options]

    OPTIONS

        -s,--service   twilio or signalwire -- default: signalwire
        -f,--from      originating phone number -- default: number in .env file
        -t,--to        destination phone number
        -m,--message   message to be sent
        -h,--help      display usage help

EXAMPLE

    $ prco-text --to 415-222-3333 --message 'hello,
    Your car is ready :)

    PRCO
    415-555-1212'


  `;
  console.log(message);
};

const abortScript = (reason) => {
  console.log(`\n${reason}`);
  usage();
  process.exit(0);
};

const validatedEnv = () => {
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
      reason += `Invalid env variable: ${envVar}`;
    } else {
      validEnvVars[envVar] = process.env[envVar];
    }
  });

  if (reason) abortScript(reason);

  return validEnvVars;
};

const validatedOptions = () => {
  var options = parseArgs(process.argv.slice(2), {
    string: ["service", "from", "to", "message", "help"],
    alias: { service: "s", from: "f", to: "t", message: "m", help: "h" },
    default: { service: "signalwire" },
  });

  let reason = "";

  if (options.help !== undefined) abortScript("");

  if (options.service !== "signalwire" && options.service !== "twilio") {
    reason += "Invalid service: use twilio or signalwire.\n";
  }

  const { twilioFrom, signalwireFrom } = validatedEnv();
  const defaultFrom = options.service === "signalwire" ? signalwireFrom : twilioFrom;
  const { service, from = defaultFrom, to, message } = options;

  if (!from || !to || !message) {
    reason += "Missing options.\n";
  }

  if (from && !validator.isMobilePhone(from)) {
    reason += `Invalid 'from' field: invalid phone format: ${from}\n`;
  }

  if (to && !validator.isMobilePhone(to)) {
    reason += `Invalid 'to' field: invalid phone format: ${to}\n`;
  }

  reason && abortScript(reason);

  return { service, from, to, message };
};

const getOptions = () => ({ ...validatedEnv(), ...validatedOptions() });

module.exports = {
  getOptions,
};
