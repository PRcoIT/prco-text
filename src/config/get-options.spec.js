const { getOptions } = require("./get-options");
const { hasProps } = require("../utils");

const expectOption = async ({ args, optionName, expected }) => {
  process.argv = args;
  const options = await getOptions();
  expect(options[optionName]).toBe(expected);
};

const expectEnvOption = async ({ args, optionName, expected }) => {
  process.argv = args;
  const options = await getOptions();
  expect(options.env[optionName]).toBe(expected);
};

const expectRejectToThrow = async ({ args }) => {
  process.argv = args;
  await expect(getOptions()).rejects.toThrow();
};

const expectProps = async ({ args, props }) => {
  process.argv = args;
  const options = await getOptions();
  hasProps(props, options);
};

const expectEnvProps = async ({ args, props }) => {
  process.argv = args;
  const options = await getOptions();
  hasProps(props, options.env);
};

describe("get-options", () => {
  describe("inbound text options", () => {
    beforeEach(() => {
      args = ["node", "prco-text", "--server-command", "start"];
    });

    describe("default values", () => {
      it("should default 'config_env_file' option to '$HOME/protected/prco-text-env'", async () => {
        await expectOption({
          args,
          optionName: "config_env_file",
          expected: `${process.env.HOME}/protected/prco-text-env`,
        });
      });

      it("should default 'service' option to 'twilio'", async () => {
        await expectOption({
          args,
          optionName: "service",
          expected: "twilio",
        });
      });
    });

    describe("restricted options", () => {
      it("should restrict option 'server-command' to 'start' or 'stop'", async () => {
        await expectOption({
          args: ["node", "prco-text", "--server-command", "start"],
          optionName: "serverCommand",
          expected: "start",
        });

        await expectOption({
          args: ["node", "prco-text", "--server-command", "stop"],
          optionName: "serverCommand",
          expected: "stop",
        });

        await expectRejectToThrow({
          args: ["node", "prco-text", "--server-command", "bad"],
        });
      });

      it("should restrict option 'service' to 'twilio' or 'signalwire'", async () => {
        await expectOption({
          args: [...args, "--service", "twilio"],
          optionName: "service",
          expected: "twilio",
        });

        await expectOption({
          args: [...args, "--service", "signalwire"],
          optionName: "service",
          expected: "signalwire",
        });

        await expectRejectToThrow({
          args: [...args, "--service", "bad"],
        });
      });
    });

    describe("required options", () => {
      it("should require options: 'serverCommand' and 'service'", async () => {
        await expectProps({ args, props: ["serverCommand", "service"] });
      });
    });
  });

  describe("outbound text options", () => {
    let args;

    beforeEach(() => {
      args = [
        "node",
        "prco-text",
        "--from",
        "6509353327",
        "--to",
        "4152557204",
        "--message",
        "hello",
      ];

      process.env.twilioAccountSid = "foo";
      process.env.twilioAuthToken = "bar";
      process.env.twilioFrom = "4152557204";
      process.env.signalwireSpaceUrl = "foo";
      process.env.signalwireProjectId = "bar";
      process.env.signalwireApiToken = "baz";
      process.env.signalwireFrom = "4155551212";
    });

    describe("default values", () => {
      it("should default 'config_env_file' option to '$HOME/protected/prco-text-env'", async () => {
        await expectOption({
          args,
          optionName: "config_env_file",
          expected: `${process.env.HOME}/protected/prco-text-env`,
        });
      });

      it("should default 'service' option to 'twilio'", async () => {
        await expectOption({
          args,
          optionName: "service",
          expected: "twilio",
        });
      });

      describe("when using twilio", () => {
        it("should default 'from' option to 'twilioFrom' value in env file", async () => {
          process.env.twilioFrom = "4152557204";

          await expectOption({
            args: ["node", "prco-text", "--to", "4152557204", "--message", "hello"],
            optionName: "from",
            expected: "+14152557204",
          });
        });
      });

      describe("when using signalwire", () => {
        it("should default 'from' option to 'signalwireFrom' value in env file", async () => {
          await expectOption({
            args: [
              "node",
              "prco-text",
              "--service",
              "signalwire",
              "--to",
              "4152557204",
              "--message",
              "hello",
            ],
            optionName: "from",
            expected: "+14155551212",
          });
        });
      });
    });

    describe("restricted options", () => {
      it("should restrict option 'service' to 'twilio' or 'signalwire'", async () => {
        await expectOption({
          args: [...args, "--service", "twilio"],
          optionName: "service",
          expected: "twilio",
        });

        await expectOption({
          args: [...args, "--service", "signalwire"],
          optionName: "service",
          expected: "signalwire",
        });

        await expectRejectToThrow({
          args: [...args, "--service", "bad"],
        });
      });

      it("should restrict option 'from' to formal 11 digit phone number", async () => {
        await expectOption({
          args,
          optionName: "from",
          expected: "+16509353327",
        });

        args[3] = "41512345"; // changing 'from' option
        await expectRejectToThrow({
          args,
        });
      });

      it("should restrict option 'to' to formal 11 digit phone number", async () => {
        await expectOption({
          args,
          optionName: "to",
          expected: "+14152557204",
        });

        args[5] = "41512345"; // changing 'to' option
        await expectRejectToThrow({
          args,
        });
      });

      it("should restrict option 'message' to not be blank", async () => {
        await expectOption({
          args,
          optionName: "message",
          expected: "hello",
        });

        args[7] = ""; // changing 'message' option
        await expectRejectToThrow({
          args,
        });
      });
    });

    describe("required options", () => {
      it("should require options: 'service', 'from', 'to', 'message'", async () => {
        await expectProps({ args, props: ["service", "from", "to", "message"] });
      });
    });
  });

  describe("auth options from env", () => {
    let args;

    describe("when using twilio", () => {
      beforeEach(() => {
        args = ["node", "prco-text", "--server-command", "start"];
      });

      it("should require twilio auth options", async () => {
        await expectEnvProps({
          args,
          props: ["twilioAccountSid", "twilioAuthToken", "twilioFrom"],
        });

        await expectEnvOption({
          args,
          optionName: "twilioAccountSid",
          expected: "foo",
        });

        await expectEnvOption({
          args,
          optionName: "twilioAuthToken",
          expected: "bar",
        });

        await expectEnvOption({
          args,
          optionName: "twilioFrom",
          expected: "4152557204",
        });
      });
    });

    describe("when using signalwire", () => {
      beforeEach(() => {
        args = ["node", "prco-text", "--server-command", "start", "--service", "signalwire"];
      });

      it("should require signalwire auth options", async () => {
        await expectEnvProps({
          args,
          props: [
            "signalwireSpaceUrl",
            "signalwireProjectId",
            "signalwireApiToken",
            "signalwireFrom",
          ],
        });

        await expectEnvOption({
          args,
          optionName: "signalwireSpaceUrl",
          expected: "foo",
        });

        await expectEnvOption({
          args,
          optionName: "signalwireProjectId",
          expected: "bar",
        });

        await expectEnvOption({
          args,
          optionName: "signalwireApiToken",
          expected: "baz",
        });

        await expectEnvOption({
          args,
          optionName: "signalwireFrom",
          expected: "4155551212",
        });
      });
    });
  });
});
