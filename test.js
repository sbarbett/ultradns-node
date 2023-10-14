const { UltraApi } = require('ultradns-node');

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.error('Please provide a username and password as arguments.');
    process.exit(1);
}

async function testApi() {
    // Create an instance of the UltraApi class
    const client = await UltraApi.connect(username, password);
    client.toggleDebug();

    // Perform a basic GET request
    client.get('/status').then(response => {
        console.log(response);
    });
}

testApi().catch(error => {
    console.error('An error occurred:', error.message);
});
