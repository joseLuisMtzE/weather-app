import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";

function index({ item: { nameDay, iconImage, weatherTime, max, min } }) {
  return (
    <View
      key={nameDay}
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Text style={{ ...styles.text, flex: 1 }}>{nameDay} </Text>
      <View
        style={{
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
          alignSelf: "center",
          flex: 0.6,
        }}
      >
        <Image
          width={20}
          height={20}
          source={{
            uri: iconImage,
          }}
        />
        <Text
          style={{
            ...styles.text,
            textAlign: "right",
          }}
        >
          {weatherTime}
        </Text>
      </View>
      <Text
        style={{
          ...styles.text,
          flex: 1,
          textAlign: "right",
        }}
      >
        {max}°/{min}°
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default index;
