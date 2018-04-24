import React, { Component } from 'react';
import {
  Text, View, StyleSheet, TouchableHighlight,
  StatusBar, TextInput, Platform
} from 'react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';
import haversine from 'haversine';
import { RunInfo, RunInfoNumeric } from './components/footer';


let id = 0;
class App extends Component {
  constructor(props) {
    super(props);

    let watchID = navigator.geolocation.watchPosition((position) => {
      let distance = 0;

      if (this.state.previousCoordinate) {
        distance = this.state.distance + haversine(
          this.state.previousCoordinate,
          position.coords
        );
        this.distanceInfo.setState({ value: distance });
      }

      this.speedInfo.setState({ value: position.coords.speed });

      let x = position.coords.heading;
      if ((x > 0 && x <= 23) || (x > 338 && x <= 360)) {
        this.directionInfo.setState({ value: 'N' });
      } else if (x > 23 && x <= 65) {
        this.directionInfo.setState({ value: 'NE' });
      } else if (x > 65 && x <= 110) {
        this.directionInfo.setState({ value: 'E' });
      } else if (x > 110 && x <= 155) {
        this.directionInfo.setState({ value: 'SE' });
      } else if (x > 155 && x <= 203) {
        this.directionInfo.setState({ value: 'S' });
      } else if (x > 203 && x <= 248) {
        this.directionInfo.setState({ value: 'SW' });
      } else if (x > 248 && x <= 293) {
        this.directionInfo.setState({ value: 'W' });
      } else if (x > 293 && x <= 338) {
        this.directionInfo.setState({ value: 'NW' });
      }

      this.setState({
        markers: [
          ...this.state.markers, {
            coordinate: position.coords,
            key: id++
          }
        ],
        previousCoordinate: position.coords,
        distance
      }, null, {
          enableHighAccuracy: true, timeout: 20000,
          maximumAge: 1000, distanceFilter: 10
        });
    });

    this.state = { markers: [], watchID };



    //   setInterval(() => {
    //     this.distanceInfo.setState({ value: Math.random() * 1000000 });
    //     this.speedInfo.setState({ value: Math.random() * 1500 });
    //     this.directionInfo.setState({
    //       value: this.directionInfo.state === 'N' ? 'NW' : 'N'
    //     });
    //   }, 1000);


  }

  componentWillUnmount() {
    navigator.geolocation.stopWatch(this.state.watchID);
  }

  addMarker(region) {
    let now = (new Date).getTime();
    if (this.state.ladAddedMarker > now - 2000) {
      return;
    }
    this.setState({
      markers: [
        ...this.state.markers, {
          coordinate: region,
          key: id++
        }
      ],
      ladAddedMarker: now
    })
  }
  render() {
    return (
      <View style={{
        flex: 1, marginHorizontal: 2,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : null
      }}>
        <MapView
          // mapType='hybrid'
          provider='google'
          showsUserLocation
          // followsUserLocation
          initialRegion={{
            latitude: -1.9591757,
            longitude: 30.0923519,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          // onRegionChange={(region) => { this.addMarker(region) }}
          style={styles.map}
        >

          <Polyline coordinates={this.state.markers.map((marker) => marker.coordinate)}
            strokeColor='blue'
            strokeWidth={5}
          />

          {/* {this.state.markers.map((marker) => (
            <Marker coordinate={marker.coordinate} key={marker.key} />
          ))} */}


        </MapView>
        <View style={styles.infoWrapper}>
          <RunInfoNumeric title='Distance' unit='Km'
            ref={(info) => this.distanceInfo = info}
          />
          <RunInfoNumeric title='Speed' unit='Km/h'
            ref={(info) => this.speedInfo = info}
          />
          <RunInfo title='Direction' value='NE'
            ref={(info) => this.directionInfo = info}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  infoWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
export default App;

