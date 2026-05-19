import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { Alpha, Colors } from "@/constants/colors";

type Props = TextInputProps & {
  label: string;
};

export function AuthField({ label, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={Colors.muted}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: Colors.ice,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  input: {
    backgroundColor: Alpha.white06,
    borderWidth: 1,
    borderColor: Alpha.iceBorder20,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.snow,
    fontSize: 15,
  },
});
