# @cogent-labs/prco-text

A utility that allows texting.

## Installation

    npm install -g @cogent-labs/prco-text

## Configuration

Add your configuration via environment variables to the default location: `$HOME/protected/prco-text-env`

    # TWILIO
    twilioAccountSid=xxxxx
    twilioAuthToken=xxxxx
    twilioFrom=xxxxx


    # SIGNAL WIRE
    signalwireFrom=xxxxx
    signalwireSpaceUrl=xxxxx
    signalwireProjectId=xxxxx
    signalwireApiToken=xxxxx

> You can use the `--config_env_file` option to configure another location if you like.

## Usage

    USAGE

        prco-text [options]

        OPTIONS

            -c,--config_env_file    location of file containing environment variables
                                    defaults to $HOME/protected/prco-text-env
            -h,--help               display usage help
            -s,--service            twilio or signalwire -- default: signalwire
            -f,--from               originating phone number -- default: number in .env file
            -t,--to                 destination phone number
            -m,--message            message to be sent

    EXAMPLE

        $ prco-text --to 415-222-3333 --message 'hello,
        Your car is ready :)

        PRCO
        415-555-1212'

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
