const assert = require('assert');  // assertion librarty from mocha
const ganache = require ('ganache-cli'); // test network
const Web3 = require ('web3'); // uses ABI to communicate with the ethereum netowrk over JSON RPC protocol
const {bytecode, interface} = require ('../compile');

// web3 is an instance of Web3 and we are connecting to ganache hense we use ganache connection provider
const provider = ganache.provider();
const web3  = new Web3(provider);

// mocha to test, ganache for network contract deploy, web3 to call contract and interact with the network

let accounts;
let inbox;

beforeEach(async () => {
    // get a list of all ganache accounts
    accounts = await web3.eth.getAccounts();
    // use one of the accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))  // create new contract from the abi interface and deploy the bytecode with argument string, and send that transaction from
    // the first account, limited by million wei.
      .deploy({
        data: bytecode,
        arguments: ['Hi there!']
      })
      .send({
        from: accounts[0],
        gas: '1000000'
      });
      inbox.setProvider(provider);
});

describe('Inbox', () => {

  // tc 1
  it ('Is contract actually deployed?', () => {
    //assert.notEqual(inbox.options.address,null);
    assert.ok(inbox.options.address);
  });

  // tc 2
  it ('does contract have a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.ok(message);
    assert.equal(message,'Hi there!');
  });

  // tc 3
  it ('Can we update the message', async () => {
    const newMsg = 'This is a new message';
    // calling method to modify contract requires send for sending a transaction which in turen requires from field to make sure
    // we have enough money for this transaction
    await inbox.methods.SetMessage(newMsg).send( { from: accounts[0]});
    // plain free message call
    const message = await inbox.methods.message().call();
    assert.equal(message,newMsg);
  });

});
