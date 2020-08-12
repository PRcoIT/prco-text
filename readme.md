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
        NOTE: prco-text server must be publicly accessible

        NAVIGATING TO TWILIO CONSOLE LOCATIONS
            CONSOLE_HOME -- console > home icon
            CONSOLE_SERVICES -- console > chat icon > messaging services
            CONSOLE_SERVICE -- console > chat icon > messaging services > service-name
            CONSOLE_SERVICE_NUMBER -- console > chat icon > messaging service > service-name > sender-pool > number
            CONSOLE_SERVICE_OPT_OUT -- console > chat icon > messaging service > service-name > Opt-Out Management
            CONSOLE_SERVICE_WEBHOOK -- console > chat icon > messaging service > service-name > Integration
            CONSOLE_VERIFIED_CALLER_IDS -- console > elipsis icon > # phone numbers > Verified Caller IDs


        SETUP PROCESS
            purchase Twilio account with an SMS capable number
            use twilio-site to update env file: twilioAccountSid, twilioAuthToken, twilioPhoneNumberSid
                -- CONSOLE_HOME: twilioAccountSid, twilioAuthToken
                -- CONSOLE_SERVICE_NUMBER: twilioPhoneNumberSid
            use twilio-site to configure opt-in, opt-out, and help custom messages
                -- CONSOLE_SERVICE_OPT_OUT: click the edit link
            use twilio-site to configure webhook url
                -- CONSOLE_SERVICE_WEBHOOK
                    -- under incoming messages, send-a-webhook
                    -- enter publicly accessible url with sms endpoint-- example: https://898e6154fc66.ngrok.io/sms
            use prco-text to start server
            use prco-text to configure service name and collect twilioServiceSid
            add twilioServiceSid to env file
            use prco-text stop then start server
            use prco-text to configure service phone number


        HOW TO USE NGROK TO PROVIDE PUBLIC URL
            NOTE: this is for demo purposes
            killall ngrok
            ngrok http 1337
            update webhook url with the ngrok public url (example: http://37435e1d227e.ngrok.io)


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


        GET INCOMING TEXT MESSAGES

            prco-text --get-incoming-messages


        CLEAR INCOMING TEXT MESSAGES

            prco-text --clear-incoming-messages
