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
import RNPickerSelect from 'react-native-picker-select';
import MapView, { Marker, ProviderPropType } from "react-native-maps";
const { width, height } = Dimensions.get("window");
const axios = require("axios");

const ASPECT_RATIO = width / height;
let items=[];


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      region: {
        latitude: 50.2813,
        longitude: 19.56503,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      },
    };
    this.inputPress = this.inputPress.bind(this);

    const myList = takeidName()    
    myList.then((response) => {
      console.log("axios success  " + JSON.stringify(response.data));
      console.log(`jestem w myList ` +response.data.length);

      for (let i = 0; i < response.data.length; i++) {
      items.push({label:response.data[i] , value: +response.data[i]})
      console.log("label"+ items[i].label + " label "+response.data[i])
      
      }
      
    });
    async function takeidName(){
      try {
        const response = await axios.get(
          `https://busmapa.ct8.pl/getAllBus.php`
        );
        return response;
      } catch (error) {
        console.log("error", error);
      }
    }    
  }


  generateMarkers2(myData) {
    const result = [];
    console.log(`jestem w generateMarkers2 `);
    for (var value in myData) {
      const lat = myData[value].lat;
      const longitude = myData[value].longitude;
      let myTime =Date.now(); //unique key as timestamp (now);
      console.log("time: "+myTime);
      const newMarker = {
        coordinate: {
          latitude: parseFloat(lat),
          longitude: parseFloat(longitude),
        },
        key: myData[value].myTime,
        title: myData[value].idName,
        description: myData[value].idIndex,
      };
      console.log(`newMarke ${JSON.stringify(newMarker)}`);
      result.push(newMarker);
    }
    return result;
  }
  inputPress(idName) {
    console.log(`jestem w input press`);
    console.log(`idName w press ${idName}`);

    async function asyncFunc(idName) {
      try {
        const response = await axios.get(
          `https://busmapa.ct8.pl/getBus.php?idName=` + idName
        );
        return response;
      } catch (error) {
        console.log("error", error);
      }
    }
    const myData = asyncFunc(idName);
    myData.then((response) => {
      console.log("axios success2  " + JSON.stringify(response.data));
      console.log(`teraz setState`);
      //...this.state.markers,
      this.setState({
        markers: [
          
          ...this.generateMarkers2(response.data),
        ],
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
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
        <View style={styles.buttonContainer2}>
          <Text style={{ padding: 10, fontSize: 20 }}>
            Identyfikator linii:{" "}
          </Text>
          <TextInput
            style={{ padding: 10, fontSize: 20 }}
            editable={true}
            selectionColor={"blue"}
            underlineColorAndroid={"gray"}
            placeholder="?"
            onSubmitEditing={(event) => {
              console.log(`idName: ${event.nativeEvent.text}`);
              this.setState({ idName: event.nativeEvent.text });
              this.setState({ markers: [] });
              this.inputPress(event.nativeEvent.text);
            }}
          ></TextInput>
         
        </View>
        <Text style={styles.buttonContainer2}>Wybierz szukaną linię: </Text>
        <View style={styles.buttonContainer2}>
        <RNPickerSelect
            placeholder={{
              label: 'wybierz...',
              value: null,
              color: 'red',
            }}
            onValueChange={(value) => this.inputPress(value)}
            items={items}
        />
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
    justifyContent: "flex-start",
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
  buttonContainer2: {
    flexDirection: "row",
    marginVertical: 5,
    backgroundColor: "white",
  },
});
