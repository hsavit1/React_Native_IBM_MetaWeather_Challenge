import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { connect } from 'react-redux';

class DetailViewTitle extends Component {
	render() {
		return (
			<View
				style={{
					height: 64,
					backgroundColor: '#FFFFFF',
					alignItems: 'center',
					justifyContent: 'center',
					paddingTop: 20,
				}}
			>
				<Text
					style={{
						color: '#000000',
						fontSize: 17,
						fontWeight: 'bold',
					}}
				>
					{this.props.currentCity.title}
				</Text>
			</View>
		);
	}
}

const mapStateToProps = state => ({
	fetching: state.data.fetching,
	currentCity: state.data.currentCity,
	error: state.data.error,
});

export default connect(mapStateToProps)(DetailViewTitle);
