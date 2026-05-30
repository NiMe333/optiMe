import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

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
  const datePickerRef = useRef<HTMLInputElement | null>(null);

  const currentPlatform = Platform.OS as string;

  const isWeb = currentPlatform === "web";
  const isIOS = currentPlatform === "ios";
  const isAndroid = currentPlatform === "android";

  const isValidDate = value instanceof Date && !isNaN(value.getTime());
  const safeDate = isValidDate ? value : new Date();

  const maxDate = new Date();

  function formatDateForDisplay(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  }

  function formatDateForInput(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function parseInputDate(value: string) {
    if (!value) {
      return null;
    }

    const [year, month, day] = value.split("-").map(Number);

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
  const inputDateValue = formatDateForInput(safeDate);
  const maxDateValue = formatDateForInput(maxDate);

  const [webDateText, setWebDateText] = useState(displayDateValue);

  useEffect(() => {
    setWebDateText(displayDateValue);
  }, [displayDateValue]);

  function handleWebTextChange(text: string) {
    setWebDateText(text);

    const selectedDate = parseDisplayDate(text);

    if (selectedDate) {
      onChange(selectedDate);
    }
  }

  function handleWebDateBlur() {
    const selectedDate = parseDisplayDate(webDateText);

    if (selectedDate) {
      setWebDateText(formatDateForDisplay(selectedDate));
      onChange(selectedDate);
      return;
    }

    setWebDateText(displayDateValue);
  }

  function openWebDatePicker() {
    const picker = datePickerRef.current;

    if (!picker) {
      return;
    }

    const pickerWithShowPicker = picker as HTMLInputElement & {
      showPicker?: () => void;
    };

    if (pickerWithShowPicker.showPicker) {
      pickerWithShowPicker.showPicker();
      return;
    }

    picker.click();
  }

  if (isWeb) {
    return (
      <View style={styles.inputWrapper}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            value={webDateText}
            placeholder="dd.mm.yyyy"
            inputMode="decimal"
            onChange={(e) => handleWebTextChange(e.currentTarget.value)}
            onBlur={handleWebDateBlur}
            style={{
              width: "100%",
              height: 45,
              paddingLeft: 20,
              paddingRight: 56,
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

          <button
            type="button"
            onClick={openWebDatePicker}
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              width: 42,
              height: 45,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <Ionicons name="calendar-outline" size={23} color="#555" />
          </button>

          <input
            ref={datePickerRef}
            type="date"
            value={inputDateValue}
            max={maxDateValue}
            onChange={(e) => {
              const selectedDate = parseInputDate(e.currentTarget.value);

              if (selectedDate) {
                onChange(selectedDate);
                setWebDateText(formatDateForDisplay(selectedDate));
              }
            }}
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              width: 42,
              height: 45,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        </div>
      </View>
    );
  }

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.inputText}>{displayDateValue}</Text>

        <Ionicons name="calendar-outline" size={22} color="#555" />
      </TouchableOpacity>

      {isIOS && showPicker ? (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={safeDate}
                mode="date"
                display="spinner"
                maximumDate={maxDate}
                themeVariant="light"
                textColor="#24364A"
                style={styles.iosPicker}
                onChange={(_, selectedDate) => {
                  if (selectedDate && !isNaN(selectedDate.getTime())) {
                    onChange(selectedDate);
                  }
                }}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {isAndroid && showPicker ? (
        <DateTimePicker
          value={safeDate}
          mode="date"
          display="default"
          maximumDate={maxDate}
          onChange={(event, selectedDate) => {
            setShowPicker(false);

            if (event.type === "dismissed") {
              return;
            }

            if (selectedDate && !isNaN(selectedDate.getTime())) {
              onChange(selectedDate);
            }
          }}
        />
      ) : null}
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
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
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

  modalHeader: {
    alignItems: "flex-end",
  },

  doneButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  doneText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#204A78",
  },

  iosPicker: {
    width: "100%",
    height: 220,
  },
});
