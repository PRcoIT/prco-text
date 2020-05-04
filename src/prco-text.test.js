const prcoText = require("./prco-text").prcoText;

describe("prco-text", () => {
  let response;

  beforeEach(() => {
    response = "";
  });

  describe("invalid options", () => {
    describe("when no options given", () => {
      it("should provide default options and show error and usage", async () => {
        process.argv = ["node", "prco-check-status"];
        response = await prcoText();

        expect(response).toMatchSnapshot();
      });
    });

    describe("when missing config_env_file ", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status", "-c /foo"];
        response = await prcoText();

        expect(response).toMatchSnapshot();
      });
    });

    describe("when help option given", () => {
      it("should only display usage", async () => {
        process.argv = ["node", "prco-check-status", "-h"];
        response = await prcoText();

        expect(response).toMatchSnapshot();
      });
    });

    describe("when invalid service option (not wis or oneguard)", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status", "-s foo"];
        response = await prcoText();

        expect(response).toMatchSnapshot();
      });
    });

    describe("when invalid 'from' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status"];
        response = await prcoText();
        expect(response).toMatchSnapshot();

        process.argv = ["node", "prco-check-status", "-f 555"];
        response = await prcoText();
        expect(response).toMatchSnapshot();
      });
    });

    describe("when invalid 'to' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status"];
        response = await prcoText();
        expect(response).toMatchSnapshot();

        process.argv = ["node", "prco-check-status", "-t 555"];
        response = await prcoText();
        expect(response).toMatchSnapshot();
      });
    });

    describe("when invalid 'message' option", () => {
      it("should show error and usage", async () => {
        process.argv = ["node", "prco-check-status"];
        response = await prcoText();
        expect(response).toMatchSnapshot();
      });
    });
  });

  describe("valid options", () => {
    describe("when all options valid", () => {
      it("should show response from server", async () => {
        process.argv = ["node", "prco-check-status", "-t", "+14159353327", "-m", "booya"];
        response = await prcoText();
        response = response.replace(/^sid:.*$/gm, "sid:");
        response = response.replace(/^date_created:.*$/gm, "date_created:");
        expect(response).toMatchSnapshot();
      });
    });
  });
});
