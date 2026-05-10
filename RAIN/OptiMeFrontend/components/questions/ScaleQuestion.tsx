import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  options: readonly number[];
  selected?: number;
  onSelect: (value: number) => void;
};

export default function ScaleQuestion({ options, selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.circle, isSelected && styles.selectedCircle]}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 40,
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#163B63",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedCircle: {
    backgroundColor: "#163B63",
  },
  text: {
    color: "#163B63",
    fontWeight: "600",
  },
  selectedText: {
    color: "white",
  },
});
