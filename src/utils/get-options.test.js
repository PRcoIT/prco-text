const getOptions = require("./get-options").getOptions;

const getCommandOptions = (options) => {
  const commandOptions = {
    language: "node",
    command: "prco-text",
    from: "415-935-3327",
    to: "415-935-3327",
    message: "hi",
  };

  Object.keys(options).forEach((option) => {
    commandOptions[option] = options[option];
  });

  const result = [
    commandOptions["language"],
    commandOptions["command"],
    "--from",
    commandOptions["from"],
    "--to",
    commandOptions["to"],
    "--message",
    commandOptions["message"],
  ];

  return result;
};

describe("get-options", () => {
  let response;

  beforeEach(() => {
    response = "";
  });

  describe("invalid options", () => {
    describe("when command given no options", () => {
      it("should produce error message and show usage", async () => {
        process.argv = ["node", "prco-text"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when config_env_file not found", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-text", "-c /foo"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given invalid service option (not wis or oneguard)", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-text", "-s foo"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given invalid 'from' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-text"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });

        process.argv = ["node", "prco-text", "-f 555"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when comand given invalid 'to' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-text"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });

        process.argv = ["node", "prco-text", "-t 555"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given invalid 'message' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-text"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });
  });

  describe("phone number transformation and validation", () => {
    describe("when command given 'from' with dashes", () => {
      it("should modify 'from' field and remove dashes and add usa country code", async () => {
        process.argv = getCommandOptions({ from: "415-935-3327", to: "415935" });
        getOptions()
          .then(console.log)
          .catch(async (e) => {
            expect(e).toMatchSnapshot();
          });
      });
    });

    describe("when command given 'from' missing country code", () => {
      it("should modify 'from' field and add usa country code", async () => {
        process.argv = getCommandOptions({ from: "4159353327", to: "415935" });
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given invalid 'from' number", () => {
      it("should show error and usage", async () => {
        process.argv = getCommandOptions({ from: "4159353", to: "4159353327" });
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given 'to' with dashes", () => {
      it("should modify 'to' field and remove dashes and add usa country code", async () => {
        process.argv = getCommandOptions({ from: "415935", to: "415-935-3327" });
        getOptions()
          .then(console.log)
          .catch(async (e) => {
            expect(e).toMatchSnapshot();
          });
      });
    });

    describe("when command given 'to' missing country code", () => {
      it("should modify 'to' field and add usa country code", async () => {
        process.argv = getCommandOptions({ from: "415935", to: "4159353327" });
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given invalid 'to' number", () => {
      it("should show error and usage", async () => {
        process.argv = getCommandOptions({ from: "4159353327", to: "415935" });
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });
  });

  describe("valid options", () => {
    describe("when command given help option", () => {
      it("should only display usage", async () => {
        process.argv = ["node", "prco-text", "-h"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when comand given all valid options", () => {
      it("should return object containing the valid options", async () => {
        process.argv = ["node", "prco-text", "-t", "+14159353327", "-m", "booya"];
        response = await getOptions();

        [
          "twilioAccountSid",
          "twilioAuthToken",
          "signalwireSpaceUrl",
          "signalwireProjectId",
          "signalwireApiToken",
        ].forEach((field) => {
          expect(field.length).toBeGreaterThan(5);
          response[field] = "hidden";
        });

        expect(response).toMatchSnapshot();
      });
    });
  });
});
