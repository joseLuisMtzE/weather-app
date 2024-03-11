//  TODO:
//   - Aignar valor a iconImage de manera dinamica
//   - Crear componentes
//   - Implementar fondo con degradado
//   - Implementar un cambio de color en el fondo de forma dinamica

// ! FIX:
//    - Rvisar tema de location

import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  Image,
  StyleSheet,
  View,
  TextInput as Input,
  Text,
  PermissionsAndroid,
  FlatList,
  BackHandler,
  Alert,
  Linking,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Chip,
  FAB,
  Icon,
  IconButton,
  Searchbar,
  Snackbar,
} from "react-native-paper";
import hexToRgba from "./utilities/hexToRgba";
import { ForecastItem, WeatherElementItem } from "./components";
import * as Location from "expo-location";
import TimestampToString from "./utilities/timestampToString";
// import LinearGradient from "react-native-linear-gradient";

export default function App() {
  const { EXPO_PUBLIC_WEATHER_API_KEY, EXPO_PUBLIC_BASE_URL } = process.env;
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherElementsData, setweatherElementsData] = useState({});
  const [gradientColors, setGradientColors] = useState(["#3498db", "#1abc9c"]); // Colores por defecto

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loc, setLoc] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        Alert.alert(
          "Permisos de ubicación requeridos",
          "Por favor, concede permisos de ubicación para usar la aplicación.",
          [
            {
              text: "OK",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const forecastData = [
    {
      nameDay: "Hoy",
      iconImage: `https:${weatherData?.current.condition.icon}`,
      weatherTime: "Nublado",
      max: 20,
      min: 9,
    },
    {
      nameDay: "Mañana",
      iconImage: `https:${weatherData?.current.condition.icon}`,
      weatherTime: "Soleado",
      max: 29,
      min: 18,
    },
    {
      nameDay: "Martes",
      iconImage: `https:${weatherData?.current.condition.icon}`,
      weatherTime: "Lluvioso",
      max: 20,
      min: 16,
    },
  ];

  const setWeatherElements = (data) => {
    const {
      humidity,
      feelslike_c,
      uv,
      precip_mm,
      cloud,
      wind_kph,
      pressure_mb,
    } = data.current;
    let obj = [];
    if (data.current) {
      obj = [
        {
          id: 0,
          elementName: "Humedad",
          value: humidity,
          icon: "water-percent",
        },
        {
          id: 1,
          elementName: "Sensacion termica",
          value: feelslike_c,
          icon: "sun-thermometer",
        },
        {
          id: 2,
          elementName: "UV",
          value: uv,
          icon: "sun-wireless",
        },
        {
          id: 3,
          elementName: "Probabilidad de lluvia",
          value: precip_mm,
          icon: "weather-hail",
        },
        {
          id: 4,
          elementName: "Velocidad del viento",
          value: wind_kph,
          icon: "weather-windy",
        },
        {
          id: 5,
          elementName: "Presion barometrica",
          value: pressure_mb,
          icon: "gauge",
        },
      ];
    }
    setweatherElementsData(obj);
  };
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [fabCurrentLocation, setFabCurrentLocation] = useState(false);

  const showSnackbar = (text) => {
    setSnackbarText(text);
    setSnackbarVisible(true);
  };

  const getWheatherData = async (q) => {
    // console.log(q);
    try {
      setLoading(true);
      const response = await fetch(
        `${EXPO_PUBLIC_BASE_URL}/forecast.json?key=${EXPO_PUBLIC_WEATHER_API_KEY}&q=${q}&days=3&aqi=yes&alerts=no&lang=es`
      );
      const json = await response.json();

      if (json.error) {
        throw json.error.message;
      }

      setWeatherElements(json);
      setWeatherData(json);
    } catch (error) {
      showSnackbar(error);
      setFabCurrentLocation(false);
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = () => {
    getWheatherData(searchQuery);
    setFabCurrentLocation(true);
  };

  const searchByCurrentLocation = async () => {
    try {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      setSearchQuery("");
      getWheatherData(`${latitude},${longitude}`);
    } catch (error) {
      console.error("Error al obtener la ubicación:", error.message);
    } finally {
      setFabCurrentLocation(false);
    }
  };

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location.coords;
      getWheatherData(`${latitude},${longitude}`);
    }
  }, [location]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* <LinearGradient colors={gradientColors}> */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{
            label: "Ok",
          }}
        >
          {snackbarText}
        </Snackbar>
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Searchbar
            style={{ ...styles.searchBar, flex: 1 }}
            placeholder="Ciudad, País..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            loading={loading}
            elevation={5}
            onSubmitEditing={searchLocation}
          />
          {/* <IconButton
            icon="crosshairs-gps"
            mode="contained"
            size={24}
            onPress={() => searchByCurrentLocation()}
          /> */}
        </View>
        <FAB
          visible={fabCurrentLocation}
          icon="crosshairs-gps"
          style={styles.fab}
          onPress={() => searchByCurrentLocation()}
        />
        {loading ? (
          // <Text>Cargando....</Text>
          <></>
        ) : (
          <>
            {weatherData && (
              <>
                <Text
                  variant="displaySmall"
                  style={{
                    fontWeight: "500",
                    fontSize: 32,
                    color: "#FFF",
                    textAlign: "center",
                  }}
                >
                  {weatherData.location.name}
                </Text>
                <Text
                  variant="bodyLarge"
                  style={{ fontSize: 16, color: "#FFF" }}
                >
                  {`${weatherData.location.region}, ${weatherData.location.country}`}
                </Text>
                <View style={styles.gradesText}>
                  <Text
                    variant="displayLarge"
                    style={{ fontWeight: "500", fontSize: 96, color: "#FFF" }}
                  >
                    {weatherData.current.temp_c}
                  </Text>
                  <Text
                    variant="displayLarge"
                    style={{
                      fontWeight: "500",
                      fontSize: 24,
                      marginTop: 24,
                      color: "#FFF",
                    }}
                  >
                    C°
                  </Text>
                </View>
                <Text
                  variant="bodyLarge"
                  style={{ fontSize: 16, color: "#FFF" }}
                >
                  Max {weatherData.forecast.forecastday[0].day.maxtemp_c}° / Min
                  {weatherData.forecast.forecastday[0].day.mintemp_c}°
                </Text>

                <View style={styles.weatherImageText}>
                  <Image
                    width={32}
                    height={32}
                    source={{
                      uri: `https:${weatherData.current.condition.icon}`,
                    }}
                  />
                  <Text variant="bodyLarge" style={{ fontSize: 16 }}>
                    {weatherData.current.condition.text}
                  </Text>
                </View>
                <View
                  style={{
                    height: 216,
                  }}
                >
                  <FlatList
                    data={weatherElementsData}
                    renderItem={({ item }) => (
                      <WeatherElementItem item={item} />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: hexToRgba("#292929", 0.2),
                    width: "100%",
                    height: 140,
                    borderRadius: 8,
                    margin: 4,
                    padding: 16,
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <Text
                    variant="bodyLarge"
                    style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}
                  >
                    Pronostico de 3 dias
                  </Text>
                  <View style={{ gap: 8 }}>
                    {forecastData.map((item, i) => (
                      <ForecastItem key={i} item={item} />
                    ))}
                  </View>
                </View>
              </>
            )}
          </>
        )}
        <StatusBar style="auto" />
        {/* </LinearGradient> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: "#8AC3ED",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchBar: {
    marginBottom: 8,
    marginTop: 8,
  },
  gradesText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  weatherImageText: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
    margin: 8,
  },
  weatherElementItem: {
    text: {
      header: {
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
      },
      value: {
        fontSize: 28,
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
    },
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
