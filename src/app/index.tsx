import AntDesign from "@expo/vector-icons/AntDesign";
import constants from "expo-constants";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const statusBarHeight = constants.statusBarHeight;
SplashScreen.preventAutoHideAsync();

const index = () => {
  const [loaded, error] = useFonts({
    DMSerifText: require("@/assets/fonts/DMSerifText-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.topHeaderBar}>
          <Image
            source={require("@/assets/images/app-logo.png")}
            style={{
              width: 120,
              height: 120,
            }}
          />
          <Text
            style={{
              fontSize: 22,
              color: "green",
              fontFamily: "DMSerifText",
            }}>
            No. 1 Education Brand In India
          </Text>
          <Text
            style={{
              fontSize: 22,
              color: "orange",
              fontWeight: "bold",
            }}>
            www.sgcsmindia.org
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.navigate("/(center)/login")}>
              <AntDesign
                name="team"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>CENTER LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => router.navigate("/(student)/login")}>
              <AntDesign
                name="user"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>STUDENT LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => router.navigate("/centerverification")}>
              <AntDesign
                name="checkcircleo"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>CENTER VERIFICATION</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => router.navigate("/(exam)/login")}>
              <AntDesign
                name="clockcircleo"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>EXAM LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.navigate("/bankdetails")}>
              <AntDesign
                name="link"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>BANK DETAILS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.navigate("/result")}>
              <AntDesign
                name="notification"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>ONLINE RESULT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => alert("comming soon")}>
              <AntDesign
                name="book"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>E-BOOKS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.navigate("/certificateverification")}>
              <AntDesign
                name="infocirlceo"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>CERTIFICATE VERIFICATION</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => alert("comming soon")}>
              <AntDesign
                name="videocamera"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>LIVE CLASSES</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.navigate("/franchiseform")}>
              <AntDesign
                name="paperclip"
                size={40}
                color="#152d7cff"
              />
              <Text style={styles.cardText}>FRANCHISE ONLINE FORM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  topHeaderBar: {
    backgroundColor: "#fff6a654",
    paddingTop: statusBarHeight + 10,
    paddingBottom: 10, // or 0 to fully remove extra space
    alignItems: "center",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    borderStyle: "solid",
  },
  card: {
    width: "48%",
    backgroundColor: "#d1d7f854",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    borderColor: "#8791c954",
    borderWidth: 1,
    borderStyle: "solid",
  },
  cardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
});
