import contract from 'truffle-contract'
import getWeb3 from './getWeb3'
import getIpfs from 'window.ipfs-fallback'
import getFeedReader from './feedReader'

import OpenWitContract from './contracts/OpenWit.json'
import OpenWitRegistryContract from './contracts/OpenWitRegistry.json'
import { fixTruffleContractCompatibilityIssue } from './utils/fixes'
import OpenWitViewer from './openWitViewer'

export const LOAD_APP = 'LOAD_APP'
export const CREATE_FEED = 'CREATE_FEED'
export const FETCH_FEED = 'FETCH_FEED'
export const POST_TO_FEED = 'POST_TO_FEED'
export const TRANSFER_OWNERSHIP = 'TRANSFER_OWNERSHIP'
export const FEED_UPDATED = 'FEED_UPDATED'
export const DESTROY_FEED = 'DESTROY_FEED'
export const TOGGLE_LOCK = 'TOGGLE_LOCK'
export const LOAD_FEED_LIST = 'LOAD_FEED_LIST'

export const loadingAppStates = {
  INITIALIZING: 'INITIALIZING',
  IPFS_LOADING: 'IPFS_LOADING',
  IPFS_LOAD_FAILED: 'IPFS_LOAD_FAILED',
  WEB3_LOADING: 'WEB3_LOADING',
  WEB3_LOAD_FAILED: 'WEB3_LOAD_FAILED',
  LOADED: 'LOADED'
}

export function loadAppInitializing () {
  return {
    type: LOAD_APP,
    status: loadingAppStates.INITIALIZING
  }
}

export function loadAppIpfsLoading () {
  return {
    type: LOAD_APP,
    status: loadingAppStates.IPFS_LOADING
  }
}

export function loadAppIpfsLoadingFailed (errorMessage) {
  return {
    type: LOAD_APP,
    status: loadingAppStates.IPFS_LOAD_FAILED,
    errorMessage
  }
}

export function loadAppWeb3Loading ({ipfs, ipfsId}) {
  return {
    type: LOAD_APP,
    status: loadingAppStates.WEB3_LOADING,
    ipfs,
    ipfsId
  }
}

export function loadAppWeb3LoadingFailed (errorMessage) {
  return {
    type: LOAD_APP,
    status: loadingAppStates.WEB3_LOAD_FAILED,
    errorMessage
  }
}

export function loadAppLoaded ({web3, currentWeb3Account, openWit, openWitRegistryContract, registry, feedReader}) {
  return {
    type: LOAD_APP,
    status: loadingAppStates.LOADED,
    web3,
    currentWeb3Account,
    openWit,
    openWitRegistryContract,
    feedReader,
    registry
  }
}

export function initializeApp () {
  return async (dispatch) => {
    dispatch(loadAppInitializing())

    dispatch(loadAppIpfsLoading())
    let ipfs, ipfsId
    try {
      ipfs = await getIpfs() // Init an IPFS peer node
      ipfsId = await ipfs.id() // Get the peer id info
      console.log(`Running ${ipfsId.agentVersion} with ID ${ipfsId.id}`)
    } catch (e) {
      return dispatch(loadAppIpfsLoadingFailed(e.message))
    }
    dispatch(loadAppWeb3Loading({ipfs, ipfsId}))
    let web3, currentWeb3Account, openWit, openWitRegistryContract, feedReader, registry
    try {
      web3 = (await getWeb3).web3
      const accounts = await web3.eth.getAccounts()
      currentWeb3Account = accounts[0]

      openWit = contract(OpenWitContract)
      openWit.setProvider(web3.currentProvider)
      fixTruffleContractCompatibilityIssue(openWit)

      openWitRegistryContract = contract(OpenWitRegistryContract)
      openWitRegistryContract.setProvider(web3.currentProvider)
      fixTruffleContractCompatibilityIssue(openWitRegistryContract)

      registry = await openWitRegistryContract.deployed()

      feedReader = await getFeedReader({ ipfs: ipfs })
    } catch (e) {
      return dispatch(loadAppWeb3LoadingFailed(e.message))
    }
    return dispatch(loadAppLoaded({web3, currentWeb3Account, openWit, openWitRegistryContract, registry, feedReader}))
  }
}

export const fetchFeedStatuses = {
  UNLOADED: 'UNLOADED',
  REQUESTED: 'REQUESTED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  REQUEST_SUCCEEDED: 'REQUEST_SUCCEEDED'
}

export function fetchFeedRequested (feedAddress) {
  return {
    type: FETCH_FEED,
    status: fetchFeedStatuses.REQUESTED,
    feedAddress
  }
}

export function fetchFeedFailed (errorMessage) {
  return {
    type: FETCH_FEED,
    status: fetchFeedStatuses.REQUEST_FAILED,
    errorMessage
  }
}

export function fetchFeedSucceeded (feed, owner, paused, contract) {
  return {
    type: FETCH_FEED,
    status: fetchFeedStatuses.REQUEST_SUCCEEDED,
    feed,
    owner,
    paused,
    contract
  }
}

export function feedUpdated (ipfsFeed) {
  return {
    type: FEED_UPDATED,
    ipfsFeed
  }
}

export function fetchFeed (contractAddress) {
  return async (dispatch, getState) => {
    const { feed, openWit, feedReader } = getState()
    if (feed.requestStatus === fetchFeedStatuses.REQUESTED) {
      console.info('Request already in play')
      return
    }

    dispatch(fetchFeedRequested(contractAddress))

    try {
      console.log('Fetch Feed at Eth Contract Address', contractAddress)

      const feedUpdatedCallback = (ipfsFeed) => {
        dispatch(feedUpdated(ipfsFeed))
      }

      const result = await OpenWitViewer.getOpenWitFeed(contractAddress, { openWit, feedReader, feedUpdatedCallback })

      if (result.status === 'error') {
        return dispatch(fetchFeedFailed(result.errorMessage))
      }

      const {feed, owner, paused, contract} = result.content

      return dispatch(fetchFeedSucceeded(feed, owner, paused, contract))
    } catch (ex) {
      console.log(ex)
      return dispatch(fetchFeedFailed(ex.message))
    }
  }
}

export const postToFeedStatuses = {
  UNINITIATED: 'UNINITIATED',
  REQUESTED: 'REQUESTED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  REQUEST_SUCCEEDED: 'REQUEST_SUCCEEDED'
}

function postToFeedRequested (postText) {
  return {
    type: POST_TO_FEED,
    status: postToFeedStatuses.REQUESTED,
    postText
  }
}

function postToFeedFailed (errorMessage) {
  return {
    type: POST_TO_FEED,
    status: postToFeedStatuses.REQUEST_FAILED,
    errorMessage }
}

function postToFeedSuceeded (ipfsFeed) {
  return {
    type: POST_TO_FEED,
    status: postToFeedStatuses.REQUEST_SUCCEEDED,
    ipfsFeed
  }
}

export function postToFeed (postText) {
  return async (dispatch, getState) => {
    const { postToFeed, feed, openWit, feedReader, currentWeb3Account } = getState()

    if (postToFeed.requestStatus === postToFeedStatuses.REQUESTED) {
      console.info('Request already in play')
      return
    }

    dispatch(postToFeedRequested(postText))

    try {
      const result = await OpenWitViewer.addPostToOpenWitFeed(postText, {
        openWit,
        feedReader,
        currentWeb3Account,
        permawitFeed: feed.feed,
        contract: feed.contract
      })

      if (result.status === 'error') {
        return dispatch(postToFeedFailed(result.errorMessage))
      }

      return dispatch(postToFeedSuceeded(result.content.feed))
    } catch (ex) {
      console.log(ex)
      return dispatch(postToFeedFailed(ex.message))
    }
  }
}

export const transferOwnershipStatuses = {
  UNINITIATED: 'UNINITIATED',
  REQUESTED: 'REQUESTED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  REQUEST_SUCCEEDED: 'REQUEST_SUCCEEDED'
}

function transferOwnershipRequested (newOwnerAccountAddress) {
  return {
    type: TRANSFER_OWNERSHIP,
    status: transferOwnershipStatuses.REQUESTED,
    newOwnerAccountAddress
  }
}

function transferOwnershipFailed (errorMessage) {
  return {
    type: TRANSFER_OWNERSHIP,
    status: transferOwnershipStatuses.REQUEST_FAILED,
    errorMessage
  }
}

function transferOwnershipSucceeded (errorMessage) {
  return {
    type: TRANSFER_OWNERSHIP,
    status: transferOwnershipStatuses.REQUEST_SUCCEEDED,
    errorMessage
  }
}

export function transferOwnership (newOwnerAccountAddress) {
  return async (dispatch, getState) => {
    const { currentWeb3Account, feed } = getState()
    dispatch(transferOwnershipRequested(newOwnerAccountAddress))

    try {
      console.log('transferring ownership to new owner ' + newOwnerAccountAddress)
      const result = OpenWitViewer.transferOwnership(newOwnerAccountAddress, {
        currentWeb3Account,
        contract: feed.contract
      })

      if (result.status === 'error') {
        return dispatch(transferOwnershipFailed(result.errorMessage))
      }

      return dispatch(transferOwnershipSucceeded())
    } catch (ex) {
      console.log(ex)
      return dispatch(transferOwnershipFailed(ex.message))
    }
  }
}

export const destroyFeedStatuses = {
  UNINITIATED: 'UNINITIATED',
  REQUESTED: 'REQUESTED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  REQUEST_SUCCEEDED: 'REQUEST_SUCCEEDED'
}

function destroyFeedRequested () {
  return {
    type: DESTROY_FEED,
    status: destroyFeedStatuses.REQUESTED
  }
}

function destroyFeedFailed (errorMessage) {
  return {
    type: DESTROY_FEED,
    status: destroyFeedStatuses.REQUEST_FAILED,
    errorMessage
  }
}

function destroyFeedSucceeded (errorMessage) {
  return {
    type: DESTROY_FEED,
    status: destroyFeedStatuses.REQUEST_SUCCEEDED
  }
}

export function destroyFeed () {
  return async (dispatch, getState) => {
    const { currentWeb3Account, feed } = getState()
    dispatch(destroyFeedRequested())

    try {
      const result = OpenWitViewer.destroy({
        currentWeb3Account,
        contract: feed.contract
      })

      if (result.status === 'error') {
        return dispatch(destroyFeedFailed(result.errorMessage))
      }

      return dispatch(destroyFeedSucceeded())
    } catch (ex) {
      console.log(ex)
      return dispatch(destroyFeedFailed(ex.errorMessage))
    }
  }
}

export const toggleLockStatuses = {
  UNINITIATED: 'UNINITIATED',
  REQUESTED: 'REQUESTED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  REQUEST_SUCCEEDED: 'REQUEST_SUCCEEDED'
}

function toggleLockRequested (lockFlag) {
  return {
    type: TOGGLE_LOCK,
    status: toggleLockStatuses.REQUESTED,
    lockFlag
  }
}

function toggleLockFailed (errorMessage) {
  return {
    type: TOGGLE_LOCK,
    status: toggleLockStatuses.REQUEST_FAILED,
    errorMessage
  }
}

function toggleLockSucceeded (lockFlag) {
  return {
    type: TOGGLE_LOCK,
    status: toggleLockStatuses.REQUEST_SUCCEEDED,
    lockFlag
  }
}

export function toggleLock (lockFlag) {
  return async (dispatch, getState) => {
    const { currentWeb3Account, feed } = getState()

    dispatch(toggleLockRequested())

    try {
      const result = await OpenWitViewer.toggleLock(lockFlag, { currentWeb3Account, contract: feed.contract })

      if (result.status === 'error') {
        return dispatch(destroyFeedFailed(result.errorMessage))
      }

      return dispatch(toggleLockSucceeded(lockFlag))
    } catch (ex) {
      return dispatch(toggleLockFailed(ex.message))
    }
  }
}

export const createFeedStatuses = {
  UNINITIATED: 'UNINITIATED',
  REQUESTED: 'REQUESTED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  REQUEST_SUCCEEDED: 'REQUEST_SUCCEEDED'
}

function createFeedRequest (title, author) {
  return {
    type: CREATE_FEED,
    status: createFeedStatuses.REQUESTED,
    title,
    author
  }
}

function createFeedFailed (errorMessage) {
  return {
    type: CREATE_FEED,
    status: createFeedStatuses.REQUEST_FAILED,
    errorMessage
  }
}

function createFeedSucceeded () {
  return {
    type: CREATE_FEED,
    status: createFeedStatuses.REQUEST_SUCCEEDED
  }
}

export function createFeed (title, author) {
  return async (dispatch, getState) => {
    const { currentWeb3Account, feedReader, registry } = getState()
    dispatch(createFeedRequest(title, author))

    try {
      const result = await OpenWitViewer.createFeed(
        title,
        author,
        { currentWeb3Account, feedReader, registry })

      if (result.status === 'error') {
        return dispatch(createFeedFailed(result.errorMessage))
      }

      return dispatch(createFeedSucceeded())
    } catch (ex) {
      return dispatch(toggleLockFailed(ex.message))
    }
  }
}

export const loadFeedListStatuses = {
  UNINITIATED: 'UNINITIATED',
  REQUESTED: 'REQUESTED',
  REQUEST_FAILED: 'REQUEST_FAILED',
  REQUEST_SUCCEEDED: 'REQUEST_SUCCEEDED'
}

function loadFeedListRequest () {
  return {
    type: LOAD_FEED_LIST,
    status: loadFeedListStatuses.REQUESTED
  }
}

function loadFeedListFailed (errorMessage) {
  return {
    type: LOAD_FEED_LIST,
    status: loadFeedListStatuses.REQUEST_FAILED,
    errorMessage
  }
}

function loadFeedListSucceeded (feedRecords) {
  return {
    type: LOAD_FEED_LIST,
    status: loadFeedListStatuses.REQUEST_SUCCEEDED,
    feedRecords
  }
}

export function loadFeedList () {
  return async (dispatch, getState) => {
    const { registry, openWit, feedReader } = getState()
    dispatch(loadFeedListRequest())

    try {
      const result = await OpenWitViewer.getOpenWitFeedSummaries({registry, openWit, feedReader})

      if (result.status === 'error') {
        return dispatch(loadFeedListFailed(result.errorMessage))
      }

      return dispatch(loadFeedListSucceeded(result.content.feedRecords))
    } catch (ex) {
      console.error(ex)
      return dispatch(loadFeedListFailed(ex.message))
    }
  }
}
