const chai = require('chai');
const expect = chai.expect;
const UltraApi = require('../src/ultradns-node');


describe('UltraApi', function() {

    describe('Constructor', function() {
        it('should initialize with default values', function() {
            const client = new UltraApi('testuser', 'testpass');
            expect(client.baseUrl).to.equal('https://api.ultradns.com');
            expect(client.accessToken).to.equal('');
            expect(client.refreshToken).to.equal('');
            expect(client.debug).to.be.false;
            expect(client.pprint).to.be.false;
        });
        
        it('should throw an error if no password is provided', function() {
            expect(() => new UltraApi('testuser')).to.throw('Password is required when providing a username.');
        });

        // Additional tests can be added here
    });

    describe('Utility Methods', function() {
        it('should toggle debug mode', function() {
            const client = new UltraApi('testuser', 'testpass');
            client.toggleDebug();
            expect(client.debug).to.be.true;
            client.toggleDebug();
            expect(client.debug).to.be.false;
        });

        it('should toggle pretty print mode', function() {
            const client = new UltraApi('testuser', 'testpass');
            client.togglePPrint();
            expect(client.pprint).to.be.true;
            client.togglePPrint();
            expect(client.pprint).to.be.false;
        });

        // Additional tests for other utility methods can be added here
    });

    // Use 'sinon' or 'nock' to add mock API calls here later
 
});

