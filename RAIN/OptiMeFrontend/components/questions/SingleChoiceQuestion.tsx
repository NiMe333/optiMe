import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  options: readonly string[];
  selected?: string;
  onSelect: (value: string) => void;
};

export default function SingleChoiceQuestion({
  options,
  selected,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.option, isSelected && styles.selectedOption]}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {option}
            </Text>

            <View style={[styles.radio, isSelected && styles.selectedRadio]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    marginTop: 34,
  },
  option: {
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "white",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: "#163B63",
  },
  text: {
    color: "#163B63",
    fontWeight: "600",
  },
  selectedText: {
    color: "white",
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#163B63",
  },
  selectedRadio: {
    borderColor: "white",
    backgroundColor: "white",
  },
});
