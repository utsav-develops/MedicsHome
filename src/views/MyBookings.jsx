import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Modal,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    FlatList
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, work_details, my_bookings, api_url, img_url, loader, no_data_loader, cancel, f_s, f_xs, f_tiny, f_xl, hiring_cancel } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import { Badge } from '@rneui/themed';
import axios from 'axios';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const MyBookings = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState(5);
    const viewableItems = useSharedValue([]);
    const [cancellation_statuses, setCancellationStatuses] = useState([6, 7]);
    const { t } = useLocalization();
    const [modalVisible, setModalVisible] = useState(false);
    const insets = useSafeAreaInsets();
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    const getHourDifference = (startTime, endTime) => {
        const start = new Date("2000-01-01 " + startTime); // Date object for start time
        const end = new Date("2000-01-01 " + endTime);     // Date object for end time

        // Calculate difference in milliseconds
        let difference = end - start;

        // Convert milliseconds to hours
        let hours = difference / (1000 * 60 * 60);

        return Math.abs(hours);
    };

    const go_back = () => {
        navigation.goBack();
    };

    const openModal = () => {
        setModalVisible(true);
      };

    const closeModal = () => {
    setModalVisible(false);
    };

    useEffect(() => {
        call_my_bookings(5);
    }, []);

    const change_filter = (id) => {
        setFilter(id);
        call_my_bookings(id);
    }




    const call_my_bookings = (fl) => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + my_bookings,
            data: { workplace_id: global.id, lang: global.lang, filter: fl }
        })
            .then(async response => {
                setTimeout(function () {
                    setLoading(false);
                    setData(response.data.result);
                    console.log(response.data.result)
                }, 1000)
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong');
            });
    }

    const call_hiring_cancel= (h_id) => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + hiring_cancel,
            data: { hiring_id: h_id }
        })
            .then(async response => {
                    setLoading(false);
                    if(response.data.status == 1) {
                        closeModal();
                        alert('Booking successfully canceled');
                        call_my_bookings(5);
                    }
            })
            .catch(error => {
                closeModal();
                setLoading(false);
                alert('Sorry something went wrong');
            });
    }


    function removeLastTwoDigits(timeString) {
    try {
        return timeString.substring(0, timeString.length - 3);
        } catch (error) {
                return "unknown";
            }
    }

    const navigate = (work_id, filter) => {
        if (filter == 1) {
            call_work_details(work_id);
        } else if (filter == 2) {
            navigation.navigate('Bill', { work_id: work_id, from: 'works' })
        }
    }

    const call_work_details = (work_id) => {
        axios({
            method: 'post',
            url: api_url + work_details,
            data: { work_id: work_id }
        })
            .then(async response => {
                navigation.navigate('WorkDetails', { work_id: work_id, from: 'works', data: response.data.result })
            })
            .catch(error => {
                console.log(error)
            });
    }

    const navigate_home = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    }

    const MyModal = ({ visible, onClose, id }) => {
        return (
          <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{t('wantToDecline')}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={() => {closeModal()}}>
                    <Text style={styles.buttonText}>{t('donotCancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => {call_hiring_cancel(id)}}>
                    <Text style={styles.buttonText}>{t('yes_do')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        );
      };

    type ListItemProps = {
        viewableItems: Animated.SharedValue<ViewToken[]>;
        item: {
            id: number;
        };
        filter: number; // Add this line

    };

    const ListItem: React.FC<ListItemProps> = React.memo(
        ({ item, viewableItems }) => {
            const rStyle = useAnimatedStyle(() => {
                const isVisible = Boolean(
                    viewableItems.value
                        .filter((item) => item.isViewable)
                        .find((viewableItem) => viewableItem.item.id === item.id)
                );
                return {
                    opacity: withTiming(isVisible ? 1 : 0),
                    transform: [
                        {
                            scale: withTiming(isVisible ? 1 : 0.6),
                        },
                    ],
                };
            }, []);
            return (
                <Animated.View style={[
                    {
                        width: '100%',
                    },
                    rStyle,
                ]}>
                    <TouchableOpacity activeOpacity={1} onPress={navigate.bind(this, item.id, filter)} style={{ alignItems: 'center', borderRadius: 10, padding: 10 }}>
                        <DropShadow
                            style={{
                                width: '95%',
                                marginBottom: 5,
                                marginTop: 5,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: 0.1,
                                shadowRadius: 5,
                            }}
                        >

                            <View style={{ flexDirection: 'row', flex: 1, backgroundColor: colors.theme_bg_three, padding: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                <View style={{ width: '17%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <View style={{ width: 50, height: 50 }} >
                                        {item.profile_picture === null?
                                          <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={require('.././assets/img/tracking/nurse.png')} />
                                        :
                                           <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={{ uri: item.profile_picture }} />

                                        }
                                    </View>
                                </View>
                                <View style={{ margin: 2 }} />
                                <View style={{ width: '33%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    {item.staff_name === null?
                                        <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: bold }}>{t('booking')}</Text>
                                    :
                                         <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: bold }}>{item.staff_name}</Text>

                                    }
                                    <View style={{ margin: 2 }} />
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon type={Icons.MaterialIcons} name="star" color={colors.warning} style={{ fontSize: 20 }} />
                                        <View style={{ margin: 1 }} />
                                        <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: bold }}>{item.ratings}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>{t('rate')}</Text>
                                    <View style={{ margin: 3 }} />
                                    <Text style={{ fontSize: f_s, fontFamily: bold, color: colors.theme_fg_two }}>{global.currency}{item.total}</Text>
                                </View>
                                {filter === 5 ?
                                <View style={{position:'absolute', top:0, right:0, backgroundColor:'red', borderBottomLeftRadius:8, borderTopRightRadius:10,}}>
                                    <TouchableOpacity onPress={openModal}>
                                        <Icon type={Icons.Entypo} name="cross" color={'black'} style={{ fontSize: 27}} />
                                    </TouchableOpacity>
                                    <MyModal visible={modalVisible} onClose={closeModal} id={item.id} />
                                </View>
                                :null
                            }
                                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>{t('hrs')}</Text>
    <View style={{ margin: 3 }} />
    {filter === 5 ? (
        <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: bold }}>{getHourDifference(item.pickup_time, item.drop_time)} {t('hours')} </Text>
    ) : (
        <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: bold }}>{item.distance} {t('hours')}</Text>
    )}

</View>
                            </View>
                            <View style={{ bottomBorderWidth: 0.5, borderColor: colors.grey, height: 1 }} />
                            <View style={{ flex: 1, backgroundColor: colors.theme_bg_three, padding: 15, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>





                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Badge status="success" />


                                        <View style={{ margin: 5 }} />
                                        {filter ===5 ?
                                            <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: normal }}>{item.pickup_location}</Text>

                                        :
                                            <Text numberOfLines={2} ellipsizeMode='tail' style={{ width: '95%', color: colors.theme_fg_two, fontSize: f_xs, fontFamily: normal }}>{item.pickup_address}</Text>
                                        }

                                    </View>

{filter === 2 && (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 }}>
        <View style={{ flex: 1 }}>
            {/* Other content if you have any, like pickup address etc., should be here */}
        </View>
        {/* <TouchableOpacity activeOpacity={1} onPress={() => {navigation.navigate("RepeatTimes", {work_id:item.id, profile_picture: item.profile_picture, speciality_name: item.speciality_type})}} style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Icon type={Icons.Feather} name="repeat" color={colors.icon_inactive_color} style={{ fontSize: 20 }} />
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 12, fontFamily: bold }}>{t('rehire')}</Text>
        </TouchableOpacity> */}
    </View>
)}
                                </View>
                                <View style={{ margin: 5, marginTop: 10, flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    {filter===5 ?(
                                        <View style ={{alignItems:'flex-start'}}>
                                            <Text style={{ fontSize: f_tiny, fontFamily: normal, color: colors.text_grey }}>{Moment(item.pickup_date).format("DD-MMM-YYYY")} - {Moment(item.drop_date).format("DD-MMM-YYYY")} </Text>
                                            <Text style={{ fontSize: f_xs, fontFamily: bold, color: colors.text_grey, alignSelf: 'flex-start' }}>{removeLastTwoDigits(item.pickup_time)} - {removeLastTwoDigits(item.drop_time)}</Text>
                                        </View>
                                    ):(
                                        <Text style={{ fontSize: f_tiny, fontFamily: normal, color: colors.text_grey }}>{Moment(item.pickup_date).format("DD-MMM-YYYY")}</Text>
                                    )}
                                    </View>
                                    <View style={{ width: '50%', }}>
                                        {filter ===5?(
                                        <>
                                            <View style={{ margin: 5 }} />
                                         {item.status === 1 ? (
                                            <View style={{ padding: 8,alignSelf: 'flex-end', borderColor:colors.warning, borderWidth:2, borderRadius: 15, alignItems: 'center',  }}>
                                                <Text style={{ fontSize: f_s, fontFamily: bold , color: colors.theme_fg_two }}>{t('bookingPlaced')}</Text>
                                            </View>
                                          ) : (
                                            item.status === 2 ? (
                                              <View style={{ borderColor:colors.success, alignSelf: 'flex-end', borderWidth:2, padding: 5, borderRadius: 15, alignItems: 'center',  }}>
                                                  <Text style={{ fontSize: f_s, fontFamily: bold, color: colors.theme_fg_two }}>{t('accepted')}</Text>
                                              </View>
                                            ) : item.status === 7 ? (
                                                <TouchableOpacity onPress={() =>  {alert(t('placeNewBooking')) }}style={{ borderColor:colors.error,alignSelf: 'flex-end', borderWidth:2, padding: 5, borderRadius: 15, alignItems: 'center', }}>
                                                    <Text style={{ fontSize: f_s, fontFamily: bold, color: colors.theme_fg_two }}>{t('rejected')}</Text>
                                                </TouchableOpacity>
                                            ) : item.status === 9 ? (
                                              <View style={{ borderColor:'orange', alignSelf: 'flex-end', borderWidth:2, padding: 5, borderRadius: 15, alignItems: 'center',  }}>
                                                   <Text style={{ fontSize: f_s, fontFamily: bold, color: colors.theme_fg_two }}>{t('ongoing')}</Text>
                                               </View>
                                           ) : null
                                          )}

                                        </>):(
                                            <Text style={{ fontSize: f_tiny, fontFamily: normal, color: colors.text_grey, alignSelf: 'flex-end' }}>{Moment(item.pickup_date).format("hh:mm a")}</Text>

                                        )}
                                    </View>
                                </View>
                            </View>
                            {cancellation_statuses.includes(parseInt(item.status)) &&
                                <View style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 100, height: 100 }} >
                                        <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={cancel} />
                                    </View>
                                </View>
                            }
                        </DropShadow>
                    </TouchableOpacity>
                </Animated.View>
            );
        }
    );

    const onViewableItemsChanged = ({ viewableItems: vItems }) => {
        viewableItems.value = vItems;
    };

    const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

    const styles = StyleSheet.create({
            header: {
                height: 60,
                backgroundColor: colors.theme_bg,
                flexDirection: 'row',
                alignItems: 'center'
            },

            modalContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              },
              modalContent: {
                backgroundColor: colors.dark,
                borderColor:'white',
                borderWidth:1,
                padding: 20,
                borderRadius: 10,
                alignItems: 'center',
              },
              modalText: {
                fontSize: 18,
                marginBottom: 20,
              },
              buttonContainer: {
                flexDirection: 'row',
              },
              button: {
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 5,
                marginHorizontal: 5,
                width: '40%',
                alignItems:'center',
              },
              buttonText: {
                color: 'white',
                fontSize: 16,
              },
            segment_active_bg: {
                minWidth: 120, // Static width
                alignItems: 'center',
                justifyContent: 'center',
                padding: 15,
                backgroundColor: colors.medics_blue,
                borderRadius: 10
            },
            segment_inactive_bg: {
                minWidth: 120, // Static width
                alignItems: 'center',
                justifyContent: 'center',
                padding: 15,
                backgroundColor: colors.theme_bg_three,
                borderRadius: 10
            },
            segment_active_fg: {
                    color: 'white',
                    fontSize: 16,
                    fontFamily: bold,

                },

            segment_inactive_fg: {
                    color: colors.theme_fg_two,
                    fontSize: 16,
                    fontFamily: normal,
                    color: colors.theme_fg_two }
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
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('booking')}</Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', marginTop:10, marginBottom:5 }}>

  <DropShadow
      style={{
          width: '95%',
          marginTop: 5,
          shadowColor: "#000",
          shadowOffset: {
              width: 0,
              height: 0,
          },
          shadowOpacity: 0.1,
          shadowRadius: 5,
      }}
  >
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: 'row',  borderRadius: 10 }}
    >
        <View style={{margin:5}}/>
       {loading == false?
       <TouchableOpacity onPress={change_filter.bind(this,5)} style={[filter == 5 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
             <Text style={[filter == 5 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('upcoming')}</Text>
         </TouchableOpacity>
         :
       <TouchableOpacity style={[filter == 5 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
               <Text style={[filter == 5 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('upcoming')}</Text>
       </TouchableOpacity>
       }

      <View style={{margin:5}}/>
       {loading == false?
      <TouchableOpacity onPress={change_filter.bind(this,1)} style={[filter == 1 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
          <Text style={[filter == 1 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('ongoing')}</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity style={[filter == 1 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
            <Text style={[filter == 1 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('ongoing')}</Text>
        </TouchableOpacity>
        }

      <View style={{margin:5}}/>
      {loading == false?
      <TouchableOpacity onPress={change_filter.bind(this, 2)} style={[filter == 2 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
          <Text style={[filter == 2 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('completed')}</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity style={[filter == 2 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
            <Text style={[filter == 2 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('completed')}</Text>
        </TouchableOpacity>
      }
      <View style={{margin:5}}/>
      {loading == false?
      <TouchableOpacity onPress={change_filter.bind(this, 3)} style={[filter == 3 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
          <Text style={[filter == 3 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('cancelled')}</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity style={[filter == 3 ? styles.segment_active_bg : styles.segment_inactive_bg]}>
            <Text style={[filter == 3 ? styles.segment_active_fg : styles.segment_inactive_fg]}>{t('cancelled')}</Text>
        </TouchableOpacity>
      }
      <View style={{margin:5}}/>
    </ScrollView>
      </DropShadow>
    </View>
    <ScrollView showsVerticalScrollIndicator={false}>


            {loading == true ?
                <View style={{ height: 100, width: 100, alignSelf: 'center', marginTop: '30%' }}>
                    <LottieView source={loader} autoPlay loop />
                </View>
                :
                <View>
                    {data.length > 0 ?
                        <FlatList
                            data={data}
                            contentContainerStyle={{ paddingTop: 5 }}
                            viewabilityConfigCallbackPairs={
                                viewabilityConfigCallbackPairs.current
                            }
                            renderItem={({ item }) => {
                                return <ListItem item={item} viewableItems={viewableItems} filter={filter} />;
                            }}
                        />
                        :
                        <View style={{ height: 300, width: 300, alignSelf: 'center', marginTop: '30%' }}>
                            <LottieView source={no_data_loader} autoPlay loop />
                        </View>
                    }
                </View>
            }
            <View style={{ margin:0}}/>
            </ScrollView>
        </SafeAreaView>
        </>
    );
};



export default MyBookings;