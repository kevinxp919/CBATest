#!/bin/bash

# Set environment variables
export BASE_URL="https://petstore.swagger.io/v2"

# Debugging output
echo "Running tests with baseURL: $BASE_URL"

# Run tests
npx mocha --recursive test/petstore.test.js --reporter mochawesome --reporter-options reportDir=custom_reports,reportFilename=custom_report "$@"