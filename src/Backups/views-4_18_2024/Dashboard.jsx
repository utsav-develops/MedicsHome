import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Animated,
  StatusBar,
  TextInput,
  Keyboard,
  FlatList,
  Platform
} from "react-native";
import { connect } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
;import { useNavigation,useRoute  } from "@react-navigation/native";
import { RectButton } from 'react-native-gesture-handler';
import { screenHeight, screenWidth,favourites_status, work_details, check_policies, search_loader, normal, promo_codes, bold, GOOGLE_KEY, month_names, money_icon, discount_icon, no_favourites, add_favourite, get_home, api_url, img_url, get_estimation_rate, pin_marker, regular, get_zone, btn_loader, booking_confirm, work_request_cancel, f_m } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import DropShadow from "react-native-drop-shadow";
import { Badge, Divider } from '@rneui/themed';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from "axios";
import LottieView from 'lottie-react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropdownAlert from 'react-native-dropdownalert';
import database from '@react-native-firebase/database';
import Modal from "react-native-modal";
import Dialog, {
  DialogTitle,
  SlideAnimation,
  DialogContent,
  DialogFooter,
  DialogButton,
} from "react-native-popup-dialog";
import AddressVerify from '../views/AddressVerify';
import PaymentMethod from '../views/PaymentMethod';
import RepeatTimes from '../views/RepeatTimes';
import PrivacyPolicies from '../views/PrivacyPolicies';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import RNPickerSelect from 'react-native-picker-select';
import { blueviolet } from "color-name";


const Dashboard = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const search = useRef();
  const map_ref = useRef();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  let dropDownAlertRef = useRef();
  const fav_RBSheet = useRef();
  const [on_loaded, setOnLoaded] = useState(0);
  const [active_location, setActiveLocation] = useState(1);
  const [region, setRegion] = useState(props.initial_region);
  const [work_types, setWorkTypes] = useState([]);
  const [promo_list, setPromoList] = useState([]);
  const [promo, setPromo] = useState(0);
  const [work_sub_types, setWorkSubTypes] = useState([]);
  const [estimation_rates, setEstimationRates] = useState([]);
  const [online_specialities, setOnlineSpecialities] = useState([]);
  const [workplace_favourites, setWorkplaceFavourties] = useState([]);
  const [active_work_type, setActiveWorkType] = useState(0);
  const [active_work_sub_type, setActiveWorkSubType] = useState(0);
  const [active_speciality_type, setActiveSpecialityType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search_loading, setSearchLoading] = useState(false);
  const [current_location_status, setCurrentLocationStatus] = useState(true);
  const [is_date_picker_visible, setDatePickerVisibility] = useState(false);
  const [pickup_date, setPickupDate] = useState(new Date());
  const [pickup_date_label, setPickupDateLabel] = useState('Now');
  const [packages, setPackages] = useState([]);
  const [package_hr, setPackageHr] = useState(0);
  const [package_km, setPackageKm] = useState(0);
  const [package_id, setPackageId] = useState(0);
  const [is_mount, setIsMount] = useState(0);
  const [km, setKm] = useState(0);
  const [search_status, setSearchStatus] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [is_modal_visible, setModalVisible] = useState(false);
  const duration = 500;
  const [work_request_id, setWorkRequestId] = useState(0);
  const [address_status, setaddressstatus] = useState();
  const [activepayment, setActivePayment] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const repeats = route.params?.counter;
  const [selectedHours, setSelectedHours] = useState();
  const [selectedDays, setSelectedDays] = useState(1);



  //Address
  const [pickup_address, setPickupAddress] = useState('');
  const [pickup_lat, setPickupLat] = useState(props.initial_lat);
  const [pickup_lng, setPickupLng] = useState(props.initial_lng);

  const [fav_lat, setfavlat] = useState();
  const [fav_lng, setfavlng] = useState();

  const [drop_address, setDropAddress] = useState('');
  const [drop_lat, setDropLat] = useState(0);
  const [drop_lng, setDropLng] = useState(0);

  const [tmp_address, setTmpAddress] = useState('');
  const [tmp_lat, setTmpLat] = useState(props.initial_lat);
  const [tmp_lng, setTmpLng] = useState(props.initial_lng);


  //Screen Home
  const home_comp_1 = useRef(new Animated.Value(-60)).current;
  const home_comp_2 = useRef(new Animated.Value(screenHeight + 220)).current;

  //Screen Location
  const drop_comp_1 = useRef(new Animated.Value(-110)).current;
  const drop_comp_2 = useRef(new Animated.Value(screenHeight + 150)).current;
  const drop_comp_3 = useRef(new Animated.Value(-150)).current;
  const drop_comp_4 = useRef(new Animated.Value(screenHeight + (screenHeight - 100))).current;

  //Screen Booking
  const book_comp_1 = useRef(new Animated.Value(screenHeight + 200)).current;



const [counter, setCounter] = useState({ value: packages[0]?.hours, unit: 'Hr' });
const [currentPackageIndex, setCurrentPackageIndex] = useState(0);

const handleIncrement = () => {
  const nextIndex = (currentPackageIndex + 1) % packages.length;
  setCurrentPackageIndex(nextIndex);
  const nextPackage = packages[nextIndex];
  setCounter({ ...counter, value: nextPackage.hours });
};

const handleDecrement = () => {
  const prevIndex = (currentPackageIndex - 1 + packages.length) % packages.length;
  setCurrentPackageIndex(prevIndex);
  const prevPackage = packages[prevIndex];
  setCounter({ ...counter, value: prevPackage.hours });
};

const getDurationText = () => {
  return `${counter.value} hr${counter.value !== 1 ? 's' : ''} - ${t('duration')}`;
};

const selectedData = packages.find((data) => data.hours === counter.value);


useEffect(() => {

  if (packages.length > 0) {
    setCounter({ value: packages[0].hours, unit: t('hours') });
  }
}, [packages]);

useEffect(() => {
  setPackageHr(counter.value);
}, [counter]);





  useEffect(() => {

    screen_home_entry();
    get_home_api();
    booking_sync();
    get_specialities();
    call_promo_codes();
    const unsubscribe = navigation.addListener("focus", async () => {
      setIsMount(1);
    });
    setTimeout(() => { setOnLoaded(1) }, 2000)
    return (
      unsubscribe
    );
  }, []);

  const call_promo_codes = () => {
    axios({
      method: 'post',
      url: api_url + promo_codes,
      data: { lang: global.lang, workplace_id: global.id }
    })
      .then(async response => {
        setPromoList(response.data.result)
      })
      .catch(error => {
        alert('Sorry something went wrong')
      });
  }
   const call_address_verify = (lat, lng) => {
     return new Promise((resolve, reject) => {
       axios({
         method: 'post',
         url: api_url + favourites_status,
         data: { lat: lat, lng: lng }
       })
       .then(response => {
         setaddressstatus(response.data.result);
         resolve(response.data.result); // Resolve with the result
       })
       .catch(error => {
         console.error(error);
         reject(error); // Reject with the error
       });
     });
   }


  const call_apply_promo = (data) => {
    setPromo(data.id);
    toggleModal();
    get_estimation_rate_api(pickup_lat, pickup_lng, drop_lat, drop_lng, package_id, active_work_sub_type, data.id);
  }


  const booking_sync = () => {
    database().ref(`workplaces/${global.id}`).on('value', snapshot => {
      const snapshotValue = snapshot.val();
      if (snapshotValue) {
        setSearchStatus(snapshotValue.is_searching);
        if (snapshotValue.booking_id != null && snapshotValue.booking_id != 0) {
          if (is_mount === 0) {
            setIsMount(1);
            booking_exit();
            setActiveWorkType(1);
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



  const toggleModal = () => {
    setModalVisible(!is_modal_visible);
  };

  const get_specialities = () => {
    database().ref(`staffs`).on('value', snapshot => {
      setOnlineSpecialities([]);
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val() != null) {
          if (Array.isArray(childSnapshot.val())) {
            childSnapshot.val().map((value) => {
              if (value != null && value.booking && value.booking.booking_status == 0 && value.online_status == 1) {
                setOnlineSpecialities(prevArray => [...prevArray, { latitude: value.geo.lat, longitude: value.geo.lng, speciality_slug: value.speciality_slug, bearing: value.geo.bearing }])
              }
            })
          } else {
            {
              Object.values(childSnapshot.val()).map(item => {
                if (item != null && item.booking && item.booking.booking_status == 0 && item.online_status == 1) {
                  setOnlineSpecialities(prevArray => [...prevArray, { latitude: item.geo.lat, longitude: item.geo.lng, speciality_slug: item.speciality_slug, bearing: item.geo.bearing }])
                }
              })
            }
          }
        }
      });
    });
  }

  const render_specialities = () => {
    return online_specialities.map((marker) => {
      //console.log(marker.bearing);
      if (marker.speciality_slug == "nurse") {
        return (
          <Marker coordinate={marker} rotation={marker.bearing}>
            <Image
              style={{ flex: 1, height: 20, width: 20 }}
              source={require('.././assets/img/tracking/nurse.png')}
            />
          </Marker>
        );
      } else if (marker.speciality_slug == "dentist") {
        return (
          <Marker coordinate={marker}>
            <Image
              style={{ flex: 1, height: 20, width: 20 }}
              source={require('.././assets/img/tracking/nurse.png')}
            />
          </Marker>
        );
      } else if (marker.speciality_slug == "therapist") {
        return (
          <Marker coordinate={marker}>
            <Image
              style={{ flex: 1, height: 20, width: 20 }}
              source={require('.././assets/img/tracking/nurse.png')}
            />
          </Marker>
        );
      }
    });
  }

  const set_default_date = async (currentdate, type) => {
    let datetime =
      (await (currentdate.getDate() < 10 ? "0" : "")) +
      currentdate.getDate() +
      "-" +
      (currentdate.getMonth() + 1 < 10 ? "0" : "") +
      (currentdate.getMonth() + 1) +
      "-" +
      currentdate.getFullYear() +
      " " +
      (currentdate.getHours() < 10 ? "0" : "") +
      currentdate.getHours() +
      ":" +
      (currentdate.getMinutes() < 10 ? "0" : "") +
      currentdate.getMinutes() +
      ":" +
      (currentdate.getSeconds() < 10 ? "0" : "") +
      currentdate.getSeconds();
    let label =
      (await (currentdate.getDate() < 10 ? "0" : "")) +
      currentdate.getDate() +
      " " +
      month_names[currentdate.getMonth()] +
      ", " + formatAMPM(currentdate);
    if (type == 0) {
      setPickupDateLabel('Now');
    } else {
      setPickupDateLabel(label);
    }

    setPickupDate(datetime);
  };

  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  const screen_home_entry = () => {
    Keyboard.dismiss();
    Animated.timing(home_comp_1, {
      toValue: 60,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(home_comp_2, {
      toValue: (screenHeight),
      duration: duration,
      useNativeDriver: true,
    }).start();
    setPromo(0);
  }

  const screen_home_exit = () => {
    Animated.timing(home_comp_1, {
      toValue: -60,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(home_comp_2, {
      toValue: (screenHeight + 220),
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  const location_entry = () => {
    Animated.timing(drop_comp_1, {
      toValue: 75,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_2, {
      toValue: (screenHeight),
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_3, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  const location_exit = () => {
    Animated.timing(drop_comp_1, {
      toValue: -110,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_2, {
      toValue: (screenHeight + 150),
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_3, {
      toValue: -150,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_4, {
      toValue: screenHeight + (screenHeight - 100),
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  const search_entry = () => {
    Animated.timing(drop_comp_4, {
      toValue: 100,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  const search_exit = () => {
    Keyboard.dismiss();
    Animated.timing(drop_comp_4, {
      toValue: screenHeight + (screenHeight - 100),
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  const booking_entry = () => {
    location_exit();
    set_default_date(new Date(), 0);
    setCurrentLocationStatus(false);
    Animated.timing(book_comp_1, {
      toValue: 200,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  const booking_exit = () => {
    setCurrentLocationStatus(true);
    Animated.timing(book_comp_1, {
      toValue: screenHeight + 200,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }
  const booking_exit_to_home = () => {
    setCurrentLocationStatus(true);
    screen_home_entry();
    Animated.timing(book_comp_1, {
      toValue: screenHeight + 200,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  const check_address_details = () => {
    alert(drop_address);
  }

  const is_focus = () => {
    search_entry();
  }

  const region_change = (region) => {
    if (on_loaded == 1) {
      screen_home_exit();
      booking_exit();
      location_entry();
      onRegionChange(region, 'T');
    }
    else if (on_loaded == 2){
      setOnLoaded(1);
      onRegionChange(region, 'T');
    }
    else {
      onRegionChange(region, 'P');
    }
  }

  const onRegionChange = async (value, type) => {
    //console.log(value);
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + value.latitude + ',' + value.longitude + '&key=' + GOOGLE_KEY)
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.results[2].formatted_address != undefined) {

          if (type == 'P') {
            setPickupAddress(responseJson.results[2].formatted_address);
            setPickupLat(value.latitude);
            setPickupLng(value.longitude);
          } else {
            setTmpAddress(responseJson.results[2].formatted_address);
            setTmpLat(value.latitude);
            setTmpLng(value.longitude);
            search.current?.setAddressText(responseJson.results[2].formatted_address);
          }
          //this.get_distance();
          //this.find_city(responseJson.results[0]);
        }
      })
  }

  const confirm_location = async () => {

    if (active_location == 1) {
      setPickupAddress(tmp_address);
      setPickupLat(tmp_lat);
      setPickupLng(tmp_lng);
    } else {
      setDropAddress(tmp_address);
      setDropLat(tmp_lat);
      setDropLng(tmp_lng);

    }
    if (pickup_address != '' && active_location == 2) {
      booking_entry();
      
      get_estimation_rate_api(pickup_lat, pickup_lng, tmp_lat, tmp_lng, 0, active_work_sub_type, 0);
    } else if (drop_address != '' && active_location == 1) {
      booking_entry();
      get_estimation_rate_api(tmp_lat, tmp_lng, drop_lat, drop_lng, 0, active_work_sub_type, 0);
    } else {
      back_to_home_screen();
    }
  }

  const select_package = (data, counter) => {

        screen_home_exit();
    setPackageId(data.id);
    setPackageHr(0);
    setPackageHr(counter.unit === 'Hr' ? counter.value : 0);

    booking_entry();
    get_estimation_rate_api(tmp_lat, tmp_lng, drop_lat, drop_lng, data.id,
            0, 0
    );
  }
  const select_package_new = (id, hours, days) => {
    setPackageId(id);
    setPackageHr(0);
    setPackageHr(hours);
    let total_hours = hours * days
    get_estimation_rate_api(tmp_lat, tmp_lng, drop_lat, drop_lng, id, 0 ,0, total_hours );
};

  const check_policy = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: api_url + check_policies,
        data: { workplace_id : global.id}
      })
      .then(response => {
        setLoading(false);
        resolve(parseFloat(response.data.status));
      })
      .catch(error => {
        setLoading(false);
        reject(error);
      });
    });
  }

  const validate_before_booking = async () => {
      const policyStatus = await check_policy();
      const address_status = await call_address_verify(pickup_lat, pickup_lng);
      
      if(0<=wallet)
      {
        if(policyStatus == 1)
        {
            if(address_status !== undefined && address_status.toString()==='Approved' && address_status !== null)
            {
                call_zone();

            }
            else
            {
                dropDownAlertRef.alertWithType('error', t('locationNotApproved'), t('approveYourLocation'));
            }
         }
         else
         {
              navigation.navigate('PrivacyPolicies',{from: "booking"});
          }
      }
      else
      {
      dropDownAlertRef.alertWithType('error', t('sorry'), t('notSufficientBalanceTryAgain'));
      }
  };



  const handlePackageSelection = () => {
    const selectedData = packages.find((data) => data.hours === String(counter.value));
    if (selectedData && selectedData.id !== undefined) {
      select_package(selectedData, counter); // Pass the entire counter object
    } else {
      // Handle the error case where no matching package is found
      console.error('No package found for the selected hours:', counter.value);
    }
  };





  const get_location = (data, details, type) => {
    setTmpAddress(data.description);
    setTmpLat(details.geometry.location.lat);
    setTmpLng(details.geometry.location.lng);
    search_exit();
    set_location(details.geometry.location.lat, details.geometry.location.lng);
  }

  const set_location = (lat, lng) => {
  const fav_region = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
    map_ref.current.animateToRegion(fav_region, 1000);
  };

  const back_to_home_screen = () => {
    location_exit();
    select_package_new(0, 6, 1);
    booking_entry();
  }

  const open_location = async (location) => {
    search.current?.setAddressText('');
    search_entry();
    setActiveLocation(location)
    screen_home_exit();
    location_entry();
  }

  const load_work_types = () => {
    let icon = '';
    return work_types.map((data) => {
      if (data.id == active_work_type) {
        icon = data.active_icon;
      } else {
        icon = data.inactive_icon;
      }
      return ("")
    })
  }

  const estimation_rate_list = () => {
    return estimation_rates.map((data) => {
      return (
        <DropShadow
          style={{
            width: '100%',
            marginBottom: 5,
            marginTop: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: active_speciality_type == data.id ? 0.3 : 0,
            shadowRadius: 5,
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={change_speciality_type.bind(this, data.id, data.rates.total_rate)} style={{ width: '100%', backgroundColor: colors.theme_bg_three, padding: 10, flexDirection: 'row', borderRadius: 10 }}>
            <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ height: 50, width: 50 }} >
                <Image style={{ height: undefined, width: undefined, flex: 1 }} source={{ uri: data.active_icon }} />
              </View>
            </View>
            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 14, fontWeight: 'bold' }}>{data.speciality_type}</Text>
              <View style={{ margin: 2 }} />
              <Text numberOfLines={1} style={{ color: colors.text_grey, fontSize: 12, fontWeight: 'normal' }}>{data.description}</Text>
            </View>
            <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 14, fontWeight: 'normal', letterSpacing: 1 }}>{global.currency}{data.rates.total_rate}</Text>
              {promo != 0 &&
                <View style={{ marginTop: 4, backgroundColor: colors.success_background, borderRadius: 5, padding: 2, paddingLeft: 5, paddingRight: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <Text ellipsizeMode='tail' style={{ color: colors.success, fontSize: 8, fontWeight: 'normal' }}>Promo Applied</Text>
                </View>
              }
            </View>
          </TouchableOpacity>
        </DropShadow>
      )
    })
  }

  const load_location = (address, lat, lng) => {
    setOnLoaded(2);
    setaddressstatus('');
    back_to_home_screen();
    set_location(lat, lng);
    call_address_verify(parseFloat(lat), parseFloat(lng));
    setPickupLat(parseFloat(lat));
    setPickupLng(parseFloat(lng));
    setPickupAddress(address);
  }

  const favourites_list = () => {
    if (workplace_favourites.length == 0) {
      return (
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ height: 150, width: 150, alignSelf: 'center' }}>
            <LottieView source={no_favourites} autoPlay loop />
          </View>
          <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 12, color: colors.text_grey, fontweight: regular }}>No data found</Text>
        </View>
      )
    } else {
      return workplace_favourites.map((data) => {
        return (
          <TouchableOpacity activeOpacity={1} onPress={load_location.bind(this, data.address, data.lat, data.lng)} style={{ width: '100%', flexDirection: 'row', borderBottomWidth: 0.5, paddingBottom: 10, paddingTop: 10 }}>
            <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
              <Icon type={Icons.MaterialIcons} name="near-me" color={colors.icon_inactive_color} style={{ fontSize: 22 }} />
            </View>
            <View style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 16, color: colors.text_grey, fontweight: regular }}>
              {data.address}

              <TouchableOpacity activeOpacity={1} onPress={() => {navigation.navigate("AddressVerify",{workplace_fav_id:data.id})}} style={{ left:10, justifyContent:'center', alignItems:'flex-start',borderWidth: 1, padding: 10, borderRadius: 10, borderColor: colors.grey }}>
                  <Text style={{ fontSize: 12, color: colors.text_grey, fontWeight: 'bold' }}>{t('verify')}</Text>
              </TouchableOpacity>
              </Text>

            </View>
          </TouchableOpacity>

        )
      })
    }
  }

  const change_work_type = async (data) => {
    setActiveWorkType(2);
    setWorkSubTypes(data.work_sub_type);
    if (data.work_sub_type.length > 0) {
      setActiveWorkSubType(data.work_sub_type[0].id)
    } else {
      setActiveWorkSubType(0)
    }
  }

  const get_home_api = async () => {
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + get_home,
      data: { lang: global.lang, workplace_id: global.id },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          setWorkTypes(response.data.result.work_types);
          setPackages(response.data.result.packages);
          setWorkplaceFavourties(response.data.result.workplace_favourites);
          setActiveWorkType(2);
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

  const add_favourite_api = async () => {
    fav_RBSheet.current.close();
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + add_favourite,
      data: { workplace_id: global.id, address: pickup_address, lat: pickup_lat, lng: pickup_lng }
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          dropDownAlertRef.alertWithType('success', t('success'), t('LocAddedInFav'));
          setWorkplaceFavourties(response.data.result);
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

  const get_estimation_rate_api = async (lat1, lng1, lat2, lng2, package_id, sub_type, pr, hours ) => {
      setLoading(true);
    await axios({
      method: "post",
      url: api_url + get_estimation_rate,
      data: { workplace_id: global.id, pickup_lat: lat1, hours: hours, pickup_lng: lng1, drop_lat: lat2, drop_lng: lng2, work_type: 2, promo: pr, lang: global.lang, package_id: package_id, days: 1, work_sub_type: sub_type },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          setEstimationRates(response.data.result['specialities']);
          setWallet(response.data.result['wallet']);
          setKm(response.data.result['specialities'][0].rates.km);
          change_speciality_type(response.data.result['specialities'][0].id, 0);
          if (pr != 0 && response.data.result['specialities'][0].rates.discount <= 0) {
            setPromo(0);
            dropDownAlertRef.alertWithType('error', t('error'), t('promoNotApplied'));
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };


  const call_zone = async () => {
        setLoading(true);
        await axios({
          method: "post",
          url: api_url + get_zone,
          data: { lat: pickup_lat, lng: pickup_lng },
        })
          .then(async (response) => {
            if (response.data.result == 0) {
              setLoading(false);
              dropDownAlertRef.alertWithType('error', t('notAvailable'), t('notAvailableInYourLocation'));
            } else {
              call_booking_confirm(response.data.result);
            }
          })
          .catch((error) => {
            setLoading(false);
            alert("Sorry something went wrong");
          });

  };

  const pickerItems = packages.map(pkg => ({
    id: pkg.hours,
    label: pkg.hours,
    value: pkg.hours

  }));

  const items = [];
  for (let i = 1; i <= 30; i++) {
    items.push({ label: `${i}`, value: i });
  }


  const call_booking_confirm = async (zone) => {
    setLoading(true);
        await axios({
          method: "post",
          url: api_url + booking_confirm,
          data: {
            km: counter.value,
            promo: 0,
            speciality_type: active_speciality_type,
            payment_method: 2,
            workplace_id: global.id,
            work_type: 2,
            surge: 1,
            pickup_address: pickup_address,
            pickup_date: pickup_date,
            pickup_lat: pickup_lat.toFixed(7),
            pickup_lng: pickup_lng.toFixed(7),
            drop_address: "random address",
            drop_lat: 0,
            drop_lng: 0,
            package_id: package_id,
            work_sub_type: active_work_sub_type,
            stops: JSON.stringify([]),
            zone: zone,
            multiple_dates: JSON.stringify([]),
          },
        })
          .then(async (response) => {
            setLoading(false);
            if (response.data.status == 1) {
              setWorkRequestId(response.data.result);
              if (response.data.booking_type == 2) {
                dropDownAlertRef.alertWithType('success', t('bookingPlacedSuccess'), t('seeBookingsinMenu'));
              }
              // booking_exit();
            } else {
              dropDownAlertRef.alertWithType('error', t('sorry'),t('staffnotAvailable'));
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error("error 2: "+error);

            alert('Sorry something went wrong')
          });
  };

  const change_speciality_type = (speciality_type, totalrate) => {
    //alert(speciality_type+'-'+km);
    setActiveSpecialityType(speciality_type);
    setActivePayment(totalrate);
    //setKm(km);
  }

  const show_date_picker = () => {
    setDatePickerVisibility(true);
  };

  const hide_date_picker = () => {
    setDatePickerVisibility(false);
  };

  const handle_confirm = (date) => {
    console.warn("A date has been picked: ", date);
    hide_date_picker();
    set_default_date(new Date(date), 1);
  };

  const navigate_promo = () => {
    //navigation.navigate("Promo")
    setModalVisible(true);
  }

  const change_work_sub_type = (id) => {
    setActiveWorkSubType(id)
    get_estimation_rate_api(pickup_lat, pickup_lng, drop_lat, drop_lng, 0, id, 0);
  }

  const load_work_sub_types = () => {
    return work_sub_types.map((item) => {
      return (
        <TouchableOpacity onPress={change_work_sub_type.bind(this, item.id)} style={[active_work_sub_type == item.id ? styles.segment_active_bg : styles.segment_inactive_bg]}>
          <Text style={[active_work_sub_type == item.id ? styles.segment_active_fg : styles.segment_inactive_fg]}>{item.work_sub_type}</Text>
        </TouchableOpacity>
      )
    })
  }

// const handlePackageSelection = (data) => {
//   // Pass the entire 'data' object to 'select_package'
//   select_package(data);
// };

//   const show_packages = packages.map((data) => {
//     return (
//             <TouchableOpacity key={data.id} onPress={() => handlePackageSelection(data)}
//             style={{
//               width: 130,
//               backgroundColor: 'rgb(255, 255, 255)',
//               borderColor: 'white',
//               marginLeft: 5,
//               marginRight: 5,
//               marginBottom: 5,
//               borderRadius: 20,
//               padding: 5,
//               borderWidth: 1,
//               alignItems: 'center',
//               justifyContent: 'center',
//               // Removed negative margin, adjust this value as needed
//               marginTop: 0,
//             }}
//           >
//             <Text style={{
//               color: colors.theme_fg_two,
//               fontSize: 40,
//               fontWeight: 'bold',
//             }}>
//               {data.hours} Hr
//             </Text>
//             <View style={{ margin: 1 }} />
//             {/* <Text style={{ color: colors.text_grey, fontSize: 15, fontweight: regular }}>{data.kilometers} km</Text>*/}
//           </TouchableOpacity>
//       )
//     }
//     )

  const CustomHeader_hours = () => (
    <View style={{ padding: 10, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Choose Hours</Text>
    </View>
  );

  const CustomHeader_days= () => (
    <View style={{ padding: 10, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Choose Days</Text>
    </View>
  );

  const screen_home = () => {
    return (
      <View>
        <Animated.View style={[{ transform: [{ translateY: home_comp_1 }] }, [{ position: 'absolute',  width: '100%', height: 60, alignItems: 'center', justifyContent: 'center' }]]}>
          <DropShadow
            style={{
              width: '90%',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          >

            <View activeOpacity={1} style={{ width: '80%', backgroundColor: colors.theme_bg_three, borderRadius: 10, height: 50, flexDirection: 'row', alignSelf:'center', }}>

               <TouchableOpacity activeOpacity={1} onPress={navigation.toggleDrawer.bind(this)} style={{ top:5, left:'-16%', width: 40,backgroundColor:'white',borderRadius:80,height: 40, flexDirection: 'row',alignItems:'center', justifyContent: 'center', }}>
                                           <Icon type={Icons.MaterialIcons} name="menu" color={colors.icon_active_color} style={{ fontSize: 25 }} />
             </TouchableOpacity>
             <View style={{ flexDirection: 'row', justifyContent:'space-between'}}>
                  <TouchableOpacity activeOpacity={1} onPress={open_location.bind(this, 1)} style={{ width:'70%', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 14, fontWeight: 'normal' }}>{pickup_address}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} onPress={() => fav_RBSheet.current.open()} style={{ justifyContent: 'center', }}>
                    <Icon type={Icons.MaterialIcons} name="favorite-border" color={colors.icon_inactive_color} style={{ fontSize: 22 }} />
                  </TouchableOpacity>
             </View>
            </View>
          </DropShadow>
        </Animated.View>

        <Animated.View style={[{ transform: [{ translateY: home_comp_2 }] }, [{ position: 'absolute', borderRadius:5, bottom: 5, width: '100%', height: 100,  alignItems: 'center', justifyContent: 'center' }]]}>

          {/*<View style={{flexDirection: 'row'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {load_work_types()}
              </ScrollView>
            </View>*/}



      <View style={{ flexDirection: 'row' }}>
        {load_work_types()}
      </View>
<       Animated.View style={[{ transform: [{ translateY: drop_comp_2 }] }, [{ position: 'absolute', bottom: Platform.OS === 'ios' ? insets.top : 5,  width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' }]]}>
          <TouchableOpacity activeOpacity={1} onPress={confirm_location.bind(this)} style={{ width: '90%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('confirmLocation')}</Text>
          </TouchableOpacity>
        </Animated.View>    


        </Animated.View>
      </View>
    )
  }

  const screen_location = () => {
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
      <View >
        
        <Animated.View style={[{ transform: [{ translateY: drop_comp_3 }] }, [{ position: 'absolute', width: '100%', height: 100, alignItems: 'center', paddingBottom: 10, justifyContent: 'center', backgroundColor: colors.theme_bg_three }]]}>
          
          <View style={{ flexDirection: 'row', height: 90, width: '100%' }}>
            <TouchableOpacity onPress={back_to_home_screen.bind(this)} style={{ left:-12,top:2,width: '15%', alignItems: 'center', justifyContent: 'center' }}>
              <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.icon_active_color} style={{ fontSize: 22 }} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View style={[{ transform: [{ translateY: drop_comp_2 }] }, [{ position: 'absolute', bottom: Platform.OS === 'ios' ? insets.top : 5,  width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' }]]}>
          <TouchableOpacity activeOpacity={1} onPress={confirm_location.bind(this)} style={{ width: '90%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('confirmLocation')}</Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[{ transform: [{ translateY: drop_comp_4 }] }, [{ position: 'absolute', width: '100%', height: (screenHeight - 100), alignItems: 'center', paddingBottom: 10, justifyContent: 'flex-start', backgroundColor: colors.theme_bg_three }]]}>
          <TouchableOpacity activeOpacity={1} onPress={search_exit.bind(this)} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1, padding: 10, borderRadius: 10, borderColor: colors.grey }}>
            <Icon type={Icons.MaterialIcons} name="location-on" color={colors.icon_inactive_color} style={{ fontSize: 22 }} />
            <View style={{ margin: 5 }} />
            <Text style={{ fontSize: 18, color: colors.text_grey, fontWeight: 'bold' }}>{t('locateonMap')}</Text>
          </TouchableOpacity>
          <View style={{ margin: 20 }} />

          <View style={{ width: '100%', padding: 20 }}>
            <Text style={{ fontSize: 18, color: colors.text_grey, fontWeight: 'bold' }}>{t('savedLocations')}</Text>
            <View style={{ margin: 10 }} />
            <ScrollView style={{height:500}}>
            {favourites_list()}

            </ScrollView>
          </View>

        </Animated.View>
        <Animated.View style={[{ transform: [{ translateY: drop_comp_1 }] }, [{ position: 'absolute', width: '100%', alignItems: 'center', justifyContent: 'center' }]]}>
          <DropShadow
            style={{
              top:-50,
              width: '80%',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          >
            <View style={{ borderRadius: 10, backgroundColor: colors.theme_bg_three, }}>
              <GooglePlacesAutocomplete
                ref={search}
                minLength={2}
                placeholder={t('enterWorkAddress')}
                listViewDisplayed='auto'
                fetchDetails={true}
                GooglePlacesSearchQuery={{
                  rankby: 'distance',
                  types: 'food'
                }}
                debounce={200}
                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                textInputProps={{
                  onFocus: () => is_focus(),
                  placeholderTextColor: colors.text_grey,
                  returnKeyType: "search"
                }}
                styles={{
                  textInputContainer: {
                    backgroundColor: colors.theme_bg_three,
                    borderRadius: 10,

                  },
                  description: {
                    color: '#000'
                  },
                  textInput: {

                    height: 45,
                    color: colors.theme_fg_two,
                    fontWeight: 'normal',
                    fontSize: 14,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  },
                  predefinedPlacesDescription: {
                    color: colors.theme_fg_two,
                  }
                }}
                currentLocation={true}
                enableHighAccuracyLocation={true}
                onPress={(data, details = null) => {
                  get_location(data, details);
                }}
                query={{
                  key: GOOGLE_KEY,
                  language: 'en',
                  radius: '1500',
                  location: pickup_lat + ',' + pickup_lng,
                  types: ['geocode', 'address']
                }}
              />
            </View>
          </DropShadow>
        </Animated.View>
      </View>
      </>
    )
  }

  const screen_booking = () => {
    return (

      <View>

        {!current_location_status &&
          <DropShadow
            style={{
              width: '100%',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 25,
            }}
          >
            <TouchableOpacity activeOpacity={0} onPress={booking_exit_to_home.bind(this)} style={{ width: 40, height: 40, backgroundColor: colors.theme_bg_three, borderRadius: 25, alignItems: 'center', justifyContent: 'center', top: 12, left: 10 }}>
              <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.icon_active_color} style={{ fontSize: 22 }} />
            </TouchableOpacity>

          </DropShadow>
        }

        <Animated.View style={[{ transform: [{ translateY: book_comp_1 }] }, [{ position: 'absolute', width: '100%', height: (screenHeight - 250), paddingBottom: 10, justifyContent: 'flex-start', backgroundColor: colors.theme_bg_three }]]}>
          

          <View style={{ width: '100%', height: 110 }}>
            <DropShadow
              style={{
                width: '100%',
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}
            >
                <View style={{ flexDirection: 'row', width: '100%', height: 30 , backgroundColor: colors.medics_silver }}>


                  <View style={{ height: 30, paddingRight:10, paddingLeft:10, backgroundColor: colors.warning, alignItems: 'center', borderTopRightRadius: 15, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => {navigation.navigate('Wallet')}} >
                      <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: 14, fontWeight: 'normal', letterSpacing: 1 }}>{t('youhave')} {global.currency} {wallet} !</Text>
                      </TouchableOpacity>
                  </View>
                  <View style= {{margin:10}}/>
                  

                <View style={{ flexDirection:'row', height:'100%', width: '100%', justifyContent: 'center', alignItems:'center', }}>
                  <Badge status="success"/> 
                  <View style= {{margin:5}}/>
                  <View style ={{flexDirection:'row'}}>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: 13, fontWeight: 'normal',  }}>{pickup_address}</Text>
                  </ScrollView>
                  </View>
                </View>

                </View>


              <Divider style={{ backgroundColor: colors.grey }} />
              <View style={{flexDirection: 'row',backgroundColor: colors.theme_bg_three,justifyContent: 'space-between', width:'100%', alignItems: 'center'}}>

                  <View style={{ flexDirection: 'row', alignItems: 'center',padding: 10, height: 70, justifyContent: 'space-between', }}>
                    <View>
                      <Icon type={Icons.MaterialIcons} name="schedule" color={colors.icon_active_color} style={{ fontSize: 22 }} />
                    </View>
                    <View style={{margin:3}}/>
                    <View >
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 20, fontWeight: 'bold' }}>{selectedHours + " "+ t('hrs')} Per Day</Text>
                        {selectedDays != 0 ?
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.medics_grey, fontSize: 15, }}>{selectedDays === 1? "for "+ selectedDays + " Day ": "for "+selectedDays + " Days" }</Text>
                        : null
                        }
                    </View>
                  </View>


{/*                 <TouchableOpacity activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}> */}
{/*                   <View style={{ flexDirection: 'row', width: '80%', height: 50 }}> */}
{/*                     <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}> */}
{/*                       <Badge status="error" /> */}
{/*                     </View> */}
{/*                     <View style={{ width: '75%', alignItems: 'flex-start', justifyContent: 'center' }}> */}
{/*                       <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 13, fontWeight: 'normal' }}>{drop_address}</Text> */}
{/*                     </View> */}
{/*                   </View> */}
{/*                 </TouchableOpacity> */}

                <View style={{justifyContent: 'center', alignItems: 'center',flexDirection: 'row', paddingRight:5, }} >

                    <View style={{ padding: 5, paddingLeft:10, paddingRight:10, backgroundColor: colors.theme_bg_three, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: colors.theme_bg }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => {navigation.navigate('MyBookings')}} >
                            {repeats ? (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.medics_blue, fontSize: 18, fontWeight: 'bold' }}>{repeats}</Text>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 12, fontWeight: 'bold' }}>{t('rehire')}</Text>
                                    </View>
                                ) : (
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon type={Icons.Feather} name="repeat" color={colors.icon_inactive_color} style={{ fontSize: 20 }} />
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 12, fontWeight: 'bold' }}>Rehire</Text>
                                    </View>
                                )}
                        </TouchableOpacity>
                    </View>
                    <View style={{margin:5}}/>

                    <View style={{ width:50, padding: 5, backgroundColor: colors.theme_bg_three, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: colors.theme_bg }}>
                        <TouchableOpacity activeOpacity={1} onPress={show_date_picker.bind(this)} >
                          {pickup_date_label == 'Now' ?
                            <View style={{  alignItems: 'center', justifyContent: 'center' }}>
                              <Icon type={Icons.MaterialIcons} name="schedule" color={colors.icon_inactive_color} style={{ fontSize: 20 }} />
                              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 12, fontWeight: 'bold' }}>{pickup_date_label}</Text>
                            </View>
                            :
                            <View style={{alignItems: 'center', justifyContent: 'center' }}>
                              <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 12, fontWeight: 'bold' }}>{pickup_date_label}</Text>
                            </View>
                          }
                        </TouchableOpacity>
                </View>

                </View>



              </View>
            </DropShadow>

          </View>

          <ScrollView>
  <View style={{ marginBottom: 10, backgroundColor: colors.theme_bg_three }}>
    {load_work_sub_types()}
  </View>

  <View style={{ padding: 5 }}>
    {estimation_rate_list()}
  </View>
  </ScrollView>
<View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', width: '90%', borderColor: colors.theme_bg, borderWidth:2, borderRadius:60, padding:10, }}>

    {/* For Hours Section */}
    <View style={{flexDirection:'row',alignItems:'center',}}>
      <RNPickerSelect
      InputAccessoryView = {CustomHeader_hours}
            onValueChange={(value, id) => {
              setSelectedHours(value);
              select_package_new(id, value, selectedDays);
            }}
            items={pickerItems}
            style={pickerSelectStyles}
            placeholder = {{
              
            }}
            value={selectedHours}
          />
        <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <Text style = {[styles.button_choose_text]}>Hours</Text>
          <Icon type={Icons.MaterialIcons} name="arrow-drop-down" color={colors.medics_black} style={{ fontSize: 30 }} />
        </View>
      </View>

      <View style={{width:3, height: '100%', backgroundColor: colors.medics_grey, borderRadius:10,}}/>

    {/* For Days Section */}
    <View style={{flexDirection:'row',alignItems:'center',}}>
      <RNPickerSelect
            InputAccessoryView = {CustomHeader_days}
            onValueChange={(value) => {
              setSelectedDays(value);
              select_package_new(package_id, selectedHours, value);
            }}
            items={items}
            style={pickerSelectStyles}
            placeholder = {{

            }}
            value={selectedDays}
          />
        <View style={{flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <Text style = {[styles.button_choose_text]}>{selectedDays === 1 ? "Day" : "Days"}</Text>
          
          <Icon type={Icons.MaterialIcons} name="arrow-drop-down" color={colors.medics_black} style={{ fontSize: 30 }} />
        </View>
      </View>





  </View>
<View style={{margin:10}}/>
            {loading == false ?
     <RectButton
          //  onPress={call_zone.bind(this)}
            onPress={validate_before_booking.bind(this)}
           style={[styles.button, { backgroundColor: colors.btn_color}]}>
           <Text style={[styles.buttonText, { color: colors.theme_fg_three, fontWeight: 'bold' }]}>{t('bookNow')}</Text>
         </RectButton>
    :
    <View style={{ width: '90%', alignSelf: 'center' }}>
      <LottieView source={btn_loader} autoPlay loop />
    </View>
  }
</View>
        </Animated.View>
      </View>
    )
  }

  const rb_favourite = () => {
    return (
      <RBSheet
        ref={fav_RBSheet}
        height={170}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: 10
          }
        }}
      >
        <View style={{ padding: 10, width: '100%' }}>
          <Text style={{ color: colors.theme_fg_two, fontSize: 25, fontWeight: 'normal' }}>{t('saveasFavourite')}</Text>
          <View style={{ margin: 5 }} />
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 16, fontweight: regular }}>{pickup_address}</Text>
        </View>


        <View style={{ margin: 10 }} />
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '1%' }} />
          <View style={{ width: '48%', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity activeOpacity={1} onPress={() => fav_RBSheet.current.close()} style={{ width: '100%', backgroundColor: colors.lite_grey, borderRadius: 5, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.theme_fg_two, fontWeight: 'bold' }}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: '1%' }} />
          <View style={{ width: '48%', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }}>
            <TouchableOpacity activeOpacity={1} onPress={() => add_favourite_api()} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 5, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.theme_fg_three, fontWeight: 'bold' }}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    )
  }

  const cancel_request = () => {
    setSearchLoading(true);
    axios({
      method: 'post',
      url: api_url + work_request_cancel,
      data: { work_request_id: work_request_id }
    })
      .then(async response => {
        setSearchLoading(false);
      })
      .catch(error => {
        setSearchLoading(false);
        console.log(error)
      });
  }

  const search_dialog = () => {
    return (
      <Dialog
        visible={search_status}
        width="90%"
        animationDuration={100}
        dialogAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onTouchOutside={() => {
          setSearchStatus(true)
        }}
      >
        <DialogContent>
          <View
            style={{
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ alignItems: "center", padding: 20 }}>
              <LottieView
                style={{ height: 100, width: 100 }}
                source={search_loader}
                autoPlay
                loop
              />
            </View>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: colors.theme_fg_two }}>
              Please wait while we find a staff...
            </Text>
            <View style={{ margin: 10 }} />
            {search_loading == false ?
              <TouchableOpacity style={{ padding: 10 }} activeOpacity={1} onPress={cancel_request.bind(this)}>
                <Text
                  onPress={cancel_request.bind(this)}
                  style={{
                    color: "red",
                    fontSize: f_m,
                    fontWeight: 'bold',
                    alignSelf: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              :
              <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                <LottieView source={btn_loader} autoPlay loop />
              </View>
            }
            </View>
        </DialogContent>
      </Dialog>
    )
  }

  const date_picker = () => {
    return (
      <DateTimePickerModal
        isVisible={is_date_picker_visible}
        mode="datetime"
        date={new Date()}
        minimumDate={new Date(Date.now() + 10 * 60 * 1000)}
        is24Hour={false}
        onConfirm={handle_confirm}
        onCancel={hide_date_picker}
      />
    )
  }

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

  const modal = () => {
    return (
      <View style={{  }}>
        <Modal isVisible={is_modal_visible} animationInTiming={500} animationOutTiming={500} onBackdropPress={() => setModalVisible(false)} animationIn="slideInUp" animationOut="slideOutDown" style={{ width: '90%', height: '60%', backgroundColor: colors.theme_bg_three, borderRadius: 10 }}>
          <View style={{ width: '100%', flexDirection: 'row', padding: 20 }}>
            <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ color: colors.theme_fg_two, fontSize: 20, fontWeight: 'bold' }}>{t('promoCodes')}</Text>
            </View>
            <TouchableOpacity onPress={toggleModal.bind(this)} style={{ width: '20%', alignItems: 'flex-end', justifyContent: 'center' }}>
              <Icon type={Icons.MaterialIcons} name="close" color={colors.icon_inactive_color} style={{ fontSize: 30 }} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={promo_list}
            renderItem={show_promo_list}
            keyExtractor={item => item.id}
          />
        </Modal>
      </View>
    )
  }
const handleMyLocationPress = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      mapRef.current.animateToRegion(userRegion, 1000); // You can adjust the duration (1000 milliseconds in this example)
    },
    (error) => console.log(error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
};
  const show_promo_list = ({ item }) => (
    <View style={{ alignItems: 'center', borderBottomWidth: 0.5 }}>
      <View style={{ width: '100%', backgroundColor: colors.theme_bg_three, borderRadius: 10, padding: 20, marginTop: 5, marginBottom: 5 }}>
        <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text style={{ color: colors.theme_fg_two, fontSize: 16, fontWeight: 'bold' }}>{item.promo_name}</Text>
          <View style={{ margin: 3 }} />
          <Text style={{ color: colors.theme_fg_two, fontSize: 14, fontweight: regular }}>{item.description}</Text>
        </View>
        <View style={{ margin: 5 }} />
        <View style={{ width: '100%', borderRadius: 10, flexDirection: 'row', borderWidth: 1, padding: 10, backgroundColor: colors.text_container_bg, borderStyle: 'dotted' }}>
          <View style={{ width: '70%', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg, fontSize: 16, fontWeight: 'normal' }}>{global.currency}{item.discount}OFF</Text>
          </View>
          {loading == true ?
            <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
              <LottieView source={btn_loader} autoPlay loop />
            </View>
            :
            <TouchableOpacity onPress={call_apply_promo.bind(this, item)} activeOpacity={1} style={{ width: '30%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg, borderRadius: 10, padding: 10 }}>
              <Text style={{ color: colors.theme_fg_three, fontSize: 14, fontWeight: 'normal' }}>{t('apply')}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  );

  return (
    <>

    <View style={styles.container}>

      <MapView
        ref={map_ref}
        style={{ ...StyleSheet.absoluteFillObject }}
        region={region}
        showsUserLocation={true}
//         showsMyLocationButton={current_location_status}
        onRegionChangeComplete={region => {
          region_change(region);
        }}
      >
        {render_specialities()}
      </MapView>
      <View style={{ height: 100, width: 100, alignSelf: 'center', position: 'absolute', top: (screenHeight / 2) - 50 }}>
        <LottieView source={pin_marker} autoPlay loop />
      </View>

     {/* This home screen is for both top and bottom location search bar*/}
     <View>
      {screen_home()}
      {screen_location()}
      {screen_booking()}
      {rb_favourite()}
      {date_picker()}
      {drop_down_alert()}
      {search_dialog()}
      {modal()}
    </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
      ...StyleSheet.absoluteFillObject,
      height: screenHeight,
      width: screenWidth,

  },
  button: {
      width: '90%',
      height: 60,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button_choose: {
      height: 60,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button_choose_text:{
      fontSize: 15,
      color: colors.medics_black, 
      textAlign:'center',
    },
    buttonText: {
      fontSize: 18,
    },

  speciality_img: {
    height: 40,
    width: 60
  },
  active_work_type_label: {
    color: colors.theme_fg_two,
    fontSize: 14,
    fontWeight: 'bold'
  },
  inactive_work_type_label: {
    color: colors.text_grey,
    fontSize: 12,
    fontWeight: 'normal'
  },
  segment_active_bg: { width: '48%', alignItems: 'center', justifyContent: 'center', padding: 5, marginLeft: '1%', marginRight: '1%', backgroundColor: colors.theme_bg, borderRadius: 10 },
  segment_active_fg: { color: colors.theme_fg_two, fontSize: 14, fontWeight: 'bold', color: colors.theme_fg_three },
  segment_inactive_bg: { width: '48%', alignItems: 'center', justifyContent: 'center', padding: 5, marginLeft: '1%', marginRight: '1%', backgroundColor: colors.lite_bg, borderRadius: 10 },
  segment_inactive_fg: { color: colors.theme_fg_two, fontSize: 14, fontWeight: 'normal', color: colors.theme_fg_two }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: colors.theme_fg_three, 
    textAlign:'center', 
    fontWeight: 'bold',
    fontSize: 25,
    backgroundColor: colors.medics_blue,
    borderRadius:50,
    alignItems:'center',
    height:50,
    width:100,
    justifyContent:'center'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

function mapStateToProps(state) {
  return {
    initial_lat: state.booking.initial_lat,
    initial_lng: state.booking.initial_lng,
    initial_region: state.booking.initial_region,
  };
}

export default connect(mapStateToProps, null)(Dashboard);