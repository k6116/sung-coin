const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Q: What is a key pair?
// A: In cryptography, a key pair consists of a private and public key.
//    The private key is used to decrypt data sent to the public key
// For example: If I want people to send me encrypted data, I give them my public key
//  The public key is available to everyone, but no one can access that data unless they have the private key
//  Think of a mailbox with a slot. Anyone can drop mail into the mailbox slot, but they cannot access any letters
//    in it unless they have the key to open the mailbox
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log('private key', privateKey);
console.log('public key', publicKey);



