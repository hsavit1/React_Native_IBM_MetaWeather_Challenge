import React from 'react';
import { ActivityIndicator, FlatList, Image } from 'react-native';
import { LoadingContainer, Container } from './StyledComponents';

import styled from 'styled-components';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ListItem = styled.View`
	flex: 1;
	height: 80;
	justify-content: space-around;
	align-items: center;
	background-color: white;
	flex-direction: row;
`;

const HighTemp = styled.Text`
	color: black;
	font-size: 20;
`;

const LowTemp = styled.Text`
	color: blue;
	font-size: 20;
`;

const Date = styled.Text`
	color: black;
	font-size: 20;
`;

const DetailScreenProps = {
	fetching: PropTypes.bool.isRequired,
	currentCity: PropTypes.object,
};

class DetailScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Forecast',
		};
	};

	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidCatch() {
		this.setState({ hasError: true });
	}

	keyExtractor = (item, index) => index;

	renderItem = ({ item }) => (
		<ListItem>
			<Date>{item.applicable_date}</Date>
			<Image
				source={{
					uri: `https://www.metaweather.com/static/img/weather/png/${
						item.weather_state_abbr
					}.png`,
				}}
				style={{ width: 48, height: 48 }}
			/>
			<HighTemp>{Math.round(item.max_temp * 1.8 + 32)}</HighTemp>
			<LowTemp>{Math.round(item.min_temp * 1.8 + 32)}</LowTemp>
		</ListItem>
	);

	render() {
		if (this.props.fetching || !this.props.currentCity) {
			return (
				<LoadingContainer>
					<ActivityIndicator />
				</LoadingContainer>
			);
		}

		if (this.props.error || this.state.hasError) {
			return <LoadingContainer>ERROR</LoadingContainer>;
		}

		return (
			<Container>
				<FlatList
					keyExtractor={this.keyExtractor}
					data={this.props.currentCity.consolidated_weather}
					renderItem={this.renderItem}
					style={{ width: '100%' }}
				/>
			</Container>
		);
	}
}

DetailScreen.propTypes = DetailScreenProps;

const mapStateToProps = state => ({
	fetching: state.data.fetching,
	currentCity: state.data.currentCity,
	error: state.data.error,
});

export default connect(mapStateToProps)(DetailScreen);
