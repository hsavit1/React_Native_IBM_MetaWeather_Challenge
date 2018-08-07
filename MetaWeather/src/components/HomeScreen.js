import React from 'react';
import { ActivityIndicator, Platform, Button, FlatList } from 'react-native';
import {
	LoadingContainer,
	Container,
} from './StyledComponents';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { SearchBar, ListItem } from 'react-native-elements';

import { Constants, Location, Permissions } from 'expo';

import {
	COORDINATES_API_CALL_FAILURE,
	COORDINATES_API_CALL_SUCCESS,
	COORDINATES_API_CALL_REQUEST,
	CITYNAME_API_CALL_REQUEST,
	CITYNAME_API_CALL_FAILURE,
	CITYNAME_API_CALL_SUCCESS,
	FORECAST_API_CALL_REQUEST,
	FORECAST_API_CALL_FAILURE,
	FORECAST_API_CALL_SUCCESS,
	DETAIL,
	HISTORY,
	SAVE_SEARCH_WORD,
} from '../actions/actionTypes';

import Reactotron from 'reactotron-react-native';
import moment from 'moment';

const HomeScreenProps = {
	coordsFetch: PropTypes.func.isRequired,
	cityFetch: PropTypes.func.isRequired,
	forecastFetch: PropTypes.func.isRequired,
	saveSearch: PropTypes.func.isRequired,
	fetching: PropTypes.bool.isRequired,
	cities: PropTypes.array,
};

class HomeScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Weather',
			headerRight: (
				<Button
					onPress={() => navigation.state.params.oldSearches()}
					title="History"
				/>
			),
		};
	};

	constructor(props) {
		super(props);

		this.state = {
			location: null,
			errorMessage: null,
			hasError: false,
			searchText: ""
		};
	}

	componentDidMount() {
		this.props.navigation.setParams({
			oldSearches: this._oldSearches.bind(this),
		});

		if (Platform.OS === 'android' && !Constants.isDevice) {
			this.setState({
				errorMessage:
					'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
			});
		} else {
			this._getLocationAsync();
		}
	}

	componentDidCatch() {
		this.setState({ hasError: true });
	}

	_oldSearches = () => {
		this.props.historyScreen();
	};

	_getLocationAsync = async () => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION);
		if (status !== 'granted') {
			this.setState({
				errorMessage: 'Permission to access location was denied',
			});
		}

		let location = await Location.getCurrentPositionAsync({
			enableHighAccuracy: true,
		});

		this.props.coordsFetch(
			location.coords.latitude,
			location.coords.longitude
		);
	};

	onSearchBarSearch() {
		if(this.state.searchText === "") {return};

		const fixedText = this.state.searchText.replace(' ', '+');
		this.props.cityFetch(fixedText);

		this.props.saveSearch(this.state.searchText);
	}

	onListItemPress(item) {
		this.props.forecastFetch(item.woeid);
	}

	keyExtractor = (item, index) => index;

	renderItem = ({ item }) => (
		<ListItem
			title={item.title}
			subtitle={`ID: ${item.woeid}, Type: ${item.location_type}`}
			onPress={() => this.onListItemPress(item)}
		/>
	);

	render() {
		if (this.props.fetching) {
			return (
				<LoadingContainer>
					<ActivityIndicator />
				</LoadingContainer>
			);
		}

		if (this.props.error || this.state.hasError) {
			return (
				<LoadingContainer>
					ERROR FETCHING 
				</LoadingContainer>
			);
		}

		return (
			<Container>
				<SearchBar
					onEndEditing={(text) => this.onSearchBarSearch(text)}
					onChangeText={(text) => this.setState({searchText: text})}
					onClearText={() => this.setState({searchText: ""})}
					searchIcon
					clearButtonMode='while-editing'
					containerStyle={{ width: '100%' }}
					placeholder="Search for cities"
					returnKeyType='done'
				/>
				<FlatList
					keyExtractor={this.keyExtractor}
					data={this.props.cities}
					renderItem={this.renderItem}
					style={{width: '100%'}}
					/>
			</Container>
		);
	}
}

HomeScreen.propTypes = HomeScreenProps;

// These actions could really go in their own special place, but I kept them here just to show how this thing works
const forecastFetchAction = (woeid) => async dispatch => {
	dispatch(forecastFetchStartAction());

	try {
		const url = `https://www.metaweather.com/api/location/search/location/${woeid}`;
		const response = await fetch(url);
		const responseBody = await response.json();
		dispatch(forecastFetchSuccessAction(responseBody));
		dispatch(navigateToDetail())
	} catch (error) {
		console.error(error);
		dispatch(forecastFetchFailedAction());
	}
};

const forecastFetchStartAction = () => ({
	type: FORECAST_API_CALL_REQUEST,
});

const forecastFetchFailedAction = () => ({
	type: FORECAST_API_CALL_FAILURE,
});

const forecastFetchSuccessAction = response => ({
	type: FORECAST_API_CALL_SUCCESS,
	results: response,
});

const cityFetchAction = (city) => async dispatch => {
	dispatch(cityFetchStartAction());

	try {
		const url = `https://www.metaweather.com/api/location/search/?query=${city}`;
		const response = await fetch(url);
		const responseBody = await response.json();
		dispatch(cityFetchSuccessAction(responseBody));
	} catch (error) {
		console.error(error);
		dispatch(cityFetchFailedAction());
	}
};

const cityFetchStartAction = () => ({
	type: CITYNAME_API_CALL_REQUEST,
});

const cityFetchFailedAction = () => ({
	type: CITYNAME_API_CALL_FAILURE,
});

const cityFetchSuccessAction = response => ({
	type: CITYNAME_API_CALL_SUCCESS,
	results: response,
});

const coordsFetchAction = (lat, long) => async dispatch => {
	dispatch(coordsFetchStartAction());

	try {
		const url = `https://www.metaweather.com/api/location/search/?lattlong=${lat},${long}`;
		const response = await fetch(url);
		const responseBody = await response.json();
		dispatch(coordsFetchSuccessAction(responseBody));
	} catch (error) {
		console.error(error);
		dispatch(coordsFetchFailedAction());
	}
};

const coordsFetchStartAction = () => ({
	type: COORDINATES_API_CALL_REQUEST,
});

const coordsFetchFailedAction = () => ({
	type: COORDINATES_API_CALL_FAILURE,
});

const coordsFetchSuccessAction = response => ({
	type: COORDINATES_API_CALL_SUCCESS,
	results: response,
});

const navigateToDetail = () => ({
	type: DETAIL,
});

const navigateToHistory = () => ({
	type: HISTORY,
});

const saveSearchAction = (text) => ({
	type: SAVE_SEARCH_WORD,
	saveObject: {keyword: text, timestamp: moment().format('MMMM Do YYYY, h:mm:ss a') }
});

const mapStateToProps = state => ({
	fetching: state.data.fetching,
	cities: state.data.cities,
	error: state.data.error,
});

const mapDispatchToProps = dispatch => ({
	detailScreen: () => dispatch(navigateToDetail()),
	historyScreen: () => dispatch(navigateToHistory()),
	saveSearch: (text) => dispatch(saveSearchAction(text)),
	cityFetch: (city) => dispatch(cityFetchAction(city)),
	coordsFetch: (lat, long) => dispatch(coordsFetchAction(lat, long)),
	forecastFetch: (woeid) => dispatch(forecastFetchAction(woeid)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HomeScreen);
