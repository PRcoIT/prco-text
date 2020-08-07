#!/usr/bin/env bash

forever start src/prco-text-server.js -m 3  1 > /dev/null 2>&1
echo "server started"
