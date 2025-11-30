import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { useCustomTheme } from '../config/useCustomTheme';
import { normal, bold } from '../config/Constants';

const Downtime = () => {
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:colors.theme_dark,
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: bold,
      color: '#ffffff',
      marginVertical: 20,
    },
    message: {
      position:'absolute',
      bottom:50,
      fontSize: 16,
      color: colors.theme_fg_two,
      textAlign: 'center',
      marginHorizontal: 20,
      fontFamily: normal
    },
    loader: {
      marginTop: 30,
    },
  });

  return (
    <View style={styles.container}>
      <LottieView source={require(".././assets/json/app_update.json")} autoPlay loop />

      <Text style={styles.message}>
        Our servers are currently undergoing maintenance to improve your experience. Please check back later.
      </Text>
    </View>
  );
};



export default Downtime;
