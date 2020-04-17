import {
    createStore,
    applyMiddleware
} from '../lib/redux.js';
import promiseMiddleware from 'redux-promise';
import rootReducer from './reducers'
export default function configStore() {
    const store = createStore(rootReducer, applyMiddleware(promiseMiddleware));
    return store;
}
