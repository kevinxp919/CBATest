const fs = require('fs');
const utils = require('../library/utils');
const baseURL = process.env.BASE_URL || 'https://petstore.swagger.io/v2';
const petStatus = ['available', 'pending', 'sold']
const petsFile = 'pets.json';
const apiKey = 'special-key';
const path = require('path');
const imagePath = path.join(__dirname, '../library/Cute_dog.jpg');

describe('Create Pet API Tests', function() {
    this.timeout(5000); // Increase timeout if needed

    let pets = [];

    before(async function() {
        console.log('Running before hook');
          // Dynamically import chai.expect
          const chai = await import('chai');
          expect = chai.expect;
          global.expect = expect;
        // Load existing pets from pets.json if it exists, otherwise create a new one
        if (fs.existsSync(petsFile)) {
            pets = JSON.parse(fs.readFileSync(petsFile, 'utf8'));
        } else {
            fs.writeFileSync(petsFile, JSON.stringify([]));
            pets = [];
        }
    });

    after(function() {
        console.log('Test Suit completed');
        // Save pets to pets.json after tests
        fs.writeFileSync(petsFile, JSON.stringify(pets, null, 2));
    });

    it('should create a new pet with Post Method and validate the pet details', async function() {
        console.log('Running test: should create a new pet (POST)');
        await utils.createAndValidateNewPet(baseURL, apiKey, pets);
        fs.writeFileSync(petsFile, JSON.stringify(pets, null, 2));
        console.log('Test completed: should create a new pet (POST)');
    });

    it('should retrieve the pet by ID with GET Method and validate the pet details', async function() {
        console.log('Running test: should retrieve the pet by ID (GET)');
        const petName = pets.find(pet => pet.name.includes('Doggie')).name;
        console.log("what is the petName "+ petName);
        const petId = pets.find(pet => pet.name === petName).id;
        await utils.retrieveValidatrePetById(baseURL, apiKey, petId,petName);
        console.log('Test completed: should retrieve the pet by ID (GET)');
    });

    for(let i=0;i<=petStatus.length;i++){
    it(`should retrieve pet ${petStatus[i]} with GET Method and validate the status details`, async function() {
        console.log('Running test: should retrieve pet status (GET) and validate the status details');
        await utils.findAndValidateStatus(baseURL, apiKey, petStatus[i]);
        console.log('Test completed: should retrieve the pet by ID (GET) and validate the status details');
    });
    } 
    
    it('should update an existing pet with PUT Method and validate the pet details', async function() {
        console.log('Running test: should update an existing pet (PUT)');

        // Pick a random pet from the pets array
        let randomPetIndex = Math.floor(Math.random() * pets.length);
        let pet = pets[randomPetIndex];
        console.log("what is the pet id " + pet.id);

        // generate random values
        const updatedPetData = utils.generateUpdatedPetData(pet, petStatus);
        // Update all fields and validate the fields values
        await utils.updatePetAndValidate(baseURL, apiKey, updatedPetData,pets);

        console.log('Test completed: should update an existing pet (PUT)');
    });

    it('should update an existing pet with form data and using POST Method and validate the pet details', async function() {
        console.log('Running test: should update an existing pet with form data (POST)');
        // Pick a random pet from the pets array
        let randomPetIndex = Math.floor(Math.random() * pets.length);
        let pet = pets[randomPetIndex];
        console.log("what is the pet id " + pet.id);
        // Generate random name and status
        const newName = `Updated${utils.generateRandomName()}`;
        const filteredStatus = petStatus.filter(status => status !== 'available');
        const newStatus = filteredStatus[Math.floor(Math.random() * filteredStatus.length)];
        console.log("what is the new status "+ newStatus);
        await utils.updatePetWithFormData(baseURL, apiKey, pet.id, newName, newStatus,pets);

        console.log('Test completed: should update an existing pet with form data (POST)');
    });

    it('should upload an image for an existing pet (POST)', async function() {
        console.log('Running test: should upload an image for an existing pet (POST)');
        const randomPetIndex = Math.floor(Math.random() * pets.length);
        const pet = pets[randomPetIndex];
        console.log("what is the pet id " + pet.id);
        await utils.uploadPetImage(baseURL, apiKey, pet.id, imagePath);
        console.log('Test completed: should upload an image for an existing pet (POST)');
    });


    it('should delete an existing pet with DELETE Method and validate the deletion', async function() {
        console.log('Running test: should delete an existing pet (DELETE)');
        // Pick a random pet from the pets array
        const randomPetIndex = Math.floor(Math.random() * pets.length);
        const pet = pets[randomPetIndex];
        console.log("what is the pet id " + pet.id);
        await utils.deletePetAndValidate(baseURL, apiKey, pet.id, pets);
        console.log('Test completed: should delete an existing pet (DELETE)');
    });
});
