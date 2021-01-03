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
      markers: [],
      region: {
        latitude: 50.2813,
        longitude: 19.56503,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
    };
    this.onMapPress = this.onMapPress.bind(this);
    this.inputPress = this.inputPress.bind(this);
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
    for (var value in this.state.markers) {
      console.log(
        "Index in array: " + value + " = " + this.state.markers[value]
      );
    }
    return result;
  }
  generateMarkers2(myData) {
    const result = [];
    let { id, lat, longitude, s, idName, idIndex } = myData;
    console.log(`jestem w generateMarkers2 `);

    for (var value in myData) {
      // console.log(`jestem w for `);
      // console.log("Index in array: " + value + " = " + myData[value].id);
      // console.log("Index in array: " + value + " = " + myData[value].lat);
      // console.log("Index in array: " + value + " = " + myData[value].longitude);
      // console.log("Index in array: " + value + " = " + myData[value].s);
      // console.log("Index in array: " + value + " = " + myData[value].idName);
      // console.log("Index in array: " + value + " = " + myData[value].idIndex);
      const lat = myData[value].lat;
      const longitude = myData[value].longitude;

      const newMarker = {
        coordinate: {
          latitude: parseFloat(lat),
          longitude: parseFloat(longitude),
        },
        key: myData[value].id,
        title: myData[value].idName,
        description: myData[value].idIndex,
      };
      console.log(`newMarke ${JSON.stringify(newMarker)}`);
      result.push(newMarker);
    }

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
  inputPress() {
    console.log(`jestem w input press`);
    axios
      .get(
        `https://busmapa.ct8.pl/getBus.php?idName=` +
          this.state.idName +
          `&idIndex=` +
          this.state.idIndex
      )
      .then((result) => {
        console.log("axios success '\n' " + JSON.stringify(result.data));
        const myData = result.data;

        console.log(`teraz setState`);
        this.setState({
          markers: [...this.state.markers, ...this.generateMarkers2(myData)],
        });

        console.log(`wyświetla markers`);
        for (var value in this.state.markers) {
          console.log(
            "Index in array: " + value + " = " + this.state.markers[value]
          );
        }
      })
      .catch((err) => {
        console.log("axios failed " + err);
      });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          onPress={this.onMapPress}
        >
          {this.state.markers.map((marker) => (
            <Marker
              title={marker.title}
              description={marker.description}
              key={marker.key}
              coordinate={marker.coordinate}
            />
          ))}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.inputPress()}
            style={styles.bubble}
          >
            <Text>zapytanie do bazy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.setState({ markers: [] })}
            style={styles.bubble}
          >
            <Text>usuń</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    marginVertical: 20,
    backgroundColor: "white",
  },
});
