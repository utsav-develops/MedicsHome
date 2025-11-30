import React, {useRef, useState, useEffect} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, alert, Image, FlatList, Alert, Platform } from 'react-native';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { api_url, booking_confirm, get_profile, staff_hiring_request, f_xl, f_l, f_m, bold, img_url, regular, normal,f_tiny, pay_payment_methods, btn_loader, base_url, esewa_success_url, esewa_failed_url } from '../config/Constants';
import Dashborad from './Dashboard';
import { useNavigation } from "@react-navigation/native";
import DropdownAlert from 'react-native-dropdownalert';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';
import { initialWindowSafeAreaInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { Icons } from '../components/Icons';
import { WebView } from 'react-native-webview';
import { esewaPaymentStatus } from '../actions/PaymentActions';
import LottieView from 'lottie-react-native';

const ReHireConfirmation = ({ visible, onClose, onModify, staffName, startDate, hours, endDate, startTime, endTime, price, exclusion, speciality_type, speciality_name, pickup_address, pickup_dates, pickup_lat, pickup_lng, package_id, work_sub_type, zone, staffid, profile_picture }) => {
let dropDownAlertRef = useRef();

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}-${month}`;
  };

const navigation = useNavigation();
const { t } = useLocalization();
const { isDarkMode, toggleTheme, colors } = useCustomTheme();
const [loading, setLoading] = useState(false);
const insets = useSafeAreaInsets();
const [methods, setMethods]= useState('');
const [selectedMethod, setSelectedMethod] = useState('');
const [paymentVisible, setPaymentVisible]= useState(false);
const [main_visible, setVisible] = useState(visible);

const [EsewaModalVisible, setEsewaModalVisible] = useState(false);
const [amount, setAmount] = useState(100);
const [url, setUrl] = useState(base_url+'paywithesewa/');
const [esewa_success_status, setSuccessStatus] = useState(0);
const [WalletAmount, setWalletAmount] = useState(0);
const [search_status, setSearchStatus] = useState(0);

const _onNavigationStateChange = async (value) => {
  const indexOfQuestionMark = value.url.indexOf('?');
  const baseUrl = indexOfQuestionMark !== -1 ? value.url.slice(0, indexOfQuestionMark) : value.url;

      if(baseUrl == esewa_success_url ){
             esewa_success_func();
             setSuccessStatus(1);
            }else if(baseUrl == esewa_failed_url){
          setSuccessStatus(0);
          setTimeout(() => {
            esewa_fail_func();
          }, 2000);

     }
}


  useEffect(() => {
    getPaymentMethod();
    call_wallet();
    }, []);

const drop_down_alert = () => {
    return (
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
      />
    )
  }

const booking_start = async () =>{
      const startTime_24hr = convertTo24HourFormat(startTime);
      const endTime_24hr = convertTo24HourFormat(endTime);
      call_all_staff_hiring_request(startTime_24hr, endTime_24hr);
};

const call_wallet =  async () => {
  setLoading(true);
  await axios({
    method: "post",
    url: api_url + "workplace/get_wallet",
    data: { id: global.id },
  })
    .then(async (response) => {
        setLoading(false);
        setWalletAmount(response.data.result.wallet);
    })
    .catch((error) => {
      setLoading(false);
      alert("Sorry something went wrong");
    });

};

const getPaymentMethod =  async () => {
  setLoading(true);
  await axios({
    method: "post",
    url: api_url + pay_payment_methods,
    data: { country_id: "NP"},
  })
    .then(async (response) => {
        setLoading(false);
        setMethods(response.data.result);
    })
    .catch((error) => {
      setLoading(false);
      alert("Sorry something went wrong");
    });

};


const payment_done = async () => {
  if (selectedMethod != 0) {
   if (selectedMethod == 6) {
      navigation.navigate("Paypal", { amount: price });
      }
      else if (selectedMethod == 39) {
        esewa_modal_func(true);
      }
      else if (selectedMethod == 40) {
      navigation.navigate("Fonepay", { amount: price });
      }
      else if (selectedMethod == 1) {
        setPaymentVisible(false);
        booking_start();
      }
      else if (selectedMethod == 2) {
        setPaymentVisible(false);
        booking_start();
      }
  }
  else {
      alert("Sorry something went wrong");
  }
}


const esewa_modal_func = (action) =>{
  setEsewaModalVisible(action);
  setPaymentVisible(!action);
};

const esewa_success_func = () =>{
  setEsewaModalVisible(false);
  setVisible(true);
  booking_start();
};

const esewa_fail_func = () =>{
  esewa_modal_func(false);
};

const payment_option_func = async (action) =>{
  setPaymentVisible(action);
  setVisible(!action);
};


const esewa_modal =  () => {

  const handleSelectMethod = (id) => {
    setSelectedMethod(id);
    console.log(id);
};


  return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={EsewaModalVisible}
        onClose= {onClose}
      >
       <View style={{ backgroundColor:'#24272c', flex:1, width: '100%', height:'90%', padding:10, bottom: 0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

       <WebView
        source={{uri: url + price}}
        style={{paddingTop: 20, backgroundColor: '#24272c',}}
        onNavigationStateChange={_onNavigationStateChange.bind(this)}
      />

     <TouchableOpacity onPress= {() => esewa_modal_func(false)} style={{position:'absolute', left:0, top:0, backgroundColor:'white', borderBottomRightRadius:10,borderTopLeftRadius:20,       shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5}}>
          <Icon type={Icons.MaterialIcons} name="close" color='black'style={{ fontSize: 35, }} />
      </TouchableOpacity>

       </View>

      </Modal>
  );
};

const booking_cancel_alert = () =>
    Alert.alert(
      t('notice'),
      t('sureCancelBooking'),
        [
          {
            text: t('yes_do'),
            onPress: () => onClose(),
            style: 'cancel',
          },
          {
            text: t('donotCancel'),
            style: 'cancel',
          },
        ],
      {
        cancelable: true,
        onDismiss: () => console.log('dismissed'),
      },
    );


const payment_method = () => {

  const check_confirm = () => {
         if(wallet <= price){
       showAlert();
  }
  else{
      book_confirm();
  }
  };

  const handleSelectMethod = (id) => {
      setSelectedMethod(id);
  };

  const renderPaymentItem = ({ item }) => (
    <>
      {item.id == 2 && price > WalletAmount ?
        <TouchableOpacity
        key={item.id}
        onPress={() => dropDownAlertRef.alertWithType('error', 'Insufficient Balance', 'You Need to Top-up your Wallet to Use This Option.') }
        style={{
          flexDirection: 'row',
          width:'100%',
          alignItems: 'center',
          padding: 10,
          borderRadius: 5,
          backgroundColor: 'grey',
          color: selectedMethod === item.id ? 'white' : 'black',
          marginBottom: 10,
        }}
      >
        <Image
          source={{ uri: img_url + item.icon }}
          style={{ width: 50, height: 50, marginRight: 10 }}
        />
          <Text style={{ fontSize: 18, color: selectedMethod === item.id ? 'white' : 'black' }}>{item.payment}</Text>
          {item.id == 2?
              <Text style={{ fontSize: 18, position:'absolute', right:10, color: selectedMethod === item.id ? 'white' : 'black' }}>Rs {WalletAmount}</Text>
            :
            null
          }


      </TouchableOpacity>

      :

      <TouchableOpacity
      key={item.id}
      onPress={() => handleSelectMethod(item.id)}
      style={{
        flexDirection: 'row',
        width:'100%',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        backgroundColor: selectedMethod === item.id ? colors.medics_blue : 'white',
        color: selectedMethod === item.id ? 'white' : 'black',
        marginBottom: 10,
      }}
    >
      <Image
        source={{ uri: img_url + item.icon }}
        style={{ width: 50, height: 50, marginRight: 10 }}
      />
        <Text style={{ fontSize: 18, color: selectedMethod === item.id ? 'white' : 'black' }}>{item.payment}</Text>
        {item.id == 2?
            <Text style={{ fontSize: 18, position:'absolute', right:10, color: selectedMethod === item.id ? 'white' : 'black' }}>Rs {WalletAmount}</Text>
          :
          null
        }


    </TouchableOpacity>
      }
      </>
    );


  return(
    <Modal
       animationType="slide"
       transparent={true}
       visible={paymentVisible}
       onClose= {onClose}
     >
       <View style={{ backgroundColor:colors.theme_dark, width: '100%',padding:10, bottom: 0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

           <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
           <TouchableOpacity onPress={() => {payment_option_func(false)}}>
              <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 27,}} />
           </TouchableOpacity>

             <Text style={{ color: colors.theme_fg_two, fontSize: 25, fontWeight: 'bold',textAlign: 'center'}}>Select Payment Method</Text>
           <TouchableOpacity onPress={booking_cancel_alert}>
             <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
           </TouchableOpacity>
           </View>



       <View style={{margin:10}}/>

        <FlatList
             data={methods}
             renderItem={renderPaymentItem}
             keyExtractor={(item) => item.id.toString()}
           />

           <View style={{margin:10}}/>

         <View style ={{flexDirection: 'row', justifyContent:'center', }}>

            {loading == false ?

            <TouchableOpacity onPress={() => payment_done()} style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center', width: '100%', borderRadius:15, backgroundColor: '#1C1C1C'}}>
                <View style={{width:'75%', height:'100%', justifyContent:'space-between', alignItems:'center', flexDirection: 'row', paddingVertical: 10}}>
                    <Text style={{ color: 'white', fontSize: 25, fontweight: normal }}>Book Now</Text>
                    <Text style={{ color: 'white', fontSize: 20, fontweight: normal }}>●</Text>
                    <Text style={{ color: '#4BBE2E', fontSize: 25, fontweight: normal }}>{t('rs')} {price}</Text>
                </View>
            </TouchableOpacity>
          :
          <View style={{ width: '90%', alignSelf: 'center', height: 50 }}>
            <LottieView source = {btn_loader} autoPlay loop />
          </View>
        }
          </View>

         <View style={{ marginBottom: Platform.OS === 'ios' ? insets.bottom : 0 }} />
       </View>

    </Modal>
  );
};


const call_get_wallet = async () => {
    try {
        const response = await axios({
            method: "post",
            url: api_url + get_profile,
            data: {
                workplace_id: global.id,
                lang: "en",
            },
        });
        return(response.data.result.wallet);
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        return null; //
    }
};


const convertTo24HourFormat = (timePart) => {
  const [time, period] = timePart.split(" ");
  let hours = parseInt(time);
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, '0')}:00:00`;
};

const booking_success_alert = () =>
Alert.alert(
  t('bookingSuccessful'),
  t('bookedsuccessfully'),
    [
      {
        text: t('bookingPage'),
        onPress: () => {
        navigation.navigate('MyBookings');
        onClose();
        },
        style: 'cancel',
      },
      {
        text: t('OK'),
        onPress: () => navigation.navigate('Dashboard'),
        style: 'cancel',
      },
    ],
  {
    cancelable: true,
    onDismiss: () => console.log('dismissed'),
  },
);


const show_hold_amount_Alert = (holding_amount) =>
Alert.alert(
  t('notice'),
  t('someAmts') + holding_amount+ t('forPrevBooking'),
    [
      {
        text: t('wallet'),
        onPress: () => {
            onClose();
            navigation.navigate('Wallet');
        },
        style: 'cancel',
      },
      {
        text: t('cancel'),
        style: 'cancel',
      },
    ],
  {
    cancelable: true,
    onDismiss: () => console.log('dismissed'),
  },
);

const call_all_staff_hiring_request = async (startTime_24hr, endTime_24hr) => {
  let days = Object.keys(pickup_dates).length ;
  setLoading(true);
  await axios({
    method: "post",
    url: api_url + 'workplace/all_staff_hiring_request',
    data: {
          workplace_id: global.id,
          rehire_status : 1,
          staff_id: staffid,
          pickup_location: pickup_address,
          speciality_type: speciality_type,
          pickup_date: startDate,
          drop_date: endDate,
          pickup_time: startTime_24hr,
          drop_time: endTime_24hr,
          pickup_lat: pickup_lat,
          pickup_lng: pickup_lng,
          drop_location: 'none',
          package_id: package_id,
          drop_lat: 0,
          drop_lng: 0,
          zone: zone,
          country_id: "NP",
          total: price,
          days: days,
          payment_method: selectedMethod,
          multiple_dates: JSON.stringify(pickup_dates)
          },
      })
    .then(async (response) => {
      setLoading(false);
      if(response.data.status == 3){
          show_hold_amount_Alert(response.data.holding_amount);
      }
      if(response.data.status == 4){
          dropDownAlertRef.alertWithType('error', t('alreadyBookedDates') , t('bookedinDates'));
       }
       if(response.data.status == 5){
          dropDownAlertRef.alertWithType('error', t('notAvailable') , t('nostaffForNow'));
       }
      if(response.data.status == 2){
          dropDownAlertRef.alertWithType('error', t('alreadyBookedDates') , Object.keys(pickup_dates));
      }
      if(response.data.status === 1){
        booking_success_alert();
      }
    })
    .catch((error) => {
      setLoading(false);
      console.error(error.response);
      dropDownAlertRef.alertWithType('error', t('sorry'), t('cantRehire'));
    });
};



  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      backgroundColor: colors.theme_dark,
      borderRadius: 20,
      alignItems: 'center',
      shadowColor: '#000',
      width: '100%',
      bottom:0,
      position:'absolute',
      padding:20,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    openButton: {
      justifyContent: 'center',
      width: 140,
      height: 40,
      backgroundColor: colors.medics_blue,
      borderRadius: 10
    },
    modifyButton: {
      justifyContent: 'center',
      backgroundColor: 'grey', // a light grey color
      width: 140,
      height: 40,
      borderRadius: 10
    },
    textStyle: {
      color: 'white',
      fontFamily: bold,
      textAlign: 'center'
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center'
    },
    overlay:{
      ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
  });

  const renderItem = ({ item }) => (
    <View >
      <Text style={{  color: colors. text_container_bg, fontSize: f_m, fontFamily: normal, padding: 5}}>{formatDate(item)}</Text>
    </View>
  );

  return (
    <>
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}></View>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
         <Text style={{ color: colors.theme_fg_two, fontFamily: bold, fontSize: 20, marginBottom:15}}>{t('bookingConfirmation')}</Text>
         <View style={{justifyContent: 'space-between', flexDirection:'row'}}>
         <View>
         <Image
             style={{height: 80, width: 80, borderRadius:15 }}
                source={{ uri: profile_picture}}
         />
         </View>
         <View style={{margin:5}}/>

           <View style={{ flexDirection: 'row', padding: 20, width: '65%',height: 80, borderRadius: 15, backgroundColor: '#D9E3FF' }}>
           <View>
             <Text style={{ color: 'black', fontSize: f_l, fontFamily: bold}}>{staffName}</Text>
             <Text style={{ color: 'black', fontSize: f_m, fontFamily: normal}}>{speciality_name}</Text>
             </View>
           </View>
           </View>

           <View style={{margin:5}}/>

             <View style={{padding: 10, width:'100%', height: 'auto',flexDirection: 'row', alignItems: 'center', borderRadius: 10,justifyContent: 'space-between', backgroundColor: colors.medics_green }}>
                <View style={{width:'50%'}}>
                <FlatList
                      data={pickup_dates}
                      renderItem={renderItem}
                      keyExtractor={(item) => item}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
              </View>
               <View style={{height: 30, width: 2, backgroundColor: colors.text_container_bg, borderRadius: 10}} />
               <View>
                <Text style={{ color: colors. text_container_bg, fontSize: f_m, fontFamily: normal, padding: 5 }}>{startTime} to  {endTime}</Text>
               </View>
               </View>

            <View style={{margin:5}}/>

              <View style={{flexDirection: 'row',justifyContent: 'space-between', width:'90%'}}>
                   <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: normal, padding: 5 }}>{t('package')}</Text>
                   <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontFamily: normal, padding: 5 }}>{hours} {t('hrs')}</Text>
              </View>

            <View style={{margin:7,height:1, width: '90%', borderWidth:1, borderColor: colors.theme_fg_two,  backgroundColor: colors.theme_fg_two, borderRadius: 10, alignSelf:'center'}} />

              <View style={{flexDirection: 'row',justifyContent: 'space-between', width:'90%'}}>
                   <Text style={{ color: colors.theme_fg_two, fontSize: f_l, fontFamily: bold, padding: 5 }}>{t('totalPrice')}</Text>
                   <Text style={{ color: colors.medics_green, fontSize: f_l, fontFamily: bold, padding: 5 }}>{t('rs')}{price}</Text>
              </View>

{/*           <Text style={styles.modalText}>{t('goingToBook')} {staffName} {t('from')}</Text> */}
{/*           <Text style={styles.modalText}>{startDate} {t('to')} {endDate} {t('till')}</Text> */}
{/*           <Text style={styles.modalText}>{t('For')} {hours} {t('hoursEachday')} {startTime} {t('to')} {endTime} {t('till')}</Text> */}
{/*           <Text style={styles.modalText}>{t('oneHrLunch')} {exclusion}</Text> */}
{/*            */}
            <View style={{margin:5}}/>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={onClose} style={styles.modifyButton}>
            <Text style={styles.textStyle}>{t('modify')}</Text>
          </TouchableOpacity>

            <View style={{margin:15}}/>

          {loading == false ?
            <TouchableOpacity onPress={()=> payment_option_func(true)} style={styles.openButton}>
                <Text style={styles.textStyle}>{t('bookNow')}</Text>
            </TouchableOpacity>
            :
            <View style={{ width: 140, alignSelf: 'center', height: 40,}}>
              <LottieView source = {btn_loader} autoPlay loop />
            </View>
            }
          </View>
          <View style={{ margin: Platform.OS === 'ios' ? 15 : null}}/>
        </View>
      </View>
      {drop_down_alert()}
      {payment_method()}
      {esewa_modal()}
    </Modal>

    </>
  );
};



export default ReHireConfirmation;