import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type AuthInputDatePickerProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};

export default function AuthInputDatePicker({
  label,
  value,
  onChange,
}: AuthInputDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const isValidDate = value instanceof Date && !isNaN(value.getTime());
  const safeDate = isValidDate ? value : new Date();

  const maxDate = new Date();

  function formatDateForDisplay(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  function parseDisplayDate(value: string) {
    const cleanedValue = value.trim();

    const match = cleanedValue.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);

    if (!match) {
      return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    const parsedDate = new Date(year, month - 1, day);

    const isValid =
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day;

    if (!isValid) {
      return null;
    }

    if (parsedDate > maxDate) {
      return null;
    }

    return parsedDate;
  }

  const displayDateValue = formatDateForDisplay(safeDate);

  const [webDateText, setWebDateText] = useState(displayDateValue);

  useEffect(() => {
    setWebDateText(displayDateValue);
  }, [displayDateValue]);

  function handleWebDateBlur() {
    const selectedDate = parseDisplayDate(webDateText);

    if (selectedDate) {
      onChange(selectedDate);
      setWebDateText(formatDateForDisplay(selectedDate));
      return;
    }

    setWebDateText(displayDateValue);
  }

  if (Platform.OS === "web") {
    return (
      <View style={styles.inputWrapper}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>

        <input
          type="text"
          value={webDateText}
          placeholder="dd.mm.yyyy"
          inputMode="numeric"
          onChange={(e) => {
            setWebDateText(e.currentTarget.value);
          }}
          onBlur={handleWebDateBlur}
          style={{
            width: "100%",
            height: 45,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 32,
            border: "1.5px solid #8B8B8B",
            fontSize: 18,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            color: "#555",
            backgroundColor: "#FFFFFF",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.inputText}>{displayDateValue}</Text>
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.doneText}>Close</Text>
              </TouchableOpacity>

              <DateTimePicker
                value={safeDate}
                mode="date"
                display="spinner"
                maximumDate={maxDate}
                onChange={(_, selectedDate) => {
                  if (selectedDate && !isNaN(selectedDate.getTime())) {
                    onChange(selectedDate);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={safeDate}
          mode="date"
          display="calendar"
          maximumDate={maxDate}
          onChange={(_, selectedDate) => {
            setShowPicker(false);

            if (selectedDate && !isNaN(selectedDate.getTime())) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: "relative",
    marginBottom: 28,
  },

  labelContainer: {
    position: "absolute",
    top: -12,
    left: 22,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    zIndex: 2,
    borderRadius: 5,
  },

  label: {
    fontSize: 18,
    fontWeight: "800",
    color: "#6B6B6B",
  },

  input: {
    height: 45,
    borderWidth: 1.5,
    borderColor: "#8B8B8B",
    borderRadius: 32,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  inputText: {
    fontSize: 18,
    color: "#555",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },

  doneButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  doneText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#204A78",
  },
});
