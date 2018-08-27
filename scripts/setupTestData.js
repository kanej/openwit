const ipfsAPI = require('ipfs-api')
const Permawit = require('permawit')
const MemoryStore = require('../src/utils/memoryStore')

const fs = require('fs')
const Web3 = require('web3')
const truffleContract = require('truffle-contract')
const { fixTruffleContractCompatibilityIssue } = require('../src/utils/fixes')

const { getBytesFromCidv1 } = require('../src/multihash')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const openWitRegistryAbi = JSON.parse(fs.readFileSync('./build/contracts/OpenWitRegistry.json'))

var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

const byronFeed = {
  title: 'She Walks in Beauty',
  author: 'Lord Byron',
  posts: [
    'She walks in beauty, like the night',
    'Of cloudless climes and starry skies;',
    'And all that’s best of dark and bright',
    'Meet in her aspect and her eyes;',
    'Thus mellowed to that tender light',
    'Which heaven to gaudy day denies.'
  ]
}

const tennysonFeed = {
  title: 'The Lady of Shalott',
  author: 'Lord Tennyson',
  posts: [
    'On either side the river lie',
    'Long fields of barley and of rye,',
    'That clothe the wold and meet the sky;',
    'And thro\' the field the road runs by',
    'To many-tower\'d Camelot;',
    'The yellow-leaved waterlily',
    'The green-sheathed daffodilly',
    'Tremble in the water chilly',
    'Round about Shalott.'
  ]
}

const keatsFeed = {
  title: 'La Belle Dame',
  author: 'John Keats',
  posts: [
    'O what can ail thee, knight-at-arms,',
    'Alone and palely loitering?',
    'The sedge has withered from the lake,',
    'And no birds sing.'
  ]
}

const badFeed = {
  title: 'Misbehaving',
  author: 'Anon',
  posts: [
    'No I really do think there are good reasons for multiple inheritance'
  ]
}

const setupFeedOnIpfs = async (feedData, wit) => {
  const feed = await wit.createFeed({ name: feedData.title, author: feedData.author })
  for (var post of feedData.posts.reverse()) {
    await feed.post({text: post})
  }
  return feed.getHash()
}

const addFeedToRegistry = async ({cid, openWitRegistry, accounts}) => {
  const { version, codec, hash, size, digest } = getBytesFromCidv1(cid)

  try {
    const result = await openWitRegistry.create(
      version,
      codec,
      hash,
      size,
      digest,
      {
        from: accounts[3],
        value: web3.utils.toWei('0.1', 'ether'),
        gas: 3000000
      })

    const newFeedAddress = result.logs[0].args.newAddress
    console.log('OpenWit address:', newFeedAddress)
  } catch (e) {
    console.error(e)
  }
}

const setupTestData = async () => {
  console.log('Setting up test data on IPFS ...')
  const wit = new Permawit({ ipfs, store: new MemoryStore() })

  const openWitRegistryContract = truffleContract(openWitRegistryAbi)
  openWitRegistryContract.setProvider(web3.currentProvider)
  fixTruffleContractCompatibilityIssue(openWitRegistryContract)

  const accounts = await web3.eth.getAccounts()

  const openWitRegistry = await openWitRegistryContract.deployed()

  const byronFeedHash = await setupFeedOnIpfs(byronFeed, wit)
  const tennysonFeedHash = await setupFeedOnIpfs(tennysonFeed, wit)
  const keatsFeedHash = await setupFeedOnIpfs(keatsFeed, wit)
  const badFeedHash = await setupFeedOnIpfs(badFeed, wit)

  console.log('Byron Feed Hash: ', byronFeedHash)
  console.log('Tennyson Feed Hash: ', tennysonFeedHash)
  console.log('Keats Feed Hash: ', keatsFeedHash)
  console.log('Bad Feed Hash: ', badFeedHash)

  await addFeedToRegistry({cid: byronFeedHash, openWitRegistry, accounts})
  await addFeedToRegistry({cid: tennysonFeedHash, openWitRegistry, accounts})
  await addFeedToRegistry({cid: keatsFeedHash, openWitRegistry, accounts})
  await addFeedToRegistry({cid: badFeedHash, openWitRegistry, accounts})
}

setupTestData()
