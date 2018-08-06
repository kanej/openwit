# openwit

[![CircleCI](https://circleci.com/gh/kanej/openwit.svg?style=svg&circle-token=83c03cba6469010356c56bed2d1d182db3548996)](https://circleci.com/gh/kanej/openwit)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Microblogging fun with Ethereum and IPFS

An attempt at a simple micro-blogging system running on Ethereum for change control and IPFS for storage.

This has been developed as my project for the Consensys Academy 2018 project.

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [TODO](#todo)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Security

OpenWit is made up of one Ethereum contract currently. It has had no security measures put in place.

## Install


```bash
npm install
```

Usage
-----

Run the dev server:

```bash
$ npm run start
```

Run ganache (local ethereum development blockain):

```bash
$ npm run dev:ganache
```

Migrate the constracts on to the dev blockchain:

```bash
$ truffle migrate
```

Setup an example feed

```bash
$ node ./scripts/setupFeed.js
```

Refresh the development server

## TODO

See the [TODO file](./todo.md).

## Maintainers

[@kanej](https://github.com/kanej)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 John Kane
