# PetStore API Tests

This repository contains automated tests for the PetStore API using Mocha and Chai.

## Prerequisites

- Node.js (version 12 or later)
- npm (version 6 or later)

## Installation

1. Clone the repository:

git clone git@github.com:kevinxp919/CBATest.git
cd <your-repository-directory>

2. Install the dependencies:
npm install

3. To run all the tests:
./runner.sh

4. To run a specific test case, you can use the --grep option:
 
./runner.sh --grep 'test case description'
For example: ./runner.sh --grep 'should create a new pet with Post Method and validate the pet details'

5. Report
The report will be generated in the 'customer_reports'. In order to open the report, please double click 'custom_report.html' and it will bring up at your default browser

6. Project Structure

- test/petstore.test.js: Contains the test cases for the PetStore API.
- library/utils.js: Contains utility functions for the test cases.
- library/httpRequests.js: Contains HTTP request functions (GET, POST, PUT, DELETE).
- pets.json: It is used for storing the test data creation, update, deletion. During the test suite running time, it will save the test data into the JSON and then it will delete the test data after running the Delete API Test case.

7. Test Scenarios

- Create a new pet:

Test case: should create a new pet with Post Method and validate the pet details
Description: Creates a new pet and validates its details.

- Retrieve a pet by ID:

Test case: should retrieve the pet by Random ID with GET Method and validate the pet details
Description: Retrieves a pet by ID and validates its details.

- Retrieve pets by status:

Test cases:
should retrieve pet available with GET Method and validate the status details
should retrieve pet pending with GET Method and validate the status details
should retrieve pet sold with GET Method and validate the status details
Description: Retrieves pets by status and validates the status details.

- Update an existing pet:

Test case: should update an existing pet with PUT Method and validate the pet details
Description: Updates an existing pet and validates its details.

- Update an existing pet with form data:

Test case: should update an existing pet with form data and using POST Method and validate the pet details
Description: Updates an existing pet with form data and validates its details.

- Delete a pet:

Test case: should delete a pet with DELETE Method and validate the response
Description: Deletes a pet and validates the response.

- Upload an image for a pet:

Test case: should upload an image for a pet with POST Method and validate the response
Description: Uploads an image for a pet and validates the response.

8. Environment Variables

BASE_URL: The base URL for the PetStore API.
API_KEY: The API key for authentication.
You can set these variables in your environment or in the runner.sh script.

