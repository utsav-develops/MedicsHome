import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const PrivacyPolicies = (props) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  const go_back = () => {
    navigation.goBack();
  }

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: screenHeight,
      width: screenWidth,
      backgroundColor: colors.lite_bg
    },
    header: {
      height: 60,
      backgroundColor: colors.lite_bg,
      flexDirection: 'row',
      alignItems: 'center'
    },
  });

  return (
  <>
        <View
        style={{
          backgroundColor: colors.theme_bg,
          height: Platform.OS === 'ios' ? insets.top : null,
        }}>
        <StatusBar
          backgroundColor={colors.theme_bg}
        />
        </View>
    <SafeAreaView style={styles.container}>

      <View style={[styles.header]}>
        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
        </TouchableOpacity>
      </View>
      <ScrollView>

      </ScrollView>
    </SafeAreaView>
    </>
  );
};



export default PrivacyPolicies;