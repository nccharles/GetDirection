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

const locOptions = {
  enableHighAccuracy: true,
  distanceInterval: 3
}
class MapScreen extends Component {

  state = {
    coords: {}
  }

  logData = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      await Location.setApiKey('AIzaSyDQBSAVxZozG5WDEj8nbZbtAxXJUFQUOzI');
      await Location.watchPositionAsync(
        locOptions,
        (coords) => this.setState(coords)
      );
    }
    return;
  }

  componentWillUnmount() {
    Location.watchHeadingAsync().remove()
  }

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
    this.logData();
    console.log(this.state.coords)
    const { longitude, latitude } = this.state.coords
    return (
      <View style={styles.container} >

        {
          latitude &&
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
          </MapView>
        }
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