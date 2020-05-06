const getOptions = require("./get-options").getOptions;

describe("get-options", () => {
  let response;
  let commandOptions;

  const getCommandOptions = (options) => {
    const commandOptions = {
      language: "node",
      command: "prco-check-status",
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

  beforeEach(() => {
    response = "";
  });

  describe("invalid options", () => {
    describe("when command given no options", () => {
      it("should produce error message and show usage", async () => {
        process.argv = ["node", "prco-check-status"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when config_env_file not found", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status", "-c /foo"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given invalid service option (not wis or oneguard)", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status", "-s foo"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given invalid 'from' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });

        process.argv = ["node", "prco-check-status", "-f 555"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when comand given invalid 'to' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });

        process.argv = ["node", "prco-check-status", "-t 555"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when command given invalid 'message' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status"];
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
        process.argv = ["node", "prco-check-status", "-h"];
        getOptions().catch(async (e) => {
          expect(e).toMatchSnapshot();
        });
      });
    });

    describe("when comand given all valid options", () => {
      it("should return object containing the valid options", async () => {
        process.argv = ["node", "prco-check-status", "-t", "+14159353327", "-m", "booya"];
        response = await getOptions();
        response.twilioAccountSid = "hidden";
        response.twilioAuthToken = "hidden";
        response.signalwireSpaceUrl = "hidden";
        response.signalwireProjectId = "hidden";
        response.signalwireApiToken = "hidden";

        expect(response).toMatchSnapshot();
      });
    });
  });
});
