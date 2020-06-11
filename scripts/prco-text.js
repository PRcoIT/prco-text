const getOptions = require("../config/get-options");
const prcoTextOutbound = require("../text-outbound");
const prcoTextInbound = require("../text-inbound");

const prcoText = () =>
  getOptions().then((options) =>
    options.isServerCommand ? prcoTextInbound() : prcoTextOutbound()
  );
