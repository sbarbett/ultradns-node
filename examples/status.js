#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const UltraApi = require('../src/ultradns-node');

async function getStatus() {
    // Parse command line arguments
    const argv = yargs(hideBin(process.argv))
        .option('username', {
            alias: 'u',
            description: 'Username for UltraDNS API',
            type: 'string',
            demandOption: true
        })
        .option('password', {
            alias: 'p',
            description: 'Password for UltraDNS API',
            type: 'string',
            demandOption: true
        })
        .help()
        .alias('help', 'h')
        .argv;

    // Create an instance of the UltraApi class and enable debugging
    const client = await UltraApi.connect(argv.username, argv.password);
    //client.toggleDebug();

    // Perform a basic GET request
    const response = await client.get('/status');
    console.log(response);
}

getStatus().catch(error => {
    console.error('An error occurred:', error.message);
});
