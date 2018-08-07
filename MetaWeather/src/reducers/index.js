import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { RootNavigator } from '../navigators/AppNavigator';

import {
	CITYNAME_API_CALL_FAILURE,
	CITYNAME_API_CALL_SUCCESS,
	CITYNAME_API_CALL_REQUEST,
	FORECAST_API_CALL_FAILURE,
	FORECAST_API_CALL_REQUEST,
	FORECAST_API_CALL_SUCCESS,
	COORDINATES_API_CALL_REQUEST,
	COORDINATES_API_CALL_FAILURE,
	COORDINATES_API_CALL_SUCCESS,
	HISTORY,
	DETAIL,
	HOME,
  SAVE_SEARCH_WORD
} from '../actions/actionTypes';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

const router = RootNavigator.router;
const home = router.getActionForPathAndParams(HOME);
const initialNavState = router.getStateForAction(home);

// NOTES
// 
// One very nice things about this app is my Navigation state is stored in redux
//
function nav(state = initialNavState, action) {
	let nextState;
	switch (action.type) {
		case HOME:
			nextState = router.getStateForAction(
				NavigationActions.navigate({ routeName: HOME }),
				state
			);
			break;

		case HISTORY:
			nextState = router.getStateForAction(
				NavigationActions.navigate({ routeName: HISTORY }),
				state
			);
			break;

		case DETAIL:
			nextState = router.getStateForAction(
				NavigationActions.navigate({ routeName: DETAIL }),
				state
			);
			break;

		default:
			nextState = router.getStateForAction(action, state);
			break;
	}

	return nextState || state;
}

const initialDataState = {
	fetching: false,
	cities: [],
	currentCity: {},
	error: null,
};

function data(state = initialDataState, action) {
	switch (action.type) {
		case COORDINATES_API_CALL_REQUEST:
			return {
				...state,
				fetching: true,
				error: null,
			};

		case COORDINATES_API_CALL_SUCCESS:
			return {
				...state,
				fetching: false,
				cities: action.results,
				error: null,
			};

		case COORDINATES_API_CALL_FAILURE:
			return {
				...state,
				fetching: false,
				cities: [],
				error: action.error,
			};

		case CITYNAME_API_CALL_REQUEST:
			return {
				...state,
				fetching: true,
				error: null,
			};

		case CITYNAME_API_CALL_SUCCESS:
			return {
				...state,
				fetching: false,
				cities: action.results,
				error: null,
			};

		case CITYNAME_API_CALL_FAILURE:
			return {
				...state,
				fetching: false,
				cities: [],
				error: action.error,
			};

		case FORECAST_API_CALL_REQUEST:
			return {
				...state,
				fetching: true,
				error: null,
			};

		case FORECAST_API_CALL_SUCCESS:
			return {
				...state,
				fetching: false,
				currentCity: action.results,
				error: null,
			};

		case FORECAST_API_CALL_FAILURE:
			return {
				...state,
				fetching: false,
				currentCity: {},
				error: action.error,
			};

		default:
			return state;
	}
}

const initSavedDataSource = {
	savedSearches: [],
};

function saved(state = initSavedDataSource, action) {
	switch (action.type) {
		case SAVE_SEARCH_WORD:
			return {
				savedSearches: [...state.savedSearches, action.saveObject],
			};

		default:
			return state;
	}
}

const AppReducer = combineReducers({
	nav,
	data,
	saved,
});

//Only persist our saved reducer state to local storage
const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['saved'],
};

export default persistReducer(persistConfig, AppReducer);
