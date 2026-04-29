import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from "@expo-google-fonts/inter";
import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
  Sora_900Black,
  useFonts as useSoraFonts,
} from "@expo-google-fonts/sora";
import { COLORS } from "./src/theme";
import { getScooterById } from "./src/data";
import {
  SplashScreen,
  OnboardingScreen,
  LanguageScreen,
  LoginScreen,
  HomeScreen,
  FleetScreen,
  DetailScreen,
  BookingDatesScreen,
  PaymentScreen,
  OrderConfirmedScreen,
  BookingsScreen,
  ProfileScreen,
} from "./src/screens";

const DARK_ROUTES = new Set(["splash", "onboarding-1", "onboarding-2", "onboarding-3"]);

function replaceTop(stack, route) {
  if (!stack.length) {
    return [route];
  }

  return [...stack.slice(0, -1), route];
}

export default function App() {
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [soraLoaded] = useSoraFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
    Sora_900Black,
  });
  const [stack, setStack] = useState([{ name: "splash" }]);
  const [language, setLanguage] = useState("EN");
  const [selectedScooterId, setSelectedScooterId] = useState(2);
  const [bookingRange, setBookingRange] = useState({ start: 12, end: 15 });

  const route = stack[stack.length - 1];
  const scooter = useMemo(() => getScooterById(selectedScooterId), [selectedScooterId]);

  const navigation = useMemo(
    () => ({
      push: (name, params = {}) => setStack((current) => [...current, { name, params }]),
      replace: (name, params = {}) =>
        setStack((current) => replaceTop(current, { name, params })),
      goBack: () =>
        setStack((current) => (current.length > 1 ? current.slice(0, -1) : current)),
      toTab: (name) => setStack([{ name }]),
      signIn: () => setStack([{ name: "home" }]),
      signOut: () => setStack([{ name: "login" }]),
      openScooter: (id) => {
        setSelectedScooterId(id);
        setStack((current) => [...current, { name: "detail" }]);
      },
      startBooking: () => setStack((current) => [...current, { name: "booking-dates" }]),
      continueToPayment: () => setStack((current) => [...current, { name: "payment" }]),
      finishBooking: () => setStack((current) => [...current, { name: "confirmed" }]),
      showLanguage: () => setStack((current) => [...current, { name: "language" }]),
    }),
    [],
  );

  useEffect(() => {
    if (route.name !== "splash") {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      navigation.replace("onboarding-1");
    }, 1400);

    return () => clearTimeout(timeoutId);
  }, [navigation, route.name]);

  if (!interLoaded || !soraLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.black }} />;
  }

  let screen = null;

  switch (route.name) {
    case "splash":
      screen = <SplashScreen />;
      break;
    case "onboarding-1":
      screen = <OnboardingScreen step={1} navigation={navigation} />;
      break;
    case "onboarding-2":
      screen = <OnboardingScreen step={2} navigation={navigation} />;
      break;
    case "onboarding-3":
      screen = <OnboardingScreen step={3} navigation={navigation} />;
      break;
    case "language":
      screen = (
        <LanguageScreen
          navigation={navigation}
          selectedLanguage={language}
          setSelectedLanguage={setLanguage}
        />
      );
      break;
    case "login":
      screen = <LoginScreen navigation={navigation} />;
      break;
    case "home":
      screen = <HomeScreen navigation={navigation} />;
      break;
    case "fleet":
      screen = <FleetScreen navigation={navigation} />;
      break;
    case "detail":
      screen = <DetailScreen navigation={navigation} scooter={scooter} />;
      break;
    case "booking-dates":
      screen = (
        <BookingDatesScreen
          bookingRange={bookingRange}
          setBookingRange={setBookingRange}
          navigation={navigation}
        />
      );
      break;
    case "payment":
      screen = (
        <PaymentScreen
          bookingRange={bookingRange}
          navigation={navigation}
          scooter={scooter}
        />
      );
      break;
    case "confirmed":
      screen = (
        <OrderConfirmedScreen
          bookingRange={bookingRange}
          navigation={navigation}
          scooter={scooter}
        />
      );
      break;
    case "bookings":
      screen = <BookingsScreen navigation={navigation} />;
      break;
    case "profile":
      screen = <ProfileScreen language={language} navigation={navigation} />;
      break;
    default:
      screen = <HomeScreen navigation={navigation} />;
      break;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={DARK_ROUTES.has(route.name) ? "light" : "dark"} />
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>{screen}</View>
    </SafeAreaProvider>
  );
}
