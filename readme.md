# @cogent-labs/prco-text

This is a utility that facilitates both outbound and inbound text messages.

## Installation

To install:

    npm install -g @cogent-labs/prco-text

To check the version:

    npm -g ls @cogent-labs/prco-text --depth 0

To upgrade:

    npm upgrade -g @cogent-labs/prco-text

## Configuration

Your configuration information is stored in this file:

> Note \$HOME references your home directory

    $HOME/protected/prco-text-env

Add your configuration via environment variables to the default location:

> Note the use of double-quotes around all values

    # TWILIO CREDENTIALS
    twilioAccountSid="<twilio-sid>"
    twilioAuthToken="<twilio-auth-token>"

    # COMPANY PHONE
    twilioFrom="<company-phone>"

    # TEXT REPLIES TO INCOMING MESSAGES
    optOut="You have successfully been unsubscribed. You will not receive any more messages from this number. Reply START to resubscribe."

    optIn="You have successfully been re-subscribed to messages from this number. Reply STOP to unsubscribe. Msg&Data Rates May Apply.
    Your message has been received. Thank you!"

    optNone="Your message has been received. Thank you!"

| config variable  | description                       |
| ---------------- | --------------------------------- |
| twilioAccountSid | Twilio SID                        |
| twilioAuthToken  | Twilio Auth Token                 |
| twilioFrom       | Company Phone                     |
| optOut           | Text response to opt-out request  |
| optIn            | Text response to opt-in request   |
| optNone          | Text response to incoming message |

## Usage

    USAGE

        prco-text [options]

        OPTIONS

            -c,--config_env_file  location of file containing environment variables
                                default: $HOME/protected/prco-text-env

            --server-command      choices: start, stop

            -s,--service          service to use. choices: twilio or signalwire -- default: twilio

            -f,--from             source phone number. default: 'from' in the .env file

            -t,--to               target phone number.

            -m,--message          message to be sent

            -h,--help             display usage help

## Examples

    SENDING OUTBOUND TEXT MESSAGES

        $ prco-text --to 415-222-3333 --message 'hello,
        Your car is ready :)

        PRCO
        415-555-1212'


    RECEIVING INBOUND TEXT MESSAGES

        CONFIGURE TWILIO -- only do this once

            collect credentials (account-sid, auth-token)

                -- login to twilio website with prco credentials
                -- https://www.twilio.com/console

            login with twilio command line tool

                twilio login
                    -- enter account SID
                    -- enter auth token

            configure twilio to use your local server

                twilio phone-numbers:update "+19252593760" --sms-url="http://localhost:1337/sms"


        START THE INCOMING SERVER

            prco-text --server-command start

        To be continued...

## Author

Frank Gutierrez

npm.frankg@gmail.com

## License

Copyright (c) 2020 Frank Gutierrez III

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
