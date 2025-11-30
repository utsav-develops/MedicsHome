import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import Icon, { Icons } from "../components/Icons";
import { useLocalization } from "../config/LocalizationContext";
import { useCustomTheme } from "../config/useCustomTheme";
import { normal, bold, f_xl, api_url, delete_document } from "../config/Constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { useNavigation, CommonActions, useRoute } from "@react-navigation/native";

const ImageView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { photoUri, imageName, id } = route.params;
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { isDarkMode, colors } = useCustomTheme();
  const [loading, setLoading] = useState(false);


  const handleBack = () => {
    navigation.goBack();
  };


  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.theme,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: colors.theme_bg,
    },
    headerTitle: {
      fontSize: f_xl,
      fontFamily: bold,
      color: "white",
      marginLeft: 15,
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.theme,
    },
    image: {
      width: "95%",
      height: "90%",
      resizeMode: "contain",
    },
    deleteButton: {
      marginTop: 20,
      padding: 10,
      alignItems: "center",
      zIndex: 1,
    },
  });

  return (
    <>
      <View
        style={{
          backgroundColor: colors.theme_bg,
          height: Platform.OS === "ios" ? insets.top : null,
        }}
      >
        <StatusBar backgroundColor={colors.theme_bg} />
      </View>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack}>
            <Icon type={Icons.MaterialIcons} name="arrow-back" color="white" style={{ fontSize: 30 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{imageName}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={{ uri: photoUri }} style={styles.image} />
        </ScrollView>
        {loading && (
          <View style={StyleSheet.absoluteFill}>
            <ActivityIndicator size="large" color={colors.theme_fg} />
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default ImageView;
