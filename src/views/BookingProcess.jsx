import React, {useRef,useState, useEffect} from 'react';
import { Modal,  View, Text, TouchableOpacity, StyleSheet,alert,FlatList, Image, Alert, Platform } from 'react-native';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { api_url, success_icon, base_url, unsuccess_icon, booking_confirm, wallet, img_url,add_wallet, pay_payment_methods, esewa_failed_url, esewa_success_url, get_profile, work_details,searching_loader,screenHeight, get_patient_types, all_staff_hiring_request, btn_loader, get_speciality_categories, f_xl, f_l, f_m, bold, regular, normal,f_tiny, get_estimation_rate, get_zone } from '../config/Constants';
import { useNavigation, CommonActions } from "@react-navigation/native";
import Dialog, {
  DialogTitle,
  SlideAnimation,
  DialogContent,
  DialogFooter,
  DialogButton,
} from "react-native-popup-dialog";
import DropdownAlert from 'react-native-dropdownalert';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useCustomTheme } from  '../config/useCustomTheme';
import Icon, { Icons } from '../components/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DropShadow from "react-native-drop-shadow";
import LottieView from 'lottie-react-native';
import database from '@react-native-firebase/database';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import BottomSheet from 'react-native-simple-bottom-sheet';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { esewaPaymentStatus } from '../actions/PaymentActions';



const BookingProcess = ({visible,packages,onClose,pickup_lat,pickup_lng, pickup_address }) => {
let dropDownAlertRef = useRef();
const navigation = useNavigation();
const { t } = useLocalization();
const { isDarkMode, toggleTheme, colors } = useCustomTheme();
const [step_1_visible, set_step_1_visible] = useState(visible);
const [step_1_yes_visible, set_step_1_yes_visible] = useState(false);
const [step_1_no_visible, set_step_1_no_visible] = useState(false);
const [now_later_visible, set_now_later_visible] = useState(false);
const [now_packages_visible, set_now_packages_visible] = useState(false);
const [all_packages_visible, set_all_packages_visible] = useState(false);
const [available_times_visible, set_available_times_visible] = useState(false);
const [date_select_visible, set_date_select_visible] = useState(false);
const [book_confirm_visible, set_book_confirm_visible] = useState(false);
const [date_time, setdatetime] = useState(new Date());
const [startTime_24hr, setStartTime] = useState('');
const [endTime_24hr, setEndTime] = useState('');
const [known, setKnown] = useState();
const [is_mount, setIsMount] = useState(0);
const [search_status, setSearchStatus] = useState(0);
const [work_request_id, setWorkRequestId] = useState(0);

const today = moment();
const now_time_in_hour = new Date().getHours();
const tomorrow = today.add(1, 'day').format("YYYY-MM-DD");
const [selectedDates, setSelectedDates] = useState({});
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [selectedTime, setSelectedTime] = useState(null);
const [selected_package, setselectedpackage] = useState(0);
const [loading, setLoading] = useState(false);
const [specialities, setSpecialities] = useState([]);
const [active_speciality_type, setActiveSpecialityType] = useState(0);
const [patient_types, setPatientTypes] = useState([]);
const [on_loaded, setOnLoaded] = useState(0);
const [search_loading, setSearchLoading] = useState(false);

const [km, setKm] = useState(0);
const [wallet, setWallet] = useState(0);
const [estimation_rate, setEstimationRates] = useState(0);
const [from, setfrom] = useState('');
const [current_location_status, setCurrentLocationStatus] = useState(true);
const [paymentVisible, setPaymentVisible]= useState(false);
const [methods, setMethods]= useState('');
const [selectedMethod, setSelectedMethod] = useState('');
const [paySuccessVisible, setPaySuccessVisible] = useState(false);
const [payFailVisible, setPayFailVisible] = useState(false);

const [EsewaModalVisible, setEsewaModalVisible] = useState(false);
const [amount, setAmount] = useState(100);
const [url, setUrl] = useState(base_url+'paywithesewa/');
const [esewa_success_status, setSuccessStatus] = useState(0);
const [WalletAmount, setWalletAmount] = useState(0);


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

const call_add_wallet = (fill_amount) => {
  setLoading(true);
  axios({
      method: 'post',
      url: api_url + add_wallet,
      data: { id: global.id, amount: fill_amount }
  })
      .then(async response => {
        setLoading(false);
        call_wallet();
        dropDownAlertRef.alertWithType('success', 'Added to Wallet', 'Your Money Has Been Refunded to your Wallet.');
      })
      .catch(error => {
          setLoading(false);
      });
}


  useEffect(() => {
    get_speciality_category();
    call_get_patient_types();
    getPaymentMethod();
    booking_sync();
    call_wallet();

    const unsubscribe = navigation.addListener("focus", async () => {
          setIsMount(1);
        });
        setTimeout(() => { setOnLoaded(1) }, 2000)
        return (
          unsubscribe
        );
    }, []);

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

const payment_done = async () => {
        if (selectedMethod != 0) {
         if (selectedMethod == 6) {
            navigation.navigate("Paypal", { amount: estimation_rate });
            }
            else if (selectedMethod == 39) {
              esewa_modal_func(true);
            }
            else if (selectedMethod == 40) {
            navigation.navigate("Fonepay", { amount: estimation_rate });
            }
            else if (selectedMethod == 1) {
              console.log("imposter 1");
              call_zone();
              setPaymentVisible(false);
              set_book_confirm_visible(true);
            }
            else if (selectedMethod == 2) {
              console.log("imposter 2");

              call_zone();
              setPaymentVisible(false);
              set_book_confirm_visible(true);
            }
        }
        else {
            alert("Sorry something went wrong");
        }
    }

    const handleOnRedirect = (data) => {
        if (data.status == "successful") {
//             call_add_wallet();
        } else {
            alert("Sorry, your payment declined");
        }
       // wallet_ref.current.open();
    }

//for date logic

  const saveTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    const todayDateString = `${year}-${month}-${day}`;
    const dateObject = {
      [todayDateString]: {
        selected: true,
        selectedColor: '#015BBB'
      }
    };

    setSelectedDates(dateObject);
    if(selected_package.id == 10){
        setStartTime('08:00:00');
        setEndTime('20:00:00');
    }
    else if(selected_package.id == 11){
        setStartTime('20:00:00');
        setEndTime('08:00:00');
    }
    else if(selected_package.id == 17){
        setStartTime('8:00:00');
        setEndTime('20:00:00');
    }
  };

  const onDayPress = (day) => {
    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[day.dateString]) {
      delete newSelectedDates[day.dateString];
    } else {
      newSelectedDates[day.dateString] = {
        selected: true,
        selectedColor: colors.medics_blue,
      };
    }
    setSelectedDates(newSelectedDates);
      const dates = Object.keys(selectedDates);
  };

  const get_estimation_rate_api = async (when) => {
    let total_days = Object.keys(selectedDates).length;
    console.log(selected_package?.value);
    if(when === "Today"){
        total_days = 1;
    }
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + get_estimation_rate,
      data: { workplace_id: global.id, pickup_lat: pickup_lat, hours: selected_package.value * total_days , pickup_lng: pickup_lng, drop_lat: 'no address', drop_lng: 'no address', work_type: 2, promo: 5, lang: global.lang, package_id: selected_package.id, days: 1, work_sub_type: 4 },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          console.log( JSON.stringify(response.data.result));
          setEstimationRates(response.data.result['specialities'][active_speciality_type.id].rates.total_rate);
          setWallet(response.data.result['wallet']);
          setKm(response.data.result['specialities'][active_speciality_type.id].rates.km);
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

    const booking_sync = () => {
      database().ref(`workplaces/${global.id}`).on('value', snapshot => {
        const snapshotValue = snapshot.val();
        if (snapshotValue) {
          setSearchStatus(snapshotValue.is_searching == 1? true : false);
          if (snapshotValue.booking_id != null && snapshotValue.booking_id != 0) {
            if (is_mount === 0) {
              setIsMount(1);
              onClose();
              setSearchStatus(false);
              call_work_details(snapshotValue.booking_id);
            }
          }
        }
      });
    };

      const call_work_details = (work_id) => {
        axios({
          method: 'post',
          url: api_url + work_details,
          data: { work_id: work_id }
        })
          .then(async response => {

            navigation.navigate('WorkDetails', { work_id: work_id, from: 'home', data: response.data.result })
          })
          .catch(error => {
            console.log(error)
          });
      }

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


const get_request_id = async () => {
  try {
    const snapshot = await database().ref(`workplaces/${global.id}`).once('value');
    const snapshotValue = snapshot.val();
    if (snapshotValue) {
      setWorkRequestId(snapshotValue.work_request_id);
      cancel_request(snapshotValue.work_request_id);
    }
  } catch (error) {
    console.error("Error fetching request ID:", error);
  }
};

const cancel_request = (request_id) => {
  console.log("new request id is:" + request_id);
  setSearchLoading(true);

  axios.post(`${api_url}workplace/work_request_cancel`, { work_request_id: request_id })
    .then(response => {
      setSearchLoading(false);
    })
    .catch(error => {
      console.error("Error cancelling request:", error);
      setSearchLoading(false);
    });
};


   const call_get_patient_types = async () => {
      setLoading(true);
      await axios({
        method: "post",
        url: api_url + 'get_patient_types',
        data: { lang: global.lang },
      })
        .then(async (response) => {
          setLoading(false);
            setPatientTypes(response.data.result);
        })
        .catch((error) => {
          setLoading(false);
          alert("Sorry something went wrong");
        });
    };

// Function to get seconds difference between current time and given hour
const addCustomHoursAndGetHour_date = (hoursToAdd) => {
  const now = new Date();
  const targetTime = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  const targetHour = targetTime.getHours();
  return targetHour;
};

// Function to get seconds difference between given time and given hour
const difference_in_hours = (date, hoursToAdd) => {
  const now = new Date(date);
  const targetTime = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  const targetHour = targetTime.getHours();
  return targetHour;
};

const call_zone = async () => {
  setLoading(true);
  await axios({
    method: "post",
    url: api_url + get_zone,
    data: { lat: pickup_lat, lng: pickup_lng, workplace_id: global.id, total: estimation_rate},
  })
    .then(async (response) => {
      setLoading(false);
      if(response.data.status == 3 && selectedMethod == 2){
          show_hold_amount_Alert(response.data.holding_amount);
      }
      else{
        if (response.data.result == 0) {
              dropDownAlertRef.alertWithType('error', t('notAvailable'), t('notAvailableInYourLocation'));
              if(esewaPaymentStatus == 1 && selectedMethod == 39){
                call_add_wallet(estimation_rate);
  
              }
            }
        else
        {
          if(from === 'Later' || selected_package.id == 10 || selected_package.id == 11 || selected_package.id == 17 ){
             call_all_staff_hiring_request(response.data.result);
          }
          else{
           call_booking_confirm(response.data.result);
          }

        }
      }

    })
    .catch((error) => {
      setLoading(false);
      console.error(error.response);
      alert("Sorry something went wrong");
    });

};

const get_speciality_category = async () => {
  setLoading(true);
  await axios({
    method: "post",
    url: api_url + 'workplace/get_speciality_categories',
    data: { lang: global.lang, speciality_mode: 18},
  })
    .then(async (response) => {
        setLoading(false);
        setSpecialities(response.data.result);

    })
    .catch((error) => {
      setLoading(false);
      alert("Sorry something went wrong");
    });

};

 const call_all_staff_hiring_request = async (zone) => {
    setLoading(true);
    const keys = Object.keys(selectedDates);
    const start_date = Object.keys(selectedDates)[0];
    const endDate = keys[keys.length - 1];
    const days = Object.keys(selectedDates).length;
    await axios({
      method: "post",
      url: api_url + 'workplace/all_staff_hiring_request',
      data: {
            workplace_id: global.id,
            pickup_location: pickup_address,
            speciality_type: active_speciality_type.id,
            pickup_date: start_date,
            rehire_status: 0,
            drop_date: endDate,
            pickup_time: startTime_24hr,
            drop_time: endTime_24hr,
            pickup_lat: pickup_lat,
            pickup_lng: pickup_lng,
            drop_location: 'none',
            package_id: selected_package.id,
            drop_lat: 0,
            drop_lng: 0,
            zone: zone,
            country_id: "NP",
            total: estimation_rate,
            payment_method: selectedMethod,
            days: days,
            multiple_dates: JSON.stringify(Object.keys(selectedDates))
            },
        })
      .then(async (response) => {
        setLoading(false);
        if(response.data.status === 1){
            booking_success_alert();
        }
        if(response.data.status == 2){
          if(esewaPaymentStatus == 1 && selectedMethod == 39){
            call_add_wallet(estimation_rate);

          }
            Alert.alert( t('alreadyBookedDates') + Object.keys(selectedDates));
        }
        if(response.data.status == 3){
            show_hold_amount_Alert(response.data.holding_amount);
        }
         if(response.data.status == 4){
          if(esewaPaymentStatus == 1 && selectedMethod == 39){
            call_add_wallet(estimation_rate);

          }
           dropDownAlertRef.alertWithType('error', t('alreadyBookedDates') , t('bookedinDates'));
        }
        if(response.data.status == 5){
          if(esewaPaymentStatus == 1 && selectedMethod == 39){
            call_add_wallet(estimation_rate);

          }
          dropDownAlertRef.alertWithType('error', t('notAvailable') , t('nostaffForNow'));
        }

      })
      .catch((error) => {
        setLoading(false);
        console.error(error.response);
      });
  };

const call_booking_confirm = async (zone) => {
  setLoading(true);
      await axios({
        method: "post",
        url: api_url + booking_confirm,
        data: {
          km: selected_package.value,
          promo: 5,
          speciality_type: active_speciality_type.id,
          payment_method: selectedMethod,
          workplace_id: global.id,
          work_type: 2,
          surge: 1,
          pickup_address: pickup_address,
          pickup_date: new Date(),
          pickup_lat: pickup_lat,
          pickup_lng: pickup_lng,
          drop_address: "null",
          drop_lat: 0,
          drop_lng: 0,
          package_id: selected_package.id,
          work_sub_type: 4,
          stops: JSON.stringify([]),
          zone: zone,
          multiple_dates: JSON.stringify([]),
        },
      })
        .then(async (response) => {
          setLoading(false);
          if (response.data.status == 1) {
            if (response.data.booking_type == 2) {
              dropDownAlertRef.alertWithType('success', t('bookingPlacedSuccess'), t('seeBookingsinMenu'));
            }
          }
          else if (response.data.status == 3){
            show_hold_amount_Alert(response.data.holding_amount);
          }
          else {
            console.log('logsss');
            console.log(esewaPaymentStatus);
            console.log(selectedMethod);
            if(esewaPaymentStatus == 1 && selectedMethod == 39){
              console.log('wallet added');
              call_add_wallet(estimation_rate);

            }
            dropDownAlertRef.alertWithType('error', t('sorry'),t('staffnotAvailable'));
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("error 2: "+ JSON.stringify(error.response));

          alert('Sorry something went wrong');
        });
};

//Extracting packages
const pickerItemsNow = packages
  .filter(pkg => addCustomHoursAndGetHour_date(pkg.hours) < 20 && addCustomHoursAndGetHour_date(pkg.hours) >= 8 || pkg.id == 11 && !(new Date().getHours() >= 20) )
  .map(pkg => ({
    id: pkg.id,
    label: pkg.package_name,
    value: pkg.hours,
  }));

  const pickerItemsAll = packages
  .map(pkg => ({
    id: pkg.id,
    label: pkg.package_name,
    value: pkg.hours,
  }))


// Function to get time slots for a given package duration
const getTimeSlots = (packageHours) => {
  const startHour = 8; // 8:00 AM
  const endHour = 20; // 8:00 PM
  const timeSlots = [];

  let currentHour = startHour;
  while (currentHour + packageHours <= endHour) {
    timeSlots.push(`${currentHour}:00 - ${currentHour + packageHours}:00`);
    currentHour += packageHours;
  }

  return timeSlots;
};



const insets = useSafeAreaInsets();





  //visibility changing functions
  const step_1_yes_visible_func = (action) =>{
    set_step_1_visible(!action);
    set_step_1_yes_visible(action);
    get_speciality_category();
  };

  const step_1_no_visible_func = (action) =>{
    set_step_1_visible(!action);
    set_step_1_no_visible(action);
  };

  const now_later_visible_func = (action) =>{
    if(known == true){
        set_step_1_yes_visible(!action);
    }
    else{
        set_step_1_no_visible(!action);
    }

    set_now_later_visible(action);

  };

  const date_select_func = (action) =>{
    setfrom('Later');
    set_now_later_visible(!action);
    set_date_select_visible(action);
  };


  const now_packages_func = (action) =>{
    set_now_later_visible(!action);
    set_now_packages_visible(action);

  };

  const all_packages_func = (action) =>{
    set_date_select_visible(!action);
    set_all_packages_visible(action);

  };

  const available_times_func = (action) =>{
    set_all_packages_visible(!action);
    set_available_times_visible(action);

  };

  const book_confirm_func = async (action, from_where) =>{
        set_book_confirm_visible(action);
        console.log("times run");

    if (from_where === 'Later'){
        set_available_times_visible(!action);
    }
    else if (from_where === 'Today'){
        saveTodayDate();
        set_now_packages_visible(!action);
    }

  };

  const esewa_modal_func = (action) =>{
    setEsewaModalVisible(action);
    setPaymentVisible(!action);
  };

  const esewa_success_func = () =>{
    setPaySuccessVisible(true);
    setEsewaModalVisible(false);
    set_book_confirm_visible(true);
    console.log("imposter 3");

    call_zone();
  };

  const esewa_fail_func = () =>{
    esewa_modal_func(false);
    setPayFailVisible(true);
  };

  const payment_option_func = async (action) =>{
    setPaymentVisible(action);
    set_book_confirm_visible(!action);
  };




  //api calling
  const Step_1_Yes = () =>{
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handlePress = (item)=>{
      setSelectedCategory(item);
      setActiveSpecialityType(item);
    }
    const check_confirm = () =>{
      if(selectedCategory != null){
        setKnown(true);
        set_step_1_yes_visible(false);
        now_later_visible_func(true);
      }
      else{
        dropDownAlertRef.alertWithType('error', t('notSelected'), t('selectOneOption'));
      }
    };



    const render_specialities= ({ item }) => (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          selectedCategory?.speciality_type === item.speciality_type && styles.selectedItemContainer,
        ]}
        onPress={() => handlePress(item)}
      >
        <Text
          style={[
            styles.itemText,
            selectedCategory?.speciality_type === item.speciality_type && styles.selectedItemText,
          ]}
        >
          {item.speciality_type}
        </Text>
      </TouchableOpacity>
    );



//     visible={step_1_yes_visible}
    return(
        <Modal
          animationType="slide"
          transparent={true}
          visible={step_1_yes_visible}
          onClose= {onClose}
        >
         <View style = {{backgroundColor:colors.theme_dark, width:'100%', padding:10, bottom: 0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

          <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
           <TouchableOpacity onPress={() => {step_1_yes_visible_func(false)}}>
               <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 25, }} />
               </TouchableOpacity>
               <Text style={{ color: colors.theme_fg_two, fontSize: f_l, fontweight: bold,textAlign: 'center', width:'70%' }}>{t('selectNurseCategory')}</Text>
                <TouchableOpacity onPress={booking_cancel_alert}>
                  <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
                </TouchableOpacity>

        {/*             <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontweight: bold,   }}>Booking</Text> */}
           </View>
{/*                 <View style={{margin:10}}/> */}


{/*                   <View style={{margin:2}}/> */}

                  <View style={{margin:10}}/>

                  <FlatList
                  data={specialities}
                  renderItem={render_specialities}
                  keyExtractor={(item) => item}
                  style={styles.list}
                  showsVerticalScrollIndicator={true}
                />
                    <View style={{margin:10}}/>

                    <View style ={{flexDirection: 'row', justifyContent:'center',}}>
                        <TouchableOpacity onPress={() => {check_confirm()}} style={{flexDirection:'row', alignItems:'center',fontSize: f_l, justifyContent:'center',padding:5, width:150, height:50, backgroundColor:colors.medics_blue, borderRadius:10}}>
                            <Text style={{ color: 'white', fontSize: f_l, fontweight: normal,}}>{t('next')}</Text>
                        </TouchableOpacity>
                   </View>
                   <View style={{margin:Platform.OS==='ios'? insets.bottom:0}}/>
              </View>
        </Modal>
    );
  };

  const Step_1_No = () =>{
  const [selectedCategories, setSelectedCategories] = useState([]);

    const handlePress = (item) => {
        setSelectedCategories((prevSelectedCategories) => {
          let newSelectedCategories;
          if (prevSelectedCategories.some((category) => category.id === item.id)) {
            // If item is already selected, remove it
            newSelectedCategories = prevSelectedCategories.filter((category) => category.id !== item.id);
          } else {
            // If item is not selected, add it
            newSelectedCategories = [...prevSelectedCategories, item];
          }

          // Check if any selected category has caregiver set to 'No'
          const hasNoCaregiver = newSelectedCategories.some((category) => category.caregiver === 'No');
          if (hasNoCaregiver) {
           setActiveSpecialityType({"active_icon": "speciality_categories//d761f74676f9219db2f2ed5eba8090fa.png", "id": 12, "inactive_icon": "speciality_categories//3c34eabf166c179cc9cfdd0afcbcedde.png", "price_per_km": 0, "speciality_type": "Staff Nurse Home Care", "status": 1});
          } else {
            setActiveSpecialityType({"active_icon": "speciality_categories//3dff0d3b4bafd0b25c1158de734ff108.png", "id": 13, "inactive_icon": "speciality_categories//ab886732f7eb0a9c409e16e8cfe09c3f.png", "price_per_km": 0, "speciality_type": "Care Giver", "status": 1});
          }

          return newSelectedCategories;
        });
      };

    const check_confirm = () => {
      if (selectedCategories.length > 0) {
        setKnown(false);
        set_step_1_no_visible(false);
        now_later_visible_func(true);
      } else {
        dropDownAlertRef.alertWithType('error', t('notSelected'), t('selectOneOption'));
      }
    };


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        selectedCategories.some((category) => category.id === item.id) && styles.selectedItemContainer,
      ]}
      onPress={() => handlePress(item)}
    >
      <Text
        style={[
          styles.itemText,
          selectedCategories.some((category) => category.id === item.id) && styles.selectedItemText,
        ]}
      >
        {item.specific_task}
      </Text>
    </TouchableOpacity>
  );

    return(
        <Modal
          animationType="slide"
          transparent={true}
          visible={step_1_no_visible}
          onClose= {onClose}
        >
              <View style = {{backgroundColor:colors.theme_dark, width:'100%', padding:10, bottom: 0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

                  <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {step_1_no_visible_func(false)}}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 25, }} />
                    </TouchableOpacity>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_l, fontweight: bold, textAlign: 'center', width:'70%' }}>{t('whatKindofCare')}</Text>
                    <TouchableOpacity onPress={booking_cancel_alert}>
                      <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
                    </TouchableOpacity>
        {/*             <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontweight: bold,   }}>Booking</Text> */}
                </View>

{/*                 <View style={{margin:10}}/> */}


{/*                   <View style={{margin:2}}/> */}

                  <View style={{margin:10}}/>

                  <FlatList
                  data={patient_types}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  style={styles.list}
                  showsVerticalScrollIndicator={true}
                />
                    <View style={{margin:10}}/>

                    <View style ={{flexDirection: 'row', justifyContent:'center',}}>
                        <TouchableOpacity onPress={() => {check_confirm()}} style={{flexDirection:'row', alignItems:'center',  justifyContent:'center',padding:5, width:150, height:50,marginBottom:15, backgroundColor:colors.medics_blue, borderRadius:10}}>
                            <Text style={{ color: 'white', fontSize: f_l, fontweight: normal,}}>{t('next')}</Text>
                        </TouchableOpacity>
                   </View>

              </View>
        </Modal>
    );
  };


  const now_later = () =>{

//   visible={now_later_visible}

    return(
      <Modal
      animationType="slide"
      transparent={true}
      visible={now_later_visible}
      onClose= {onClose}
    >
       <View style = {{backgroundColor:colors.theme_dark , width:'100%',padding:10, bottom:0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

        <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => {now_later_visible_func(false)}}>
            <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 25, }} />
        </TouchableOpacity>
             <Text style={{  color: colors.theme_fg_two, fontSize: f_l, fontweight: bold, textAlign: 'center', width:'70%'}}>{t('hireLaterorToday')}</Text>
        <TouchableOpacity onPress={booking_cancel_alert}>
              <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
        </TouchableOpacity>
{/*             <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontweight: bold,   }}>Booking</Text>  */}
        </View>

        <View style={{margin:10}}/>


            <View style ={{flexDirection: 'row', justifyContent:'space-around',marginBottom:20}}>
                <TouchableOpacity onPress={() => {date_select_func(true)}} style={{alignItems:'center', justifyContent:'center', width:'40%', height:50, backgroundColor:colors.medics_blue, borderRadius:10}}>
                    <Text style={{ color: 'white', fontSize: f_m, fontweight: normal,}}>{t('later')}</Text>
                </TouchableOpacity>
                 {now_time_in_hour >= 20 || now_time_in_hour < 8 ?
                    <TouchableOpacity onPress={() => {dropDownAlertRef.alertWithType('error', t('sorry'), t('instantBookingAvailable'))}} style={{alignItems:'center', justifyContent:'center', width:'40%', height:50, backgroundColor:colors.icon_inactive_color, borderRadius:10}}>
                        <Text style={{ color: 'white', fontSize: f_m, fontweight: normal,}}>{t('today')}</Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity onPress={() => {now_packages_func(true)}} style={{alignItems:'center', justifyContent:'center', width:'40%', height:50, backgroundColor:colors.medics_blue, borderRadius:10}}>
                        <Text style={{ color: 'white', fontSize: f_m, fontweight: normal,}}>{t('today')}</Text>
                    </TouchableOpacity>
                }

           </View>
           {/* <View style = {{margin:Platform.OS==='ios'? insets.bottom: null}}/> */}
        </View>
        </Modal>
    );
  };

  const date_select = () =>{

  //   visible={now_later_visible}
  const check_confirm = () =>{
    if (Object.keys(selectedDates).length === 0) {
      dropDownAlertRef.alertWithType('error', t('notSelected'), t('selectOnedate'));
    } else {
      all_packages_func(true);
    }

  }

      return(
        <Modal
        animationType="slide"
        transparent={true}
        visible={date_select_visible}
        onClose= {onClose}
      >
         <View style = {{backgroundColor:colors.theme_dark, width:'100%', padding:10, bottom:0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

          <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => {date_select_func(false)}}>
              <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 25, }} />
          </TouchableOpacity>
               <Text style={{  color: colors.theme_fg_two, fontSize: f_l, fontweight: bold, textAlign: 'center', width:'70%'}}>{t('selectDatetoHire')}</Text>
          <TouchableOpacity onPress={booking_cancel_alert}>
                <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
          </TouchableOpacity>
  {/*             <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontweight: bold,   }}>Booking</Text>  */}
          </View>

          <View style={{margin:10}}/>


          <Calendar
            onDayPress={onDayPress}
            markedDates={selectedDates}
            markingType={'multi-dot'}
            minDate={getTomorrowDate()}
            theme={{
              todayTextColor: colors.medics_blue,
              arrowColor: colors.theme_fg_two,
              calendarBackground: colors.theme_dark,
              textDisabledColor: colors.medics_grey,
              dayTextColor: colors.theme_fg_two,
              monthTextColor: colors.theme_fg_two,
            }}
          />
            <View style={{margin:10}}/>
                <TouchableOpacity onPress={()=>{check_confirm()}} style={{ alignSelf:'center', alignItems:'center',fontSize: f_l, justifyContent:'center',padding:5, width:150, height:50,marginBottom:15, backgroundColor:colors.medics_blue, borderRadius:10}}>
                    <Text style={{ color: 'white', fontSize: f_l, fontweight: normal,}}>{t('next')}</Text>
                </TouchableOpacity>
          </View>
          </Modal>
      );
    };

  // Function to get tomorrow's date in 'YYYY-MM-DD' format
const getTomorrowDate = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDateString = tomorrow.toISOString().split('T')[0];
  return tomorrowDateString;
};

  const now_packages = () =>{
    const[selected_category, setSelectedCategory] = useState(null);

    const check_confirm = () =>{
      let date_book = new Date();
      if(selected_category != null){

        if(selected_package.id === 11){
          date_book.setHours(20,0,0,0);
          setSelectedTime('8 PM to 8 AM');
          setdatetime(date_book);
        }
        else if(selected_package.id === 10){
          date_book.setHours(8,0,0,0);
          setSelectedTime('8 AM to 8 PM');
          setdatetime(date_book);
        }

        else if(selected_package.id === 17){
          date_book.setHours(8,0,0,0);
          setSelectedTime('8 AM to 8 AM');
          setdatetime(date_book);
        }
          setfrom('Today');
          get_estimation_rate_api("Today");
          console.log("whennn:" + from);
          book_confirm_func(true, "Today");
      }
      else{
        dropDownAlertRef.alertWithType('error', t('notSelected'), t('selectOneOption'));
      }
    };

    const handlePress = (item)=>{
      setSelectedCategory(item);
      setselectedpackage(item);
      setSelectedTime(item.value + t('hrsFromNow'));
    }

    const render_packages= ({ item }) => (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          selected_package?.id === item.id && styles.selectedItemContainer,
        ]}
        onPress={() => handlePress(item)}
      >
        <Text
          style={[
            styles.itemText,
            selected_package?.id === item.id && styles.selectedItemText,
          ]}
        >
          {item.label === item.value ? `${item.label} ${t('hrsFromNow')}` : item.label }
        </Text>
      </TouchableOpacity>
    );

    return(
        <Modal
          animationType="slide"
          transparent={true}
          visible={now_packages_visible}
          onClose= {onClose}
        >
         <View style={{ backgroundColor:colors.theme_dark, width: '100%',padding:10, bottom: 0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

                <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={()=> {now_packages_func(false)}}>
                      <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 25, }} />
                    </TouchableOpacity>
                    <Text style={{  color: colors.theme_fg_two, fontSize: f_l, fontweight: bold,textAlign: 'center', width:'70%' }}>{t('availablePackageforToday')}</Text>
                     <TouchableOpacity onPress= {booking_cancel_alert}>
                        <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
                     </TouchableOpacity>

        {/*             <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontweight: bold,   }}>Booking</Text> */}
                </View>


                  <View style={{margin:5}}/>

                  <FlatList
                  data={pickerItemsNow}
                  renderItem={render_packages}
                  keyExtractor={(item) => item}
                  style={styles.list}
                  showsVerticalScrollIndicator={true}
                />
                    <View style={{margin:10}}/>



                   {loading == false ?
                  <View style ={{flexDirection: 'row', justifyContent:'center',}}>
                     <TouchableOpacity onPress={()=>{check_confirm()}} style={{flexDirection:'row', alignItems:'center',fontSize: f_l, justifyContent:'center',padding:5, width:150, height:50,marginBottom:15, backgroundColor:colors.medics_blue, borderRadius:10}}>
                        <Text style={{ color: 'white', fontSize: f_l, fontweight: normal,}}>{t('next')}</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={{ width: '90%', alignSelf: 'center',  height: 50 }}>
                    <LottieView source={btn_loader} autoPlay loop />
                  </View>
                }

              </View>

        </Modal>
    );
  };

  const all_packages = () =>{
    const[selected_category, setSelectedCategory] = useState("");

    const check_confirm = () =>{
      if(selected_category != ""){
        get_estimation_rate_api("Later");
        available_times_func(true);
      }
      else{
        dropDownAlertRef.alertWithType('error', t('notSelected'), t('selectOneOption'));

      }
    };

    const handlePress = (item)=>{
      setSelectedCategory(item);
      setselectedpackage(item);
    }

    const render_packages= ({ item }) => (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          selected_package?.id === item.id && styles.selectedItemContainer,
        ]}
        onPress={() => handlePress(item)}
      >
        <Text
          style={[
            styles.itemText,
            selected_package?.id === item.id && styles.selectedItemText,
          ]}
        >
          {item.label === item.value ? `${item.label} ${t('hrs')}` : item.label }
        </Text>
      </TouchableOpacity>
    );

    return(
        <Modal
          animationType="slide"
          transparent={true}
          visible={all_packages_visible}
          onClose= {onClose}
        >
         <View style={{ backgroundColor:colors.theme_dark, width: '100%',padding:10, bottom: 0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

                <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={()=> {all_packages_func(false)}}>
                      <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 25, }} />
                    </TouchableOpacity>
                    <Text style={{  color: colors.theme_fg_two, fontSize: f_l, fontweight: bold,textAlign: 'center', width:'70%' }}>{t('availablePackage')}</Text>
                     <TouchableOpacity onPress= {onClose}>
                        <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
                     </TouchableOpacity>

        {/*             <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontweight: bold,   }}>Booking</Text> */}
                </View>


                  <View style={{margin:5}}/>

                  <FlatList
                  data={pickerItemsAll}
                  renderItem={render_packages}
                  keyExtractor={(item) => item}
                  style={styles.list}
                  showsVerticalScrollIndicator={true}
                />
                    <View style={{margin:10}}/>



                   {loading == false ?
                  <View style ={{flexDirection: 'row', justifyContent:'center',}}>
                    <TouchableOpacity onPress={()=>{check_confirm()}} style={{flexDirection:'row', alignItems:'center',fontSize: f_l, justifyContent:'center',padding:5, width:150, height:50,marginBottom:15, backgroundColor:colors.medics_blue, borderRadius:10}}>
                        <Text style={{ color: 'white', fontSize: f_l, fontweight: normal,}}>{t('next')}</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={{ width: '90%', alignSelf: 'center',  height: 50 }}>
                    <LottieView source={btn_loader} autoPlay loop />
                  </View>
                }

              </View>

        </Modal>
    );
  };



  const book_confirm = () => {

    const check_confirm = () => {
        payment_method();
    };

    // Utility function to format date
    const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
    };

     const renderItem = ({ item }) => (
        <View >
          <Text style={{  color: colors. text_container_bg, fontSize: f_m, fontWeight: 'normal', padding: 5}}> {formatDate(item)} </Text>
        </View>
      );

    return(
      <Modal
         animationType="slide"
         transparent={true}
         visible={book_confirm_visible}
         onClose= {onClose}
       >
         <View style={{ backgroundColor:colors.theme_dark, width: '100%',padding:10, bottom: 0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

         {search_status == 0 ?

             <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
             <TouchableOpacity onPress={() => {book_confirm_func(false, from)}}>
                <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 27,}} />
             </TouchableOpacity>

               <Text style={{ color: colors.theme_fg_two, fontSize: 25, fontWeight: 'bold',textAlign: 'center'}}>{t('bookingSummary')}</Text>
             <TouchableOpacity onPress={booking_cancel_alert}>
               <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
             </TouchableOpacity>

             </View>
             :
             <Text style={{ color: colors.warning, fontSize: 18, padding:5, fontWeight: 'bold',textAlign: 'center'}}>{t('pleasewaitFindStaff')}</Text>
         }


         <View style={{margin:10}}/>

            <View style={{alignItems: 'center'}}>
           <View style={{ flexDirection: 'row', padding: 20, width: '90%',height: 'auto', borderRadius: 15,justifyContent: 'space-around', backgroundColor: '#D9E3FF' }}>
            <Image
              style={{ height: 50, width: 50 }}
              source={{ uri: img_url + active_speciality_type.active_icon }}
            />
           <View>
                <Text style={{ color: 'black', fontSize: f_m, fontWeight: 'normal'}}>{t('youAreHiring')}</Text>
                <Text style={{ color: 'black', fontSize: f_xl, fontWeight: 'bold'}}>{active_speciality_type.speciality_type}</Text>
            </View>
           </View>
           </View>

           <View style={{margin:5}}/>

           <View style={{alignItems: 'center', justifyContent:'center'}}>
             <View style={{ flexDirection: 'row', padding: 10, width: '90%',height: 'auto', borderRadius: 10,justifyContent: 'space-between', backgroundColor: colors.medics_green }}>

            <View style={{width:'40%', alignItems:'center'}}>

            {from === 'Later'? (
            <FlatList
                    data={Object.keys(selectedDates)}
                    renderItem={renderItem}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />

              ): from === 'Today' && selected_package.id !=11 && selected_package.id !=10 && selected_package.id !=17? (
                 <Text style={{ color: colors. text_container_bg, fontSize: f_m, fontWeight: 'normal', padding: 5, alignSelf:'center' }}>{t('now')}</Text>
              ) : (
                 <Text style={{ color: colors. text_container_bg, fontSize: f_m, fontWeight: 'normal', padding: 5, alignSelf:'center' }}>{t('today')}</Text>
              )
            }
            </View>
               <View style={{height: 30, width: 2, backgroundColor: colors.text_container_bg, borderRadius: 10}} />
                <Text style={{ color: colors. text_container_bg, fontSize: f_m, fontWeight: 'normal', padding: 5 }}>{selectedTime}</Text>
                </View>
           </View>

          <View style={{margin:5}}/>

           <View style={{alignItems: 'center'}}>
           <View style={{flexDirection: 'row',justifyContent: 'space-between', width:'90%'}}>
                <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontWeight: 'normal', padding: 5 }}>{t('package')}</Text>
                <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontWeight: 'normal', padding: 5 }}>{selected_package.label === selected_package.value ? selected_package.label+' ' +t('hrs') : selected_package.label }</Text>
           </View>
           {Object.keys(selectedDates).length != 0 && selected_package.id != 11?
             <View style={{flexDirection: 'row',justifyContent: 'space-between', width:'90%'}}>
                  <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontWeight: 'normal', padding: 5 }}>{t('days')}</Text>
                  <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontWeight: 'normal', padding: 5 }}>{Object.keys(selectedDates).length === 1 ? Object.keys(selectedDates).length +' '+ t('day') : Object.keys(selectedDates).length +' '+t('days_Day')}</Text>
             </View>
           :null
           }
           </View>

            <View style={{alignItems: 'center'}}>
              <View style={{margin:7,height:1, width: '90%', borderWidth:1, borderColor: colors.theme_fg_two, borderRadius: 10}}/>
            </View>

          <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row',justifyContent: 'space-between', width:'90%'}}>
                 <Text style={{ color: colors.theme_fg_two, fontSize: f_l, fontWeight: 'bold', padding: 5 }}>{t('totalPrice')}</Text>
                 <Text style={{ color: colors.medics_green, fontSize: f_l, fontWeight: 'bold', padding: 5 }}>{t('rs')} {estimation_rate}</Text>
            </View>
          </View>

            <View style={{alignItems: 'center'}}>
              <Text style={{ color: colors.theme_fg_two, fontSize: 14, fontWeight: 'bold', padding: 5 }}>{t('nurseAcceptNotification')}</Text>
            </View>

           <View style={{ margin: 10 }} />
           <View style ={{flexDirection: 'row', justifyContent:'center', }}>

              {search_status == 0 ?
              <>
              {loading == false ?

            <View style ={{flexDirection: 'row', justifyContent:'center',}}>
                  <TouchableOpacity onPress={() => payment_option_func(true)} style={{ alignItems: 'center', justifyContent: 'center', width: 150, height: 50, backgroundColor: colors.medics_blue, borderRadius: 10 }}>
                        <Text style={{ color: 'white', fontSize: f_m, fontWeight: 'normal' }}>{t('confirm')}</Text>
                    </TouchableOpacity>
            </View>
            :
            <View style={{ width: '90%', alignSelf: 'center', height: 50 }}>
              <LottieView source={btn_loader} autoPlay loop />
            </View>
          }


</>
                  :

                  <>
                  <View style={{ flexDirection: 'row',justifyContent:'space-between', width:'80%',  }}>
                    <View>
                      <TouchableOpacity onPress = {get_request_id} style={{ alignItems: 'center', justifyContent: 'center', width: 150, height: 50, backgroundColor: colors.error, borderRadius: 10 }}>
                          <Text style={{ color: 'white', fontSize: f_m, fontWeight: 'normal' }}>{t('cancel')}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width:'90%',  height: 50}}>
                      <LottieView source={searching_loader}
                      autoPlay loop
                      />
                    </View>
                  </View>
                  </>
                }
                </View>

           <View style={{ marginBottom: Platform.OS === 'ios' ? insets.bottom : 0 }} />
         </View>

      </Modal>
    );
  };



    const payment_method = () => {

      const check_confirm = () => {
             if(wallet <= estimation_rate){
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
          {item.id == 2 && estimation_rate > WalletAmount ?
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

                {search_status == 0 ?
                <>
                {loading == false ?

                <TouchableOpacity onPress={() => payment_done()} style={{ flexDirection: 'row', alignItems:'center', justifyContent:'center', width: '100%', borderRadius:15, backgroundColor: '#1C1C1C'}}>
                    <View style={{width:'75%', height:'100%', justifyContent:'space-between', alignItems:'center', flexDirection: 'row', paddingVertical: 10}}>
                        <Text style={{ color: 'white', fontSize: 25, fontweight: normal }}>Book Now</Text>
                        <Text style={{ color: 'white', fontSize: 20, fontweight: normal }}>●</Text>
                        <Text style={{ color: '#4BBE2E', fontSize: 25, fontweight: normal }}>{t('rs')} {estimation_rate}</Text>
                    </View>
                </TouchableOpacity>
              :
              <View style={{ width: '90%', alignSelf: 'center', height: 50 }}>
                <LottieView source = {btn_loader} autoPlay loop />
              </View>
            }


  </>
                    :

                    <>
                    <View style={{ flexDirection: 'row',justifyContent:'space-between', width:'80%',  }}>
                      <View>
                        <TouchableOpacity onPress = {get_request_id} style={{ alignItems: 'center', justifyContent: 'center', width: 150, height: 50, backgroundColor: colors.error, borderRadius: 10 }}>
                            <Text style={{ color: 'white', fontSize: f_m, fontWeight: 'normal' }}>{t('cancel')}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{width:'90%',  height: 50}}>
                        <LottieView source={searching_loader}
                        autoPlay loop
                        />
                      </View>
                    </View>
                    </>
                  }
                  </View>

             <View style={{ marginBottom: Platform.OS === 'ios' ? insets.bottom : 0 }} />
           </View>

        </Modal>
      );
    };

    const payment_success = () =>{

    return(
        <Modal
          animationType="slide"
          transparent={true}
          visible={paySuccessVisible}
          onClose= {onClose}
        >
        <View style={{ backgroundColor:colors.theme_dark, width: '70%',padding:15, paddingVertical: 30, borderRadius: 10, top: '25%', position: 'absolute', alignItems: 'center', alignSelf: 'center' }}>


         <Image source={success_icon} style={{height: 175, aspectRatio: 1}}/>
            <Text style={{fontweight: bold, fontSize: 20, marginTop: 10, color: colors.theme_fg_two}}>SUCCESS</Text>
            <Text style={{fontweight: bold, fontSize: 16, marginTop: 10, color: colors.theme_fg_two}}>Your payment was successful. </Text>
            <TouchableOpacity onPress = {()=>{setPaySuccessVisible(false)}} style={{ backgroundColor: '#E24C4B', width:'100%',padding: 7, marginTop: 15, borderRadius: 10 }}>
                <Text style={{ color: 'white', fontSize: 16, fontweight: bold, alignSelf: 'center' }}>Done</Text>
            </TouchableOpacity>
        </View>
        </Modal>
      );
    };

    const payment_failure = () =>{

      return(
          <Modal
            animationType="slide"
            transparent={true}
            visible={payFailVisible}
            onClose= {onClose}
          >
          <View style={{ backgroundColor:colors.theme_dark, width: '70%',padding:15, paddingVertical: 30, borderRadius: 10, top: '25%', position: 'absolute', alignItems: 'center', alignSelf: 'center' }}>
            <Image source={unsuccess_icon} style={{height: 175, aspectRatio: 1}}/>
                <Text style={{fontweight: bold, fontSize: 20, marginTop: 10, color: colors.theme_fg_two}}>UNSUCCESS</Text> 
            <Text style={{fontweight: bold, fontSize: 16, marginTop: 10, textAlign:'center', color: colors.theme_fg_two}}>Your payment was unsuccessful. </Text> 

            <TouchableOpacity  onPress = {()=>{setPayFailVisible(false)}}  style={{ backgroundColor: '#3EB655', width:'100%',padding: 7, marginTop: 15, borderRadius: 10 }}> 
               <Text style={{ color: 'white', fontSize: 16, fontweight: bold, alignSelf: 'center' }}>Done</Text> 
            </TouchableOpacity> 
  
          </View>
          </Modal>
        );
      };


  const available_times = () =>{
    const[selected_category, setSelectedCategory] = useState("");
    const[time_raw, setTimeRaw] = useState([]);
   // Function to generate time ranges
   function generateTimeRanges(hours) {
     const minStartTime = 8; // 8 AM
     const maxEndTime = 20; // 8 PM
     const timeRanges = [];

     for (let startHour = minStartTime; startHour <= maxEndTime - hours; startHour++) {
       let endHour = startHour + hours;
       if (endHour <= maxEndTime) {
         timeRanges.push(`${formatTime(startHour)} to ${formatTime(endHour)}`);
       }
     }
     return timeRanges;
   }

   // Helper function to format time
   function formatTime(hour) {
     const period = hour >= 12 ? 'PM' : 'AM';
     const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
     return `${formattedHour} ${period}`;
   }


    const check_confirm = () =>{
      if (selectedTime != null) {

        // Extract the first and last time from the range
        const [firstPart, lastPart] = selectedTime.split(" to ");

        // Helper function to convert time to 24-hour format and append ":00:00"
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

        const firstFormattedTime = convertTo24HourFormat(firstPart);
        const lastFormattedTime = convertTo24HourFormat(lastPart);
        setStartTime(firstFormattedTime);
        setEndTime(lastFormattedTime);

        // Concatenate dates with the first formatted time
        const concatenatedDates = Object.keys(selectedDates).map(date => `${date} ${firstFormattedTime}`);
        setdatetime(concatenatedDates);

        book_confirm_func(true, "Later");
      }
      else{
        dropDownAlertRef.alertWithType('error', t('notSelected'), t('selectOneOption'));
      }
    };

    // Component to render each item
    const render_packages = ({ item }) => {
        const isSelected = item === selectedTime;

        return (
          <TouchableOpacity
            style={[styles.itemContainer, isSelected && styles.selectedItemContainer]}
            onPress={() => setSelectedTime(item)}
          >
            <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      };

    return(
        <Modal
          animationType="slide"
          transparent={true}
          visible={available_times_visible}
          onClose= {onClose}
        >
         <View style={{ backgroundColor:colors.theme_dark , width: '100%',padding:10, bottom: 0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

                <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={()=> {available_times_func(false)}}>
                      <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 25, }} />
                    </TouchableOpacity>
                    <Text style={{  color: colors.theme_fg_two, fontSize: f_l, fontweight: bold,textAlign: 'center', width:'70%' }}>{t('availableTimes')}</Text>
                     <TouchableOpacity onPress= {booking_cancel_alert}>
                        <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
                     </TouchableOpacity>

        {/*             <Text style={{ color: colors.theme_fg_two, fontSize: f_m, fontweight: bold,   }}>Booking</Text> */}
                </View>


                  <View style={{margin:5}}/>

                    <FlatList
                      data={generateTimeRanges(parseInt(selected_package.value, 10))}
                      renderItem={render_packages}
                      keyExtractor={(item, index) => index.toString()}
                      style={styles.list}
                      showsVerticalScrollIndicator={true}
                    />
                    <View style={{margin:10}}/>



                   {loading == false ?
                  <View style ={{flexDirection: 'row', justifyContent:'center',}}>
                    <TouchableOpacity onPress={()=>{check_confirm()}} style={{flexDirection:'row', alignItems:'center',fontSize: f_l, justifyContent:'center',padding:5, width:150, height:50,marginBottom:15, backgroundColor:colors.medics_blue, borderRadius:10}}>
                        <Text style={{ color: 'white', fontSize: f_l, fontweight: normal,}}>{t('next')}</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={{ width: '90%', alignSelf: 'center' }}>
                    <LottieView source={btn_loader} autoPlay loop />
                  </View>
                }

              </View>

        </Modal>
    );
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
          source={{uri: url + estimation_rate}}
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


 const showAlert = () =>
  Alert.alert(
    t('notice'),
    t('insufficientBalance'),
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
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    {
      cancelable: true,
      onDismiss: () => console.log('dismissed'),
    },
  );

  const closeEsewaModal = () => {
    setEsewaModalVisible(false);
  };

  const show_hold_amount_Alert = (holding_amount) =>
    Alert.alert(
      t('notice'),
      t('someAmts') +holding_amount+ t('forPrevBooking'),
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
        onPress: () => onClose(),
        style: 'cancel',
      },
    ],
  {
    cancelable: true,
    onDismiss: () => console.log('dismissed'),
  },
);


const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    openButton: {
      backgroundColor: colors.medics_blue,
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      marginTop: 15
    },
    modifyButton: {
      backgroundColor: 'grey', // a light grey color
      borderRadius: 10,
      padding: 10,
      elevation: 2,
      marginTop: 15
    },
    textStyle: {
      color: 'white',
      fontweight: 'bold',
      textAlign: 'center'
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center'
    },
    overlay:{
      ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    itemContainer: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.medics_grey,
       shadowColor: "#000",
       shadowOffset: {
         width: 0,
         height: 3,
       },
       shadowOpacity: 0.2,
       shadowRadius: 5,
    },
    selectedItemContainer: {
      backgroundColor: colors.medics_blue, // Change to your desired highlight color
    },
    itemText: {
      color: colors.theme_fg_two,
      fontSize: 16,
      fontWeight: 'normal',
    },
    selectedItemText: {
      color: 'white', // Change to your desired text color for selected item
    },
    list: {
      height:200,

    },
    radioButtonContainer: {
      flexDirection: 'row',
      height: 75,
      width: '100%',
      alignSelf: 'center',
      borderWidth:1,
      borderColor: '#f2f2f2',
      marginBottom:10,
      justifyContent: 'space-between',
      padding: 10,
      shadowColor: colors.medics_grey,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      backgroundColor: colors.theme_dark,
      borderRadius: 10,

    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.theme_fg_two,
    }
  });


//  visible={step_1_visible}
  return (
    <>


    <Modal
      animationType="slide"
      transparent={true}
      visible={step_1_visible}
      onRequestClose={onClose}
    >
      <View style = {{backgroundColor:colors.theme_dark, width:'100%',padding:10, bottom:0, position: 'absolute', borderTopLeftRadius: 20, borderTopRightRadius:20 }}>

       <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>
       <TouchableOpacity onPress= {onClose}>
            <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_two} style={{ fontSize: 25, }} />
        </TouchableOpacity>
        <Text style={{color: colors.theme_fg_two, fontSize: f_l, fontweight: bold, textAlign: 'center', width:'80%'}}>{t('whichstaff')}</Text>
        <TouchableOpacity onPress= {onClose}>
           <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} style={{ fontSize: 27, }} />
        </TouchableOpacity>
        </View>
        <View style={{margin:10}}/>

        <View style={{alignItems: 'center'}}>
          <Text style={{ color: colors.medics_grey, fontSize: f_xl, fontweight: normal,}}>{t('nurseExample')}</Text>
        </View>
          <View style={{margin:10}}/>

            <View style ={{flexDirection: 'row', justifyContent:'space-between',}}>
                <TouchableOpacity onPress={() => {step_1_no_visible_func(true)}} style={{alignItems:'center', justifyContent:'center', width:'45%', height:50, backgroundColor:colors.icon_inactive_color, borderRadius:10}}>
                    <Text style={{ color: 'white', fontSize: f_m, fontweight: normal,}}>{t('no')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {step_1_yes_visible_func(true)}} style={{alignItems:'center', justifyContent:'center', width:'45%', height:50, backgroundColor:colors.medics_blue, borderRadius:10}}>
                    <Text style={{ color: 'white', fontSize: f_m, fontweight: normal,}}>{t('yes')}</Text>
                </TouchableOpacity>
           </View>
           <View style = {{marginBottom:Platform.OS==='ios'? insets.bottom: null}}/>
      </View>


    </Modal>

    {Step_1_Yes()}
    {Step_1_No()}
    {now_later()}
    {now_packages()}
    {all_packages()}
    {available_times()}
    {date_select()}
    {drop_down_alert()}
    {book_confirm()}
    {payment_method()}
    {esewa_modal()}
    {payment_success()}
    {payment_failure()}
    </>

  );
};

function mapStateToProps(state) {
    return {
        paypal_payment_status: state.payment.paypal_payment_status,
        esewa_payment_status: state.payment.esewa_payment_status

    };
}

const mapDispatchToProps = (dispatch) => ({
    paypalPaymentStatus: (data) => dispatch(paypalPaymentStatus(data)),
    esewaPaymentStatus: (data) => dispatch(esewaPaymentStatus(data))

});

export default connect(mapStateToProps, mapDispatchToProps)(BookingProcess);
