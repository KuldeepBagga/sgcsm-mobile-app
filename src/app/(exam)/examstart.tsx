import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const questions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    correctAns: "Delhi",
  },
  {
    question: "React Native is based on?",
    options: ["Flutter", "Swift", "React", "Angular"],
    correctAns: "React",
  },
  {
    question: "Which is the largest planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAns: "Jupiter",
  },
];

export default function ExamStart() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

  // Global exam timer
  useEffect(() => {
    if (timeLeft === 0) {
      finishExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (option) => {
    if (option === questions[currentQ].correctAns) {
      setScore((prev) => prev + 1);
    }
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    alert(`Quiz Finished! Your score: ${score}/${questions.length}`);
  };

  // Format time (HH:MM:SS)
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Time Left: {formatTime(timeLeft)}
      </Text>

      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        {questions[currentQ].question}
      </Text>

      {questions[currentQ].options.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={{
            backgroundColor: "#ddd",
            padding: 10,
            marginVertical: 5,
            borderRadius: 5,
          }}
          onPress={() => handleAnswer(option)}>
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  timer: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  question: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  option: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  optionText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
