const twilioSend = ({ twilioAccountSid, twilioAuthToken, from, to, message }) => {
  const client = require("twilio")(twilioAccountSid, twilioAuthToken);

  return client.messages
    .create({
      from,
      to,
      body: message,
    })
    .then((message) => {
      const response = `---
service: twilio
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


    `;

      return response;
    })
    .catch((e) => console.log(e));
};

module.exports = twilioSend;
