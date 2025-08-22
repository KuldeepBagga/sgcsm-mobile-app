import { useNavigation } from "expo-router";
import React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";


const BankDetailsCard = ({ logo, accountNumber, ifsc }) => (
  <View style={[styles.form, { marginTop: 20 }]}>
    <Image
      source={logo}
      style={styles.bankLogo}
    />
    {[
      ["Account Holder", "SANJAY GANDHI COMPUTER SAKSHARTA MISSION"],
      ["Account Number", accountNumber],
      ["IFSC", ifsc],
      ["Address", "Sector 10, Dwarka, New Delhi (India)"],
    ].map(([label, value], idx) => (
      <View
        key={idx}
        style={styles.tableRow}>
        <Text style={styles.tableLabel}>{label} :</Text>
        <Text style={styles.tableValue}>{value}</Text>
      </View>
    ))}
  </View>
);

export default function bankdetails() {
  const navigation = useNavigation();
  
   return (
     <SafeAreaView style={styles.safeArea}>
       <ScrollView contentContainerStyle={styles.scrollContainer}>
         <View style={styles.header}>
           <Text style={styles.title}>Bank Details</Text>
         </View>

         <BankDetailsCard
           logo={require("@/assets/images/sbi.png")}
           accountNumber="35059000934"
           ifsc="SBIN0004384"
         />

         <BankDetailsCard
           logo={require("@/assets/images/pnb.png")}
           accountNumber="4641002100000534"
           ifsc="PUNB0444700"
         />

         <View style={[styles.form, styles.qrContainer]}>
           <Image
             source={require("@/assets/images/qr.jpg")}
             style={styles.qrImage}
           />
         </View>
       </ScrollView>
     </SafeAreaView>
   );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#152d7cff",
  },
  form: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  bankLogo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  tableLabel: {
    fontWeight: "bold",
    fontSize: 12,
    width: 120,
  },
  tableValue: {
    fontSize: 12,
    flex: 1,
    fontWeight: "bold",
  },
  qrContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  qrImage: {
    width: 300,
    height:400,
    resizeMode: "contain",
  },
});
