# examples

This directory contains example scripts showcasing the basic functionalities of the client.

## Table of Contents

1. [Usage](#usage)
2. [create-zone.js](#create-zonejs)
3. [status.js](#statusjs)

## Usage

To run the example scripts:

1. Make sure you've installed the required packages using `npm install`.
2. Navigate to the `examples` directory.
3. Run the script, passing the required arguments.

For additional help or to view the available options for each script, you can use the `-h` or `--help` flag.

Example:
```
./create-zone.js --help
```

## create-zone.js

This script demonstrates how to create a zone (domain) and set up A and CNAME records in UltraDNS. It takes in the domain name, username, and password as command-line arguments.

Example:
\```
./createZone.js -u [YOUR_USERNAME] -p [YOUR_PASSWORD] -d [YOUR_DOMAIN]
\```

## status.js

This script showcases a basic GET request to fetch the status. It requires the username and password for authentication.

Example:
\```
./status.js -u [YOUR_USERNAME] -p [YOUR_PASSWORD]
\```