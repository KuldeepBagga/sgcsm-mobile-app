import AntDesign from '@expo/vector-icons/AntDesign';
import { Stack, useNavigation } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

const StudentLayout = () => {
  return (
    <Stack screenOptions={{ animation: "slide_from_bottom" }}>
      <Stack.Screen
        name="login"
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#f4f4f4",
          },
          presentation: "modal",
          headerLeft: () => {
            const navigation = useNavigation();
            return (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{ paddingHorizontal: 10 }}>
                <AntDesign
                  name="close"
                  size={24}
                  color="#000"
                />
              </Pressable>
            );
          },
        }}
      />
    </Stack>
  );
}

export default StudentLayout;