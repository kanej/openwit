Common Security Attacks
=======================

There are several standard practices I have employed while writing the contracts to reduce the risk of security vulnerablilites: they are unit tested, linted with `solium` and extend battle-tested OpenZepplin base contracts.

I have endeavoured to keep the contracts simple and focussed on their purpose. The main complexity of a blog has been completely outsourced to IPFS data structures. Only the governance of the blog is controlled through the OpenWit contract. The blog contract and the registry contract have been kept seperated (blogs don't know registries exist) to help ensure that unforseen problems with the registry do not render a blog unusable. The oracle can do nothing other than allow registering of a Code of Conduct review request and allowing the off chain oracle service to update the request with a pass or fail.

`Re-entrancy attacks` are guarded against as the OpenWit.sol and OpenWitOracle.sol contracts do not make
external calls, while the registry updates no state after its one external call in `requestConductCheck`.
A potential need for the oracle to update the registry on a request being passed or failed is avoided
by having the Oracle Service both update the Oracle contract with the answer, then having the service
trigger the update in the registry which reads from the Oracle and updates appropriately.

`Integer Overflow/Underflow` is possible for the request number that the oracle uses for indexing and
referring to requests. However as the Oracle is the only contract that can update the private `RequestIndexCounter` variable and its only update mechanism is increment, its size as a `uint256`
should guard against overflow. The only other use of integers is as part of the IPFS hash, but
this is used for storage only, no on-chain calculation or logic is based off of it.

`Bad User Input` does not reach the ethereum contracts directly, it instead is stored on IPFS then referenced
from the smart contracts. All ids are generated within the contracts, human readability be damned. It is possible for an owner of a blog to update the OpenWit.sol blog contract with an invalid ipfs hash, this would
render the blog unreadable. It would damage nothing but their own blog. To reduce inconvenience to users, the offline Oracle could be extend to check valid IPFS hashes as well as conduct, this has not been implemented.

As the Oracle could go offline, the registry is susceptible to `DOS` attack, where someone requests a review of a blog, then manages to stop the Oracle Service from answering the request. The blog would show as `UnderReview` until the attack finishes. That the blog is still viewable while `UnderReview` partly solves this. The implemented solution is that the blog owner (or anyone else) has the option of triggering `updateFeedStateBasedOnConductCheck` themselves rather than the registry, this will set a blog back to `UnderReview` if more than 240 blocks have passed since the review was requested. The 240 block size should give the Oracle Service plenty of time to answer the request, and large enough that a miner cannot practically stop the response.

Gas limits problems are guarded against by avoiding loops and storing blog data offchain. There is a potential `DOS` attack by creating enough blogs that reading the blog list from the contract fails. This is not dealt with, though using a different Oracle to update IFPS with a list of blogs in the registry would be my next move.

The code of conduct violation is susceptible to front running. A user could monitor for complaints against their blog, then update the IFPS hash to an innocous version, before the request is processed. A change to the oracle to cycle through all previous IPFS hashes of the blog (available through events), would avoid this attack, it has not been implemented.
