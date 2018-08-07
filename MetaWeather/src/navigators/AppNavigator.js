import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import {
	reduxifyNavigator,
	createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

import HomeScreen from '../components/HomeScreen';
import DetailScreen from '../components/DetailScreen';
import HistoryScreen from '../components/HistoryScreen';

// This is where I defined all of the routes that my app can visit
const RootNavigator = createStackNavigator(
	{
		'HOME': HomeScreen,
		'HISTORY': HistoryScreen,
		'DETAIL': DetailScreen,
	},
	{
		initialRouteName: 'HOME',
	}
);

const middleware = createReactNavigationReduxMiddleware(
	'root',
	state => state.nav
);

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
	state: state.nav,
});

// Navigator is injected into my app state tree
const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export { RootNavigator, AppNavigator, middleware };
