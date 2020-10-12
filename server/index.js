const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

var EC = require('elliptic').ec;

var ec = new EC('secp256k1');

const key1 = ec.genKeyPair()
const key2 = ec.genKeyPair()
const key3 = ec.genKeyPair()

var publickey1 = key1.getPublic().encode('hex')
publickey1 = publickey1.substring(0, 40);
var publickey2 = key2.getPublic().encode('hex')
publickey2 = publickey2.substring(0, 40);
var publickey3 = key3.getPublic().encode('hex')
publickey3 = publickey3.substring(0, 40);

const balances = {
  [publickey1]: 100,
  [publickey2]: 50,
  [publickey3]: 75,
}

app.get('/addresses', (req, res) => {
  const addresses = Object.keys(balances)
  res.send({ addresses });
});


app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
