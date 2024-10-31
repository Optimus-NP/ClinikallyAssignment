import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface CountdownTimerProps {
  initialSeconds: number; // Duration in seconds
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer); // Stop the timer when it reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hours ${minutes} mins left for same day delivery`;
  };

  return (
    <View style={styles.container}>
      {secondsLeft > 0 && ( // Show message only if secondsLeft > 0
        <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  timerText: {
    fontSize: 32,
    marginBottom: 20,
  },
});

export default CountdownTimer;
