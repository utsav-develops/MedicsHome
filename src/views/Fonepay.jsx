import React, { useState,useRef,useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, base_url, success_url, failed_url, get_about, add_wallet, api_url ,esewa_failed_url, esewa_success_url, Fonepay_QR } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';


const Fonepay = (props) => {
  let dropDownAlertRef = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  const [loading, setLoading] = useState(false);
  const [on_load, setOnLoad] = useState(0);
  const [data, setData] = useState("");
  const { t } = useLocalization();

  const go_back = () => {
        navigation.goBack();
    }
    useEffect(() => {
            call_get_about();
        }, []);

        const call_get_about = () => {
            setLoading(true);
            axios({
                method: 'post',
                url: api_url + get_about,
                data: { lang: global.lang }
            })
                .then(async response => {
                    setLoading(false);
                    setData(response.data.result)
                    setOnLoad(1);
                })
                .catch(error => {
                    setLoading(false);
                    alert('Sorry something went wrong')
                });
        }

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: screenHeight,
      width: screenWidth,
      backgroundColor: 'white'
    },
    header: {
      height: 60,
      backgroundColor: colors.theme_bg,
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
          <Icon type={Icons.MaterialIcons} name="arrow-back" color='white' style={{ fontSize: 30 }} />
        </TouchableOpacity>
      </View>
       <View style={{ width: '95%', alignSelf: 'center', marginTop: 10 }}>
           <Text style={{ alignSelf: 'center', fontSize: 24, color: '#d82424', fontFamily: bold , marginBottom: 15}}>{t('ScanQR')}</Text>
           <Text style={{ textAlign: 'center', fontSize: 18, color: colors.warning, marginBottom: 10}}>{t('callWhatsapp')}</Text>
           <Text style={{ alignSelf: 'center', fontSize: 20, fontFamily: bold , color:'black', marginBottom: 10}}>{data.phone_number}</Text>
       </View>
      <View style={{ height: '60%', width: '90%', alignSelf: 'center' }}>
          <Image source={Fonepay_QR} style={{ flex: 1, height: undefined, width: undefined }} />
      </View>


    </SafeAreaView>
       </>
  );
};


  export default Fonepay;