# openwit

[![CircleCI](https://circleci.com/gh/kanej/openwit.svg?style=svg&circle-token=83c03cba6469010356c56bed2d1d182db3548996)](https://circleci.com/gh/kanej/openwit)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Microblogging fun with Ethereum and IPFS

An attempt at a simple micro-blogging system running on Ethereum for change control and IPFS for storage.

This has been developed as coursework for the Consensys Academy 2018 project.

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

The app demonstrates an ethereum contract that represents a decentralized microblog feed. It allows you to create a microblog, post to it, lock it, transfer it to a new owner and destroy it. Changes to the blog are controlled through the ethereum contract but the data of the blog, that is its posts, are stored on [IPFS](https://ipfs.io). The censorship resistant nature of IPFS makes it ideal for publishing static data, the smaller wrapper contract on the ethereum blockchain gives enough mutability to allow for an 'updatable' blog.

The second part of the app is a registry contract that gathers together a set of blogs and allows enforcement of a simple code of conduct by confiscating a financial stake if a blog is in breach of the rules.

## Background

Social media sites have a free speech problem. They seek to be global in scope, encourage general discussion and yet retain the ability to remove content that is illegal/unacceptable to most people. They are in a bind because instead of national laws determining what can and cannot be published, it is their own terms of use that apply. But as soon as they start banning or allowing content based on standards of morality/taste/good manners, governments and communities can quite legitimately ask that within their jurisdictions their standards of morality/taste/good manners apply. This rubs against the social media companies push to be global in scope, hence the perhaps surprising commitment they tend to have to free speech. The current alternative would be the break up and balkanisation of these platforms so that each jurisdiction could control their little part. That a person would then be constrained in their speech by the standards of wherever they happen to live, is the downside.

Perhaps one way around this would be to restore the approach we took before the internet. The technology to publish should always be available, ensuring free speech to the out numbered; however communities (of whatever size) should be able to set their own code of conduct and exclude behaviour or members that fail to meet it. Swearing may be acceptable in your local pub, but would get you asked not to give the Woman's Institute address again.

This project is an attempt to build out a censorship resistant microblog (free speech for all, as long as your keeping it short) with the ability to create communities that have and can enforce their own standards. 

## Install

```bash
npm install
```

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

To start an ipfs node, first install ipfs, then:

```bash
$ ipfs daemon --offline
```

The development webserver runs on `port 3000` and is started with:

```bash
$ npm run dev:web
```

Before browsing to the app, make sure that the ethereum contracts are
deployed to the ganache environment:

```bash
$ truffle migrate
```

To setup example data run:

```bash
$ node ./scripts/setupFeed.js
```

Refresh the development server

Run storybook

```bash
$ node .\node_modules\@storybook\react\bin\index.js -p 9090 -s public -c .\.storybook
```
## Security

OpenWit is made up of one Ethereum contract currently. It has had no security measures put in place.

## TODO

See the [TODO file](./todo.md).

## Maintainers

[@kanej](https://github.com/kanej)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 John Kane
