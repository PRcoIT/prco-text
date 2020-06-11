const usage = () => {
  const message = `
USAGE

    prco-text [options]

    OPTIONS

        -c,--config_env_file  location of file containing environment variables
                              default: $HOME/protected/prco-text-env

        --server-command      choices: start, stop

        -s,--service          service to use. choices: twilio or signalwire -- default: signalwire

        -f,--from             source phone number. default: 'from' in the .env file

        -t,--to               target phone number.

        -m,--message          message to be sent

        -h,--help             display usage help


EXAMPLES

    SENDING A TEXT MESSAGE

        $ prco-text --to 415-222-3333 --message "hello,
        Your car is ready :)

        PRCO
        415-555-1212"


    START INBOUND SERVER

        prco-text --server start


    STOP INBOUND SERVER

        prco-text --server stop



  `;

  return message;
};

module.exports = {
  usage,
};
