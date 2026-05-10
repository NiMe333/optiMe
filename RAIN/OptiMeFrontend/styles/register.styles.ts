import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    flexDirection: "row",
  },

  cardMobile: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },

  form: {
    flex: 1,
    paddingHorizontal: 80,
    justifyContent: "center",
  },

  formMobile: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 30,
    paddingTop: 32,
    paddingBottom: 28,
    justifyContent: "flex-start",
  },

  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 60,
    paddingBottom: 100,
  },

  logo: {
    width: 500,
    height: 500,
    alignSelf: "center",
  },

  mobileLogo: {
    width: 190,
    height: 145,
    alignSelf: "center",
    marginBottom: 8,
  },

  webLogo: {
    width: 600,
    height: 520,
    alignSelf: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#333",
    marginBottom: 38,
  },

  titleMobile: {
    fontSize: 42,
    fontWeight: "700",
    color: "#24364A",
    textAlign: "left",
    marginBottom: 34,
  },

  inputWrapper: {
    position: "relative",
    marginBottom: 24,
  },

  label: {
    position: "absolute",
    top: -12,
    left: 38,
    backgroundColor: "#F4EDE9",
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#777",
    zIndex: 2,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#9A9A9A",
    borderRadius: 28,
    paddingHorizontal: 36,
    fontSize: 15,
    color: "#24364A",
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#204A78",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },

  signupText: {
    color: "#B3AAA5",
    fontSize: 13,
    fontWeight: "500",
  },

  signupLink: {
    color: "#24364A",
    fontSize: 13,
    fontWeight: "800",
  },
});
