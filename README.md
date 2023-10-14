# ultradns-node

A Node.js client for interacting with the UltraDNS API.

## Installation

```bash
npm install ultradns-node
```

## Usage

First, import the module:

```javascript
const UltraApi = require('ultradns-node');
```

Then, create a new instance with your username and password:

```javascript
const client = await UltraApi.connect('your-username', 'your-password');
```

You can then use the client to make requests to the UltraDNS API.

### Making GET Requests

```javascript
client.get('/path/to/resource').then(response => {
    console.log(response);
});
```

## Debug Mode

To enable debug mode and get more detailed logs:

```javascript
client.toggleDebug();
```

## Setting a Custom User Agent

```javascript
client.setUserAgent('Your Custom User Agent String');
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
