# PRCO TEXT

prco-text SMS inbound/outbound messaging.

## FEATURES AND COMPONENTS

prco-text features:

- inbound and outbound messaging
- subscribe/unsubscribe with custom opt-in, opt-out, help wording.
- incoming message custom reply
- incoming message log

prco-text components:

- prco-text command line interface for easy control
- prco-text server for communicating with twilio

## USAGE

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

            prco-text --start-stop


        CONFIGURE SERVICE NAME

            prco-text --config-service-name "PRCO MESSAGING SERVICE"


        CONFIGURE SERVICE PHONE NUMBER

            prco-text --config-service-phone-number


        SEND TEXT MESSAGE

            prco-text --outbound-message "Your inspection request is ready" --target-phone-number +14158761234


        GET INCOMING TEXT MESSAGES

            prco-text --get-incoming-messages


        CLEAR INCOMING TEXT MESSAGES

            prco-text --clear-incoming-messages

> Note: prco-text server must be publicly accessible

## FEATURE REQUEST

- SHOULD WE KEEP AN INCOMING MESSAGE LOG
- DOES IT HAVE SPAM CONTROL
