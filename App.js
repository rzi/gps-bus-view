import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";

import MapView, { Marker, ProviderPropType } from "react-native-maps";
const { width, height } = Dimensions.get("window");
const axios = require("axios");
let id = 0;
const ASPECT_RATIO = width / height;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [
        {
          key: 1,
          coordinate: { latitude: 50.2813, longitude: 19.56503 },
          title: " Marker m1",
          description: "Opis marker1 ",
        },
      ],
      region: {
        latitude: 50.2813,
        longitude: 19.56503,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
    };
    this.onMapPress = this.onMapPress.bind(this);
  }

  generateMarkers(fromCoordinate) {
    const result = [];
    const { latitude, longitude } = fromCoordinate;

    const newMarker = {
      coordinate: {
        latitude: latitude + 0.001,
        longitude: longitude + 0.001,
      },
      key: `key${id++}`,
    };
    result.push(newMarker);

    return result;
  }

  onMapPress(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        ...this.generateMarkers(e.nativeEvent.coordinate),
      ],
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          onPress={this.onMapPress}
        >
          {this.state.markers.map((marker) => (
            <Marker
              title={marker.key}
              key={marker.key}
              coordinate={marker.coordinate}
            />
          ))}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => this.setState({ markers: [] })}>
            <Text>Tap to create 100 markers</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => onMapPress(50.2893, 19.56593)}>
            <Text>Tap a marker</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

App.propTypes = {
  provider: ProviderPropType,
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 100,
    alignItems: "stretch",
  },
  button: {
    width: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 40,
    backgroundColor: "white",
  },
});
