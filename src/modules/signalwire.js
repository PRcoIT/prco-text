const signalwireSend = ({
  signalwireProjectId,
  signalwireApiToken,
  signalwireSpaceUrl,
  from,
  to,
  message,
}) => {
  const { RestClient } = require("@signalwire/node");

  const client = new RestClient(signalwireProjectId, signalwireApiToken, {
    signalwireSpaceUrl,
  });

  return client.messages
    .create({
      from,
      to,
      body: message,
    })
    .then((message) =>
      console.log(
        `---
service: signalwire
sid: ${message.sid}
api_version: ${message.apiVersion}
date_created: ${message.dateCreated}
date_sent: ${message.dateSent}
direction: ${message.direction}
status: ${message.status}
price: ${message.price}
price_unit: ${message.priceUnit}
from: ${message.from}
to: ${message.to}
body: ${message.body}

      `
      )
    )
    .catch((e) => console.log(e));
};

module.exports = signalwireSend;
