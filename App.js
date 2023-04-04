import * as Location from "expo-location";
import PhoneInput from "react-native-phone-number-input";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";

import call from "react-native-phone-call";

export default function App() {
  const [address, setAddress] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [isCoords, setCoords] = useState();

  const [phoneNumber, setphoneNumber] = useState("");
  const phoneInput = useRef(null);
  const [countyCode, setCountyCode] = useState("IN");

  const buttonPress = () => {
    Alert.alert(phoneNumber);
  };

  const handleCalling = () => {
    // console.log(phoneNumber)
    const args = {
      number: phoneNumber,
      prompt: true,
    };
    // Make a call
    call(args).catch(console.error);
  };

  useEffect(() => {
    const getLocationPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if ("granted" === status) {
        await setLocationPermission(true);
        let {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({});
        setCoords({ latitude, longitude });

        if (isCoords) {
          let { longitude, latitude } = isCoords;

          let regionName = await Location.reverseGeocodeAsync({
            longitude,
            latitude,
          });
          setAddress(regionName[0]);
          console.log(regionName, "nothing");
        }
      }
    };
    getLocationPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titleText}>
        EXample Make a Phone Call in ReactCallingApp
      </Text>
      <Text style={styles.titleTextsmall}>
        Current location : {JSON.stringify(isCoords)}
      </Text>
      <Text style={styles.titleTextsmall}>{address?.["subregion"]}</Text>

      <Text style={styles.titleTextsmall}>Enter Conatct Number to Call</Text>

      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneNumber}
        defaultCode={countyCode}
        layout="first"
        withShadow
        autoFocus
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.textInput}
        onChangeFormattedText={(text) => {
          setphoneNumber(text);
        }}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.buttonStyle}
        onPress={handleCalling}
      >
        <Text style={styles.buttonTextStyle}>Make a Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneContainer: {
    width: "75%",
    height: 50,
  },
  textInput: {
    paddingVertical: 0,
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  titleTextsmall: {
    marginVertical: 8,
    fontSize: 16,
  },
  buttonStyle: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "green",
  },
  buttonTextStyle: {
    color: "#fff",
    textAlign: "center",
  },
});
