//Fixed
import React, { useState, useEffect, useRef, useContext  } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  Switch
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, regular, api_url, get_kyc, btn_loader, update_kyc, f_xl, f_xs, f_m, f_l } from '../config/Constants';
import axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';
import { CheckBox } from '@rneui/themed';
import LottieView from 'lottie-react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../config/ThemeContext';
import { lightTheme as lightColors, darkTheme as darkColors } from '../assets/css/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Language = (props) => {
  const navigation = useNavigation();
   const {locale, setLocale, t } = useLocalization();
  const data = [
      { lang: t('english'), id: 'en' },
      { lang: t('nepali'), id: 'ne' },
      // Add more objects as needed
    ];
  const [checkedId, setCheckedId] = useState(null);
     const [selectedLanguage, setSelectedLanguage] = React.useState(locale);

    const toggleLanguage = () => {
      const newLanguage = selectedLanguage === 'en' ? 'ne' : 'en'; // Toggle between English and Nepali
      setSelectedLanguage(newLanguage);
      setLocale(newLanguage); // Update the app's language
    };

    const { colors, toggleTheme } = useTheme();
       const [isDarkMode, setIsDarkMode] = useState(false);

       const toggleSwitch = async () => {
         try {
           const newMode = !isDarkMode;
           setIsDarkMode(newMode);
           await AsyncStorage.setItem('themeMode', newMode ? 'dark' : 'light');
           toggleTheme(); // Toggle the theme in the context
         } catch (error) {
           console.error('Error toggling theme mode:', error);
         }
       };
       useEffect(() => {
         const fetchThemeMode = async () => {
           try {
             const storedMode = await AsyncStorage.getItem('themeMode');
             if (storedMode) {
               setIsDarkMode(storedMode === 'dark');
             }
           } catch (error) {
             console.error('Error fetching theme mode:', error);
           }
         };

         fetchThemeMode();
       }, []);

    let dropDownAlertRef = useRef();

    const go_back = () => {
      navigation.goBack();
    }
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    header: {
      height: 60,
      backgroundColor: colors.theme_bg,
      flexDirection: 'row',
      alignItems: 'center'
  },
    textinput: {
      fontSize: f_m,
      color: colors.grey,
      fontFamily: regular,
      height: 60,
      backgroundColor: colors.text_container_bg,
      width: '100%'
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
    <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>

      <View style={[styles.header]}>
        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('Setting')}</Text>
        </View>
      </View>

    <View style={{backgroundColor: colors.theme_bg_three, marginTop: 15, padding: 10, borderRadius: 12, width:'95%', alignSelf: 'center'}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, justifyContent: 'space-between'}}>
          <Text style={{ marginRight: 10, fontSize:f_l,color: colors.theme_fg_two, fontFamily: regular }}>{t('darkTheme')}</Text>
          <Switch value={isDarkMode} trackColor={{ false: "#767577", true: "#bcbcbc" }}   onValueChange={toggleSwitch} />
        </View>
    </View>

    <View style={{backgroundColor: colors.theme_bg_three, marginTop: 10, padding: 10, borderRadius: 12, width:'95%', alignSelf: 'center'}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, justifyContent: 'space-between' }}>
                 <Text style={{ marginRight: 10,fontSize:f_l,color: colors.theme_fg_two, fontFamily: regular  }}>{t('nepali')}</Text>
                 <Switch value={selectedLanguage === 'ne'} trackColor={{ false: "#767577", true: "#bcbcbc" }} onValueChange={toggleLanguage} />
               </View>
    </View>


        <View style={{ margin: 40 }} />

    </SafeAreaView>
    </>
  );
};


export default Language;