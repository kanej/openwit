/**
 * Based on multihash.js from https://github.com/saurfang/ipfs-multihash-on-solidity
 * which is distributed under the MIT license
 */

const bs58 = require('bs58')

/**
 * @typedef {Object} Multihash
 * @property {string} digest The digest output of hash function in hex with prepended '0x'
 * @property {number} hashFunction The hash function code for the function used
 * @property {number} size The length of digest
 */

/**
 * Partition multihash string into object representing multihash
 *
 * @param {string} multihash A base58 encoded multihash string
 * @returns {Multihash}
 */
function getBytes32FromMultihash (multihash) {
  const decoded = bs58.decode(multihash)

  return {
    digest: `0x${Buffer.from(decoded.slice(2)).toString('hex')}`,
    hashFunction: decoded[0],
    size: decoded[1]
  }
}

/**
 * Encode a multihash structure into base58 encoded multihash string
 *
 * @param {Multihash} multihash
 * @returns {(string|null)} base58 encoded multihash string
 */
function getMultihashFromBytes32 (multihash) {
  const { digest, hashFunction, size } = multihash
  if (size === 0) {
    return null
  }

  // cut off leading "0x"
  const hashBytes = Buffer.from(digest.slice(2), 'hex')

  // prepend hashFunction and digest size
  const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length)
  multihashBytes[0] = hashFunction
  multihashBytes[1] = size
  multihashBytes.set(hashBytes, 2)

  return bs58.encode(multihashBytes)
}

module.exports = {
  getBytes32FromMultihash,
  getMultihashFromBytes32
}
