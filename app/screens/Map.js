import React, { Component } from 'react';
import { Location, Permissions } from 'expo';
import MapView from 'react-native-maps';
import {
  Platform, Text, View, StyleSheet, Dimensions
} from 'react-native';


import styles from '../shared-styles';
import { RunInfo, RunInfoNumeric } from '../components/footer';

let { width, height } = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.00672
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class MapScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      coords: {},
      status: 'denied',
      distanceInfo: null,
      speedInfo: null
    };
    setInterval(() => {
      this.setState({ speedInfo: Math.random() * 1000000 });
      this.setState({ distanceInfo: Math.random() * 1500 });
    }, 1000);
  }

  componentWillMount() {
    this.trackLocation();
  }

  trackLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let { coords } = await Location.getCurrentPositionAsync({});
      this.setState({ coords, status });
      // console.log(this.state)
    }
    return this.state
  };

  renderUserLocation = () => {

    const { longitude, latitude } = this.state.coords
    return (
      <MapView.Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
        title={'Your location'}
      />
    );
  }

  render() {
    const { longitude, latitude } = this.state.coords
    return (
      <View style={styles.container} >

        {this.state.coords.latitude &&
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
            {this.renderUserLocation()}
          </MapView>}

        <View style={styles.infoWrapper}>
          <RunInfoNumeric title='Distance' unit='Km'
            ref={(info) => this.state.distanceInfo = info}
          />
          <RunInfoNumeric title='Speed' unit='Km/h'
            ref={(info) => this.state.speedInfo = info}
          />
          <RunInfo title='Direction' value='NE'
            ref={(info) => this.directionInfo = info}
          />
        </View>
      </View>
    );
  }
}

export default MapScreen;

