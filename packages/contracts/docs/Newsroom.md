# Newsroom - Smart-contract allowing for Newsroom-like goverance and content publishing

The content number 0 is created automatically and it's use is reserved for the Newsroom charter / about page

Roles that are currently supported are:

* "editor" -> which can publish content, update revisions and add/remove more editors

To post cryptographicaly pre-approved content on the Newsroom, the author's signature must be included and
"Signed"-suffix functions used. Here are the steps to generate authors signature:

1.  Take the address of this newsroom and the contentHash as bytes32 and tightly pack them
2.  Calculate the keccak256 of tightly packed of above
3.  Take the keccak and prepend it with the standard "Ethereum signed message" preffix (see ECRecovery and Ethereum's JSON PRC).
    a. Note - if you're using Ethereum's node instead of manual private key signing, that message shall be prepended by the Node itself
4.  Take a keccak256 of that signed messaged
5.  Verification can be done by using EC recovery algorithm using the authors signature

The verification can be seen in the internal `verifyRevisionsSignature` function.
The signing can be seen in (at)joincivil/utils package, function prepareNewsroomMessage function (and web3.eth.sign() it afterwards)
