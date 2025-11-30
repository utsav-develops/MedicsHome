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
  TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { bold, regular, api_url, get_kyc, btn_loader, update_kyc, f_xl, f_xs, f_m } from '../config/Constants';
import axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';
import { CheckBox } from '@rneui/themed';
import LottieView from 'lottie-react-native';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const Language = (props) => {
  const navigation = useNavigation();
  const {setLocale, t } = useLocalization();
  const data = [
      { lang: t('english'), id: 'en' },
      { lang: t('nepali'), id: 'ne' },
      // Add more objects as needed
    ];
  const [checkedId, setCheckedId] = useState(null);
   const [selectedLanguage, setSelectedLanguage] = React.useState(data[0].id);


  let dropDownAlertRef = useRef();

  const go_back = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      <View style={[styles.header]}>
        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
        </TouchableOpacity>
        <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontWeight: 'bold' }}>Change Language</Text>
        </View>
      </View>
     <FlatList
           data={data}
           renderItem={({ item }) => (
             <CheckBox
               checked={item.id === selectedLanguage}
               onPress={() => {
                 setSelectedLanguage(item.id);
                 console.log(item.id);
                 setLocale(item.id); // Update the app's language
               }}
               title={item.lang}
               checkedColor="blue"
               checkedIcon="dot-circle-o"
               uncheckedIcon="circle-o"
             />
           )}
           keyExtractor={item => item.id}
         />

        <View style={{ margin: 40 }} />

    </SafeAreaView>
  );
};

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
    fontweight: regular,
    height: 60,
    backgroundColor: colors.text_container_bg,
    width: '100%'
  },
});

export default Language;