const prcoText = require("./prco-text");

describe("prco-text", () => {
  it("should be able to show help", () => {
    process.argv = ["node", "prco-check-status"];

    const response = prcoText();

    expect(response).toMatchSnapshot();
  });
  it("should be able to text twilio", () => {});
  it("should be able to text twilio", () => {});
  it("should be able to text twilio", () => {});
  it("should be able to text twilio", () => {});
});
