const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Function to make a POST request
async function postRequest(uri, data, apiKey) {
    const response = await axios.post(uri, data, {
        headers: {
            'Content-Type': 'application/json',
            'api_key': apiKey
        }
    });

    return {status: response.status, data: response.data};
}

// Function to make a GET request
async function getRequest(uri, apiKey) {
    const response = await axios.get(uri, {
        headers: {
            'api_key': apiKey
        }
    });
    return {status: response.status, data: response.data};
}

// Function to make a PUT request
async function putRequest(uri, data, apiKey) {
    const response = await axios.put(uri, data, {
        headers: {
            'Content-Type': 'application/json',
            'api_key': apiKey
        }
    });
    return {status: response.status, data: response.data};
}

// Function to make a POST request with form data (used for updating pet)
async function postFormRequest(uri, formData, apiKey) {
    const response = await axios.post(uri, formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'api_key': apiKey
        }
    });
    return {status: response.status, data: response.data};
}

// Function to make a DELETE request
async function deleteRequest(uri, apiKey) {
    const response = await axios.delete(uri, {
        headers: {
            'api_key': apiKey
        }
    });
    return response;
}

// Function to make a upload image request

async function postImage(uri, imagePath, apiKey,additionalMetadata) {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));
    form.append('additionalMetadata', additionalMetadata);
    const response = await axios.post(uri, form, {
        headers: {
            ...form.getHeaders(),
            'api_key': apiKey
        }
    });

    return response;
}

module.exports = { 
    postRequest, 
    getRequest, 
    putRequest,
    postFormRequest,
    deleteRequest,
    postImage 
};