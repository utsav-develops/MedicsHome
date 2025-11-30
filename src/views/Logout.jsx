import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { connect } from 'react-redux';
import { f_s, regular } from '../config/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as colors from '../assets/css/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const Logout = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();


  useEffect(() => {
    AsyncStorage.clear();
    navigate();
  }, []);

  const navigate = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "CheckPhone" }],
      })
    );
  }

    const styles = StyleSheet.create({
      logo_container: {
        flex: 1
      }
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
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>Loading...</Text>
    </View>
    </>
  );
};


export default connect(null, null)(Logout);