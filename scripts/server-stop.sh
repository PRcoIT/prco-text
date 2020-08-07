#!/usr/bin/env bash

forever stop src/prco-text-server.js > /dev/null 2>&1
echo "server stopped"
