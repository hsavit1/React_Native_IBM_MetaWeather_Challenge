import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import AppReducer from './src/reducers';
import { AppNavigator, middleware } from './src/navigators/AppNavigator';

import thunk from 'redux-thunk';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';


// NOTE
//
// I do most of my debugging with a tool called Reactotron. It allows me to view all 
// of my network activity and view changes to my application's redux state tree
// The Reactotron will only be initialized when I'm in a dev environment
// To check out Reactotron, go to the github page and download the desktop client
//
// I also persist my Redux store to local storage with Redux Persist
//
// I used Redux thunk as my middleware for async network requests

let store;
let persistedStore;
if (__DEV__) {
	require('./ReactotronConfig');
	const Reactotron = require('reactotron-react-native').default;

	const createStoreWithMiddleware = applyMiddleware(middleware, thunk);

	store = Reactotron.createStore(
		AppReducer,
		compose(createStoreWithMiddleware)
	);

	persistedStore = persistStore(store);
} else {
	const createStoreWithMiddleware = applyMiddleware(middleware, thunk);
	store = createStore(AppReducer, createStoreWithMiddleware);
	persistedStore = persistStore(store, { storage: AsyncStorage });
}

export default class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistedStore}>
					<AppNavigator />
				</PersistGate>
			</Provider>
		);
	}
}
