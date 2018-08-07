import React from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { LoadingContainer, Container } from './StyledComponents';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { ListItem } from 'react-native-elements';

const HistoryScreenProps = {
	fetching: PropTypes.bool.isRequired,
	savedSearches: PropTypes.array,
};

class HistoryScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Your Search History',
		};
	};

	componentDidCatch() {
		this.setState({ hasError: true });
	}

	keyExtractor = (item, index) => index;

	renderItem = ({ item }) => (
		<ListItem title={item.keyword} subtitle={`${item.timestamp}`} />
	);

	render() {
		if (this.props.fetching) {
			return (
				<LoadingContainer>
					<ActivityIndicator />
				</LoadingContainer>
			);
		}

		return (
			<Container>
				<FlatList
					keyExtractor={this.keyExtractor}
					data={this.props.savedSearches}
					renderItem={this.renderItem}
					style={{ width: '100%' }}
				/>
			</Container>
		);
	}
}

HistoryScreen.propTypes = HistoryScreenProps;

const mapStateToProps = state => ({
	fetching: state.data.fetching,
	savedSearches: state.saved.savedSearches,
});

export default connect(mapStateToProps)(HistoryScreen);
