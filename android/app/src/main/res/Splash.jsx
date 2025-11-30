import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
  Linking,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import {
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
  api_url,
  Auth_Token,
  screenHeight,
  app_settings,
  bold,
  normal
} from "../config/Constants";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Icon, { Icons } from '../components/Icons';

import * as colors from "../assets/css/Colors";
import { connect } from 'react-redux';
import { initialLat, initialLng, initialRegion } from '../actions/BookingActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification, { Importance } from "react-native-push-notification";
import VersionNumber from 'react-native-version-number';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from '../config/useCustomTheme';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { check, request, PERMISSIONS, RESULTS, checkNotifications } from 'react-native-permissions';
import DropShadow from "react-native-drop-shadow";
import { navigationRef } from '../config/NavigationService'; // Adjust path as needed

const Splash = (props) => {
  const navigation = useNavigation();
  const app_version_code = VersionNumber.buildVersion;
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  useEffect(() => {
    check_data();

//     const medications = [
//       {
//         MedicationID: 6,
//         patient_id: 1,
//         MedicationName: 'medicine name',
//         Formulation: 'Inhalation',
//         Dosage: 'Daily',
//         Frequency: 'Daily',
//         StartDate: '2024-08-11',
//         EndDate: '2024-08-14',
//         AdministrationTime: ["16:19", "14:09", "21:08", "21:13"],
//         AdministeredBy: 4,
//         Route: 'AddMedication',
//         AdminConfirmed: 1,
//         CategoryID: 1,
//         SubCategoryID: 1,
//         Indications: 'General anaesthetics',
//         Contraindications: 'contrainidication',
//         SideEffects: 'side',
//         Interactions: 'interaction',
//         meal: 'With a Specific Beverage',
//         status: 1,
//         created_at: '2024-07-31 11:48:3'
//       }
//     ];
  }, []);


//   const scheduleRepeatingNotifications = async (times, numberOfDays) => {
//
//           await checkAndRequestAlarmPermission();
//
//            const now = new Date();
//
//           PushNotification.createChannel(
//             {
//               channelId: 'Medicine', // (required)
//               channelName: 'Medicine Notifications', // (required)
//               channelDescription: 'A channel to categorise booking notifications', // (optional)
//               soundName: 'alarm.wav', // Custom sound
//               importance: 4, // (optional)
//               vibrate: true, // (optional)
//             },
//             (created) => console.log(`createChannel returned '${created}'`) // (optional)
//           );
//
//                for (let dayOffset = 0; dayOffset < numberOfDays; dayOffset++) {
//                   const dateForDay = new Date(now);
//                   dateForDay.setDate(dateForDay.getDate() + dayOffset);
//
//                   // Loop through each time to schedule notifications
//                   times.forEach(({ hour, minute }) => {
//                     const triggerDate = new Date(dateForDay);
//                     triggerDate.setHours(hour, minute, 0, 0);
//
//                     // If the time has already passed for today, schedule for tomorrow
//                     if (triggerDate <= now) {
//                       triggerDate.setDate(triggerDate.getDate() + 1);
//                     }
//
//           PushNotification.localNotificationSchedule({
//               channelId: 'Medicine',
//               message: 'Alarm! Time to check your alert.',
//               date: triggerDate, // Schedule for 1 minute later for testing
//               soundName: 'alarm.wav', // Custom sound
//               playSound: true,
//               vibration: 300,
//               exact: true,
//                userInfo: {
//                   screen: 'MedAlert',
//                   params: {
//                     message: 'This is a test message',
//                   },
//                 },
//               });
//            });
//          }
//        };


const scheduleRepeatingNotifications = async (medications) => {
  await checkAndRequestAlarmPermission();

  // Cancel all existing notifications
  PushNotification.removeAllDeliveredNotifications();
  PushNotification.cancelAllLocalNotifications();

  // Create the notification channel
  PushNotification.createChannel(
    {
      channelId: 'Medicine',
      channelName: 'Medicine Notifications',
      channelDescription: 'A channel to categorize medication notifications',
      soundName: 'alarm.wav',
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );

  // Get current date and time
  const now = new Date();

  // Loop through each medication to schedule notifications
  medications.forEach((med) => {
    const { MedicationID, MedicationName, Frequency, StartDate, EndDate, AdministrationTime, meal } = med;

    const startDate = new Date(StartDate);
    const endDate = new Date(EndDate);
    const times = JSON.parse(AdministrationTime || '[]');

    // Loop through each time and schedule notifications if they match the current date and time
    times.forEach(time => {
      const [hour, minute] = time.split(':').map(Number);

      // Check if the current date is within the start and end date
      if (now >= startDate && now <= endDate) {
        if (Frequency === 'Daily') {
          scheduleNotification(now, hour, minute, MedicationID, MedicationName, meal);
        } else if (Frequency === 'Weekly' && now.getDay() === 0) { // Example: Sunday
          scheduleNotification(now, hour, minute, MedicationID, MedicationName, meal);
        } else if (Frequency === 'Monthly' && now.getDate() === 1) { // Example: 1st day of the month
          scheduleNotification(now, hour, minute, MedicationID, MedicationName, meal);
        }
      }
    });
  });
};
const scheduleNotification = (currentDate, hour, minute, medicationID, medicationName, meal) => {
  const triggerDate = new Date(currentDate);
  triggerDate.setHours(hour, minute, 0, 0);

  // Check if the notification time has already passed today
  if (triggerDate <= new Date()) {
    console.log(`Notification time for ${medicationName} has already passed today. Skipping.`);
    return;
  }

  // Check if a notification with the same time has already been scheduled
  PushNotification.getScheduledLocalNotifications((notifications) => {
    const alreadyScheduled = notifications.some(
      (notif) =>
        notif.userInfo &&
        notif.userInfo.params &&
        notif.userInfo.params.medicationID === medicationID &&
        notif.date.toISOString() === triggerDate.toISOString()
    );

    if (!alreadyScheduled) {
      // Log the notification details for debugging
      console.log(`Scheduling notification for: ${triggerDate.toISOString()} with message: Time to take your medication: ${medicationName}`);

      PushNotification.localNotificationSchedule({
        channelId: 'Medicine',
        message: `Time to take your medication: ${medicationName}`,
        date: triggerDate,
        soundName: 'alarm.wav',
        playSound: true,
        vibration: 300,
        exact: true,
        userInfo: {
          screen: 'MedAlert',
          params: {
            medicationID,
            medicationName,
            hour,
            minute,
            meal
          },
        },
      });
    } else {
      console.log(`Notification for ${medicationName} at ${triggerDate.toISOString()} has already been scheduled. Skipping.`);
    }
  });
};




    const checkAndRequestAlarmPermission = async () => {
              if (Platform.OS === 'android') {
                  const permission = PERMISSIONS.ANDROID.USE_EXACT_ALARM;

                  // Check current permission status
                  const result = await check(permission);
                  console.log(result);

                  if (result === RESULTS.DENIED) {
                      // Request permission if not granted
                      const requestResult = await request(permission);
                      if (requestResult === RESULTS.GRANTED) {
                          console.log('Permission granted');
                      } else if (requestResult === RESULTS.BLOCKED) {
                          // Inform the user and guide them to app settings
                          Alert.alert(
                              'Permission Blocked',
                              'The app needs permission to schedule alarms accurately. Please enable it in the app settings.',
                              [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
                          );
                      } else {
                          // Handle other cases if necessary
                          Alert.alert(
                              'Permission denied',
                              'The app cannot set alarms without the required permission.',
                              [{ text: 'OK' }]
                          );
                      }
                  } else if (result === RESULTS.GRANTED) {
                      console.log('Permission already granted');
                  }
              }
          };

  const check_data = async () => {
    if (Platform.OS == "android") {
      await requestNotificationPermission();
      configure();
      channel_create();
      call_settings();
    } else {
      call_settings();
    }
  }

  const requestNotificationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    if (result === RESULTS.GRANTED) {
      console.log("Notification permission granted");
    } else {
      console.log("Notification permission denied");
    }
  }

  const channel_create = () => {
    PushNotification.createChannel(
      {
        channelId: "taxi_booking",
        channelName: "Booking",
        channelDescription: "Taxi Booking Solution",
        playSound: true,
        soundName: "alarm.wav",
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }

  const enable_gps = async () => {
    const permission = getPermissionByPlatform('location');
    if (permission) {
      const isGranted = await checkAndRequestPermission(permission);
      if (isGranted) {
        enable_notifications();
      }
    } else {
      Alert.alert('Permission error', 'Permission type is not recognized');
    }
  };

  const enable_notifications = async () => {
      const granted = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (granted === 'granted') {
        navigate();
      } else {
        navigate();
      }
  };
    

  const checkAndRequestPermission = async (permission) => {
    try {
      const result = await check(permission);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available on this device');
          return false;
        case RESULTS.DENIED:
          console.log('Permission denied, requesting permission...');
          // const requestResult = await request(permission);
          // return requestResult === RESULTS.GRANTED;
          navigation.navigate('LocationEnable');
        case RESULTS.LIMITED:
          console.log('Permission is limited');
          return false;
        case RESULTS.GRANTED:
          console.log('Permission granted');
          return true;
        case RESULTS.BLOCKED:
          console.log('Permission is blocked and not requestable');
          navigation.navigate('LocationEnable');
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking permission: ', error);
      return false;
    }
  };

  

 const configure = () => {
   PushNotification.configure({
     onRegister: function (token) {
       global.fcm_token = token.token;
     },
     onNotification: function (notification) {
       console.log("NOTIFICATION:", notification);
       // Handle the notification click
       handleNotificationClick(notification);
       notification.finish(PushNotificationIOS.FetchResult.NoData);
     },
     onAction: function (notification) {
       console.log("ACTION:", notification.action);
       console.log("NOTIFICATION:", notification);
     },
     onRegistrationError: function (err) {
       console.error(err.message, err);
     },
     permissions: {
       alert: true,
       badge: true,
       sound: true,
     },
     popInitialNotification: true,
     requestPermissions: true,
   });
 };

 // Function to handle notification click and navigate to specific page
const handleNotificationClick = (notification) => {
  const { data } = notification;

  if (data && data.screen) {
    // Navigate to the specified screen using the navigation service
    navigationRef.current?.navigate(data.screen, data.params);
  }
};

  const call_settings = async () => {
    await axios({
      method: 'get',
      url: api_url + app_settings
    })
      .then(async response => {
        if (response.data.result.downtime_status == 1) {
          navigation.navigate('DownTime');
        } else {
          if (response.data.result.android_latest_version.version_code > app_version_code) {
            navigate_update_app('https://medics.com.np/app');
          } else {
            home(response.data.result);
          }
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

const call_emar = async () => {
        await axios({
            method: 'post',
            url: api_url + 'staff/get_all_emar',
            data: { patient_id: global.patient_id, token : Auth_Token }
        })
            .then(async response => {

                if(response.data.status == 1){
                    PushNotification.cancelAllLocalNotifications();
                    scheduleRepeatingNotifications(response.data.result);
                }
            })
            .catch(error => {
            });
    }


  const navigate_update_app = (url) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "AppUpdate", params: { url: url } }],
      })
    );
  }

  const home = async (data) => {
    global.lang = 'en';
    const id = await AsyncStorage.getItem('id');
    const role = await AsyncStorage.getItem('role');
    if(role == 'Patient'){
      const patient_id = await AsyncStorage.getItem('patient_id');
      global.patient_id = patient_id;
    }
    const first_name = await AsyncStorage.getItem('first_name');
    const profile_picture = await AsyncStorage.getItem('profile_picture');
    const phone_with_code = await AsyncStorage.getItem('phone_with_code');
    const email = await AsyncStorage.getItem('email');
    const lang = await AsyncStorage.getItem('lang');
    global.existing = await AsyncStorage.getItem("existing");
    global.stripe_key = await data.stripe_key;
    global.razorpay_key = await data.razorpay_key;
    global.paystack_public_key = await data.paystack_public_key;
    global.paystack_secret_key = await data.paystack_secret_key;
    global.flutterwave_public_key = await data.flutterwave_public_key;
    global.app_name = await data.app_name;
    global.language_status = await data.language_status;
    global.default_language = await data.default_language;
    global.polyline_status = await data.polyline_status;
    global.currency = await data.default_currency_symbol;
    global.giveaway_status = await data.giveaway_status;
    global.mode = data.mode;
    global.promo_id = 0;


    if (id !== null) {
      global.id = id;
      global.first_name = first_name;
      global.profile_picture = profile_picture;
      global.phone_with_code = phone_with_code;
      global.email = email;
      enable_gps();
    } else {
      global.id = 0;
      enable_gps();
    }
    
    if(role == 'Patient'){
      call_emar();
    }
  }
  const getPermissionByPlatform = (permissionType) => {
    if (Platform.OS === 'ios') {
      switch (permissionType) {
        case 'location':
          return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        default:
          return null;
      }
    } else if (Platform.OS === 'android') {
      switch (permissionType) {
        case 'location':
          return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        default:
          return null;
      }
    }
    return null;
  };


  const navigate = () => {
    if (global.existing == 1) {
      if (global.id > 0) {
        if(global.giveaway_status == 1){
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Advertisement" }],
            })
          );
        }
        else{
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          );
        }

      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "CheckPhone" }],
          })
        );
      }
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Intro" }],
        })
      );
    }
  }

  const styles = StyleSheet.create({
    background: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.theme_dark,
    },
    logo_container: {
      height: 196,
      width: 196,
    },
    logo: {
      height: undefined,
      width: undefined,
      flex: 1,
      borderRadius: 98
    },
    spl_text: {
      fontFamily: bold,
      fontSize: 18,
      color: colors.theme_fg_three,
      letterSpacing: 2,
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
      <View style={styles.background}>
        <Text style={{ fontSize: 55, color: colors.theme_fg_two, top: '15%' }}>M E D I C S</Text>
        <View style={{ width: '100%', aspectRatio: 1, bottom: 0, position: 'absolute' }}>
          <LottieView source={require(".././assets/json/personnels.json")} autoPlay loop />
        </View>
      </View>
    </>
  );
};

function mapStateToProps(state) {
  return {
    initial_lat: state.booking.initial_lat,
    initial_lng: state.booking.initial_lng,
    initial_region: state.booking.initial_region,
  };
}

const mapDispatchToProps = (dispatch) => ({
  initialLat: (data) => dispatch(initialLat(data)),
  initialLng: (data) => dispatch(initialLng(data)),
  initialRegion: (data) => dispatch(initialRegion(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
