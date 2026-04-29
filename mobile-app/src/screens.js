import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  AppText,
  Badge,
  BottomNav,
  CenteredScrollView,
  FilterPill,
  GlassCircleButton,
  LabeledInput,
  LocaleBadge,
  PageContent,
  PrimaryButton,
  ResolvedIcon,
  ScooterThumb,
  SearchBar,
  Stars,
} from "./components";
import {
  buildBookingSummary,
  EXISTING_BOOKINGS,
  formatBookingDate,
  formatUsd,
  getBookingDuration,
  getScooterById,
  getSelectedRentalDays,
  LANGUAGES,
  SCOOTERS,
  USER,
} from "./data";
import { COLORS, SHADOWS } from "./theme";

export function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#060608", justifyContent: "center", alignItems: "center", paddingHorizontal: 28 }}>
      <View style={{ position: "absolute", width: 300, height: 300, borderRadius: 999, backgroundColor: "rgba(255,215,0,0.08)" }} />
      <View style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: COLORS.gold, alignItems: "center", justifyContent: "center", marginBottom: 20, ...SHADOWS.gold }}>
        <AppText family="sora" weight="black" style={{ fontSize: 36, color: COLORS.black }}>
          S
        </AppText>
      </View>
      <AppText family="sora" weight="extrabold" style={{ fontSize: 28, color: COLORS.white, letterSpacing: -1.1, marginBottom: 6 }}>
        SCOOT <AppText family="sora" weight="regular" style={{ color: COLORS.gold }}>BALI</AppText>
      </AppText>
      <AppText family="inter" weight="medium" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 56 }}>
        Premium Scooter Rental
      </AppText>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={{ width: index === 0 ? 20 : 6, height: 6, borderRadius: 999, backgroundColor: index === 0 ? COLORS.gold : "rgba(255,255,255,0.2)" }} />
        ))}
      </View>
    </View>
  );
}

export function OnboardingScreen({ step, navigation }) {
  const insets = useSafeAreaInsets();
  const screens = [
    {
      title: "Discover\nBali's Roads",
      sub: "Premium scooters for every journey — from rice terraces to clifftop temples.",
      cta: "Continue",
      colors: ["#1A1A1A", "#080808"],
    },
    {
      title: "Book in\n3 Minutes",
      sub: "Select your dates, choose add-ons, and confirm. It's really that simple.",
      cta: "Next",
      colors: ["#141824", "#080808"],
    },
    {
      title: "Delivered\nto Your Door",
      sub: "We bring your scooter to your villa or hotel, fueled and ready to ride.",
      cta: "Get Started",
      colors: ["#1A1410", "#080808"],
    },
  ];
  const current = screens[step - 1];
  const nextRoute = step === 1 ? "onboarding-2" : step === 2 ? "onboarding-3" : "language";

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.screenBlack }}>
      <LinearGradient colors={current.colors} style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: insets.top }}>
        <AppText family="inter" weight="medium" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: 1.8 }}>
          bali photography
        </AppText>
        <LinearGradient colors={["transparent", COLORS.screenBlack]} style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120 }} />
      </LinearGradient>

      <PageContent style={{ paddingHorizontal: 28, paddingTop: 32, paddingBottom: Math.max(insets.bottom, 28) + 20 }}>
        <AppText family="sora" weight="black" style={{ color: COLORS.white, fontSize: 38, lineHeight: 40, letterSpacing: -1.7, marginBottom: 16 }}>
          {current.title}
        </AppText>
        <AppText family="inter" style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 26, marginBottom: 36 }}>
          {current.sub}
        </AppText>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 28 }}>
          {[1, 2, 3].map((index) => (
            <View key={index} style={{ flex: index === step ? 1.5 : 1, height: 4, borderRadius: 999, backgroundColor: index === step ? COLORS.gold : "rgba(255,255,255,0.15)" }} />
          ))}
        </View>
        <PrimaryButton variant="gold" onPress={() => navigation.replace(nextRoute)}>
          {current.cta} →
        </PrimaryButton>
      </PageContent>
    </View>
  );
}

export function LanguageScreen({ navigation, selectedLanguage, setSelectedLanguage }) {
  const insets = useSafeAreaInsets();

  return (
    <CenteredScrollView backgroundColor={COLORS.white}>
      <PageContent style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 24) + 16 }}>
        <View style={{ marginBottom: 36 }}>
          <AppText family="inter" weight="bold" style={{ fontSize: 11, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1.6, marginBottom: 12 }}>
            Language
          </AppText>
          <AppText family="sora" weight="extrabold" style={{ fontSize: 34, lineHeight: 38, color: COLORS.black, letterSpacing: -1.4 }}>
            Choose your{"\n"}language
          </AppText>
        </View>
        <View style={{ flex: 1, gap: 10 }}>
          {LANGUAGES.map((language) => {
            const active = selectedLanguage === language.code;
            return (
              <Pressable
                key={language.code}
                onPress={() => setSelectedLanguage(language.code)}
                style={{ paddingHorizontal: 18, paddingVertical: 16, borderRadius: 14, borderWidth: 1.5, borderColor: active ? COLORS.gold : COLORS.gray200, backgroundColor: active ? "rgba(255,215,0,0.06)" : COLORS.white, flexDirection: "row", alignItems: "center", gap: 14 }}
              >
                <LocaleBadge value={language.flag} />
                <AppText family="sora" weight="semibold" style={{ flex: 1, fontSize: 16, color: COLORS.black }}>
                  {language.label}
                </AppText>
                {active ? <Ionicons name="checkmark" size={18} color={COLORS.gold} /> : null}
              </Pressable>
            );
          })}
        </View>
        <PrimaryButton variant="dark" style={{ marginTop: 24 }} onPress={() => navigation.replace("login")}>
          Confirm
        </PrimaryButton>
      </PageContent>
    </CenteredScrollView>
  );
}

export function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState(USER.email);
  const [password, setPassword] = useState("password123");

  return (
    <CenteredScrollView backgroundColor={COLORS.white}>
      <PageContent style={{ paddingHorizontal: 28, paddingTop: insets.top + 28, paddingBottom: Math.max(insets.bottom, 24) + 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 40 }}>
          <View style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: COLORS.gold, alignItems: "center", justifyContent: "center" }}>
            <AppText family="sora" weight="black" style={{ fontSize: 14, color: COLORS.black }}>
              S
            </AppText>
          </View>
          <AppText family="sora" weight="bold" style={{ fontSize: 17, color: COLORS.black, letterSpacing: -0.5 }}>
            SCOOT <AppText family="sora" weight="regular" style={{ color: COLORS.gold }}>BALI</AppText>
          </AppText>
        </View>
        <AppText family="sora" weight="extrabold" style={{ fontSize: 32, color: COLORS.black, letterSpacing: -1.2, marginBottom: 8 }}>
          Welcome back
        </AppText>
        <AppText family="inter" style={{ fontSize: 14, color: COLORS.gray500, marginBottom: 36 }}>
          Sign in to manage your bookings
        </AppText>
        <View style={{ gap: 14, marginBottom: 20 }}>
          <LabeledInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <LabeledInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        </View>
        <Pressable style={{ alignSelf: "flex-end", marginBottom: 28 }}>
          <AppText family="inter" weight="medium" style={{ fontSize: 13, color: COLORS.black }}>
            Forgot password?
          </AppText>
        </Pressable>
        <PrimaryButton variant="dark" style={{ marginBottom: 14 }} onPress={navigation.signIn}>
          Sign In →
        </PrimaryButton>
        <PrimaryButton variant="ghost" style={{ marginBottom: 28 }}>
          Continue with Google
        </PrimaryButton>
        <AppText family="inter" style={{ textAlign: "center", fontSize: 13, color: COLORS.gray500 }}>
          No account? <AppText family="inter" weight="bold" style={{ color: COLORS.black }}>Create one →</AppText>
        </AppText>
      </PageContent>
    </CenteredScrollView>
  );
}

export function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const featured = SCOOTERS[0];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CenteredScrollView backgroundColor={COLORS.white} contentContainerStyle={{ paddingBottom: 120 + Math.max(insets.bottom, 16) }}>
        <PageContent style={{ paddingHorizontal: 20, paddingTop: insets.top + 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <AppText family="inter" style={{ fontSize: 13, color: COLORS.gray500 }}>
                  Good morning
                </AppText>
                <Ionicons name="sunny-outline" size={14} color={COLORS.goldDark} />
              </View>
              <AppText family="sora" weight="extrabold" style={{ fontSize: 22, color: COLORS.black, letterSpacing: -0.8 }}>
                {USER.name}
              </AppText>
            </View>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.gold, alignItems: "center", justifyContent: "center" }}>
              <AppText family="sora" weight="extrabold" style={{ fontSize: 16, color: COLORS.black }}>
                {USER.initials}
              </AppText>
            </View>
          </View>
          <SearchBar placeholder="Search vehicles..." value={search} onChangeText={setSearch} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 16, paddingBottom: 24 }}>
            {["All", "Scooter", "Maxi", "Motorcycle"].map((item) => (
              <FilterPill key={item} label={item} active={category === item} onPress={() => setCategory(item)} />
            ))}
          </ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <AppText family="sora" weight="bold" style={{ fontSize: 18, color: COLORS.black }}>
              Featured
            </AppText>
            <Pressable onPress={() => navigation.toTab("fleet")}>
              <AppText family="inter" weight="medium" style={{ fontSize: 13, color: COLORS.gray500 }}>
                View all →
              </AppText>
            </Pressable>
          </View>
          <View style={{ backgroundColor: COLORS.black, borderRadius: 20, overflow: "hidden", marginBottom: 20 }}>
            <ScooterThumb scooter={featured} height={160} />
            <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <AppText family="sora" weight="bold" style={{ fontSize: 17, color: COLORS.white, flex: 1, paddingRight: 12 }}>
                  {featured.name}
                </AppText>
                <Badge variant="gold">Available</Badge>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}>
                  <AppText family="sora" weight="black" style={{ fontSize: 22, color: COLORS.white }}>
                    {formatUsd(featured.priceUSD)}
                  </AppText>
                  <AppText family="inter" style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
                    /day
                  </AppText>
                </View>
                <Pressable onPress={() => navigation.openScooter(featured.id)} style={{ backgroundColor: COLORS.gold, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 }}>
                  <AppText family="inter" weight="bold" style={{ fontSize: 13, color: COLORS.black }}>
                    Book Now
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {[
              { title: "Active Booking", value: "Honda PCX 160", icon: "speedometer-outline" },
              { title: "Next Delivery", value: "Nov 12, 09:00", icon: "calendar-outline" },
            ].map((card) => (
              <Pressable key={card.title} onPress={() => navigation.toTab("bookings")} style={{ flex: 1, backgroundColor: COLORS.gray100, borderRadius: 16, padding: 16 }}>
                <ResolvedIcon icon={card.icon} size={22} color={COLORS.black} style={{ marginBottom: 8 }} />
                <AppText family="inter" style={{ fontSize: 11, color: COLORS.gray500, marginBottom: 3 }}>
                  {card.title}
                </AppText>
                <AppText family="sora" weight="bold" style={{ fontSize: 13, color: COLORS.black }}>
                  {card.value}
                </AppText>
              </Pressable>
            ))}
          </View>
        </PageContent>
      </CenteredScrollView>
      <BottomNav active="home" onChange={navigation.toTab} />
    </View>
  );
}

export function FleetScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredScooters = useMemo(
    () =>
      SCOOTERS.filter((scooter) => {
        const matchesSearch =
          !search ||
          scooter.name.toLowerCase().includes(search.toLowerCase()) ||
          scooter.engine.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
          filter === "All" ||
          (filter === "Available" && scooter.available) ||
          (filter === "Scooter" && scooter.type === "scooter") ||
          (filter === "Maxi" && scooter.type === "maxi") ||
          (filter === "Moto" && scooter.type === "moto");

        return matchesSearch && matchesFilter;
      }),
    [filter, search],
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.gray100 }}>
      <View style={{ backgroundColor: COLORS.white }}>
        <PageContent style={{ paddingHorizontal: 20, paddingTop: insets.top + 16 }}>
          <AppText family="sora" weight="extrabold" style={{ fontSize: 24, color: COLORS.black, letterSpacing: -0.8, marginBottom: 16 }}>
            Our Fleet
          </AppText>
          <SearchBar placeholder="Honda, Yamaha, Royal Enfield..." value={search} onChangeText={setSearch} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 16, paddingBottom: 16 }}>
            {["All", "Scooter", "Maxi", "Moto", "Available"].map((item) => (
              <Pressable key={item} onPress={() => setFilter(item)} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: filter === item ? COLORS.gold : COLORS.gray100, borderWidth: 1, borderColor: filter === item ? COLORS.gold : COLORS.gray200 }}>
                <AppText family="inter" weight="bold" style={{ fontSize: 12, color: filter === item ? COLORS.black : COLORS.gray700 }}>
                  {item}
                </AppText>
              </Pressable>
            ))}
          </ScrollView>
        </PageContent>
      </View>
      <CenteredScrollView backgroundColor={COLORS.gray100} contentContainerStyle={{ paddingBottom: 120 + Math.max(insets.bottom, 16) }}>
        <PageContent style={{ paddingHorizontal: 20, paddingTop: 16, gap: 14 }}>
          {filteredScooters.map((scooter) => (
            <Pressable key={scooter.id} onPress={() => navigation.openScooter(scooter.id)} style={{ backgroundColor: COLORS.white, borderRadius: 18, overflow: "hidden", ...SHADOWS.card }}>
              <ScooterThumb scooter={scooter} height={130} />
              <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <AppText family="sora" weight="bold" style={{ fontSize: 15, color: COLORS.black }}>
                      {scooter.name}
                    </AppText>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                      <Stars rating={scooter.rating} size={11} />
                      <AppText family="inter" style={{ fontSize: 11, color: COLORS.gray500 }}>
                        {scooter.reviews}
                      </AppText>
                    </View>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <AppText family="sora" weight="extrabold" style={{ fontSize: 20, color: COLORS.black }}>
                      {formatUsd(scooter.priceUSD)}
                    </AppText>
                    <AppText family="inter" style={{ fontSize: 11, color: COLORS.gray500 }}>
                      per day
                    </AppText>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                  <Badge>{scooter.engine}</Badge>
                  <Badge>{scooter.type}</Badge>
                  <Badge variant={scooter.available ? "green" : "default"} icon={scooter.available ? "checkmark-circle" : undefined}>
                    {scooter.available ? "Available" : "Booked"}
                  </Badge>
                </View>
              </View>
            </Pressable>
          ))}
        </PageContent>
      </CenteredScrollView>
      <BottomNav active="fleet" onChange={navigation.toTab} />
    </View>
  );
}

export function DetailScreen({ navigation, scooter }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <CenteredScrollView backgroundColor={COLORS.white} contentContainerStyle={{ paddingBottom: 120 + Math.max(insets.bottom, 16) }}>
        <View style={{ position: "relative" }}>
          <ScooterThumb scooter={scooter} height={260} />
          <GlassCircleButton icon="chevron-back" onPress={navigation.goBack} style={{ position: "absolute", top: insets.top + 12, left: 20 }} />
          <GlassCircleButton icon="heart-outline" onPress={() => {}} style={{ position: "absolute", top: insets.top + 12, right: 20 }} />
        </View>
        <PageContent style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <View style={{ flex: 1, paddingRight: 16 }}>
              <AppText family="sora" weight="extrabold" style={{ fontSize: 24, color: COLORS.black, letterSpacing: -1, marginBottom: 4 }}>
                {scooter.name}
              </AppText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Stars rating={scooter.rating} />
                <AppText family="inter" style={{ fontSize: 12, color: COLORS.gray500 }}>
                  {scooter.reviews} reviews
                </AppText>
              </View>
            </View>
            <View>
              <AppText family="sora" weight="black" style={{ fontSize: 28, color: COLORS.black, textAlign: "right" }}>
                {formatUsd(scooter.priceUSD)}
              </AppText>
              <AppText family="inter" style={{ fontSize: 12, color: COLORS.gray500, textAlign: "right" }}>
                /day
              </AppText>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
            <Badge variant="green" icon="checkmark-circle">Available</Badge>
            <Badge>{scooter.engine}</Badge>
            <Badge>{scooter.type}</Badge>
          </View>
          <AppText family="inter" style={{ fontSize: 14, color: COLORS.gray700, lineHeight: 24, marginBottom: 20 }}>
            {scooter.description}
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {Object.entries(scooter.specs).map(([key, value]) => (
              <View key={key} style={{ width: "47%", backgroundColor: COLORS.gray100, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
                <AppText family="inter" weight="medium" style={{ fontSize: 10, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>
                  {key}
                </AppText>
                <AppText family="sora" weight="bold" style={{ fontSize: 16, color: COLORS.black }}>
                  {value}
                </AppText>
              </View>
            ))}
          </View>
          <AppText family="sora" weight="bold" style={{ fontSize: 16, color: COLORS.black, marginBottom: 12 }}>
            Included Features
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {scooter.features.map((feature) => (
              <Badge key={feature} variant="black" style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
                {feature}
              </Badge>
            ))}
          </View>
        </PageContent>
      </CenteredScrollView>
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.96)", borderTopWidth: 1, borderTopColor: "#EBEBEB", paddingHorizontal: 20, paddingTop: 16, paddingBottom: Math.max(insets.bottom, 16) + 16 }}>
        <PageContent>
          <PrimaryButton variant="dark" onPress={navigation.startBooking}>
            Reserve — {formatUsd(scooter.priceUSD)}/day →
          </PrimaryButton>
        </PageContent>
      </View>
    </View>
  );
}

export function BookingDatesScreen({ bookingRange, navigation, setBookingRange }) {
  const insets = useSafeAreaInsets();
  const disabledUntil = 12;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const dates = Array.from({ length: 31 }, (_, index) => index + 1);
  const selectedDays = getSelectedRentalDays(bookingRange);

  const handleDatePress = (day) => {
    if (day < disabledUntil) return;
    if (!bookingRange.start || bookingRange.end > bookingRange.start) {
      setBookingRange({ start: day, end: day + 1 });
      return;
    }
    if (day <= bookingRange.start) {
      setBookingRange({ start: day, end: day + 1 });
      return;
    }
    setBookingRange({ start: bookingRange.start, end: day });
  };

  return (
    <CenteredScrollView backgroundColor={COLORS.white}>
      <PageContent style={{ paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 24) + 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <Pressable onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={20} color={COLORS.gray500} />
          </Pressable>
          <AppText family="sora" weight="bold" style={{ fontSize: 20, color: COLORS.black }}>
            Select Dates
          </AppText>
        </View>
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 28 }}>
          {["Dates", "Delivery", "Payment"].map((label, index) => (
            <View key={label} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <View style={{ width: 24, height: 24, borderRadius: 999, backgroundColor: index === 0 ? COLORS.gold : COLORS.gray200, alignItems: "center", justifyContent: "center" }}>
                <AppText family="sora" weight="extrabold" style={{ fontSize: 11, color: index === 0 ? COLORS.black : COLORS.gray500 }}>
                  {index + 1}
                </AppText>
              </View>
              <AppText family="inter" weight={index === 0 ? "bold" : "regular"} style={{ flex: 1, fontSize: 11, color: index === 0 ? COLORS.black : COLORS.gray500 }}>
                {label}
              </AppText>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <AppText family="sora" weight="bold" style={{ fontSize: 18, color: COLORS.black }}>
            November 2024
          </AppText>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Ionicons name="chevron-back" size={18} color={COLORS.gray500} />
            <Ionicons name="chevron-forward" size={18} color={COLORS.black} />
          </View>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          {days.map((day) => (
            <View key={day} style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}>
              <AppText family="inter" weight="bold" style={{ fontSize: 12, color: COLORS.gray500 }}>
                {day}
              </AppText>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={`empty-${index}`} style={{ width: "13.6%", aspectRatio: 1 }} />
          ))}
          {dates.map((day) => {
            const active = selectedDays.includes(day);
            const disabled = day < disabledUntil;
            const first = day === bookingRange.start;
            const last = day === bookingRange.end - 1;
            return (
              <Pressable key={day} onPress={() => handleDatePress(day)} style={{ width: "13.6%", aspectRatio: 1, alignItems: "center", justifyContent: "center", borderRadius: first || last ? 10 : 0, backgroundColor: active ? (first || last ? COLORS.gold : "rgba(255,215,0,0.18)") : COLORS.white }}>
                <AppText family="sora" weight={active ? "bold" : "regular"} style={{ fontSize: 14, color: disabled ? COLORS.gray300 : COLORS.black }}>
                  {day}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        <View style={{ marginTop: 24, marginBottom: 20, borderRadius: 14, backgroundColor: COLORS.gray100, padding: 16, flexDirection: "row" }}>
          {[
            { label: "Check-in", value: formatBookingDate(bookingRange.start) },
            { label: "Check-out", value: formatBookingDate(bookingRange.end) },
            { label: "Duration", value: `${getBookingDuration(bookingRange)} days` },
          ].map((item, index) => (
            <View key={item.label} style={{ flex: 1, paddingHorizontal: 8, borderRightWidth: index < 2 ? 1 : 0, borderRightColor: COLORS.gray250 }}>
              <AppText family="inter" weight="bold" style={{ fontSize: 10, color: COLORS.gray500, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>
                {item.label}
              </AppText>
              <AppText family="sora" weight="bold" style={{ fontSize: 14, color: COLORS.black }}>
                {item.value}
              </AppText>
            </View>
          ))}
        </View>
        <PrimaryButton variant="dark" onPress={navigation.continueToPayment}>
          Continue →
        </PrimaryButton>
      </PageContent>
    </CenteredScrollView>
  );
}

export function PaymentScreen({ bookingRange, navigation, scooter }) {
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState("card");
  const [cardholder, setCardholder] = useState(USER.name);
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/27");
  const [cvv, setCvv] = useState("123");
  const summary = buildBookingSummary(scooter, bookingRange);

  return (
    <CenteredScrollView backgroundColor={COLORS.white}>
      <PageContent style={{ paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: Math.max(insets.bottom, 24) + 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <Pressable onPress={navigation.goBack}>
            <Ionicons name="chevron-back" size={20} color={COLORS.gray500} />
          </Pressable>
          <AppText family="sora" weight="bold" style={{ fontSize: 20, color: COLORS.black }}>
            Payment
          </AppText>
        </View>
        <View style={{ backgroundColor: COLORS.black, borderRadius: 18, padding: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <AppText family="sora" weight="bold" style={{ fontSize: 16, color: COLORS.white }}>
              {scooter.name}
            </AppText>
            <Badge variant="gold">{summary.duration} days</Badge>
          </View>
          {[
            { label: `Rental (${summary.duration} days)`, value: formatUsd(summary.rentalCost) },
            { label: "Insurance", value: `+${formatUsd(summary.insurance)}` },
            { label: "Delivery", value: "Free" },
          ].map((row) => (
            <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <AppText family="inter" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                {row.label}
              </AppText>
              <AppText family="inter" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                {row.value}
              </AppText>
            </View>
          ))}
          <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.12)", flexDirection: "row", justifyContent: "space-between" }}>
            <AppText family="sora" weight="bold" style={{ fontSize: 16, color: COLORS.white }}>
              Total
            </AppText>
            <AppText family="sora" weight="black" style={{ fontSize: 20, color: COLORS.gold }}>
              {formatUsd(summary.total)}
            </AppText>
          </View>
        </View>
        <AppText family="sora" weight="bold" style={{ fontSize: 16, color: COLORS.black, marginBottom: 12 }}>
          Payment Method
        </AppText>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
          {[
            { key: "card", icon: "card-outline", label: "Card" },
            { key: "cash", icon: "cash-outline", label: "Cash" },
            { key: "crypto", icon: "logo-bitcoin", label: "Crypto" },
          ].map((item) => {
            const active = method === item.key;
            return (
              <Pressable key={item.key} onPress={() => setMethod(item.key)} style={{ flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: active ? COLORS.black : COLORS.gray200, backgroundColor: active ? COLORS.black : COLORS.gray100, alignItems: "center", paddingVertical: 14, gap: 4 }}>
                <Ionicons name={item.icon} size={20} color={active ? COLORS.white : COLORS.gray700} />
                <AppText family="sora" weight="bold" style={{ fontSize: 12, color: active ? COLORS.white : COLORS.gray700 }}>
                  {item.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
        {method === "card" ? (
          <View style={{ gap: 12, marginBottom: 24 }}>
            <LabeledInput label="Cardholder Name" value={cardholder} onChangeText={setCardholder} />
            <LabeledInput label="Card Number" value={cardNumber} onChangeText={setCardNumber} keyboardType="number-pad" />
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <LabeledInput label="Expiry" value={expiry} onChangeText={setExpiry} />
              </View>
              <View style={{ flex: 1 }}>
                <LabeledInput label="CVV" value={cvv} onChangeText={setCvv} keyboardType="number-pad" secureTextEntry />
              </View>
            </View>
          </View>
        ) : null}
        <PrimaryButton variant="gold" onPress={navigation.finishBooking}>
          Pay {formatUsd(summary.total)} →
        </PrimaryButton>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 10 }}>
          <Ionicons name="lock-closed-outline" size={12} color={COLORS.gray500} />
          <AppText family="inter" style={{ textAlign: "center", fontSize: 11, color: COLORS.gray500 }}>
            Secured by SSL encryption
          </AppText>
        </View>
      </PageContent>
    </CenteredScrollView>
  );
}

export function OrderConfirmedScreen({ bookingRange, navigation, scooter }) {
  const insets = useSafeAreaInsets();
  const summary = buildBookingSummary(scooter, bookingRange);

  return (
    <CenteredScrollView backgroundColor={COLORS.white}>
      <PageContent style={{ minHeight: 760, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingTop: insets.top + 40, paddingBottom: Math.max(insets.bottom, 24) + 40 }}>
        <View style={{ width: 96, height: 96, borderRadius: 999, backgroundColor: COLORS.gold, alignItems: "center", justifyContent: "center", marginBottom: 28, ...SHADOWS.gold }}>
          <Ionicons name="checkmark" size={46} color={COLORS.black} />
        </View>
        <AppText family="sora" weight="black" style={{ fontSize: 32, color: COLORS.black, letterSpacing: -1.4, textAlign: "center", marginBottom: 10 }}>
          Booking Confirmed!
        </AppText>
        <View style={{ borderRadius: 999, backgroundColor: COLORS.gray100, paddingHorizontal: 20, paddingVertical: 8, marginBottom: 20 }}>
          <AppText family="sora" weight="bold" style={{ fontSize: 14, color: COLORS.black }}>
            #SB-28491
          </AppText>
        </View>
        <AppText family="inter" style={{ textAlign: "center", fontSize: 15, lineHeight: 26, color: COLORS.gray500, marginBottom: 36 }}>
          Your {scooter.name} will be delivered to Seminyak tomorrow at 09:00. Check WhatsApp for updates.
        </AppText>
        <View style={{ width: "100%", borderRadius: 16, backgroundColor: COLORS.gray100, padding: 20, marginBottom: 28 }}>
          {[
            { label: "Vehicle", value: scooter.name },
            { label: "Duration", value: `${summary.duration} days` },
            { label: "Delivery", value: `${formatBookingDate(bookingRange.start)} · 09:00` },
            { label: "Total Paid", value: formatUsd(summary.total) },
          ].map((row) => (
            <View key={row.label} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
              <AppText family="inter" style={{ fontSize: 14, color: COLORS.gray700 }}>
                {row.label}
              </AppText>
              <AppText family="inter" weight="bold" style={{ fontSize: 14, color: COLORS.black, textAlign: "right", flexShrink: 1, paddingLeft: 12 }}>
                {row.value}
              </AppText>
            </View>
          ))}
        </View>
        <PrimaryButton variant="dark" style={{ width: "100%", marginBottom: 12 }} onPress={() => navigation.toTab("bookings")}>
          Track Delivery
        </PrimaryButton>
        <PrimaryButton variant="ghost" style={{ width: "100%" }} onPress={() => navigation.toTab("home")}>
          Back to Home
        </PrimaryButton>
      </PageContent>
    </CenteredScrollView>
  );
}

export function BookingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState("Active");

  const bookings = useMemo(() => {
    if (tab === "Upcoming") return EXISTING_BOOKINGS.filter((booking) => booking.status === "active");
    if (tab === "Completed") return EXISTING_BOOKINGS.filter((booking) => booking.status === "completed");
    return EXISTING_BOOKINGS;
  }, [tab]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.gray100 }}>
      <View style={{ backgroundColor: COLORS.white }}>
        <PageContent style={{ paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: 16 }}>
          <AppText family="sora" weight="extrabold" style={{ fontSize: 24, color: COLORS.black, letterSpacing: -0.8, marginBottom: 16 }}>
            My Bookings
          </AppText>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["Active", "Upcoming", "Completed"].map((label) => (
              <Pressable key={label} onPress={() => setTab(label)} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: tab === label ? COLORS.gold : COLORS.gray100 }}>
                <AppText family="inter" weight="bold" style={{ fontSize: 13, color: COLORS.black }}>
                  {label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </PageContent>
      </View>
      <CenteredScrollView backgroundColor={COLORS.gray100} contentContainerStyle={{ paddingBottom: 120 + Math.max(insets.bottom, 16) }}>
        <PageContent style={{ paddingHorizontal: 20, paddingTop: 16, gap: 14 }}>
          {bookings.map((booking) => {
            const scooter = getScooterById(booking.scooterId);
            const active = booking.status === "active";
            return (
              <View key={booking.id} style={{ borderRadius: 18, overflow: "hidden", backgroundColor: COLORS.white, ...SHADOWS.card }}>
                <ScooterThumb scooter={scooter} height={110} />
                <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <AppText family="sora" weight="bold" style={{ fontSize: 15, color: COLORS.black, marginBottom: 2 }}>
                        {scooter.name}
                      </AppText>
                      <AppText family="inter" style={{ fontSize: 12, color: COLORS.gray500 }}>
                        {booking.dates} · #{booking.id}
                      </AppText>
                    </View>
                    <Badge variant={active ? "green" : "default"}>{active ? "Active" : "Done"}</Badge>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <AppText family="sora" weight="extrabold" style={{ fontSize: 18, color: COLORS.black }}>
                      {formatUsd(booking.total)}
                    </AppText>
                    <Pressable onPress={() => (active ? navigation.push("confirmed") : navigation.openScooter(booking.scooterId))} style={{ borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: active ? COLORS.black : COLORS.gray100 }}>
                      <AppText family="inter" weight="bold" style={{ fontSize: 12, color: active ? COLORS.white : COLORS.black }}>
                        {active ? "Track →" : "Book Again"}
                      </AppText>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </PageContent>
      </CenteredScrollView>
      <BottomNav active="bookings" onChange={navigation.toTab} />
    </View>
  );
}

export function ProfileScreen({ language, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.gray100 }}>
      <CenteredScrollView backgroundColor={COLORS.gray100} contentContainerStyle={{ paddingBottom: 120 + Math.max(insets.bottom, 16) }}>
        <View style={{ backgroundColor: COLORS.white }}>
          <PageContent style={{ paddingHorizontal: 20, paddingTop: insets.top + 16, paddingBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <LinearGradient colors={[COLORS.gold, COLORS.goldDark]} style={{ width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", ...SHADOWS.gold }}>
                <AppText family="sora" weight="black" style={{ fontSize: 24, color: COLORS.black }}>
                  {USER.initials}
                </AppText>
              </LinearGradient>
              <View>
                <AppText family="sora" weight="bold" style={{ fontSize: 20, color: COLORS.black, marginBottom: 4 }}>
                  {USER.name}
                </AppText>
                <AppText family="inter" style={{ fontSize: 13, color: COLORS.gray500 }}>
                  {USER.email}
                </AppText>
              </View>
              <View style={{ marginLeft: "auto" }}>
                <Badge variant="gold" icon="star">{USER.membership}</Badge>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {[
                { value: "3", label: "Rentals" },
                { value: "4.9", label: "Rating" },
                { value: "Bali", label: "Location" },
              ].map((item) => (
                <View key={item.label} style={{ flex: 1, borderRadius: 12, backgroundColor: COLORS.gray100, paddingVertical: 12, paddingHorizontal: 8, alignItems: "center" }}>
                  <AppText family="sora" weight="extrabold" style={{ fontSize: 20, color: COLORS.black }}>
                    {item.value}
                  </AppText>
                  <AppText family="inter" style={{ fontSize: 11, color: COLORS.gray500, marginTop: 2 }}>
                    {item.label}
                  </AppText>
                </View>
              ))}
            </View>
          </PageContent>
        </View>
        <PageContent style={{ paddingHorizontal: 20, paddingTop: 16, gap: 10 }}>
          {[
            { icon: "document-text-outline", label: "My Bookings", action: () => navigation.toTab("bookings") },
            { icon: "document-outline", label: "Documents", action: () => {} },
            { icon: "notifications-outline", label: "Notifications", action: () => {} },
            { icon: "globe-outline", label: `Language · ${language}`, action: navigation.showLanguage },
            { icon: "shield-checkmark-outline", label: "Privacy & Security", action: () => {} },
            { icon: "help-circle-outline", label: "Help & Support", action: () => {} },
            { icon: "log-out-outline", label: "Sign Out", action: navigation.signOut, danger: true },
          ].map((item) => (
            <Pressable key={item.label} onPress={item.action} style={{ borderRadius: 14, backgroundColor: COLORS.white, paddingHorizontal: 18, paddingVertical: 16, flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Ionicons name={item.icon} size={20} color={item.danger ? COLORS.danger : COLORS.black} />
              <AppText family="inter" weight="medium" style={{ flex: 1, fontSize: 15, color: item.danger ? COLORS.danger : COLORS.black }}>
                {item.label}
              </AppText>
              {!item.danger ? <Ionicons name="chevron-forward" size={16} color={COLORS.gray300} /> : null}
            </Pressable>
          ))}
        </PageContent>
      </CenteredScrollView>
      <BottomNav active="profile" onChange={navigation.toTab} />
    </View>
  );
}
