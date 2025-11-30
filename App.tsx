import React, { useEffect, useRef, useState } from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View, Image, StatusBar,} from 'react-native'
import Icon, { Icons } from './src/components/Icons';
import * as colors from './src/assets/css/Colors';
import * as Animatable from 'react-native-animatable';
import Language from './src/views/Language';
import {enableLatestRenderer} from 'react-native-maps';
import { screenWidth, bold, normal, regular, logo, img_url,home_icon, faq_icon, call_icon, policies_icon, about_us_icon, logout_icon, admin_icon, settings_icon, user_icon } from './src/config/Constants';
import { connect } from 'react-redux';
import Dialog from "react-native-dialog";
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';


/* Screens */
import Splash from './src/views/Splash';
import LocationEnable from './src/views/LocationEnable';
import Intro from './src/views/Intro';
import Forgot from './src/views/Forgot';
import Dashboard from './src/views/Dashboard';
import Faq from './src/views/Faq';

import Subscription from './src/views/Subscription';
import MyBookings from './src/views/MyBookings';
import Wallet from './src/views/Wallet';
import Profile from './src/views/Profile';
import Notifications from './src/views/Notifications';
import WorkDetails from './src/views/WorkDetails';
import CheckPhone from './src/views/CheckPhone';
import CheckPerson from './src/views/CheckPerson';
import Password from './src/views/Password';
import OTP from './src/views/OTP';
import CreateName from './src/views/CreateName';
import CreateEmail from './src/views/CreateEmail';
import CreatePassword from './src/views/CreatePassword';
import ResetPassword from './src/views/ResetPassword';
import Bill from './src/views/Bill';
import PaymentMethod from './src/views/PaymentMethod';
import WriteRating from './src/views/WriteRating';
import PrivacyPolicies from './src/views/PrivacyPolicies';
import AboutUs from './src/views/AboutUs';
import Refer from './src/views/Refer';
import Referrals from './src/views/Referrals';
import Terms from './src/views/Terms';
import ComplaintCategory from './src/views/ComplaintCategory';
import ComplaintSubCategory from './src/views/ComplaintSubCategory';
import Logout from './src/views/Logout';
import FaqDetails from './src/views/FaqDetails';
import Promo from './src/views/Promo';
import EditFirstName from './src/views/EditFirstName';
import EditLastName from './src/views/EditLastName';
import EditEmail from './src/views/EditEmail';
import Rating from './src/views/Rating';
import ImageView from './src/views/ImageView';
import NotificationDetails from './src/views/NotificationDetails';
import RepeatTimes from './src/views/RepeatTimes';
import Translations from './src/config/Translations';
import Esewa from './src/views/Esewa';
import UploadCitizenship from './src/views/UploadCitizenship';
import { LocalizationProvider } from './src/config/LocalizationContext';
import { useLocalization } from './src/config/LocalizationContext';

import { ThemeProvider } from './src/config/ThemeContext';
import { useCustomTheme } from  './src/config/useCustomTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RemotePushController from './src/config/RemotePushController';

import { navigationRef } from './src/config/NavigationService'; // Adjust path as needed


import Paypal from './src/views/Paypal';
import CreateComplaint from './src/views/CreateComplaint';
import Chat from './src/views/Chat';
import AdminChat from './src/views/AdminChat';
import ScrollTest from './src/views/ScrollTest';
import AppUpdate from './src/views/AppUpdate';
import temp from './src/views/temp';
import Advertisement from './src/views/Advertisement';
import AddPatient from './src/views/AddPatient';
import SelectPatient from './src/views/SelectPatient';
import eMAR from './src/views/eMAR';
import MedicationDetails from './src/views/MedicationDetails';
import AddMedication from './src/views/AddMedication';
import EditMedication from './src/views/EditMedication';
import AddRecord from './src/views/AddRecord';
import Items from './src/views/Items';



import AddressVerify from './src/views/AddressVerify';
import DocumentUpload from './src/views/DocumentUpload';
import EditPhoneNumber from './src/views/EditPhoneNumber';
import BookingProcess from './src/views/BookingProcess';
import Fonepay from './src/views/Fonepay';
import Charts from './src/views/Charts';
import DetailScreen from './src/views/DetailScreen';
import MedAlert from './src/views/MedAlert';



const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();





function CustomDrawerContent(props) {
  const navigation = useNavigation();
   const { t } = useLocalization();
   const [dialog_visible, setDialogVisible] = useState(false);
   const { isDarkMode, toggleTheme, colors } = useCustomTheme();

  const showDialog = () => {
    setDialogVisible(true);
  }

  const closeDialog = () => {
    setDialogVisible(false);
  }

  const handleCancel = () => {
    setDialogVisible(false)
  }

  const handleLogout = async () => {
    closeDialog();
    navigation.navigate('Logout');
  }

  const [wallet, setWallet] = useState(0);






  return (
    <DrawerContentScrollView {...props}>

      <View style={{ padding:10,  alignItems:'flex-start', backgroundColor: colors.theme_dark }}>
        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Dashboard') }} style={{ paddingRight:10, alignItems:'flex-end', width:'100%' }}>
          <Icon type={Icons.MaterialIcons} name="close" color={colors.icon_inactive_color} style={{ fontSize:30 }} />
        </TouchableOpacity>


        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center' }}>
    <View style={{ width: '40%', alignItems: 'center' }}>
      <View style={{ width: 100, height: 100 }}>
        {global.profile_picture == null ?
            <Image style={{ width: '100%', height: '100%', borderRadius: 25 }} source={user_icon}/>
        :
          <Image style={{ width: '100%', height: '100%', borderRadius: 25 }} source={{ uri: global.profile_picture }} />
          }
      </View>
    </View>
    <View style={{ width: '60%' }}>
      <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 20, fontWeight: normal }}>{t('hello')},</Text>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 30, fontWeight: bold, letterSpacing: 1 }}>
            {global.first_name}
          </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ alignSelf: 'flex-start', backgroundColor: colors.medics_blue, borderRadius:10, padding:5,  marginTop: 5  }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon type={Icons.MaterialIcons} name="edit" size={20} color={'white'} style={{ marginRight: 5 }} />
        <Text style={{ fontSize: 16, fontWeight: normal, color: 'white' }}>{t('editProfile')}</Text>
      </View>
    </TouchableOpacity>
  </View>
</View>

        {global.patient_id != null?

        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Charts') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.FontAwesome5} name="diagnoses" color={colors.text_grey} style={{ fontSize:30 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('healthRecords')}</Text>
            <View style={{ margin:3 }} />
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('patientcondition')}</Text>
          </View>
        </TouchableOpacity>

        :

        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('AddPatient') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.FontAwesome5} name="diagnoses" color={colors.text_grey} style={{ fontSize:30 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('healthRecords')}</Text>
            <View style={{ margin:3 }} />
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('patientcondition')}</Text>
          </View>
        </TouchableOpacity>
        }

         {global.patient_id != null?

                <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('eMAR') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
                  <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
                    <Icon type={Icons.FontAwesome5} name="pills" color={colors.text_grey} style={{ fontSize:30 }} />
                  </View>
                  <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('MyMedicines')}</Text>
                    <View style={{ margin:3 }} />
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('myMedStatus')}</Text>
                  </View>
                </TouchableOpacity>

                :

                <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('SelectPatient') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
                  <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
                    <Icon type={Icons.FontAwesome5} name="pills" color={colors.text_grey} style={{ fontSize:30 }} />
                  </View>
                  <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('MyMedicines')}</Text>
                    <View style={{ margin:3 }} />
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('myMedStatus')}</Text>
                  </View>
                </TouchableOpacity>

                }


        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('MyBookings') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.MaterialIcons} name="calendar-month" color={colors.text_grey} style={{ fontSize:30 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('booking')}</Text>
            <View style={{ margin:3 }} />
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('histories')}, {t('invoice')}, {t('complaints')}</Text>
          </View>
        </TouchableOpacity>
        {/*<TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Subscription') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.MaterialIcons} name="card-membership" color={colors.text_grey} style={{ fontSize:25 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:18, fontWeight:regular }}>Subscription</Text>
            <View style={{ margin:3 }} />
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>Buy subscription for your free bookings</Text>
          </View>
        </TouchableOpacity>*/}

        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Wallet') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.MaterialIcons} name="wallet" color={colors.text_grey} style={{ fontSize:30 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('wallet')}</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('transactions')}, {t('topups')}</Text>

          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Notifications') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.MaterialIcons} name="notifications" color={colors.text_grey} style={{ fontSize:30 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('notifications')}</Text>
          </View>
        </TouchableOpacity>

        {/*<TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Refer') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.MaterialIcons} name="share" color={colors.text_grey} style={{ fontSize:25 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:18, fontWeight:regular }}>Refer & Earn</Text>
          </View>
        </TouchableOpacity>*/}
        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Faq') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Image source={faq_icon} style={{ width: 30, height: 30, tintColor:'grey' }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('faqs')}</Text>
            <View style={{ margin:3 }} />
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('helpFAQ')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('PrivacyPolicies') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Image source={policies_icon} style={{ width: 30, height: 30, tintColor:'grey' }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('privacyPolicies')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('AboutUs') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Image source={about_us_icon} style={{ width: 30, height: 30, tintColor:'grey' }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('aboutUs')}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Referrals') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.MaterialIcons} name="money" color={colors.text_grey} style={{ fontSize:35 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('Referrals')}</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('AdminChat') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Image source={admin_icon} style={{ width: 30, height: 30, tintColor:'grey' }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('adminChat')}</Text>
            <View style={{ margin:3 }} />
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('emergencyContact')}</Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Language') }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Icon type={Icons.MaterialIcons} name="settings" color={colors.text_grey} style={{ fontSize:35 }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('Setting')}</Text>
            <View style={{ margin:3 }} />
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.text_grey, fontSize:12, fontWeight:normal }}>{t('changeYourAppLang')}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={1} onPress={() => { showDialog() }} style={{ flexDirection:'row', width:'100%', margin:15}}>
          <View style={{ width:'15%', alignItems:'center', justifyContent:'center'}}>
            <Image source={logout_icon} style={{ width: 30, height: 30, tintColor:'grey' }} />
          </View>
          <View style={{ width:'85%', alignItems:'flex-start', justifyContent:'center'}}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:colors.theme_fg_two, fontSize:30, fontWeight:bold }}>{t('logout')}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Dialog.Container visible={dialog_visible}>
          <Dialog.Title>{t('confirm')}</Dialog.Title>
          <Dialog.Description>
            {t('wantToLogout')}?
          </Dialog.Description>
          <Dialog.Button label="Yes" onPress={handleLogout} />
          <Dialog.Button label="No" onPress={handleCancel} />
      </Dialog.Container>
    </DrawerContentScrollView>
  );
}

function MyDrawer() {
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  const insets = useSafeAreaInsets();

  return (
  <>
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Dashboard" drawerStyle={{ width: 350, backgroundColor:colors.theme_fg_three }}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.theme_dark,
          width: screenWidth,
        },
      }}
    >

      <Drawer.Screen name="Dashboard" component={Dashboard} options={{headerShown: false}} />
       <Drawer.Screen name="MyBookings" component={MyBookings} options={{headerShown: false}} />
      <Drawer.Screen name="Charts" component={Charts} options={{headerShown: false}} />
      <Drawer.Screen name="Faq" component={Faq} options={{headerShown: false}} />
      <Drawer.Screen name="Wallet"component={Wallet} options={{headerShown: false}} />
      <Drawer.Screen name="Notifications"component={Notifications} options={{headerShown: false}}   />
      <Drawer.Screen name="Profile" component={Profile} options={{headerShown: false}} />
      <Drawer.Screen name="PrivacyPolicies" component={PrivacyPolicies} options={{headerShown: false}}  />
      <Drawer.Screen name="AboutUs" component={AboutUs} options={{headerShown: false}} />
      <Drawer.Screen name="Refer" component={Refer} options={{headerShown: false}}    />
      <Drawer.Screen name="Referrals" component={Referrals} options={{headerShown: false}}    />
      <Drawer.Screen name="Subscription" component={Subscription} options={{headerShown: false}}    />
      <Drawer.Screen name="AdminChat" component={AdminChat} options={{headerShown: false}}   />
      <Drawer.Screen name="Logout" component={Logout} options={{headerShown: false}}    />
      <Drawer.Screen name="Advertisement" component={Advertisement} options={{headerShown: false}}    />
      <Drawer.Screen name="AddPatient" component={AddPatient} options={{headerShown: false}}    />





    </Drawer.Navigator>
    </>
  );
}

function App() {

  return (

  <LocalizationProvider>
  <ThemeProvider>
  <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={({ route, navigation }) => ({
                        ...TransitionPresets.SlideFromRightIOS,
                    })} options={{headerShown: false}}  >
        <Stack.Screen name="Splash" component={Splash} options={{headerShown: false}} />
        <Stack.Screen name="CheckPhone" component={CheckPhone} options={{headerShown: false}} />
        <Stack.Screen name="CheckPerson" component={CheckPerson} options={{headerShown: false}} />
        <Stack.Screen name="Password" component={Password} options={{headerShown: false}} />
        <Stack.Screen name="OTP" component={OTP} options={{headerShown: false}} />
        <Stack.Screen name="CreateName" component={CreateName} options={{headerShown: false}} />
        <Stack.Screen name="CreateEmail" component={CreateEmail} options={{headerShown: false}} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} options={{headerShown: false}} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false}} />
        <Stack.Screen name="LocationEnable" component={LocationEnable} options={{headerShown: false}} />
        <Stack.Screen name="Intro" component={Intro} options={{headerShown: false}}  />
        <Stack.Screen name="Forgot" component={Forgot} options={{headerShown: false}}  />
        <Stack.Screen name="Home" component={MyDrawer} options={{headerShown: false}} />
        <Stack.Screen name="WorkDetails" component={WorkDetails} options={{headerShown: false}} />
        <Stack.Screen name="Bill" component={Bill} options={{headerShown: false}} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} options={{headerShown: false}} />
        <Stack.Screen name="WriteRating" component={WriteRating} options={{headerShown: false}} />
        <Stack.Screen name="ImageView" component={ImageView} options={{headerShown: false}} />
        <Stack.Screen name="Refer" component={Refer} options={{headerShown: false}} />
        <Stack.Screen name="Terms" component={Terms} options={{headerShown: false}} />
        <Stack.Screen name="ComplaintCategory" component={ComplaintCategory} options={{headerShown: false}} />
        <Stack.Screen name="ComplaintSubCategory" component={ComplaintSubCategory} options={{headerShown: false}} />
        <Stack.Screen name="FaqDetails" component={FaqDetails} options={{headerShown: false}} />
        <Stack.Screen name="Promo" component={Promo} options={{headerShown: false}} />
        <Stack.Screen name="EditFirstName" component={EditFirstName} options={{headerShown: false}} />
        <Stack.Screen name="EditLastName" component={EditLastName} options={{headerShown: false}} />
        <Stack.Screen name="EditEmail" component={EditEmail} options={{headerShown: false}} />
        <Stack.Screen name="Rating" component={Rating} options={{headerShown: false}} />
        <Stack.Screen name="NotificationDetails" component={NotificationDetails} options={{headerShown: false}} />
        <Stack.Screen name="RepeatTimes" component={RepeatTimes} options={{headerShown: false}} />
        <Stack.Screen name="Language" component={Language} options={{headerShown: false}} />
        <Stack.Screen name="MyBookings" component={MyBookings} options={{headerShown: false}} />
        <Stack.Screen name="Charts" component={Charts} options={{headerShown: false}} />
        <Stack.Screen name="Wallet" component={Wallet} options={{headerShown: false}} />
        <Stack.Screen name="Notifications" component={Notifications} options={{headerShown: false}} />
        <Stack.Screen name="Faq" component={Faq} options={{headerShown: false}} />
        <Stack.Screen name="PrivacyPolicies" component={PrivacyPolicies} options={{headerShown: false}} />
        <Stack.Screen name="AboutUs" component={AboutUs} options={{headerShown: false}} />
        <Stack.Screen name="Referrals" component={Referrals} options={{headerShown: false}} />
        <Stack.Screen name="AdminChat" component={AdminChat} options={{headerShown: false}} />
        <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}} />
        <Stack.Screen name="Esewa" component={Esewa} options={{headerShown: false}} />
        <Stack.Screen name="UploadCitizenship" component={UploadCitizenship} options={{headerShown: false}} />
        <Stack.Screen name="Advertisement" component={Advertisement} options={{headerShown: false}} />
        <Stack.Screen name="MedicationDetails" component={MedicationDetails} options={{headerShown: false}}    />
        <Stack.Screen name="AddMedication" component={AddMedication} options={{headerShown: false}}    />
        <Stack.Screen name="EditMedication" component={EditMedication} options={{headerShown: false}}    />
        <Stack.Screen name="AddPatient" component={AddPatient} options={{headerShown: false}} />
        <Stack.Screen name="eMAR" component={eMAR} options={{headerShown: false}} />
        <Stack.Screen name="SelectPatient" component={SelectPatient} options={{headerShown: false}}    />


        <Stack.Screen name="Paypal" component={Paypal} options={{headerShown: false}} />
        <Stack.Screen name="CreateComplaint" component={CreateComplaint} options={{headerShown: false}} />
        <Stack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
        <Stack.Screen name="ScrollTest" component={ScrollTest} options={{headerShown: false}} />
        <Stack.Screen name="AppUpdate" component={AppUpdate} options={{headerShown: false}} />
        <Stack.Screen name="temp" component={temp} options={{headerShown: false}} />

        <Stack.Screen name="AddressVerify" component={AddressVerify} options={{headerShown: false}} />
        <Stack.Screen name="DocumentUpload" component={DocumentUpload} options={{headerShown: false}} />
        <Stack.Screen name="EditPhoneNumber" component={EditPhoneNumber} options={{headerShown: false}} />
        <Stack.Screen name="BookingProcess" component={BookingProcess} options={{headerShown: false}} />
        <Stack.Screen name="Fonepay" component={Fonepay} options={{headerShown: false}} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} options={{headerShown: false}} />
        <Stack.Screen name="MedAlert" component={MedAlert} options={{headerShown: false}} />
        <Stack.Screen name="AddRecord" component={AddRecord} options={{headerShown: false}} />
        <Stack.Screen name="Items" component={Items} options={{headerShown: false}} />

      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
    {/* <RemotePushController /> */}
    </LocalizationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  }
})

function mapStateToProps(state) {
  return {
    first_name: state.register.first_name,
    last_name: state.register.last_name,
    email: state.register.email,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateEmail: (data) => dispatch(updateEmail(data)),
  updateFirstName: (data) => dispatch(updateFirstName(data)),
  updateLastName: (data) => dispatch(updateLastName(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
