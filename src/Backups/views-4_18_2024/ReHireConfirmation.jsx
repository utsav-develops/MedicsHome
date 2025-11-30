import React, {useRef} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet,alert } from 'react-native';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import { api_url, booking_confirm, get_profile, staff_hiring_request } from '../config/Constants';
import Dashborad from '../views/Dashboard';
import { useNavigation } from "@react-navigation/native";
import DropdownAlert from 'react-native-dropdownalert';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const ReHireConfirmation = ({ visible, onClose, onModify, staffName, startDate, hours, endDate, startTime, endTime, price, exclusion, speciality_type, pickup_address, pickup_dates, pickup_lat, pickup_lng, package_id, work_sub_type, zone, staffid }) => {
let dropDownAlertRef = useRef();

const navigation = useNavigation();
const { t } = useLocalization();
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

const check_wallet = async () =>{
    const walletData = await call_get_wallet();
    if(walletData === null || walletData < price){
        dropDownAlertRef.alertWithType('error', t('wallet'), t('notSufficientBalance'));
    }
    else{
        const startTime_24hr = convertTo24Hour(startTime);
        const endTime_24hr = convertTo24Hour(endTime);
        call_staff_hiring_request(startTime_24hr,endTime_24hr);
//         call_booking_confirm();
    }
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
    } catch (error) {
        console.error("Error fetching wallet data:", error);
        return null; //
    }
};

function convertTo24Hour(time12h) {
    let hours, minutes;

    // Check if AM or PM is present in the time string
    const isAM = time12h.includes('AM');
    const isPM = time12h.includes('PM');

    // Extract hours and minutes based on the length of the time string
    if (time12h.length === 6) {
        hours = time12h.slice(0, 1);
        minutes = time12h.slice(2, 4);
    } else if (time12h.length === 7) {
        hours = time12h.slice(0, 2);
        minutes = time12h.slice(3, 5);
    }

    // Convert hours to 24-hour format based on AM or PM
    if (isPM && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    } else if (isAM && hours === '12') {
        hours = '00';
    }

    return hours + ':' + minutes;
};


const call_staff_hiring_request = async (startTime_24hr,endTime_24hr) => {

    console.log("datas: " + startTime + " " + endTime);
    try {
        const response = await axios({
            method: "post",
            url: api_url + staff_hiring_request,
            data: {
                workplace_id: global.id,
                staff_id: staffid,
                pickup_location: pickup_address,
                pickup_date: startDate,
                drop_date: endDate,
                pickup_time: startTime_24hr,
                drop_time: endTime_24hr,
                pickup_lat: pickup_lat,
                pickup_lng: pickup_lng,
                drop_location: exclusion,
                drop_lat: 0,
                drop_lng: 0,
                zone: zone,
                country_id: "UK",
                total: price,
                payment_method: 2,
            },
        });

        console.log(response.data);

        if (response.data.status == 1) {
            dropDownAlertRef.alertWithType('info', t('bookingReqSuccessful'), t('awaitConfirmation'));
            navigation.navigate('Dashboard');
        }
    } catch (error) {
        console.error(error);
        alert('Sorry, something went wrong');
    }
};


const call_booking_confirm = async () => {
       pickup_dates.push(startTime);
       pickup_dates.push(endTime);
        await axios({
          method: "post",
          url: api_url + booking_confirm,
          data: {
            km: hours,
            promo: 0,
            speciality_type: speciality_type,
            payment_method: 2,
            workplace_id: global.id,
            work_type: 2,
            surge: 1,
            pickup_address: pickup_address,
            pickup_date: 0,
            multiple_dates: pickup_dates,
            pickup_lat: pickup_lat,
            pickup_lng: pickup_lng,
            drop_address: "random address",
            drop_lat: 0,
            drop_lng: 0,
            package_id: package_id,
            work_sub_type: work_sub_type,
            stops: JSON.stringify([]),
            zone: zone,
          },
        })
          .then(async (response) => {
          console.log(response.data);
            if (response.data.status == 1) {
              if (response.data.booking_type == 2) {
                navigation.navigate('Dashboard');
                dropDownAlertRef.alertWithType('success', t('bookingPlacedSuccess'), t('seeBookingsinMenu'));
              }
            } else {
               dropDownAlertRef.alertWithType('error', t('sorry'), t('notAvailable'));
            }
          })
          .catch((error) => {
              console.error(error);
              alert('Sorry something went wrong');
          });

  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}></View>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{t('goingToBook')} {staffName} {t('from')}</Text>
          <Text style={styles.modalText}>{startDate} {t('to')} {endDate} {t('till')}</Text>
          <Text style={styles.modalText}>{t('For')} {hours} {t('hoursEachday')} {startTime} {t('to')} {endTime} {t('till')}</Text>
          <Text style={styles.modalText}>{t('oneHrLunch')} {exclusion}</Text>
          
          <TouchableOpacity onPress={onClose} style={styles.modifyButton}>
            <Text style={styles.textStyle}>{t('modify')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={check_wallet} style={styles.openButton}>
            <Text style={styles.textStyle}>{t('bookNow')} • £{price}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {drop_down_alert()}
    </Modal>
  );
};

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
    fontWeight: 'bold',
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

export default ReHireConfirmation;