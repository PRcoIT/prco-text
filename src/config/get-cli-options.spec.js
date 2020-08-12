const { getCliOptions } = require("./get-cli-options");
const { defaultWorkerPolicies } = require("twilio/lib/jwt/taskrouter/util");

const defaultArgs = ["node", "prco-text"];

const validOptions = [
  "start-server",
  "stop-server",
  "configure-service-name",
  "configure-service-phone-number",
  "outbound-message",
  "target-phone-number",
  "get-incoming-messages",
  "clear-incoming-messages",
  "help",
];

describe("get-cli-options", () => {
  it("should return default options when no options provided", async () => {
    process.argv = [...defaultArgs];
    const actual = await getCliOptions();
    const expected = {};
    expect(actual).toEqual(expected);
  });

  it("should not allow invalid options", async () => {
    process.argv = [...defaultArgs, "--bogus"];
    const actual = await getCliOptions();
    const expected = {};
    expect(actual).toEqual(expected);
  });

  it("should allow all valid options", async () => {
    await validOptions.reduce(async (memo, option) => {
      await memo;
      process.argv = [...defaultArgs, `--${option}`];
      const actual = await getCliOptions();
      const expected = { [option]: "" };
      expect(actual).toEqual(expected);
    }, undefined);
  });

  it("should allow option args ", async () => {
    process.argv = [
      ...defaultArgs,
      "--outbound-message",
      "hello",
      "--target-phone-number",
      "+14155551212",
    ];
    const actual = await getCliOptions();
    const expected = { "outbound-message": "hello", "target-phone-number": "+14155551212" };
    expect(actual).toEqual(expected);
  });
});
