import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
   BackHandler,

} from 'react-native';
import Icon, { Icons } from '../components/Icons';
import { useLocalization } from '../config/LocalizationContext';
import { useCustomTheme } from '../config/useCustomTheme';
import { normal, regular, bold, f_xl, medicineTime, alarm, get_remind_emar, Auth_Token, api_url } from '../config/Constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Sound from 'react-native-sound';


const MedAlert = (props) => {
  const navigation = useNavigation();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  const route = useRoute();
  const med_id = route.params.med_id;
  const medicationName = route.params.medicationName;
  const hour = route.params.hour;
  const minute = route.params.minute;
  const meal = route.params.meal;
  const [medData, setMedData] = useState();





//   useEffect(() => {
//     call_med();
// //     playAlarmSound();
//   }, []);
//
//     const call_med = async () => {
//         await axios({
//             method: 'post',
//             url: api_url + get_remind_emar,
//             data: { MedicationID: med_id, token : Auth_Token }
//         })
//             .then(async response => {
//                 setMedData(response.data.result);
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }

    const playAlarmSound = () => {
        const alarmSound = new Sound('alarm.wav', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('Failed to load sound', error);
                return;
            }
            alarmSound.setVolume(1); // Set volume to maximum
            alarmSound.play((success) => {
                if (success) {
                    console.log('Successfully played sound');
                } else {
                    console.log('Playback failed');
                }
            });
        });
    };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.dismiss();
  };
   const handleExitApp = () => {
    navigation.navigate('Splash')
    BackHandler.exitApp(); // Exits the app
    };


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    width: '48%',
    height:50,
    borderRadius: 10,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
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
          backgroundColor='white'
           barStyle="dark-content"
        />
        </View>
    <SafeAreaView style={styles.safeArea}>
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 60 }}>
            <Text style={{ fontSize: 36, color: '#095D7E', fontFamily: normal }}>{medicationName}</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 20, alignSelf: 'center', backgroundColor: '#095D7E', borderRadius: 20 }}>
            <Text style={{ fontSize: 18, color: 'white', fontFamily: normal }}>{meal}</Text>
        </View>

            <View style={{ height: '100%', width: '100%', position:'absolute', alignSelf:'center', }}>
                <LottieView source={alarm} autoPlay loop />
            </View>

        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', padding: 10, marginTop: 20 }}>
            <Text style={{ fontSize: 32, color: '#095D7E', fontFamily: bold }}>{hour}:{minute}</Text>
        </View>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: 20, position: 'absolute', bottom: 30 }}>
           <TouchableOpacity onPress = {handleExitApp} style={[styles.button,{ backgroundColor: '#FF0000' }]}>
                <Icon type={Icons.FontAwesome} name="warning" size={18} color="white"/>
                <Text style={{ fontSize: 18, color: 'white', fontFamily: normal, paddingVertical: 7 }}>Missed</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={handleExitApp} style={[styles.button,{ backgroundColor: '#4BBE2E' }]}>
                <Icon type={Icons.MaterialIcons} name="done-all" size={28} color="white"/>
                <Text style={{ fontSize: 18, color: 'white', fontFamily: normal, paddingVertical: 7 }}>Done</Text>
           </TouchableOpacity>
        </View>
    </SafeAreaView>
    </>
  );
};

export default MedAlert;
