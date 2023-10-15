#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const UltraApi = require('../src/ultradns-node/udns');

async function createZone(client, domain) {
    const accountData = await client.get("/accounts");
    const accountName = accountData.accounts[0].accountName;

    const zoneData = {
        properties: {
            name: domain,
            accountName: accountName,
            type: "PRIMARY"
        },
        primaryCreateInfo: {
            forceImport: true,
            createType: "NEW"
        },
        changeComment: `Created zone for ${domain} via API`
    };

    return client.post("/v3/zones", zoneData);
}

async function createRRSet(client, domain, recordType, ownerName, ttl, rdata) {
    const endpoint = `/v3/zones/${domain}/rrsets/${recordType}/${ownerName}`;

    const rrsetData = {
        ttl: ttl,
        rdata: rdata
    };

    return client.post(endpoint, rrsetData);
}

async function createARecord(client, domain) {
    return createRRSet(client, domain, "A", domain, 300, ["192.0.2.1"]);
}

async function createCnameRecord(client, domain) {
    return createRRSet(client, domain, "CNAME", `www.${domain}`, 300, [domain]);
}

async function main() {
    const argv = yargs(hideBin(process.argv))
        .option('username', {
            alias: 'u',
            description: 'Username for UltraDNS API',
            type: 'string'
        })
        .option('password', {
            alias: 'p',
            description: 'Password for UltraDNS API',
            type: 'string'
        })
        .option('domain', {
            alias: 'd',
            description: 'Domain name',
            type: 'string'
        })
        .demandOption(['username', 'password', 'domain'], 'Please provide required arguments to work with this tool')
        .help()
        .alias('help', 'h')
        .argv;

    const client = await UltraApi.connect(argv.username, argv.password);
    //client.toggleDebug();

    console.log(`Creating zone ${argv.domain}:`, await createZone(client, argv.domain));
    console.log(`Creating an A record pointing to 192.0.2.1:`, await createARecord(client, argv.domain));
    console.log(`Creating a 'www' CNAME pointing to ${argv.domain}:`, await createCnameRecord(client, argv.domain));
}

main().catch(error => {
    console.error("Error occurred:", error.message);
});
