import React from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, SHADOWS } from "./theme";

const EMOJI_IONICON_MAP = {
  "📍": "location-outline",
  "📅": "calendar-outline",
  "⏱": "time-outline",
  "🛵": "speedometer-outline",
  "✨": "sparkles-outline",
  "⚡": "flash-outline",
  "🚗": "car-sport-outline",
  "🚚": "car-outline",
  "🛡️": "shield-checkmark-outline",
  "📱": "phone-portrait-outline",
  "📋": "document-text-outline",
  "📄": "document-outline",
  "🔔": "notifications-outline",
  "💬": "chatbubble-ellipses-outline",
  "👤": "person-outline",
  "💳": "card-outline",
  "💵": "cash-outline",
  "📲": "phone-portrait-outline",
  "🔒": "lock-closed-outline",
  "📶": "wifi-outline",
  "🎒": "bag-handle-outline",
  "⛑️": "shield-checkmark-outline",
  "🪖": "shield-outline",
  "🧥": "shirt-outline",
  "🔍": "search-outline",
};

const FLAG_CODE_MAP = {
  "🇦🇺": "AU",
  "🇷🇺": "RU",
  "🇨🇳": "CN",
  "🇬🇧": "UK",
  "🇮🇩": "ID",
  "🇩🇪": "DE",
  "🇫🇷": "FR",
};

function resolveIonicon(icon) {
  if (!icon) return "ellipse-outline";
  return EMOJI_IONICON_MAP[icon] || icon;
}

function resolveFlagCode(value) {
  return FLAG_CODE_MAP[value] || String(value || "").toUpperCase().slice(0, 2) || "--";
}

function resolveFont(family, weight) {
  if (family === "sora") {
    if (weight === "regular") return FONTS.soraRegular;
    if (weight === "semibold") return FONTS.soraSemiBold;
    if (weight === "bold") return FONTS.soraBold;
    if (weight === "extrabold") return FONTS.soraExtraBold;
    return FONTS.soraBlack;
  }

  if (weight === "medium") return FONTS.interMedium;
  if (weight === "semibold") return FONTS.interSemiBold;
  if (weight === "bold") return FONTS.interBold;
  return FONTS.interRegular;
}

function resolveScooterImage(scooter) {
  return (
    scooter?.selectedImage ||
    scooter?.mainImage ||
    scooter?.main_image ||
    scooter?.image ||
    scooter?.gallery?.[0]?.image ||
    scooter?.images?.[0]?.image ||
    ""
  );
}

export function AppText({ children, family = "inter", weight = "regular", style, ...rest }) {
  return (
    <Text allowFontScaling={false} style={[{ fontFamily: resolveFont(family, weight) }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function CenteredScrollView({
  children,
  backgroundColor = COLORS.white,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
}) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={[{ flexGrow: 1, width: "100%" }, contentContainerStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </ScrollView>
  );
}

export function PageContent({ children, style }) {
  return (
    <View style={[{ width: "100%", maxWidth: 430, alignSelf: "center" }, style]}>
      {children}
    </View>
  );
}

export function PrimaryButton({ children, variant = "gold", style, textStyle, ...rest }) {
  const variants = {
    gold: { backgroundColor: COLORS.gold, color: COLORS.black },
    dark: { backgroundColor: COLORS.black, color: COLORS.white },
    ghost: { backgroundColor: COLORS.gray100, color: COLORS.black },
  };
  const current = variants[variant];

  const disabled = rest.disabled;

  return (
    <Pressable
      style={({ pressed }) => [
        {
          minHeight: 54,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          opacity: disabled ? 0.55 : pressed ? 0.88 : 1,
        },
        current,
        variant === "gold" ? SHADOWS.gold : null,
        style,
      ]}
      {...rest}
    >
      <AppText family="inter" weight="bold" style={[{ fontSize: 15, color: current.color }, textStyle]}>
        {children}
      </AppText>
    </Pressable>
  );
}

export function Badge({ children, icon, variant = "default", style }) {
  const variants = {
    default: { backgroundColor: COLORS.gray100, color: COLORS.gray700 },
    gold: { backgroundColor: COLORS.gold, color: COLORS.black },
    green: { backgroundColor: COLORS.successBg, color: COLORS.success },
    black: { backgroundColor: COLORS.black, color: COLORS.white },
  };
  const current = variants[variant] ?? variants.default;

  return (
    <View style={[{ borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4, backgroundColor: current.backgroundColor }, style]}>
      <AppText family="inter" weight="bold" style={{ color: current.color, fontSize: 10, letterSpacing: 0.7, textTransform: "uppercase" }}>
        {icon ? <Ionicons name={icon} size={10} color={current.color} /> : null}
        {icon ? " " : ""}
        {children}
      </AppText>
    </View>
  );
}

export function ResolvedIcon({ icon, size = 20, color = COLORS.black, style }) {
  return <Ionicons name={resolveIonicon(icon)} size={size} color={color} style={style} />;
}

export function LocaleBadge({ value, style, textStyle }) {
  return (
    <View style={[{ minWidth: 40, height: 28, paddingHorizontal: 8, borderRadius: 999, backgroundColor: "rgba(255,215,0,0.14)", borderWidth: 1, borderColor: "rgba(255,215,0,0.35)", alignItems: "center", justifyContent: "center" }, style]}>
      <AppText family="inter" weight="bold" style={[{ fontSize: 11, color: COLORS.black, letterSpacing: 0.8 }, textStyle]}>
        {resolveFlagCode(value)}
      </AppText>
    </View>
  );
}

export function Stars({ rating = 5, size = 12 }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 5 }, (_, index) => (
        <Ionicons
          key={index}
          name={index < Math.round(rating) ? "star" : "star-outline"}
          size={size}
          color={index < Math.round(rating) ? COLORS.gold : COLORS.gray300}
        />
      ))}
    </View>
  );
}

export function SearchBar({ placeholder, value, onChangeText }) {
  return (
    <View style={{ minHeight: 46, borderRadius: 12, backgroundColor: COLORS.gray100, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 14 }}>
      <Ionicons name="search" size={16} color={COLORS.gray500} />
      <TextInput
        allowFontScaling={false}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray500}
        style={{ flex: 1, paddingVertical: 12, color: COLORS.black, fontFamily: FONTS.interRegular, fontSize: 14 }}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

export function FilterPill({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: active ? COLORS.black : COLORS.gray100 }}>
      <AppText family="inter" weight="semibold" style={{ fontSize: 13, color: active ? COLORS.white : COLORS.gray700 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function LabeledInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType,
  placeholder,
  autoCapitalize = "sentences",
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
}) {
  return (
    <View style={style}>
      <AppText family="inter" weight="bold" style={{ fontSize: 11, color: COLORS.gray500, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 7 }}>
        {label}
      </AppText>
      <View style={{ borderRadius: 12, backgroundColor: COLORS.gray100, paddingHorizontal: 16 }}>
        <TextInput
          allowFontScaling={false}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray500}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            {
              minHeight: multiline ? 110 : 50,
              color: COLORS.black,
              fontFamily: FONTS.interRegular,
              fontSize: 15,
              textAlignVertical: multiline ? "top" : "center",
              paddingTop: multiline ? 14 : 0,
              paddingBottom: multiline ? 14 : 0,
            },
            inputStyle,
          ]}
        />
      </View>
    </View>
  );
}

export function ScooterThumb({ scooter, height = 150 }) {
  const imageUri = resolveScooterImage(scooter);

  return (
    <View style={{ height, borderRadius: 16, overflow: "hidden", backgroundColor: COLORS.black }}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} resizeMode="cover" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      ) : (
        <LinearGradient
          colors={[scooter.accent || COLORS.black, "#1A1A1A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", inset: 0 }}
        >
          {Array.from({ length: 10 }, (_, index) => (
            <View
              key={index}
              style={{
                position: "absolute",
                left: index * 30 - 40,
                top: -24,
                width: 18,
                height: height + 60,
                backgroundColor: "rgba(255,255,255,0.04)",
                transform: [{ rotate: "35deg" }],
              }}
            />
          ))}
        </LinearGradient>
      )}

      <LinearGradient
        colors={imageUri ? ["rgba(8,8,10,0.08)", "rgba(8,8,10,0.42)", "rgba(8,8,10,0.86)"] : ["rgba(0,0,0,0.04)", "rgba(0,0,0,0.18)", "rgba(0,0,0,0.52)"]}
        style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 14, justifyContent: "space-between" }}
      >
        <View style={{ alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.16)" }}>
          <AppText family="inter" weight="bold" style={{ fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: COLORS.gold }}>
            {scooter.typeLabel || scooter.type}
          </AppText>
        </View>
        <View>
          <AppText family="sora" weight="bold" style={{ fontSize: 16, color: COLORS.white, letterSpacing: -0.4 }}>
            {scooter.name}
          </AppText>
          <AppText family="inter" weight="medium" style={{ marginTop: 4, fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase", color: "rgba(255,255,255,0.72)" }}>
            {scooter.engine}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
}

export function GlassCircleButton({ icon, color = COLORS.white, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ width: 40, height: 40, borderRadius: 12, overflow: "hidden", opacity: pressed ? 0.82 : 1 }, style]}>
      <BlurView intensity={35} tint="dark" style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={20} color={color} />
      </BlurView>
    </Pressable>
  );
}

export function BottomNav({ active, onChange, labels = {} }) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { key: "home", icon: "home", inactiveIcon: "home-outline", label: labels.home || "Home" },
    { key: "fleet", icon: "search", inactiveIcon: "search-outline", label: labels.fleet || "Fleet" },
    { key: "bookings", icon: "document-text", inactiveIcon: "document-text-outline", label: labels.bookings || "Bookings" },
    { key: "profile", icon: "person", inactiveIcon: "person-outline", label: labels.profile || "Profile" },
  ];

  return (
    <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: "#EBEBEB", paddingTop: 10, paddingBottom: Math.max(insets.bottom, 16), flexDirection: "row" }}>
      {tabs.map((tab) => {
        const selected = active === tab.key;
        return (
          <Pressable key={tab.key} onPress={() => onChange(tab.key)} style={{ flex: 1, alignItems: "center", gap: 3 }}>
            <Ionicons name={selected ? tab.icon : tab.inactiveIcon} size={20} color={selected ? COLORS.black : COLORS.gray500} />
            <AppText family="inter" weight="semibold" style={{ fontSize: 10, color: selected ? COLORS.black : COLORS.gray500 }}>
              {tab.label}
            </AppText>
            <View style={{ marginTop: 2, width: 4, height: 4, borderRadius: 999, backgroundColor: selected ? COLORS.gold : "transparent" }} />
          </Pressable>
        );
      })}
    </View>
  );
}

export function LoadingBlock({ label, color = COLORS.gold }) {
  return (
    <View style={{ paddingVertical: 24, alignItems: "center", justifyContent: "center", gap: 10 }}>
      <ActivityIndicator size="small" color={color} />
      {label ? (
        <AppText family="inter" style={{ fontSize: 13, color: COLORS.gray500 }}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}
