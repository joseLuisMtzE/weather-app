import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-paper";
import hexToRgba from "../../utilities/hexToRgba";

function index({ item: { elementName, value, icon } }) {
  return (
    <View
      style={{
        backgroundColor: hexToRgba("#292929", 0.2),
        width: 100,
        height: 100,
        borderRadius: 8,
        margin: 4,
        padding: 8,
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <View style={styles.weatherElementItem.headerContainer}>
        <Icon source={icon} size={20} color="#FFF" />

        <Text variant="bodyLarge" style={styles.weatherElementItem.text.header}>
          {elementName}
        </Text>
      </View>
      <Text variant="bodyLarge" style={styles.weatherElementItem.text.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  weatherElementItem: {
    text: {
      header: {
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
      },
      value: {
        fontSize: 24,
        color: "#fff",
        fontWeight: "600",
      },
    },
    headerContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: -3,
    },
  },
});

export default index;
