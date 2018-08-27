# openwit

[![CircleCI](https://circleci.com/gh/kanej/openwit.svg?style=svg&circle-token=83c03cba6469010356c56bed2d1d182db3548996)](https://circleci.com/gh/kanej/openwit)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Microblogging fun with Ethereum and IPFS

An attempt at a simple micro-blogging system running on Ethereum for change control and IPFS for storage.

This has been developed as coursework for the Consensys Academy 2018 project.

** Reviewers! Please start by [reading over the reviews notes](./docs/reviewer_notes.md) **
-------------------------------------------------------------------------------------------

## Table of Contents

- [Introduction](#introduction)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Security](#security)
- [TODO](#todo)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Introduction

The app demonstrates an ethereum contract that represents a decentralized microblog feed. It allows you to create a microblog, post to it, lock it, transfer it to a new owner and destroy it. Changes to the blog are controlled through the ethereum contract but the data of the blog, that is its posts, are stored on [IPFS](https://ipfs.io). The censorship resistant nature of IPFS makes it ideal for publishing static data, the small wrapper contract on the ethereum blockchain gives enough mutability to allow for an 'updatable' blog.

The second part of the app is a registry contract + oracle that gathers together a set of blogs and allows enforcement of a simple code of conduct by confiscating a financial stake if a blog is in breach of the rules. The rules (or in this case one rule - that blog posts can't contain the word `inheritance`)
can be enforced on a blog by requesting a Code of Conduct review through the registry. The registry
delegates the review to a trusted Oracle (a node.js process running locally).

More detail about the app's features and use cases can be found in the doc:

* [use_cases.md](./docs/use_cases.md)

## Background

Social media sites have a free speech problem. They seek to be global in scope, encourage general discussion and yet retain the ability to remove content that is illegal/unacceptable to most people. They are in a bind because instead of national laws determining what can and cannot be published, it is their own terms of use that apply. But as soon as they start banning or allowing content based on standards of morality/taste/good manners, governments and communities can quite legitimately ask that within their jurisdictions their standards of morality/taste/good manners apply. This rubs against the social media companies push to be global in scope, hence the perhaps surprising commitment they tend to have to free speech. The current alternative would be the break up and balkanisation of these platforms so that each jurisdiction could control their little part. That a person would then be constrained in their speech by the standards of wherever they happen to live, is the downside.

Perhaps one way around this would be to restore the approach we took before the internet. The technology to publish should always be available, ensuring free speech to the out numbered; however communities (of whatever size) should be able to set their own code of conduct and exclude behaviour or members that fail to meet it. Swearing may be acceptable in your local pub, but would get you asked not to give the Woman's Institute address again.

This project is an hilarously bad attempt to build out a censorship resistant microblog (free speech for all, as long as your keeping it short) with the ability to create communities that have and can enforce their own standards. 

## Install

The app is a javascript [truffle project](https://truffleframework.com), and can be installed with:

```bash
npm install
```

To run the oracle service requires node.js and a running local IPFS node. The best way or running IPFS
is through the `go-ipfs` client downloadable from:

> https://dist.ipfs.io/#go-ipfs

The most reliable way for a webapp to interact with the local IPFS node is using the firefox/chrome
[IPFS Companion plugin](https://chrome.google.com/webstore/detail/ipfs-companion/nibjojkomfdiaoajekhjakgkdhaomnch). It should connect with your local running instance.

Usage
-----

To run the app locally you will need several components running:

1. Ganache (local ethereum development blockain)
2. A local ipfs node
3. The development webserver

To run ganache on the command line:

```bash
$ npm run dev:ganache
```

This will start ganache with the mnemonic:

> ostrich high museum cheap fade about much voyage exist common deposit distance

Import this mnemonic into metamask and set the development network to `Localhost 8545`.

To start an ipfs node, first [install ipfs](https://dist.ipfs.io/#go-ipfs), then:

```bash
$ ipfs daemon
```

The development webserver runs on `port 3000` and is started with:

```bash
$ npm run start
```

Before browsing to the app, make sure that the ethereum contracts are
deployed to the ganache environment:

```bash
$ truffle migrate
```

To setup example data run (assuming ganache and ipfs are running):

```bash
$ node ./scripts/setupTestData.js
```

Refresh the OpenWit website if you have already went to `http://localhost:3000`

## Design

The app consists of a React web frontend that interacts with the ethereum network and the ipfs network.

The app can create microblogs by instantiating a new OpenWit contract on the ethereum network, and setting
it with a pointer (a hash in CID format) to the blogs data stored on IPFS. The data is stored not as a file on IPFS but as a [IPLD merkle graph](https://ipld.io/).

??EXAMPLE TO FOLLOW??

A microblog is represented by the `OpenWit.sol` cotract. It can be created either directly or through a registry. A registry allows others to find your blog and allows for enforcement of an admittedly noddy Code of Conduct. The registry is encoded as the `OpenWitRegistry.sol` contract. The Code of Conduct can be enforced as the owner of a blog must stake ether to get it added to the registry. Any user who determines that the blog is in violation can issue a challenge through the registry. The registry then consults an oracle (the `OpenWitOracle.sol` contract) which is backed by an offchain node.js service, which determine if the given blog is indeed in violation.

The code of conduct is hardcoded and is no more complicated than `No blog post can include the lowercase word 'inheritance'`.

Further details on the design of the contracts can be found at:

* [design_pattern_desicions.md](./docs/design_pattern_desicions.md)

## Security

OpenWit is made up of three Ethereum contracts and a shared library:

* OpenWit.sol which represents a blog
* OpenWitRegistry.sol which encapsulates a community of blogs
* OpenWitOracle.sol which provides an oracle that will verify whether a blog meets the Code of Conduct
* SharedStructs.sol which is a library that allows the registry and oracle to share the struct type and state enums that encode a Code of Conduct request

All extend base contracts from the [Open Zepplin](https://openzeppelin.org/api/docs/open-zeppelin.html) project.

Consideration of the known ethereum security attacks was given in writing the contracts based on the
guidance from the [Consensys Smart Contracts Best Practices](https://consensys.github.io/smart-contract-best-practices/known_attacks/).

The `solium` linter has been used for static analysis.

More details about specific security measures put in place for both are available in the document:

* [avoiding_common_attacks.md](./docs/avoiding_common_attacks.md)

## Testing

To test the smart contracts, with a running ganache instance, run

```bash
truffle test
```

## TODO

See the [TODO file](./todo.md).

## Maintainers

[@kanej](https://github.com/kanej)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 John Kane
