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

## Prerequisites

Node is required to use this module. Here is the best way to install Node:

    install xcode if needed

        xcode-select --install

            click install button if it appears
            click agree button if it appears

    create .bash_profile if needed

        NOTE: if macos catilana or newer then use ~/.zshrc instead of ~/.bash_profile below

        touch ~/.bash_profile

    Install nvm

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

        source ~/.bash_profile

install node

    nvm install 12

## INSTALLATION

    INSTALL

        npm install -g @cogent-labs/prco-text

    UPGRADE

        npm upgrade -g @cogent-labs/prco-text

    CHECK VERSION

        npm -g ls --depth 0

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

        NOTE: prco-text server must be publicly accessible

        MAKE ENV FILE IF NECESSARY

            mkdir ~/protected
            touch ~/protected/prco-text-env

            EXAMPLE ~/protected/prco-text-env

                # PRCO TEXT CONFIG
                twilioAccountSid=xxxxxxxxxxx
                twilioAuthToken=xxxxxxxxxxx
                twilioServiceSid=xxxxxxxxxxx
                twilioPhoneNumberSid=xxxxxxxxxxx
                twilioIncomingMessageResponse="Yo! PRCO got your message."

        NAVIGATING TO TWILIO CONSOLE LOCATIONS
            TWILIO -- www.twilio.com
            CONSOLE_DASHBOARD -- console button
            CONSOLE_SERVICES -- CONSOLE_DASHBOARD > chat icon > messaging services
            CONSOLE_SERVICE -- CONSOLE_DASHBOARD > chat icon > messaging services > (service-name)
            CONSOLE_SERVICE_NUMBER -- CONSOLE_DASHBOARD > chat icon > messaging service > service-name > sender-pool > number
            CONSOLE_SERVICE_OPT_OUT -- CONSOLE_DASHBOARD > chat icon > messaging service > service-name > Opt-Out Management
            CONSOLE_SERVICE_WEBHOOK -- CONSOLE_DASHBOARD > chat icon > messaging service > service-name > Integration
            CONSOLE_VERIFIED_CALLER_IDS -- CONSOLE_DASHBOARD > elipsis icon > # phone numbers > Verified Caller IDs





        SETUP PROCESS
            purchase Twilio account with an SMS capable number
            use twilio-site to update env file: twilioAccountSid, twilioAuthToken, twilioPhoneNumberSid
                -- CONSOLE_DASHBOARD: twilioAccountSid, twilioAuthToken
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
            create ngrok account
            killall ngrok
            ngrok http 1337
            note public url -- __ngrok-url__ + `/sms`
            update twilio messaging service -- integration
                    Send a webhook
                    Request URL:  https://ee2bf9ff5ecb.ngrok.io/sms     // example url
                    HTTP Post

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

            prco-text --outbound-message "Your inspection request is ready" \
                --source-phone-number +19252582639   \
                --target-phone-number +14158761234


        GET INCOMING TEXT MESSAGES

            prco-text --get-incoming-messages


        CLEAR INCOMING TEXT MESSAGES

            prco-text --clear-incoming-messages
