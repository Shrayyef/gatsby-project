import { createStore as reduxCreateStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'

const reducer = (state, action) => {
  if (action.type === `SELECT_VIDEO`) {
    return Object.assign({}, state, {
      modal: true,
      video: action.video,
    })
  }
  if (action.type === `CLOSE_VIDEO`) {
    return Object.assign({}, state, {
      modal: false,
      video: {},
    })
  }
  return state
}

const initialState = { modal: false, video: {} }

const createStore = () =>
  reduxCreateStore(reducer, initialState, applyMiddleware(logger))
export default createStore
