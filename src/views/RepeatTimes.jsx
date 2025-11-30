import React, { useState,useEffect  } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { f_xl, f_xs, f_m, bold, normal, api_url, work_details, get_estimation_rate, pickerconst, get_home } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { Calendar } from 'react-native-calendars';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import ReHireConfirmation from '../views/ReHireConfirmation';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const RepeatTimes = () => {
  const navigation = useNavigation();
  const today = moment();
  const tomorrow = today.add(1, 'day').format("YYYY-MM-DD");
  const route = useRoute();
  const [work_id,setWorkid]=useState(route.params?.work_id);
  const [profile_picture,setprofile_picture]=useState(route.params?.profile_picture);
  const [speciality_name,setspeciality_name]=useState(route.params?.speciality_name);
  const [workdata,setWorkData]=useState();
  const [rate,setrate]=useState(0);
  const [selectedDates, setSelectedDates] = useState({});
  const [startDate, setStartDate] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected_package, setselectedpackage] = useState(0);

  const [endDate, setEndDate] = useState('');
  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [selectedHours, setSelectedHours] = useState(null);
  const [counter,setcounter]=useState();
  const [isChecked4, setIsChecked4] = useState(false);
  const [endTime, setEndTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date_counter1, setdatecounter1]=useState(1);
  const [existing_day, setexistingday] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  const [selectedTime, setSelectedTime] = useState(null);
  const [date_time, setdatetime] = useState(new Date());
  const [startTime, setStartTime] = useState('');


  const daysArray = [];
  useEffect(() => {
      get_home_api();
      call_work_details();
    }, []);

  useEffect(() => {
      get_estimation_rate_api();
      call_work_details();
    }, [selected_package,selectedDates]);

  const handleOpenModal = () => {
      setModalVisible(true);
    };

    const handleCloseModal = () => {
      setModalVisible(false);
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
              });
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
            setPackages(response.data.result.packages);
            console.log(response.data.result.packages);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error.response);
          alert("Sorry something went wrong");
        });
    };

    const get_estimation_rate_api = async () => {
        const total_hours = selected_package.value ;
        await axios({
          method: "post",
          url: api_url + get_estimation_rate,
          data: { workplace_id: global.id, pickup_lat: workdata.pickup_lat, hours: total_hours, pickup_lng: workdata.pickup_lng, drop_lat: workdata.drop_lat, drop_lng: workdata.drop_lng, work_type: 2, promo: 0, lang: global.lang, package_id: selected_package.id, days: 1, work_sub_type: workdata.work_sub_type },
        })
          .then(async (response) => {
            setrate(response.data.result['specialities'][workdata.speciality_type].rates.total_rate);
          })
          .catch((error) => {
          console.error(error.response);
            alert("Sorry something went wrong");
          });
      };

  const validate = () => {
      if(Object.keys(selectedDates).length === 0 || selected_package == [] || selectedTime == null ){
        Alert.alert( t('fieldsMissing'), t('fieldsNotSelected'));
      }
      else{
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
       setStartTime(firstPart);
       setEndTime(lastPart)
       const firstFormattedTime = convertTo24HourFormat(firstPart);
       const lastFormattedTime = convertTo24HourFormat(lastPart);

       // Concatenate dates with the first formatted time
       const concatenatedDates = Object.keys(selectedDates).map(date => `${date} ${firstFormattedTime}`);
       setdatetime(concatenatedDates);

        handleOpenModal();

      }
  };



  const handlePress = (item)=>{
    setselectedpackage(item);
    setSelectedTime(null);
    console.log(item);
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

  const pickerItemsAll = packages
  .map(pkg => ({
    id: pkg.id,
    label: pkg.package_name,
    value: pkg.hours,
  }))

  // FOR AVAILABLE TIMES

  function generateTimeRanges(hours) {
    const minStartTime = 8; // 8 AM
    const maxEndTime = 20; // 8 PM
    const timeRanges = [];

    for (let startHour = minStartTime; startHour <= maxEndTime - hours; startHour++) {
      let endHour = startHour + hours;
      if (endHour <= maxEndTime) {
        timeRanges.push(`${formatTime_t(startHour)} to ${formatTime_t(endHour)}`);
      }
    }
    return timeRanges;
  }

  // Helper function to format time
  function formatTime_t(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${period}`;
  }

   // Component to render each item
   const render_packages_time = ({ item }) => {
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




const getMarkedDates = () => {
  const markedDates = {};

  // Mark individual dates with dots based on selectedDates
  for (const dateKey in selectedDates) {
    if (selectedDates.hasOwnProperty(dateKey)) {
      markedDates[dateKey] = { selected: true, selectedColor: colors.medics_blue, };
    }
  }

  return markedDates;
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
        price_multiplication(newSelectedDates);
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
           console.log("counter:11111 " + date_counter);
           setdatecounter1(date_counter);
  };


  const styles = StyleSheet.create({
    header: {
      height:50,
      backgroundColor: colors.theme_bg,
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
      fontFamily: normal,
    },
    selectedItemText: {
      color: 'white', // Change to your desired text color for selected item
    },
    list: {
      height:200,

    },
    doneButtonText: {
      color: colors.theme_fg_three,
      fontSize: f_xl,
      fontFamily: bold
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
        backgroundColor: colors.theme_dark,
      }
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
    <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
      <View style={[styles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: '15%', alignItems: 'center', justifyContent: 'center'}}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={'white'} style={{ fontSize: 30 }} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: '5%' }}>
      <View style={{ margin: 5 }} />
      <View style={{alignItems:'center'}}>
          <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold }}>{t('selectbookingdate')}</Text>
      </View>
      <View style={{ margin: 5 }} />
      <View style={styles.calendarContainer}>
      <Calendar
        markingType={'multi-dot'}
        minDate={tomorrow}
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}
        theme={{
          todayTextColor: colors.medics_blue,
          arrowColor: colors.theme_fg_two,
          calendarBackground: colors.theme_dark,
          textDisabledColor: colors.medics_grey,
          dayTextColor: colors.theme_fg_two,
          monthTextColor: colors.theme_fg_two,
        }}
        style={{ borderRadius: 10, backgroundColor: colors.theme_dark }}
      />
      </View>
            <ReHireConfirmation
                    visible={modalVisible}
                    onClose={handleCloseModal}
                    onModify={() => {}}
                    staffName={ (workdata?.staff.first_name) +' '+ (workdata?.staff.last_name) }
                    staffid = {workdata?.staff_id}
                    startDate={Object.keys(selectedDates)[0]}
                    endDate={(Object.keys(selectedDates))[(Object.keys(selectedDates)).length - 1]}
                    startTime={startTime}
                    endTime={endTime}
                    price={rate*date_counter1}
                    hours={selected_package.value}
                    speciality_type={workdata?.speciality_type}
                    speciality_name={speciality_name}
                    pickup_address={workdata?.pickup_address}
                    pickup_dates={Object.keys(selectedDates)}
                    pickup_lat={workdata?.pickup_lat}
                    pickup_lng={workdata?.pickup_lng}
                    package_id={workdata?.package_id}
                    work_sub_type={workdata?.work_sub_type}
                    zone={workdata?.zone}
                    profile_picture={profile_picture}
                  />
            <View style={styles.backpanel}>
            <View style={{alignItems:'center'}}>
                <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold, alignItems:'center' }}>{t('workingHours')}</Text>
            </View>
            <View style={{ margin: 5 }} />
            <FlatList
                  data={pickerItemsAll}
                  renderItem={render_packages}
                  keyExtractor={(item) => item}
                  style={styles.list}
                  showsVerticalScrollIndicator={true}
                />
          </View>
            <View style={{ margin: 10 }} />
            {selected_package != [] ?
            
          
          
            <View style={styles.backpanel}>
                <View style={{alignItems:'center'}}>
                    <Text style={{ color: colors.theme_fg_two, fontSize: f_xl, fontFamily: bold, alignItems:'center' }}>{t('chooseStartTime')}</Text>
                 </View>
                <View style={{ margin: 5 }} />

                <FlatList
                      data={generateTimeRanges(parseInt(selected_package.value, 10))}
                      renderItem={render_packages_time}
                      keyExtractor={(item, index) => index.toString()}
                      style={styles.list}
                      showsVerticalScrollIndicator={true}
                    />

            </View>
            : null  
          }
      </ScrollView>
       <TouchableOpacity onPress={validate} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>{t('bookNow')}• {global.currency}{rate*date_counter1}</Text>
       </TouchableOpacity>
    </SafeAreaView>
    </>
  );
};



export default RepeatTimes;
