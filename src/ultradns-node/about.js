const VERSION = "1.0.2";
const PREFIX = "ultradns-node";
const REPO = "https://github.com/sbarbett/ultradns-node";

function getClientUserAgent() {
    return `${PREFIX}/v${VERSION} (+${REPO})`;
}

module.exports = {
    getClientUserAgent
};
