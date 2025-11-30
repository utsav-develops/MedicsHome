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
import { screenHeight, screenWidth, gift, gift2, gift3, gift4, gift5 } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import LottieView from 'lottie-react-native';


const Advertisement = (props) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { t } = useLocalization();

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: screenHeight,
      width: screenWidth,
      backgroundColor: '#7F1624',
      flexDirection: 'column',
      alignItems: 'center',
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
          backgroundColor='#7F1624'
        />
        </View>
         <SafeAreaView style={styles.container}>
{/*            <Text style={{ color: '#F7F3F0', fontSize:36, marginTop:'5%' }}>M E D I C S</Text> */}
{/*            <Text style={{ color: '#F7F3F0', fontSize:18, marginTop:'2%' }}>Share app and start winning now!</Text> */}

           <View style={{ backgroundColor: '#F7F3F0', marginTop:'30%', height:'75%', width: '95%', borderRadius: 20 }}>
           <View style={{ width:800, height:500, alignSelf: 'center', position:'absolute', bottom: 0 }}>
           <LottieView source={gift} autoPlay loop />
           </View>
            <LottieView source={gift5} autoPlay loop />
            <View style={{ bottom:10, width: '100%', alignItems: 'center', position:'absolute' }}>
             <TouchableOpacity onPress = {()=>navigation.navigate('Referrals')}style={{ width: 160, backgroundColor: '#7F1624', padding:10, alignItems: 'center', borderRadius: 10 }}>
             <Text style={{ color: '#F7F3F0', fontSize:18 }}>Learn More</Text>
             </TouchableOpacity>
            </View>
           </View>
           <View style={{ marginTop:'5%', width: '95%', position: 'absolute', bottom:10 }}>
            <TouchableOpacity onPress = {()=>navigation.navigate('Home') } style={{ bottom:20, position:'absolute', alignSelf:'center', alignItems: 'center',}}>
            <Text style={{ color: '#F7F3F0', fontSize:14,}}>Skip ››</Text>
            </TouchableOpacity>
           </View>
           <View style={{ width: '95%', aspectRatio: 1, position: 'absolute', alignSelf: 'center', top:-60 }}>
           <Image style={{ flex:1, height: undefined, width: undefined}} source={require(".././assets/img/giveaway.png")} />
           </View>
         </SafeAreaView>
       </>
  );
};


  export default Advertisement;