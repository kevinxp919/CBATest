const { postRequest,getRequest,putRequest,postFormRequest,deleteRequest,postImage } = require('./httpRequests');
const fs = require('fs');
const petsFile = '../pets.json';

// Function to generate a random ID
function generateRandomId() {
    return Math.floor(Math.random() * 1000000);
}

// Function to generate a random name
function generateRandomName() {
    const randomStr = Math.random().toString(36).substring(7);
    return `Doggie${randomStr}`;
}

/**
 * Asynchronously creates a new pet, validates the new pet, and saves it to the list of pets.
 *
 * @param {string} baseURL - The base URL for the API.
 * @param {string} apiKey - The API key for authentication.
 * @param {Array} pets - The list of existing pets.
 * @return {Promise} A Promise that resolves with the response data of the created pet.
 */
async function createAndValidateNewPet(baseURL, apiKey, pets) {

    let newPetId = generateRandomId();
    while (pets.find(pet => pet.id === newPetId)) {
        newPetId = generateRandomId();
    }

    const newPetName = generateRandomName();

    const newPet = {
        id: newPetId,
        category: {
            id: 100,
            name: 'test100'
        },
        name: newPetName,
        photoUrls: ['hhttps://commons.wikimedia.org/wiki/File:Cute_dog.jpg'],
        tags: [
            {
                id: 101,
                name: 'test101'
            }
        ],
        status: 'available'
    };

    const uri = `${baseURL}/pet`;
    const response  = await postRequest(uri, newPet, apiKey);
    // Validate the response status and data
    expect(response.status).to.equal(200)
    expect(response.data).to.deep.include({
        id: newPetId,
        name: newPetName,
        status: 'available'
    });
    pets.push(response.data); // Save the created pet to the list
    //return response.data;
    
};

/**
 * Asynchronously retrieves a pet by ID and validates its details.
 *
 * @param {string} baseURL - The base URL for the API.
 * @param {string} apiKey - The API key for authentication.
 * @param {number} petId - The ID of the pet to retrieve.
 * @param {string} petName - The expected name of the pet.
 * @return {Promise} A Promise that resolves with the response data of the retrieved pet.
 */
async function retrieveValidatrePetById(baseURL, apiKey, petId,petName) {
    const uri = `${baseURL}/pet/${petId}`;
    const response = await getRequest(uri, apiKey);
    // Validate the response status and data
    expect(response.status).to.equal(200); 
    expect(response.data).to.deep.include({
        id: petId,
        name: petName
    })
    //return response.data;
}

/**
 * Asynchronously finds pets by status and validates their status.
 *
 * @param {string} baseURL - The base URL for the API.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} status - The status of the pets to find.
 * @return {Promise<void>} A Promise that resolves when the validation is complete.
 */
async function findAndValidateStatus(baseURL,apiKey, status){
    const uri = `${baseURL}/pet/findByStatus?status=${status}`;
    const response = await getRequest(uri, apiKey);
    // Validate the response status
    expect(response.status).to.equal(200);
    // Validate each pet's status in the response
    response.data.forEach(pet => {
    expect(pet.status).to.equal(status);
});
}

/**
 * Generates updated pet data with randomized values.
 *
 * @param {Object} pet - The pet object to update.
 * @param {Array} petStatus - The array of available pet statuses.
 * @return {Object} The updated pet object.
 */
function generateUpdatedPetData(pet, petStatus) {
    return {
        id: pet.id,
        category: {
            id: generateRandomId(),
            name: `Category${generateRandomName()}`
        },
        name: `Updated${generateRandomName()}`,
        photoUrls: ['https://example.com/updated_doggie.jpg'],
        tags: [
            {
                id: generateRandomId(),
                name: `Tag${generateRandomName()}`
            }
        ],
        status: petStatus[Math.floor(Math.random() * petStatus.length)]
    };
}

/**
 * Asynchronously updates a pet and validates the updated pet's status.
 *
 * @param {string} baseURL - The base URL for the API.
 * @param {string} apiKey - The API key for authentication.
 * @param {Object} updatedPetData - The updated data for the pet.
 * @param {string} expectedStatus - The expected status for the updated pet.
 * @return {Promise<void>} A Promise that resolves when the pet is updated and validated.
 */
// Function to update an existing pet
async function updatePetAndValidate(baseURL, apiKey, pet,pets) {
    const uri = `${baseURL}/pet`;
    const response = await putRequest(uri, pet, apiKey);

    // Validate the response
    // Validate the response
    expect(response.status).to.equal(200);
    expect(response.data).to.deep.include({
        id: pet.id,
        name: pet.name,
        status: pet.status
    });
    expect(response.data.category).to.deep.include({
        id: pet.category.id,
        name: pet.category.name
    });
    expect(response.data.photoUrls).to.deep.equal(pet.photoUrls);
    expect(response.data.tags[0]).to.deep.include({
        id: pet.tags[0].id,
        name: pet.tags[0].name
    });

    // Update the pet in the pets array
    const petIndex = pets.findIndex(p => p.id === pet.id);
    if (petIndex !== -1) {
        pets[petIndex] = response.data;
    }

    // Save pets to pets.json
    fs.writeFileSync(petsFile, JSON.stringify(pets, null, 2));

    // return response.data;
}

/**
 * Asynchronously updates a pet with form data.
 *
 * @param {string} baseURL - The base URL for the API.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} petId - The ID of the pet to update.
 * @param {string} name - The new name for the pet.
 * @param {string} status - The new status for the pet.
 * @param {Array} pets - The array of available pets.
 * @return {Promise<void>} A Promise that resolves when the pet is updated.
 */

async function updatePetWithFormData(baseURL, apiKey, petId, name, status,pets) {
    const uri = `${baseURL}/pet/${petId}`;
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('status', status);
    const response = await postFormRequest(uri, formData, apiKey);
    // Validate the response
    expect(response.status).to.equal(200);
    expect(response.data).to.deep.include({
        code: 200,
        type: 'unknown',
        message: `${petId}`
    });
    const petIndex = pets.findIndex(p => p.id === petId);
    if (petIndex !== -1) {
        pets[petIndex].name = name;
        pets[petIndex].status = status;
    }

    // Save pets to pets.json
    fs.writeFileSync(petsFile, JSON.stringify(pets, null, 2));
    //return response.data;
}

/**
 * Deletes a pet and validates the deletion.
 *
 * @param {string} baseURL - The base URL.
 * @param {string} apiKey - The API key.
 * @param {number} petId - The ID of the pet to delete.
 * @param {Array} pets - The list of pets.
 */
async function deletePetAndValidate(baseURL, apiKey, petId, pets) {
    const uri = `${baseURL}/pet/${petId}`;
    const response = await deleteRequest(uri, apiKey);

    // Validate the response
    expect(response.status).to.equal(200);

    // Remove the pet from the pets array
    const petIndex = pets.findIndex(p => p.id === petId);
    if (petIndex !== -1) {
        pets.splice(petIndex, 1);
    }

    // Save pets to pets.json
    fs.writeFileSync(petsFile, JSON.stringify(pets, null, 2));

    //return response;
}

/**
 * Uploads an image for a pet.
 *
 * @param {string} baseURL - The base URL.
 * @param {string} apiKey - The API key.
 * @param {number} petId - The ID of the pet.
 * @param {string} imagePath - The path to the image.
 */
async function uploadPetImage(baseURL, apiKey, petId, imagePath) {
    const additionalMetadata = 'Dog Pic';
    const uri = `${baseURL}/pet/${petId}/uploadImage`;
    const response = await postImage(uri, imagePath, apiKey,additionalMetadata);
    expect(response.status).to.equal(200);
    expect(response.data.code).to.equal(200);
    expect(response.data.type).to.equal('unknown');
    expect(response.data.message).to.include('additionalMetadata: Dog Pic');

}
module.exports = { 
    generateRandomId,
    generateRandomName,
    createAndValidateNewPet,
    retrieveValidatrePetById,
    findAndValidateStatus,
    updatePetAndValidate,
    generateUpdatedPetData,
    updatePetWithFormData,
    deletePetAndValidate,
    uploadPetImage
};
