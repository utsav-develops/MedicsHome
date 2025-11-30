import React, { useState, useEffect, useRef } from "react";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';

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
  Alert,
  FlatList,
  Platform
} from "react-native";
import { connect } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation,useRoute, useFocusEffect } from "@react-navigation/native";
import { RectButton } from 'react-native-gesture-handler';
import { screenHeight, screenWidth,favourites_status,all_staff_hiring_request,loader, work_details, check_policies, search_loader, normal, promo_codes, bold, GOOGLE_KEY, month_names, money_icon, discount_icon, no_favourites, add_favourite, get_home, api_url, img_url, get_estimation_rate, pin_marker, regular, get_zone, btn_loader, booking_confirm, work_request_cancel, f_m } from '../config/Constants';
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
import Geolocation from '@react-native-community/geolocation';

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
import { useCustomTheme } from  '../config/useCustomTheme';
import BookingProcess from './BookingProcess';


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
  const [pickup_hour, setPickupHour] = useState(0);
  const [selected_date, setSelectedDate] = useState(0);
  const [userRegion, setuserRegion] = useState(0);



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
  const [favourite_modal_visible, setFavModalVisible] = useState(false);
  const duration = 500;
  const [work_request_id, setWorkRequestId] = useState(0);
  const [address_status, setaddressstatus] = useState();
  const [activepayment, setActivePayment] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const repeats = route.params?.counter;
  const [selectedHours, setSelectedHours] = useState();
  const [selectedDays, setSelectedDays] = useState(1);
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  const [booking_popup_visible, setBookingPopupVisible] = useState(false);


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
  const book_comp_1 = useRef(new Animated.Value(screenHeight + 250)).current;



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
  database().ref(`workplaces/${global.id}`).update({
    fcm: global.fcm_token,
  });
  setPackageHr(counter.value);
}, [counter]);


  useEffect(() => {
    screen_home_entry();
    screen_booking();
    get_home_api();
    booking_sync();
    handleMyLocationPress();
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

const handleOpenModal = () => {
    screen_home_exit();
    location_exit();
    setBookingPopupVisible(true);
  };

  const handleMyLocationPress = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const userRegion = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setuserRegion(userRegion);
        if(userRegion != null){
            map_ref.current.animateToRegion(userRegion, 1000);
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleCloseModal = () => {
    setBookingPopupVisible(false);
    booking_exit_to_home();
  };

    const location_approval_redirect = () =>
    Alert.alert(
      t('locationNotApproved'),
      t('SorrylocationNotApproved'),
        [

            {
              text: t('notNow'),
              style: 'cancel',
            },

              {
                text: t('showMyLocation'),
                onPress: () => setFavModalVisible(true),
                style: 'default',
              },
                {
                  text: t('approve'),
                  onPress: () => fav_RBSheet.current.open(),
                  style: 'default',
                },
        ],
      {
        cancelable: true,
        onDismiss: () => console.log('dismissed'),
      },
    );

const location_approval_confirm = () =>
    Alert.alert(
      t('locationApprove'),
      t('wantToApproveLocation'),
        [
          {
            text: t('approve'),
            onPress: () => setFavModalVisible(true),
            style: 'default',
          },
            {
              text: t('notNow'),
              style: 'cancel',
            },
        ],
      {
        cancelable: true,
        onDismiss: () => console.log('dismissed'),
      },
    );



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
         console.log(response.data.result);
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
      const snapshotValue = snapshot?.val();
      if (snapshotValue) {
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

    const togglefavModal = () => {
      setFavModalVisible(!favourite_modal_visible);
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
    setPickupHour(currentdate.getHours());
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
    setSelectedDate(currentdate.getDate());
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
      toValue: Platform.OS === 'ios' ? insets.top + 10 : 30,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(home_comp_2, {
      toValue: (screenHeight),
      duration: duration,
      useNativeDriver: true,
    }).start();
    setPromo(0);
    Animated.timing(drop_comp_2, {
      toValue: (screenHeight),
      duration: duration,
      useNativeDriver: true,
    }).start();
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

    const confirm_location_entry = () => {
        Animated.timing(drop_comp_2, {
          toValue: (screenHeight),
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
      toValue: 250,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }

  const booking_exit = () => {
    setCurrentLocationStatus(true);
    Animated.timing(book_comp_1, {
      toValue: screenHeight + 250,
      duration: duration,
      useNativeDriver: true,
    }).start();
  }
  const booking_exit_to_home = () => {
    setCurrentLocationStatus(true);
    screen_home_entry();
    Animated.timing(book_comp_1, {
      toValue: screenHeight + 250,
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
      onRegionChange(region, 'P');
  
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

  const before_confirm_location = async () => {
    setLoading(true);
    const address_status = await call_address_verify(pickup_lat, pickup_lng);
    const policy_status = await check_policy();
    // if(address_status !== undefined && address_status.toString()==='Approved' && address_status !== null)
    // {
        if(policy_status == 1){
            setLoading(false);
            confirm_location();
        }
        else{
            navigation.navigate('PrivacyPolicies',{from: "booking"});
        }


    // }
    // else
    // {
    //     setLoading(false);
    //     location_approval_redirect();
    // }
           setLoading(false);

  };

  const confirm_location = async () => {

    if (active_location == 1) {
      handleOpenModal();
    }
    if (pickup_address != '' && active_location == 2) {
      booking_entry();
      get_estimation_rate_api(pickup_lat, pickup_lng, tmp_lat, tmp_lng, 0, active_work_sub_type, 0);
    } else if (drop_address != '' && active_location == 1) {
      booking_entry();
      get_estimation_rate_api(tmp_lat, tmp_lng, drop_lat, drop_lng, 0, active_work_sub_type, 0);
    } else {

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
    screen_home_entry();
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
              <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 14, fontweight: bold }}>{data.speciality_type}</Text>
              <View style={{ margin: 2 }} />
              <Text numberOfLines={1} style={{ color: colors.text_grey, fontSize: 12, fontweight: normal }}>{data.description}</Text>
            </View>
            <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 14, fontweight: normal, letterSpacing: 1 }}>{global.currency}{data.rates.total_rate}</Text>
              {promo != 0 &&
                <View style={{ marginTop: 4, backgroundColor: colors.success_background, borderRadius: 5, padding: 2, paddingLeft: 5, paddingRight: 5, alignItems: 'center', justifyContent: 'center' }}>
                  <Text ellipsizeMode='tail' style={{ color: colors.success, fontSize: 8, fontweight: normal }}>{t('promoApplied')}</Text>
                </View>
              }
            </View>
          </TouchableOpacity>
        </DropShadow>
      )
    })
  }

  const load_location = (address, lat, lng) => {
    setFavModalVisible(false);
    setOnLoaded(2);
    setaddressstatus('');
    back_to_home_screen();
    setTmpLat(lat);
    setTmpLng(lng);
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
          <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 12, color: colors.text_grey, fontweight: regular }}>{t('noDataFound')}</Text>
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
              <View style={{margin:10}}/>
              {/* {data.approval_status !== 'Approved'?
                    <TouchableOpacity activeOpacity={1} onPress={() => {navigation.navigate("AddressVerify",{workplace_fav_id:data.id})}} style={{ left:10, justifyContent:'center', alignItems:'flex-start',borderWidth: 1, padding: 10, borderRadius: 10, borderColor: colors.grey }}>
                    <Text style={{ fontSize: 12, color: colors.text_grey, fontweight: bold }}>{t('verify')}</Text>
                </TouchableOpacity>
                :
                null
              } */}

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
        console.error(error.response);
        alert("Sorry something went wrong");
      });
  };

  const add_favourite_api = async () => {
    fav_RBSheet.current.close();
    setLoading(true);
    await axios({
      method: "post",


      url: api_url + add_favourite,
      data: { workplace_id: global.id, address: pickup_address, lat: pickup_lat.toFixed(7), lng: pickup_lng.toFixed(7) }
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          dropDownAlertRef.alertWithType('success', t('success'), t('LocAddedInFav'));
          setWorkplaceFavourties(response.data.result);
//           location_approval_confirm();
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




// Function to get seconds difference between current time and given hour
const addCustomHoursAndGetHour = (hoursToAdd) => {
  const now = new Date();
  const targetTime = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  const targetHour = targetTime.getHours();
  return targetHour;
};


const pickerItems = packages
  .filter(pkg => addCustomHoursAndGetHour(pkg.hours) < 20 && addCustomHoursAndGetHour(pkg.hours) >= 8 || selected_date != new Date().getDate() || pkg.id == 11 )
  .map(pkg => ({
    id: pkg.id,
    label: pkg.package_name,
    value: pkg.hours,
  }));


  const items = [];
  for (let i = 1; i <= 30; i++) {
    items.push({ label: `${i}`, value: i });
  }




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
//               fontweight: bold,
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
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{t('chooseHours')}</Text>
    </View>
  );



  const CustomHeader_days= () => (
    <View style={{ padding: 10, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{t('chooseDays')}</Text>
    </View>
  );

  const screen_home = () => {
    return (
      <View>
        <Animated.View style={[{ transform: [{ translateY: home_comp_1 }] }, [{ position: 'absolute', top:0, width: '100%', height: 60, alignItems: 'center', justifyContent: 'center', }]]}>
          <View>
                  <DropShadow
                    style={{
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                    }}
                  >
          <View activeOpacity={1} style={{ width: '100%',  height: 50, flexDirection: 'row', justifyContent:'space-between', paddingHorizontal:7, }}>
                  <View style={{width:'12.5%', aspectRatio:1, backgroundColor:colors.theme_dark, borderRadius:150, alignItems:'center', alignSelf:'center', justifyContent: 'center',}}> 
                    <TouchableOpacity activeOpacity={1} onPress={navigation.toggleDrawer.bind(this)} >
                          <Icon type={Icons.MaterialIcons} name="menu" color={colors.icon_inactive_color} style={{ fontSize: 25 }} />
                    </TouchableOpacity>
                  </View>
                <View style={{ flexDirection: 'row', width:'70%', justifyContent:'space-between', backgroundColor: colors.theme_bg_three, borderRadius: 10, padding:5}}>
                      <TouchableOpacity activeOpacity={1} onPress={open_location.bind(this, 1)} style={{ width:'90%', justifyContent: 'center', padding:5,}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 14, fontweight: normal }}>{pickup_address}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={1} onPress={() => fav_RBSheet.current.open()} style={{ width: '10%', justifyContent: 'center', }}>
                        <Icon type={Icons.MaterialIcons} name="favorite-border" color={colors.icon_inactive_color} style={{ fontSize: 22 }} />
                      </TouchableOpacity>
                </View>
                <View style={{width:'12.5%', aspectRatio:1, backgroundColor:colors.theme_bg_three, borderRadius:150, alignItems:'center', alignSelf:'center',  justifyContent: 'center'}}> 
                <TouchableOpacity
                     onPress = {() => {handleMyLocationPress();}}>
                    <Icon type={Icons.MaterialIcons} name="my-location" color={colors.icon_inactive_color} style={{ fontSize: 25 }} />
                  </TouchableOpacity>
              </View>
            </View>
            </DropShadow>
            </View>
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
          <TouchableOpacity activeOpacity={1} onPress={before_confirm_location.bind(this)} style={{ width: '90%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.theme_fg_three, fontweight: bold }}>{t('confirmLocation')}</Text>
          </TouchableOpacity>
        </Animated.View>


        </Animated.View>
      </View>
    )
  }

  const screen_location = () => {
    return (
      <>

      <View>

        <Animated.View style={[{ transform: [{ translateY: drop_comp_3 }] }, [{ position: 'absolute', width: '100%', height: 100, alignItems: 'center', paddingBottom: 10, justifyContent: 'center', backgroundColor: colors.theme_bg_three }]]}>

          <View style={{ flexDirection: 'row', height: 90, width: '100%' }}>
            <TouchableOpacity onPress={back_to_home_screen.bind(this)} style={{ left:-12,top:2,width: '15%', alignItems: 'center', justifyContent: 'center' }}>
              <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.icon_inactive_color} style={{ fontSize: 22 }} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View style={[{ transform: [{ translateY: drop_comp_2 }] }, [{ position: 'absolute', bottom: Platform.OS === 'ios' ? insets.top : 5,  width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' }]]}>
          {loading == true ?

            <View style={{ height: 100, width: 100, }}>
                <LottieView source={btn_loader} autoPlay loop />
            </View>
            :
          <TouchableOpacity activeOpacity={1} onPress={before_confirm_location.bind(this)} style={{ width: '90%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.theme_fg_three, fontweight: bold }}>{t('confirmLocation')}</Text>
          </TouchableOpacity>
          }
        </Animated.View>
        <Animated.View style={[{ transform: [{ translateY: drop_comp_4 }] }, [{ position: 'absolute', width: '100%', height: (screenHeight - 100), alignItems: 'center', paddingBottom: 10, justifyContent: 'flex-start', backgroundColor: colors.theme_bg_three }]]}>
          <TouchableOpacity activeOpacity={1} onPress={search_exit.bind(this)} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', borderWidth: 1, padding: 10, borderRadius: 10, borderColor: colors.grey }}>
            <Icon type={Icons.MaterialIcons} name="location-on" color={colors.icon_inactive_color} style={{ fontSize: 22 }} />
            <View style={{ margin: 5 }} />
            <Text style={{ fontSize: 18, color: colors.text_grey, fontweight: bold }}>{t('locateonMap')}</Text>
          </TouchableOpacity>
          <View style={{ margin: 20 }} />

          <View style={{ width: '100%', padding: 20 }}>
            <Text style={{ fontSize: 18, color: colors.text_grey, fontweight: bold }}>{t('savedLocations')}</Text>
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
                enablePoweredByContainer={false}
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
                    fontweight: normal,
                    fontSize: 14,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  },
                  predefinedPlacesDescription: {
                    color: colors.theme_fg_two,
                  }
                }}
                currentLocation={true}
                enableHighAccuracyLocation={false}
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
      {booking_popup_visible?
      <>
              <View style={styles.overlay}/>
              <BookingProcess
                  visible = {true}
                  packages = {packages}
                  onClose = {handleCloseModal}
                  pickup_lat = {pickup_lat}
                  pickup_lng = {pickup_lng}
                  pickup_address = {pickup_address}
              />
      </>
              :null
      }

      </View>
    )
  }

  const rb_favourite = () => {
    return (
      <RBSheet
        ref={fav_RBSheet}
        height={Platform.OS === 'ios' ? 200 : 170}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: 10,
            paddingBottom:Platform.OS === 'ios' ? 30 : null,
            backgroundColor: colors.lite_bg
          }
        }}
      >
        <View style={{ padding: 10, width: '100%' }}>
          <Text style={{ color: colors.theme_fg_two, fontSize: 25, fontweight: normal }}>{t('saveasFavourite')}</Text>
          <View style={{ margin: 5 }} />
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 16, fontweight: regular }}>{pickup_address}</Text>
        </View>


        <View style={{ margin: 10 }} />
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '1%' }} />
          <View style={{ width: '48%', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity activeOpacity={1} onPress={() => fav_RBSheet.current.close()} style={{ width: '100%', backgroundColor: colors.icon_inactive_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: 'white', fontweight: bold }}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: '1%' }} />
          <View style={{ width: '48%', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }}>
            <TouchableOpacity activeOpacity={1} onPress={() => add_favourite_api()} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.theme_fg_three, fontweight: bold }}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    )
  }

  const cancel_request = () => {
  console.log("cancel error" +work_request_id);
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
      });
  }

//   const search_dialog = () => {
//     return (
//       <Dialog
//         visible={search_status}
//         width="90%"
//         animationDuration={100}
//         dialogAnimation={
//           new SlideAnimation({
//             slideFrom: "bottom",
//           })
//         }
//         onTouchOutside={() => {
//           setSearchStatus(true)
//         }}
//       >
//         <DialogContent>
//           <View
//             style={{
//               padding: 10,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <View style={{ alignItems: "center", padding: 20 }}>
//               <LottieView
//                 style={{ height: 100, width: 100 }}
//                 source={search_loader}
//                 autoPlay
//                 loop
//               />
//             </View>
//             <Text style={{ fontSize: 13, fontweight: bold, color: colors.theme_fg_two }}>
//               {t('pleasewaitFindStaff')}
//             </Text>
//             <View style={{ margin: 10 }} />
//             {search_loading == false ?
//               <TouchableOpacity style={{ padding: 10 }} activeOpacity={1} onPress={cancel_request.bind(this)}>
//                 <Text
//                   onPress={cancel_request.bind(this)}
//                   style={{
//                     color: "red",
//                     fontSize: f_m,
//                     fontweight: bold,
//                     alignSelf: "center",
//                   }}
//                 >
//                   Cancel
//                 </Text>
//               </TouchableOpacity>
//               :
//               <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
//                 <LottieView source={btn_loader} autoPlay loop />
//               </View>
//             }
//             </View>
//         </DialogContent>
//       </Dialog>
//     )
//   }
    const minimumDate = new Date();
    minimumDate.setMinutes(minimumDate.getMinutes() + 10);

  const date_picker = () => {
    return (
      <DateTimePickerModal
        isVisible={is_date_picker_visible}
        mode="datetime"
        minuteInterval={30}
        display="spinner"
        date={new Date()}
        minimumDate={minimumDate}
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
        <Modal isVisible={is_modal_visible} animationInTiming={500} animationOutTiming={500} onBackdropPress={() => setModalVisible(false)} animationIn="slideInUp" animationOut="slideOutDown" style={{ width: '90%', height: '60%', backgroundColor: colors.lite_bg, borderRadius: 10 }}>
          <View style={{ width: '100%', flexDirection: 'row', padding: 20 }}>
            <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ color: colors.theme_fg_two, fontSize: 20, fontweight: bold }}>{t('promoCodes')}</Text>
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

    const fav_list_modal = () => {
      return (

          <Modal isVisible={favourite_modal_visible} animationInTiming={500} animationOutTiming={500} onBackdropPress={() => setFavModalVisible(false)} animationIn="slideInUp" animationOut="slideOutDown" style={{  justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '100%', height: '75%', backgroundColor: colors.lite_bg, borderRadius: 10 }}>
            <View style={{ width: '100%', flexDirection: 'row', padding: 20 }}>
              <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ color: colors.theme_fg_two, fontSize: 20, fontweight: bold }}>{t('mySavedLocation')}</Text>
              </View>
              <TouchableOpacity onPress={togglefavModal.bind(this)} style={{ width: '20%', alignItems: 'flex-end', justifyContent: 'center' }}>
                <Icon type={Icons.MaterialIcons} name="close" color={colors.icon_inactive_color} style={{ fontSize: 30 }} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={workplace_favourites}
              renderItem={show_fav_list}
              keyExtractor={item => item.id}
            />
            </View>
          </Modal>

      )
    }



  const show_promo_list = ({ item }) => (
    <View style={{ alignItems: 'center', borderBottomWidth: 0.5 }}>
      <View style={{ width: '100%', backgroundColor: colors.theme_bg_three, borderRadius: 10, padding: 20, marginTop: 5, marginBottom: 5 }}>
        <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text style={{ color: colors.theme_fg_two, fontSize: 16, fontweight: bold }}>{item.promo_name}</Text>
          <View style={{ margin: 3 }} />
          <Text style={{ color: colors.theme_fg_two, fontSize: 14, fontweight: regular }}>{item.description}</Text>
        </View>
        <View style={{ margin: 5 }} />
        <View style={{ width: '100%', borderRadius: 10, flexDirection: 'row', borderWidth: 1, padding: 10, backgroundColor: colors.text_container_bg, borderStyle: 'dotted' }}>
          <View style={{ width: '70%', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg, fontSize: 16, fontweight: normal }}>{global.currency}{item.discount}{t('OFF')}</Text>
          </View>
          {loading == true ?
            <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
              <LottieView source={btn_loader} autoPlay loop />
            </View>
            :
            <TouchableOpacity onPress={call_apply_promo.bind(this, item)} activeOpacity={1} style={{ width: '30%', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.theme_bg, borderRadius: 10, padding: 10 }}>
              <Text style={{ color: colors.theme_fg_three, fontSize: 14, fontweight: normal }}>{t('apply')}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    </View>
  );

    const show_fav_list = ({ item }) => (
      <View style={{ alignItems: 'center'}}>
          {workplace_favourites.length == 0 ?
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ height: 150, width: 150, alignSelf: 'center' }}>
                  <LottieView source={no_favourites} autoPlay loop />
                </View>
                <Text numberOfLines={2} ellipsizeMode='tail' style={{ fontSize: 12, color: colors.text_grey, fontweight: regular }}>{t('noDataFound')}</Text>
              </View>

          :
        <View style={{ width: '95%', backgroundColor: colors.theme_bg_three, borderRadius: 10, padding: 20, marginTop: 5, marginBottom: 5 }}>
          <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: 16, fontweight: bold }}>{item.address}</Text>
            <View style={{ margin: 3 }} />
            <Text style={{ color: colors.theme_fg_two, fontSize: 14, fontweight: regular }}>{item.description}</Text>
          </View>
          <View style={{ margin: 5 }} />
          <View style={{ width: '100%', borderRadius: 10, justifyContent:'space-between', flexDirection: 'row', borderWidth: 1, padding: 10, backgroundColor: colors.lite_bg, borderStyle: 'dotted' }}>
          {item.approval_status == 'Approved' ?
            <TouchableOpacity onPress = {load_location.bind(this, item.address, item.lat, item.lng)} style={{  alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ color: colors.theme_fg, fontSize: 16, fontweight: bold }}>{t('setLocation')}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{  alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ color: colors.theme_fg_two, fontSize: 16, fontweight: normal }}>{t('firstApprove')}</Text>
            </TouchableOpacity>
            }
            {loading ? (
              <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                <LottieView source={btn_loader} autoPlay loop />
              </View>
            ) : (
              item.approval_status !== 'Approved' ? (
                <TouchableOpacity
                  onPress={() => {
                  navigation.navigate("AddressVerify",{workplace_fav_id:item.id});
                  togglefavModal();
                  }}
                  activeOpacity={1}
                  style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: colors.medics_blue, borderRadius: 10, padding: 10 }}>
                  <Text style={{ color: colors.theme_fg_three, fontSize: 14, fontweight: bold }}>Approve</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{ alignItems: 'center', justifyContent: 'center', borderColor:colors.medics_green, borderWidth:2, borderRadius: 10, padding: 10 }}>
                  <Text style={{ color: colors.theme_fg_two, fontSize: 14, fontweight: bold }}>{t('approved')}</Text>
                </TouchableOpacity>
              )
            )}

          </View>
        </View>
        }
      </View>
    );

  return (
    <>
    <View style={styles.container}>
      <MapView
        ref={map_ref}
        style={{ ...StyleSheet.absoluteFillObject,}}
        region={region}
        showsUserLocation={true}
        showsCompass={false}
        showsMyLocationButton={false}
        onRegionChangeComplete={region => {
          region_change(region);
        }}
        
        customMapStyle= {colors.mapCustomStyle}
      >
        {render_specialities()}
        {workplace_favourites?.map((location) => (
          <Marker
            key={location.id}
            coordinate={{ latitude: parseFloat(location.lat), longitude: parseFloat(location.lng) }}
            title={location.address}
          >
          <Image
            source={require('.././assets/img/tracking/home_red.png')}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          />
          </Marker>
        ))}
      </MapView>
      <View style={{ pointerEvents: 'none', height: 100, width: 100, alignSelf: 'center', position: 'absolute', top: (screenHeight / 2) - 50 }}>
        <LottieView source={pin_marker} autoPlay loop />
      </View>

     {/* This home screen is for both top and bottom location search bar*/}
     <View>
    {screen_booking()}
      {screen_home()}
      {screen_location()}
      {rb_favourite()}
      {date_picker()}
      {drop_down_alert()}
      {modal()}
      {fav_list_modal()}
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
      color: 'grey',
      textAlign:'center',
    },
    buttonText: {
      fontSize: 18,
    },
    overlay:{
       ...StyleSheet.absoluteFillObject,
       height: screenHeight,
       width: screenWidth,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

  speciality_img: {
    height: 40,
    width: 60
  },
  active_work_type_label: {
    color: colors.theme_fg_two,
    fontSize: 14,
    fontweight: bold
  },
  inactive_work_type_label: {
    color: colors.text_grey,
    fontSize: 12,
    fontweight: normal
  },
  segment_active_bg: { width: '48%', alignItems: 'center', justifyContent: 'center', padding: 5, marginLeft: '1%', marginRight: '1%', backgroundColor: colors.theme_bg, borderRadius: 10 },
  segment_active_fg: { color: colors.theme_fg_two, fontSize: 14, fontweight: bold, color: colors.theme_fg_three },
  segment_inactive_bg: { width: '48%', alignItems: 'center', justifyContent: 'center', padding: 5, marginLeft: '1%', marginRight: '1%', backgroundColor: colors.lite_bg, borderRadius: 10 },
  segment_inactive_fg: { color: colors.theme_fg_two, fontSize: 14, fontweight: normal, color: colors.theme_fg_two }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: colors.theme_fg_three,
    textAlign:'center',
    fontweight:bold,
    fontSize: 25,
    backgroundColor: colors.lightTheme.medics_blue,
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