import React, { useState,useEffect  } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { f_xl, f_xs, f_m, bold, api_url, work_details, get_estimation_rate } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { Calendar } from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReHireConfirmation from '../views/ReHireConfirmation';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const RepeatTimes = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [work_id,setWorkid]=useState(route.params?.work_id);
  const [workdata,setWorkData]=useState();
  const [rate,setrate]=useState(0);
  const [selectedDates, setSelectedDates] = useState({});
  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [selectedHours, setSelectedHours] = useState(null);
  const [counter,setcounter]=useState();
  const [isChecked4, setIsChecked4] = useState(false);
  const [endTime, setEndTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date_counter1, setdatecounter1]=useState(1);
  const [excludeSaturday, setExcludeSaturday] = useState(true);
  const [excludeSunday, setExcludeSunday] = useState(true);
  const [existing_day, setexistingday] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useLocalization();


  const daysArray = [];
  useEffect(() => {
      call_work_details();
    }, []);

  const handleOpenModal = () => {
      setModalVisible(true);
    };

    const handleCloseModal = () => {
      setModalVisible(false);
    };

  const handleCheckBoxClick = (checkboxNumber) => {
      setIsChecked1(checkboxNumber === 8);
      setIsChecked2(checkboxNumber === 9);
      setIsChecked3(checkboxNumber === 10);
      setIsChecked4(checkboxNumber === 11);
      setSelectedHours(checkboxNumber);
      calculateEndTime(startTime,checkboxNumber);
      setcounter(checkboxNumber-1);
      get_estimation_rate_api(checkboxNumber-1);
    };

    const [startTime, setStartTime] = useState(() => {
      let initialTime = new Date();
      initialTime.setHours(9, 0, 0); // Set to 9 AM, 0 minutes, 0 seconds
      return initialTime;
    });




  const calculateEndTime = (start, hours) => {
    if (!hours) return; // Do nothing if hours are not selected
    const end = new Date(start);
    // Add the selected number of hours plus one to the start time to get the end time
    end.setHours(end.getHours() + hours + 0); // Add an extra hour
    setEndTime(end);
  };
    const formatTime = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      return hours + ':' + minutes+''+ampm;
    }
  const onChangeStartTime = (event, selectedTime) => {
    setShowTimePicker(false); // Hide picker

    if (selectedTime) {
      const hours = selectedTime.getHours();
      if (hours < 7 || hours > 16) {
        // If the time is outside of 7 AM to 4 PM, show an alert or reset to boundary time
        Alert.alert("Invalid Time", "Please select a time between 7 AM and 4 PM.");
        return;
      }

      setStartTime(selectedTime);
      calculateEndTime(selectedTime, selectedHours); // Recalculateendtime
      }
  };

  const call_work_details = () => {
          axios({
              method: 'post',
              url: api_url + work_details,
              data: { work_id: work_id }
          })
              .then(async response => {
                  setWorkData(response.data.result.work);
              })
              .catch(error => {
                  console.log(error)
              });
    }

    const get_estimation_rate_api = async (hours) => {
        await axios({
          method: "post",
          url: api_url + get_estimation_rate,
          data: { workplace_id: global.id, pickup_lat: workdata.pickup_lat, hours: hours, pickup_lng: workdata.pickup_lng, drop_lat: workdata.drop_lat, drop_lng: workdata.drop_lng, work_type: 2, promo: 0, lang: global.lang, package_id: workdata.package_id, days: 1, work_sub_type: workdata.work_sub_type },
        })
          .then(async (response) => {
            setrate(response.data.result['specialities'][workdata.speciality_type].rates.total_rate);
          })
          .catch((error) => {
            alert("Sorry something went wrong");
          });
      };
  const toggleExcludeSaturday = () => {
      let date_counter = 0;
      daysArray.splice(0, daysArray.length);
      for (const dateKey in selectedDates ) {
       if (selectedDates.hasOwnProperty(dateKey)) {
         const date = new Date(dateKey);
         const dayOfWeek = date.getDay();
         daysArray.push(dayOfWeek);
         date_counter++;
       }
     }

      if (daysArray.includes(6) && !(daysArray.length == 1)){
      setExcludeSaturday((prevValue) => !prevValue); // Toggle between true and false
          if (!excludeSaturday){
            setdatecounter1(date_counter1-1);
          }
          else{
            setdatecounter1(date_counter1+1);
          }
      }

      if(!daysArray.includes(6) && setExcludeSaturday){
        setExcludeSaturday(true);
      }


    };

  const validate = () => {
      if(Object.keys(selectedDates).length === 0 || selectedHours === null){
        Alert.alert("Fields Missing", "One or more field isn't selected");
      }
      else{
        handleOpenModal();

      }
  };

  const toggleExcludeSunday = () => {
     daysArray.splice(0, daysArray.length);
     let date_counter = 0;
        for (const dateKey in selectedDates ) {
         if (selectedDates.hasOwnProperty(dateKey)) {
           const date = new Date(dateKey);
           const dayOfWeek = date.getDay();
           daysArray.push(dayOfWeek);
           date_counter++;
         }
       }
        if (daysArray.includes(0) && !(daysArray.length == 1)){
        setExcludeSunday((prevValue) => !prevValue); // Toggle between true and false
        if (!excludeSunday){
            setdatecounter1(date_counter1-1);
          }
          else{
            setdatecounter1(date_counter1+1);
          }
          }
          if(!daysArray.includes(0) && setExcludeSunday){
              setExcludeSunday(true);
            }
  };
  const getMarkedDates = () => {
      const markedDates = { ...selectedDates };

      let period = {};
      if (startDate && endDate) {
        let current = new Date(startDate);
        const end = new Date(endDate);
        while (current <= end) {
          const dateString = current.toISOString().split('T')[0];
          if (excludeSaturday && current.getDay() === 6 || excludeSunday && current.getDay() === 0) {
            period[dateString] = { disabled: true, disableTouchEvent: true };
          } else {
            period[dateString] = { color: colors.theme_bg, textColor: 'white' };
          }
          if (dateString === startDate) {
            period[dateString].startingDay = true;
          }
          if (dateString === endDate) {
            period[dateString].endingDay = true;
          }
          current.setDate(current.getDate() + 1);
        }
      }

      return { ...markedDates, ...period };
    };

  const onDayPress = (day) => {
    setdatecounter1(1);
    if (!startDate || (startDate && endDate)) {
      // Start a new range
      setStartDate(day.dateString);
      setEndDate('');
      setSelectedDates({ [day.dateString]: { startingDay: true, endingDay: true, color: colors.theme_bg, textColor: 'white' } });
    } else if (!endDate) {
      // Complete the range
      setEndDate(day.dateString);
      let newSelectedDates = { ...selectedDates };
      let currentDate = startDate;
      while (currentDate <= day.dateString) {
        if (currentDate === startDate) {
          newSelectedDates[currentDate] = { startingDay: true, color: colors.theme_bg, textColor: 'white' };
        } else if (currentDate === day.dateString) {
          newSelectedDates[currentDate] = { endingDay: true, color: colors.theme_bg, textColor: 'white' };
        } else {
          newSelectedDates[currentDate] = { color: colors.theme_bg, textColor: 'white' };
        }
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate = currentDate.toISOString().split('T')[0];
      }
      setSelectedDates(newSelectedDates);
      price_multiplication(newSelectedDates);
    }
  };


  const showPicker = () => {
          setShowTimePicker(true);
        };

  const price_multiplication = (dates) => {
       let date_counter = 0;
       for (const dateKey in dates ) {
         if (dates.hasOwnProperty(dateKey)) {
         const date = new Date(dateKey);
         const dayOfWeek = date.getDay();
         daysArray.push(dayOfWeek);
           date_counter++;

         }
       }
           if(daysArray.includes(6) && excludeSunday){
            date_counter=date_counter-1;
           }
           if(daysArray.includes(0) && excludeSaturday){
            date_counter=date_counter-1;
          }
           setdatecounter1(date_counter);
//            navigation.navigate('Dashboard', { counter });
  };

  const complete = () => {
    navigation.navigate('ReHireConfirmation');

  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <StatusBar backgroundColor={colors.medics_blue} />
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: '15%', alignItems: 'center', justifyContent: 'center'}}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={'white'} style={{ fontSize: 30 }} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: '5%' }}>
      <View style={{ margin: 5 }} />
      <View style={{alignItems:'center'}}>
          <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold' }}>{t('selectbookingdate')}</Text>
      </View>
      <View style={{ margin: 5 }} />
      <View style={styles.calendarContainer}>
      <Calendar
        markingType={'period'}
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        theme={{
          todayTextColor: colors.theme_fg_two,
          arrowColor: colors.theme_fg_two,
        }}
        style={{ borderRadius: 10 }}
      />
      </View>
            <View style={styles.backpanel}>
              <View style={{alignItems:'center'}}>
                  <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold', alignItems:'center' }}>{t('weekendInclude')}</Text>
               </View>
                   <View style={{ margin: 5 }} />
                   <View style={{ flexDirection: 'row', justifyContent: 'space-between',marginHorizontal: 25 }}>
                    <TouchableOpacity onPress={() => toggleExcludeSaturday()}>
                      <View style={{  shadowOffset: { width: 0, height: 0 },shadowOpacity: 0.15,shadowRadius: 5,elevation: 5,backgroundColor: 'white', alignItems: 'center',padding:15, backgroundColor: !excludeSaturday ? colors.medics_blue : 'white', borderRadius:10 }}>
                        <Text style={{ color: !excludeSaturday ? 'white' : 'black',fontSize: 20 }}>{t('saturday')}</Text>
                      </View>
                    </TouchableOpacity>
                      <View style={{  alignItems: 'center', justifyContent:'center'}}>
                        <Icon type={Icons.Ionicons} name="calendar" color={colors.icon_active_color} style={{ fontSize: 35 }} />
                      </View>
                    <TouchableOpacity onPress={() => toggleExcludeSunday()}>
                      <View style={{ shadowOffset: { width: 0, height: 0 },shadowOpacity: 0.15,shadowRadius: 5,elevation: 5, alignItems: 'center',padding:15, backgroundColor: !excludeSunday ? colors.medics_blue : 'white', borderRadius:10 }}>
                        <Text style={{ color: !excludeSunday ? 'white' : 'black',fontSize: 20 }}>{t('sunday')}</Text>
                      </View>
                    </TouchableOpacity>
                    </View>
               </View>
            <View style={{ margin: 10 }} />
            <ReHireConfirmation
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    onModify={() => {}}
                    staffName={ (workdata?.staff.first_name) +' '+ (workdata?.staff.last_name) }
                    staffid = {workdata?.staff_id}
                    startDate={Object.keys(selectedDates)[0]}
                    endDate={(Object.keys(selectedDates))[(Object.keys(selectedDates)).length - 1]}
                    startTime={`${formatTime(startTime)}`}
                    endTime={`${formatTime(endTime)}`}
                    exclusion={excludeSaturday && excludeSunday ? t('excludingSat_Sun') : (excludeSaturday ? t('excludingSaturday') : (excludeSunday ? t('excludingSunday') : ''))}
                    price={rate*date_counter1}
                    hours={selectedHours}
                    speciality_type={workdata?.speciality_type}
                    pickup_address={workdata?.pickup_address}
                    pickup_dates={Object.keys(selectedDates)}
                    pickup_lat={workdata?.pickup_lat}
                    pickup_lng={workdata?.pickup_lng}
                    package_id={workdata?.package_id}
                    work_sub_type={workdata?.work_sub_type}
                    zone={workdata?.zone}
                  />
            <View style={styles.backpanel}>
            <View style={{alignItems:'center'}}>
                <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold', alignItems:'center' }}>{t('workingHours')}</Text>
            </View>
            <View style={{ margin: 5 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <TouchableOpacity onPress={() => handleCheckBoxClick(8)}>
                    <View style={{ flexDirection: 'row', shadowOffset: { width: 0, height: 0 },shadowOpacity: 0.15,shadowRadius: 5,elevation: 5,backgroundColor: 'white', alignItems: 'center',padding:10, backgroundColor: isChecked1 ? colors.medics_blue : 'white', borderRadius:10 }}>
                      <Text style={{ color: isChecked1 ? 'white' : 'black',fontSize: 20 }}>{t('seven')} {t('hours')}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCheckBoxClick(9)}>
                    <View style={{ flexDirection: 'row', shadowOffset: { width: 0, height: 0 },shadowOpacity: 0.15,shadowRadius: 5,elevation: 5, alignItems: 'center',padding:10, backgroundColor: isChecked2 ? colors.medics_blue : 'white', borderRadius:10 }}>
                      <Text style={{ color: isChecked2 ? 'white' : 'black',fontSize: 20 }}>{t('eight')} {t('hours')}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCheckBoxClick(10)}>
                    <View style={{ flexDirection: 'row', shadowOffset: { width: 0, height: 0 },shadowOpacity: 0.15,shadowRadius: 5,elevation: 5, alignItems: 'center',padding:10, backgroundColor: isChecked3 ? colors.medics_blue : 'white', borderRadius:10 }}>
                      <Text style={{ color: isChecked3 ? 'white' : 'black',fontSize: 20 }}>{t('nine')} {t('hours')}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleCheckBoxClick(11)}>
                    <View style={{ flexDirection: 'row', shadowOffset: { width: 0, height: 0 },shadowOpacity: 0.15,shadowRadius: 5,elevation: 5, alignItems: 'center',padding:10, backgroundColor: isChecked4 ? colors.medics_blue : 'white', borderRadius:10 }}>
                      <Text style={{ color: isChecked4 ? 'white' : 'black',fontSize: 20 }}>{t('one')}{t('zero')} {t('hours')}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
          </View>
            <View style={{ margin: 10 }} />
            <View style={styles.backpanel}>
                <View style={{alignItems:'center'}}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontWeight: 'bold', alignItems:'center' }}>{t('chooseStartTime')}</Text>
                 </View>
                <View style={{ margin: 5 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
                    <TouchableOpacity onPress={showPicker} style={styles.timePickerButton}>
                        <View style={{  alignItems: 'center',paddingVertical: 5, paddingHorizontal: 20, backgroundColor: colors.medics_blue, borderRadius:10 }}>
                          <Text style={{fontSize: 20, color:'white'}}>{`${formatTime(startTime)}`}</Text>
                          <Text style={{color:'white'}}>{t('startTime')}</Text>
                        </View>
                        </TouchableOpacity>
                        <View style={{  alignItems: 'center', justifyContent:'center'}}>
                          <Icon type={Icons.FontAwesome} name="long-arrow-right" color={colors.icon_active_color} style={{ fontSize: 50 }} />
                        </View>
                    <View style={{  alignItems: 'center',paddingVertical: 5, borderColor: colors.medics_blue, backgroundColor:'white', borderWidth: 2, paddingHorizontal: 20, borderRadius:10 }}>
                      <Text style={{fontSize: 20,color: 'black'}}>{`${formatTime(endTime)}`}</Text>
                      <Text style={{color: 'black'}}>{t('endTime')}</Text>
                    </View>
                </View>

                {showTimePicker && (
                        <DateTimePicker
                          value={startTime}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={onChangeStartTime}
                        />
                      )}
            </View>
      </ScrollView>
       <TouchableOpacity onPress={validate} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>{t('bookNow')}• {global.currency}{rate*date_counter1}</Text>
       </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height:50,
    backgroundColor: colors.medics_blue,
    flexDirection: 'row',
    alignItems: 'center',
  },
  doneButton: {
    marginVertical:10,
    marginHorizontal:30,
    backgroundColor: colors.medics_blue,
    borderRadius: 10,
    height: 60,
     alignItems: 'center',
    justifyContent: 'center'
  },
  doneButtonText: {
    color: colors.theme_fg_three,
    fontSize: f_xl,
    fontWeight: 'bold'
  },
  calendarContainer: {
      marginHorizontal: 10, // Adjust as needed
      marginTop: 10, // Adjust as needed
      marginBottom: 20, // Adjust as needed
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 5,
      borderRadius: 10,
      backgroundColor: 'white', // Ensure the background color is set for the shadow to be visible
    },
    backpanel:{
    marginHorizontal:10,
    padding:10,
    paddingBottom:15,
    shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 5,
      borderRadius: 10,
      backgroundColor: 'white',
    }
});

export default RepeatTimes;
