import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Login from "../components/Login";
import Register from "../components/Register";

const WelcomeScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <Login setIsLogin={setIsLogin} />
      ) : (
        <Register setIsLogin={setIsLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});

export default WelcomeScreen;
