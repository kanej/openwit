// import { combineReducers } from 'redux'
import {
  LOAD_APP,
  FETCH_FEED,
  POST_TO_FEED,
  FEED_UPDATED,
  TRANSFER_OWNERSHIP,
  TOGGLE_LOCK,
  loadingAppStates,
  fetchFeedStatuses,
  postToFeedStatuses,
  transferOwnershipStatuses,
  toggleLockStatuses
} from './actions'

const openWitApp = (state, action) => {
  if (!state) {
    state = {
      loadingStatus: loadingAppStates.INITIALIZING,
      currentWeb3Account: null,
      ipfs: null,
      ipfsId: null,
      web3: null,
      openWit: null,
      feedReader: null,
      feed: {
        requestStatus: fetchFeedStatuses.UNLOADED,
        feedAddress: null,
        errorMessage: null,
        paused: false
      },
      postToFeed: {
        requestStatus: postToFeedStatuses.UNINITIATED,
        postText: null,
        errorMessage: null
      },
      transferOwnership: {
        requestStatus: transferOwnershipStatuses.UNINITIATED,
        newOwnerAccountAddress: null
      }
    }
  }

  switch (action.type) {
    case LOAD_APP:
      switch (action.status) {
        case loadingAppStates.WEB3_LOADING:
          return {
            ...state,
            loadingStatus: action.status,
            ipfs: action.ipfs,
            ipfsId: action.ipfsId
          }
        case loadingAppStates.LOADED:
          return {
            ...state,
            loadingStatus: action.status,
            web3: action.web3,
            currentWeb3Account: action.currentWeb3Account,
            openWit: action.openWit,
            feedReader: action.feedReader
          }
        case loadingAppStates.IPFS_LOAD_FAILED:
        case loadingAppStates.WEB3_LOAD_FAILED:
          return {
            ...state,
            loadingStatus: action.status,
            loadingErrorMessage: action.errorMessage
          }
        default:
          return { ...state, loadingStatus: action.status }
      }

    case FETCH_FEED:
      switch (action.status) {
        case fetchFeedStatuses.REQUESTED:
          return {
            ...state,
            feed: {
              ...state.feed,
              requestStatus: action.status,
              feedAddress: action.feedAddress
            }
          }
        case fetchFeedStatuses.REQUEST_FAILED:
          return {
            ...state,
            feed: {
              ...state.feed,
              requestStatus: action.status,
              errorMessage: action.errorMessage
            }
          }
        case fetchFeedStatuses.REQUEST_SUCCEEDED:
          return {
            ...state,
            feed: {
              ...state.feed,
              requestStatus: action.status,
              feed: action.feed,
              owner: action.owner,
              paused: action.paused,
              contract: action.contract
            }
          }
        case fetchFeedStatuses.UNLOADED:
          return {...state, feed: {requestStatus: action.status}}
        default:
          return state
      }
    case POST_TO_FEED:
      switch (action.status) {
        case postToFeedStatuses.REQUESTED:
          return {
            ...state,
            postToFeed: {
              requestStatus: action.status,
              postText: action.postText
            }
          }
        case postToFeedStatuses.REQUEST_FAILED:
          return {
            ...state,
            postToFeed: {
              requestStatus: action.status,
              errorMessage: action.errorMessage
            }
          }
        case postToFeedStatuses.REQUEST_SUCCEEDED:
          return {
            ...state,
            postToFeed: {
              requestStatus: action.status
            },
            feed: {
              ...state.feed,
              feed: action.ipfsFeed
            }
          }
        default:
          return state
      }
    case FEED_UPDATED:
      return {
        ...state,
        feed: {
          ...state.feed,
          feed: action.ipfsFeed
        }
      }
    case TRANSFER_OWNERSHIP:
      switch (action.status) {
        case transferOwnershipStatuses.REQUESTED:
          return {
            ...state,
            transferOwnership: {
              requestStatus: action.status,
              newOwnerAccountAddress: action.newOwnerAccountAddress
            }
          }
        case transferOwnershipStatuses.REQUEST_FAILED:
          return {
            ...state,
            transferOwnership: {
              ...state.transferOwnership,
              requestStatus: action.status,
              errorMessage: action.errorMessage
            }
          }
        case transferOwnershipStatuses.REQUEST_SUCCEEDED:
          return {
            ...state,
            transferOwnership: {
              requestStatus: action.status
            },
            feed: {
              ...state.feed,
              owner: state.transferOwnership.newOwnerAccountAddress
            }
          }
        default:
          return {...state}
      }
    case TOGGLE_LOCK:
      switch (action.status) {
        case toggleLockStatuses.REQUESTED:
          return {
            ...state,
            toggleLock: {
              requestStatus: action.status,
              lockFlag: action.lockFlag,
              errorMessage: null
            }
          }
        case toggleLockStatuses.REQUEST_FAILED:
          return {
            ...state,
            toggleLock: {
              ...state.toggleLock,
              requestStatus: action.status,
              errorMessage: action.errorMessage
            }
          }
        case toggleLockStatuses.REQUEST_SUCCEEDED:
          return {
            ...state,
            toggleLock: {
              ...state.toggleLock,
              requestStatus: action.status
            },
            feed: {
              ...state.feed,
              paused: action.lockFlag
            }
          }
        default:
          return {...state}
      }
    default:
      return state
  }
}

export default openWitApp
