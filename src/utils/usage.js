const usage = () => {
  const message = `
    USAGE

        prco-text

            OPTIONS

            --start-server                  start prco-text server
            --stop-server                   stop prco-text server
            --config-service-name           create twilio messaging service
            --config-service-phone-number   add phone number to twilio messaging service
            --outbound-message              message to send
            --target-phone-number           target phone number to send to
            --get-incoming-messages         get incoming messages log
            --clear-incoming-messages       clear incoming messages log


    ONE TIME SETUP

        NOTE: env file is located at "$HOME/protected/prco-text-env
        NOTE: prco-text server must be publicly accessible

        purchase Twilio account with an SMS capable number
        use twilio console to update env file: twilioAccountSid, twilioAuthToken, twilioPhoneNumberSid
        use twilio console to configure opt-in, opt-out, and help custom messages
        use twilio console to configure webhook url i.e. https://prco-text/sms
        use prco-text to start server
        use prco-text to configure service name and collect twilioServiceSid
        add twilioServiceSid to env file
        use prco-text stop then start server
        use prco-text to configure service phone number


    EXAMPLES

        START SERVER

            prco-text --start-server


        STOP SERVER

            prco-text --stop-server


        CONFIGURE SERVICE NAME

            prco-text --config-service-name "PRCO MESSAGING SERVICE"


        CONFIGURE SERVICE PHONE NUMBER

            prco-text --config-service-phone-number


        SEND TEXT MESSAGE

            prco-text --outbound-message "Your inspection request is ready" --target-phone-number +14158761234


        GET MESSAGES STATUS

            prco-text --get-message-status SMd8ef537dd216485e8108f83143c1ed05


        GET INCOMING TEXT MESSAGES

            prco-text --get-incoming-messages


        CLEAR INCOMING TEXT MESSAGES

            prco-text --clear-incoming-messages

  `;

  return message;
};

module.exports = {
  usage,
};
