Contract Design
===============

There are two contracts:

1. OpenWit - which represents an individual blog
2. OpenWitRegistry - which encapsulates a "community" of blogs that conform to a (hardcoded) Code of Conduct

OpenWit
-------

The OpenWit contract extends two OpenZepplin contracts directly and implicity a third:

1. [Destructible](https://openzeppelin.org/api/docs/lifecycle_Destructible.html)
2. [Pausable](https://openzeppelin.org/api/docs/lifecycle_Pausable.html)
3. [Ownable](https://openzeppelin.org/api/docs/ownership_Ownable.html)

The contract is designed to provide governance over admin tasks that are typically done on a blog, while
offloading the blogs posts and data to IPFS.

The contract is ownable, its owner being set to the sender of the transaction that creates it. The owner
can be changed after creation. Being ownable provides basic access control, allowing the contracts functionality to be limited to access by the owner. Only the owner can add new posts to the blog (that is update its IPFS hash), transfer ownership, lock the blog, unlock the blog, or destroy the blog contract.

The option to destroy the blog is provided through extending `Destructible`. 

OpenWitRegistry
---------------

TBD
