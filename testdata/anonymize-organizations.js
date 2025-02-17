// testdata/anonymize-organizations.js
const fs = require('fs');
const path = require('path');
const { fakerNO: faker } = require('@faker-js/faker');

function anonymizeContact(contact) {
    // Only anonymize if there was original data
    if (contact.firstName || contact.lastName) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        
        return {
            ...contact,
            firstName,
            lastName,
            email: contact.email ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@rodekors.org` : null,
            phone: contact.phone ? `+47 ${faker.string.numeric(8)}` : null
        };
    }
    return contact;
}

function anonymizeData(data) {
    return {
        ...data,
        data: {
            ...data.data,
            branches: data.data.branches.map(branch => ({
                ...branch,
                contacts: branch.contacts.map(anonymizeContact)
            }))
        }
    };
}

// Get the path to the repository root (two levels up from this script)
const repoRoot = path.join(__dirname, '..');
const inputPath = path.join(repoRoot, 'secrets', 'organizations.json');
const outputPath = path.join(__dirname, 'organizations.json');

try {
    // Read input file
    const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // Anonymize the data
    const anonymizedData = anonymizeData(inputData);
    
    // Write to output file
    fs.writeFileSync(
        outputPath,
        JSON.stringify(anonymizedData, null, 2),
        'utf8'
    );
    
    console.log('Successfully created anonymized data in testdata/organizations.json');
} catch (error) {
    console.error('Error during anonymization:', error);
    process.exit(1);
}