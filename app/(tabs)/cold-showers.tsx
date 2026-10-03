import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import type { IColdShowerEntry } from "@/core/interfaces";
import { Colors } from "@/constants/colors";
import {
  useGetColdShowersQuery,
  useGetColdShowerStatsQuery,
  useLogColdShowerMutation,
  useRemoveColdShowerMutation,
} from "@/core/api";

LocaleConfig.locales.fr = {
  monthNames: [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
  ],
  monthNamesShort: [
    "Janv", "Févr", "Mars", "Avr", "Mai", "Juin",
    "Juil", "Août", "Sept", "Oct", "Nov", "Déc",
  ],
  dayNames: [
    "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
  ],
  dayNamesShort: ["D", "L", "M", "M", "J", "V", "S"],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

const FLOATING_TAB_BAR_PAD = 96;

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;
const SHEET_SPRING = { damping: 20, stiffness: 200, mass: 0.6 };

const FEELINGS = [
  { value: 1, emoji: "🥶", label: "Très dur" },
  { value: 2, emoji: "😖", label: "Dur" },
  { value: 3, emoji: "😐", label: "Correct" },
  { value: 4, emoji: "🙂", label: "Bien" },
  { value: 5, emoji: "🔥", label: "Excellent" },
];

function monthBounds(anchor: string) {
  const [year, month] = anchor.split("-").map(Number);
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return {
    from: `${anchor}-01`,
    to: `${anchor}-${String(last).padStart(2, "0")}`,
  };
}

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ColdShowers() {
  const insets = useSafeAreaInsets();
  const [anchor, setAnchor] = useState(() => todayKey().slice(0, 7));
  const [selected, setSelected] = useState<string | null>(null);
  const sheetY = useSharedValue(0);
  const [feeling, setFeeling] = useState(3);
  const [notes, setNotes] = useState("");

  const { from, to } = useMemo(() => monthBounds(anchor), [anchor]);

  const { data: stats, isLoading: isLoadingStats } =
    useGetColdShowerStatsQuery();
  const { data: entries, isLoading: isLoadingEntries } = useGetColdShowersQuery({
    from,
    to,
  });

  const [logColdShower, { isLoading: isSaving }] = useLogColdShowerMutation();
  const [removeColdShower, { isLoading: isRemoving }] =
    useRemoveColdShowerMutation();

  const byDate = useMemo(() => {
    const map = new Map<string, IColdShowerEntry>();
    (entries ?? []).forEach((entry) => {
      map.set(entry.date.slice(0, 10), entry);
    });
    return map;
  }, [entries]);

  const marked = useMemo(() => {
    const result: Record<string, object> = {};

    byDate.forEach((_entry, key) => {
      result[key] = {
        customStyles: {
          container: { backgroundColor: Colors.navyAccent, borderRadius: 8 },
          text: { color: Colors.snow, fontWeight: "700" },
        },
      };
    });

    return result;
  }, [byDate]);

  const existing = selected ? byDate.get(selected) : undefined;

  const closeSheet = useCallback(() => {
    setSelected(null);
  }, []);

  const dragToDismiss = Gesture.Pan()
    .onBegin(() => {
      runOnJS(Keyboard.dismiss)();
    })
    .onUpdate((event) => {
      sheetY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationY > DISMISS_DISTANCE ||
        event.velocityY > DISMISS_VELOCITY;

      if (shouldClose) {
        sheetY.value = withTiming(600, { duration: 180 }, (finished) => {
          if (finished) runOnJS(closeSheet)();
        });
        return;
      }

      sheetY.value = withSpring(0, SHEET_SPRING);
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  const openDay = (day: string) => {
    if (day > todayKey()) {
      Alert.alert(
        "Journée à venir",
        "Tu ne peux valider qu'une journée déjà passée.",
      );
      return;
    }

    const entry = byDate.get(day);
    sheetY.value = 0;
    setSelected(day);
    setFeeling(entry?.feeling ?? 3);
    setNotes(entry?.notes ?? "");
  };

  const closeDay = closeSheet;

  const handleSave = async () => {
    if (!selected) return;

    try {
      await logColdShower({
        date: selected,
        feeling,
        notes: notes.trim() || undefined,
      }).unwrap();
      closeDay();
    } catch {
      Alert.alert("Enregistrement impossible", "Réessaie dans un instant.");
    }
  };

  const handleRemove = async () => {
    if (!selected) return;

    try {
      await removeColdShower(selected).unwrap();
      closeDay();
    } catch {
      Alert.alert("Suppression impossible", "Réessaie dans un instant.");
    }
  };

  if (isLoadingStats || isLoadingEntries) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.navyAccent} />
      </SafeAreaView>
    );
  }

  const busy = isSaving || isRemoving;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: FLOATING_TAB_BAR_PAD + Math.max(insets.bottom, 14) },
        ]}
      >
        <ScreenHeader eyebrow="RITUEL" title="Mes douches froides" />

        <View style={styles.statRow}>
          <StatBlock value={stats?.currentStreak ?? 0} label="jours d'affilée" />
          <StatBlock value={stats?.longestStreak ?? 0} label="record" />
          <StatBlock value={stats?.total ?? 0} label="au total" />
        </View>

        {!stats?.loggedToday && (
          <Pressable
            style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
            onPress={() => openDay(todayKey())}
          >
            <Text style={styles.ctaText}>VALIDER MA DOUCHE DU JOUR</Text>
          </Pressable>
        )}

        <View style={styles.calendarCard}>
          <Calendar
            current={`${anchor}-01`}
            markingType="custom"
            markedDates={marked}
            maxDate={todayKey()}
            firstDay={1}
            onDayPress={(day) => openDay(day.dateString)}
            onMonthChange={(month) =>
              setAnchor(month.dateString.slice(0, 7))
            }
            theme={{
              calendarBackground: Colors.surface,
              monthTextColor: Colors.navyAccent,
              textMonthFontWeight: "700",
              arrowColor: Colors.navyAccent,
              dayTextColor: Colors.navyAccent,
              textDisabledColor: Colors.iceBorder,
              todayTextColor: Colors.danger,
              textSectionTitleColor: Colors.mutedSoft,
            }}
          />
        </View>

        <Text style={styles.hint}>
          Touche un jour pour enregistrer ta douche et ton ressenti.
        </Text>
      </ScrollView>

      <Modal
        visible={selected !== null}
        transparent
        animationType="slide"
        onRequestClose={closeDay}
      >
        <GestureHandlerRootView style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={closeDay} />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Animated.View style={[styles.sheet, sheetStyle]}>
              <GestureDetector gesture={dragToDismiss}>
                <View style={styles.sheetHandleZone}>
                  <View style={styles.grabber} />

                  <Text style={styles.sheetTitle}>
                    {selected === todayKey()
                      ? "Aujourd'hui"
                      : selected?.split("-").reverse().join("/")}
                  </Text>
                </View>
              </GestureDetector>

              <Text style={styles.sheetLabel}>Comment c&apos;était ?</Text>
              <View style={styles.feelingRow}>
                {FEELINGS.map((option) => {
                  const active = feeling === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      style={[styles.feeling, active && styles.feelingActive]}
                      onPress={() => setFeeling(option.value)}
                    >
                      <Text style={styles.feelingEmoji}>{option.emoji}</Text>
                      <Text
                        style={[
                          styles.feelingLabel,
                          active && styles.feelingLabelActive,
                        ]}
                        numberOfLines={1}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.sheetLabel}>Une note ?</Text>
              <TextInput
                style={styles.notes}
                value={notes}
                onChangeText={setNotes}
                placeholder="Durée, température, ressenti…"
                placeholderTextColor={Colors.mutedSoft}
                multiline
                maxLength={500}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.save,
                  busy && styles.disabled,
                  pressed && styles.pressed,
                ]}
                onPress={handleSave}
                disabled={busy}
              >
                {isSaving ? (
                  <ActivityIndicator color={Colors.snow} />
                ) : (
                  <Text style={styles.saveText}>
                    {existing ? "METTRE À JOUR" : "VALIDER CETTE JOURNÉE"}
                  </Text>
                )}
              </Pressable>

              {existing && (
                <Pressable
                  style={styles.remove}
                  onPress={handleRemove}
                  disabled={busy}
                  hitSlop={8}
                >
                  <Text style={styles.removeText}>Retirer cette journée</Text>
                </Pressable>
              )}
            </Animated.View>
          </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.appBg },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.appBg,
  },
  content: { padding: 24 },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },

  statRow: { flexDirection: "row", gap: 10, marginTop: -8 },
  statBlock: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  statValue: {
    color: Colors.navyAccent,
    fontSize: 26,
    fontWeight: "800",
  },
  statLabel: {
    color: Colors.mutedDark,
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },

  cta: {
    marginTop: 18,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.navyAccent,
    alignItems: "center",
  },
  ctaText: {
    color: Colors.snow,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },

  calendarCard: {
    marginTop: 18,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  hint: {
    color: Colors.mutedSoft,
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 14,
  },

  modalRoot: { flex: 1, justifyContent: "flex-end" },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  sheetHandleZone: { paddingBottom: 4 },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.iceBorder,
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetTitle: {
    color: Colors.navyAccent,
    fontSize: 22,
    fontWeight: "300",
    fontStyle: "italic",
    marginBottom: 14,
  },
  sheetLabel: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  feelingRow: { flexDirection: "row", gap: 6, marginBottom: 20 },
  feeling: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 3,
  },
  feelingActive: {
    borderColor: Colors.navyAccent,
    backgroundColor: Colors.iceLight,
  },
  feelingEmoji: { fontSize: 20 },
  feelingLabel: { color: Colors.mutedSoft, fontSize: 9 },
  feelingLabelActive: { color: Colors.navyAccent, fontWeight: "700" },

  notes: {
    backgroundColor: Colors.iceLight,
    borderRadius: 12,
    padding: 14,
    minHeight: 72,
    color: Colors.navyAccent,
    fontSize: 14,
    textAlignVertical: "top",
    marginBottom: 20,
  },

  save: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.navyAccent,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  saveText: {
    color: Colors.snow,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
  remove: { marginTop: 14, alignItems: "center" },
  removeText: { color: Colors.danger, fontSize: 13 },
});
