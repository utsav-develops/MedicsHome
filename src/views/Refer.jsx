import React  from "react";
import {
  StyleSheet,
  View
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { screenHeight, screenWidth } from '../config/Constants';
import { useCustomTheme } from  '../config/useCustomTheme';

const Refer = (props) => {
const { isDarkMode, toggleTheme, colors } = useCustomTheme();

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
    width: screenWidth,
  },
 });

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      
    </View>
  );
};



export default Refer;