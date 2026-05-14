import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
};

export function AuthField({ label, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#5B7A99"
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

const SNOW_WHITE = "#FFFFFF";
const ICE = "#B8D4F0";

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: ICE,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(184, 212, 240, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: SNOW_WHITE,
    fontSize: 15,
  },
});
