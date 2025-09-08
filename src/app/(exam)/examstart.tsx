import axiosClient from "@/axios";
import { useExamAuth } from "@/src/context/ExamAuthContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExamStart() {
  const router = useRouter();
  const { user, logout, loading } = useExamAuth();
  const [timeLeft, setTimeLeft] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getExamQuestions = async () => {
      const userId = user.userId;

      if (!user || !userId || user.userType !== "exam") {
        //await logout();
        router.push("/(exam)/login");
        return null;
      }

      const timeLeft = await SecureStore.getItemAsync("timeLeft");

      if (timeLeft) {
        setTimeLeft(Number(timeLeft * 60));
      } else {
        Alert.alert("Exam time is over now");
        router.push("/(exam)/dashboard");
      }

      try {
        const res = await axiosClient.get("exam/start");
        if (res.status === 200) {
          setQuestions(res.data.data);
        }
      } catch (err) {
        if (err.response.status === 401) {
          await logout();
          //router.push("/(exam)/login");
        }
        if (err.response.status === 404) {
          Alert.alert("Exam is not set");
          router.push("/(exam)/dashboard");
        }
      } finally {
        setIsLoading(false);
      }
    };
    getExamQuestions();
  }, []);

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

  const finishExam = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.post(
        "exam/result",
        {
          userId: user.userId,
          total_questions: questions.length,
          correct_ans: score,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200 && res.data.status) {
        Alert.alert("Success", res.data.message);
        router.replace("/(exam)/dashboard");
      }
    } catch (err) {
      if (err.response.status === 404) {
        Alert.alert("Success", "Something went wrong");
      }

      if (err.response.status === 401) {
        await logout();
        //router.push("/(exam)/login");
      }
    } finally {
      setIsLoading(false);
    }
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

  if (loading || isLoading) {
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Time Left: {formatTime(timeLeft)}
      </Text>

      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        {questions[currentQ]?.question}
      </Text>

      {questions[currentQ]?.options.map((option, idx) => (
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
