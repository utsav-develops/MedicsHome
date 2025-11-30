import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    StatusBar,
    FlatList,
    Linking,
    Alert,
    Platform,
    PermissionsAndroid
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, GOOGLE_KEY, screenWidth, normal, bold, app_name, sos, regular, api_url, work_details, img_url, get_tips, add_tip, work_cancel, loader, sos_sms } from '../config/Constants';
import BottomSheet from 'react-native-simple-bottom-sheet';
import Icon, { Icons } from '../components/Icons';
import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion, MarkerAnimated, Polyline } from 'react-native-maps';
import DropShadow from "react-native-drop-shadow";
import LottieView from 'lottie-react-native';
import { Badge } from '@rneui/themed';
import { connect } from 'react-redux';
import axios from 'axios';
import Dialog, { DialogTitle, SlideAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import database from '@react-native-firebase/database';
import DropdownAlert from 'react-native-dropdownalert';
import Geolocation from '@react-native-community/geolocation';
import { decode, encode } from "@googlemaps/polyline-codec";
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';

const WorkDetails = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const map_ref = useRef();
    const { t } = useLocalization();
    //const staff_loc = useRef();
    let dropDownAlertRef = useRef();
    const [region, setRegion] = useState(props.initial_region);
    const [loading, setLoading] = useState(false);
    const [cancel_loading, setCancelLoading] = useState(false);
    const [data, setData] = useState(route.params.data);
    const [work_id, setWorkId] = useState(route.params.work_id);
    const [from, setFrom] = useState(route.params.from);
    const [dialog_visible, setDialogVisible] = useState(false);
    const [staff_track, setStaffTrack] = useState(null);
    const [coords, setCoords] = useState([]);
    const [on_load, setOnLoad] = useState(0);
    const [tips, setTips] = useState([]);
    const [tip, setTip] = useState(0);
    const [is_mount, setIsMount] = useState(0);
    const [pickup_statuses, setPickupStatuses] = useState([1, 2]);
    const [cancellation_reason, setCancellationReasons] = useState([]);
    const [cancellation_statuses, setCancellationStatuses] = useState([6, 7]);
    const [drop_statuses, setDropStatuses] = useState([3, 4]);
    const [staff_location, setStaffLocation] = useState({ latitude: 9.914372, longitude: 78.155033 });
    const [staff_location_ios, setStaffLocationIos] = useState(new AnimatedRegion({ latitude: 9.914372, longitude: 78.155033 }));
    const [home_marker, setHomeMarker] = useState({ latitude: parseFloat(route.params.data.work.pickup_lat), longitude: parseFloat(route.params.data.work.pickup_lng) });
    const [destination_marker, setDestinaionMarker] = useState({ latitude: parseFloat(route.params.data.work.drop_lat), longitude: parseFloat(route.params.data.work.drop_lng) });
    const [bearing, setBearing] = useState(0);
    const go_back = () => {
        if (from == 'home') {
            navigation.navigate('Dashboard')
        } else {
            navigation.goBack();
        }
    }

    const showDialog = () => {
        setDialogVisible(true);
    }

    useEffect(() => {
        call_get_tips();
        call_work_details();
        const onValueChange = database().ref(`/works/${work_id}`)
            .on('value', snapshot => {
                if (snapshot.val().status != data.status) {
                    call_work_details();
                }
            });
        const onStaffTracking = database().ref(`/staffs/${data.work.speciality_type}/${data.work.staff_id}`)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    let marker = {
                        latitude: parseFloat(snapshot.val().geo.lat),
                        longitude: parseFloat(snapshot.val().geo.lng)
                    }
                    if (data.work.status <= 2) {
                        get_direction(snapshot.val().geo.lat + "," + snapshot.val().geo.lng, data.work.pickup_lat + "," + data.work.pickup_lng)
                    } else {
                        get_direction(snapshot.val().geo.lat + "," + snapshot.val().geo.lng, data.work.drop_lat + "," + data.work.drop_lng)
                    }
                    setBearing(snapshot.val().geo.bearing)
                    setStaffLocation(marker)
                    setStaffLocationIos(marker)
                    animate(marker);
                }
            });
        return (
            onValueChange,
            onStaffTracking
        );
    }, []);

    const get_direction = async (startLoc, destinationLoc) => {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${GOOGLE_KEY}`)
            let respJson = await resp.json();
            let points = decode(respJson.routes[0].overview_polyline.points, 5);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            setCoords(coords);
        } catch (error) {
            console.log(error)
            //return error
        }
    }

    const animate = (nextProps) => {
        const duration = 500;
        if (staff_location !== nextProps) {
            if (Platform.OS === 'android') {
                if (staff_track) {
                    staff_track.animateMarkerToCoordinate(
                        nextProps,
                        duration
                    )
                }
            } else {
                staff_location_ios.timing({
                    ...nextProps,
                    duration
                }).start();
            }
        }
    }

    const call_get_tips = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + get_tips,
            data: { work_id: work_id }
        })
            .then(async response => {
                setLoading(false);
                setTips(response.data.result['data']);
                setTip(response.data.result['tip']);
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const call_add_tip = (tip) => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + add_tip,
            data: { work_id: work_id, tip }
        })
            .then(async response => {
                setLoading(false);
                if (response.data.status == 1) {
                    dropDownAlertRef.alertWithType('success', 'Thank You', 'Your tip added successfully!');
                    setTip(tip);
                }
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const call_work_details = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + work_details,
            data: { work_id: work_id }
        })
            .then(async response => {
                setLoading(false);
                setData(response.data.result);
                setCancellationReasons(response.data.result.cancellation_reasons);
                setOnLoad(1);
                if (response.data.result.work.status == 5 && from == 'home') {
                    if (is_mount == 0) {
                        setIsMount(1);
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: "Bill", params: { work_id: work_id, from: from } }],
                            })
                        );
                    }
                } else if (cancellation_statuses.includes(parseInt(response.data.result.work.status)) && from == 'home') {
                    navigate_home();
                }
            })
            .catch(error => {
                setLoading(false);
                console.log(error)
            });
    }

    const call_dialog_visible = () => {
        setDialogVisible(false)
    }

    call_staff = () => {
        Linking.openURL(`tel:${data.work.staff.phone_number}`)
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

    const call_work_cancel = async (reason_id, type) => {
        setDialogVisible(false)
        setCancelLoading(true);
        await axios({
            method: 'post',
            url: api_url + work_cancel,
            data: { work_id: work_id, status: 6, reason_id: reason_id, cancelled_by: type }
        })
            .then(async response => {
                setCancelLoading(false);
                console.log('success')
            })
            .catch(error => {
                //alert(error)
                setCancelLoading(false);
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

    const move_chat = () => {
        navigation.navigate('Chat', { work_id: work_id });
    }

    const send_sos = async () => {
        Alert.alert(
            'Please confirm',
            'Are you in emergency ?',
            [
                {
                    text: 'Yes',
                    onPress: () => get_location()
                },
                {
                    text: 'No',
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    }

    const get_location = async () => {
        if (Platform.OS == "android") {
            await requestCameraPermission();
        } else {
            await getInitialLocation();
        }
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                'title': 'Location access required',
                'message': { app_name } + 'Needs to access your location for tracking'
            }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await getInitialLocation();
            } else {
                alert('Sorry unable to fetch your location');
            }
        } catch (err) {
            alert('Sorry unable to fetch your location');
        }
    }

    const getInitialLocation = async () => {
        Geolocation.getCurrentPosition(async (position) => {
            call_sos_sms(position.coords.latitude, position.coords.longitude);
        }, error => console.log('Unable fetch your location'),
            { enableHighAccuracy: false, timeout: 10000 });
    }


    

    const call_sos_sms = (lat, lng) => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + sos_sms,
            data: { workplace_id: global.id, booking_id: work_id, latitude: lat, longitude: lng, lang: global.lang }
        })
            .then(async response => {
                setLoading(false);
                if (response.data.status == 1) {
                    alert(response.data.message);
                } if (response.data.status == 2) {
                    alert(response.data.message);
                } else {
                    Alert.alert(
                        strings.alert,
                        response.data.message,
                        [
                            {
                                text: 'Okay',
                                onPress: () => this.add_sos()
                            },
                            {
                                text: 'Cancel',
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

   

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <MapView
                provider={PROVIDER_GOOGLE}
                ref={map_ref}
                style={styles.map}
                region={region}
                fitToElements={true}
            >

                {data.work.status <= 2 &&
                    <Marker coordinate={home_marker}>
                        <Image style={{ height: 30, width: 25 }} source={require('.././assets/img/tracking/home.png')} />
                    </Marker>
                }
                {data.work.status >= 2 &&
                    <Marker coordinate={destination_marker}>
                        <Image style={{ height: 30, width: 25 }} source={require('.././assets/img/tracking/destination.png')} />
                    </Marker>
                }
                <MarkerAnimated
                    ref={marker => {
                        setStaffTrack(marker);
                    }}
                    rotation={bearing}
                    coordinate={Platform.OS === "ios" ? staff_location_ios : staff_location}
                    identifier={'mk1'}
                >
                    {data.work.speciality_slug == 'nurse' &&
                        <Image style={{ height: 30, width: 15 }} source={require('.././assets/img/tracking/nurse.png')} />
                    }
                    {data.work.speciality_slug == 'nurse' &&
                        <Image style={{ height: 30, width: 15 }} source={require('.././assets/img/tracking/doctor.png')} />
                    }
                    {data.work.speciality_slug == 'nurse' &&
                        <Image style={{ height:30, width:15 }} source={require('.././assets/img/tracking/lab.png')} />
                    }
                </MarkerAnimated>
                {global.polyline_status == 1 &&
                    <Polyline
                        coordinates={coords}
                        strokeWidth={4}
                        strokeColor={colors.theme_fg} />
                }
            </MapView>
            {drop_down_alert()}
            <View style={{ flexDirection: 'row' }}>
                <DropShadow
                    style={{
                        width: '50%',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 25,
                    }}
                >
                    <TouchableOpacity activeOpacity={0} onPress={go_back.bind(this)} style={{ width: 40, height: 40, backgroundColor: colors.theme_bg_three, borderRadius: 25, alignItems: 'center', justifyContent: 'center', top: 20, left: 20 }}>
                        <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.icon_active_color} style={{ fontSize: 22 }} />
                    </TouchableOpacity>
                </DropShadow>
                {on_load == 1 &&
                    <TouchableOpacity onPress={send_sos.bind(this)} activeOpacity={1} style={{ width: '50%', alignItems: 'flex-end' }}>
                        {drop_statuses.includes(data.work.status) &&
                            <DropShadow
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 25,
                                }}
                            >
                                <View style={{ width: 60, height: 60, backgroundColor: colors.theme_bg_three, borderRadius: 30, alignItems: 'center', justifyContent: 'center', top: 20, right: 20 }}>
                                    <LottieView source={sos} autoPlay loop />
                                </View>
                            </DropShadow>
                        }
                    </TouchableOpacity>
                }
            </View>
            <BottomSheet sliderMinHeight={80} sliderMaxHeight={screenHeight - 5} isOpen>
                {(onScrollEndDrag) => (
                    <ScrollView onScrollEndDrag={onScrollEndDrag}
                    contentContainerStyle={{ paddingTop: 0 }}
                    >
                        {on_load == 1 ?
                            <View style={{ padding: 10, paddingTop: 0 }}>
                                <View>
                                    <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 20, fontWeight: 'normal' }}>{t('yourOTPcode')} #{data.work.otp}</Text>
                                </View>
                                <View style={{ margin: 10 }} />
                                <View style={{ borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: colors.grey }}>
                                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 20, marginBottom: 20 }}>
                                        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ height: 50, width: 50 }} >
                                                <Image style={{ height: undefined, width: undefined, flex: 1 }} source={{ uri: data.work.staff.profile_picture }} />
                                            </View>
                                        </View>
                                        <View style={{ width: '40%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 17, fontWeight: 'bold' }}>{data.work.staff.first_name}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                                <Icon type={Icons.MaterialIcons} name="star" color={colors.warning} style={{ fontSize: 18 }} />
                                                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 13, fontweight: regular }}>{data.work.staff.overall_ratings}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '35%', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ height: 50, width: 50, marginBottom: 5 }} >
                                                <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 5 }} source={{ uri: img_url + data.work.speciality.speciality_image }} />
                                            </View>
                                            <Text style={styles.title}>Since {(data.created_at)}</Text>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 13, fontweight: regular }}> {data.work.speciality.number}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 0.5, borderColor: colors.grey }}>
                                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 13, fontweight: regular }}>{t('hours')}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                                <Icon type={Icons.MaterialIcons} name="map" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                                                <View style={{ margin: 2 }} />
                                                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 18, fontWeight: 'normal' }}>{data.work.distance} km</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 13, fontweight: regular }}>{t('workType')}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                                <Icon type={Icons.MaterialIcons} name="commute" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                                                <View style={{ margin: 2 }} />
                                                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 16, fontWeight: 'normal' }}>{data.work.work_type_name}</Text>
                                            </View>
                                        </View>
                                        <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 13, fontweight: regular }}>{t('rate')}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                                <Icon type={Icons.MaterialIcons} name="local-atm" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                                                <View style={{ margin: 2 }} />
                                                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 18, fontWeight: 'normal' }}>{global.currency}{data.work.total}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <View style={{ width: '100%', marginTop: 20 }}>
                                        <TouchableOpacity activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}>
                                            <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
                                                <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                                                    <Badge status="success" />
                                                </View>
                                                <View style={{ width: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                                    <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 12, fontweight: regular }}>{t('address')}</Text>
                                                    <View style={{ margin: 2 }} />
                                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 13, fontweight: regular }}>{data.work.pickup_address}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        {data.work.work_type != 2 &&
                                            <TouchableOpacity activeOpacity={1} style={{ width: '100%', backgroundColor: colors.theme_bg_three }}>
                                                <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
                                                    <View style={{ width: '10%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4 }}>
                                                        <Badge status="error" />
                                                    </View>
                                                    <View style={{ width: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 12, fontweight: regular }}>{t('address')}</Text>
                                                        <View style={{ margin: 2 }} />
                                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: 13, fontweight: regular }}>{data.work.drop_address}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                              {/* {data.work.status >= 1 && data.work.status <= 5 &&
                                    <View style={{ width: '100%', marginBottom: 20 }}>
                                        {tip == 0 &&
                                            <View style={{ padding: 10 }}>
                                                <Text style={{ color: colors.theme_fg_two, fontSize: 20, fontWeight: 'bold' }}>Add a tip for your staff</Text>
                                                <View style={{ margin: 2 }} />
                                                <Text style={{ color: colors.theme_fg_two, fontSize: 14, fontweight: regular }}>The entire amount will be transferred to the bookingr. Valid only if you pay online.</Text>
                                                <View style={{ margin: 5 }} />
                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        {tips.map((row, index) => (
                                                            <TouchableOpacity onPress={call_add_tip.bind(this, row)} style={{ width: 60, margin: 5, height: 35, borderRadius: 10, borderColor: colors.theme_fg, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text style={{ color: colors.theme_fg_two, fontSize: 14, fontWeight: 'bold' }}>+{global.currency}{row}</Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                </ScrollView>
                                            </View>
                                        }
                                    </View>
                                } */}
                                {pickup_statuses.includes(data.work.status) &&
                                    <View style={{ borderTopWidth: 0, borderColor: colors.grey }}>
                                        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 20 }}>
                                            <TouchableOpacity onPress={move_chat.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon type={Icons.MaterialIcons} name="chat" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                                            </TouchableOpacity>
                                            <View style={{ width: '5%' }} />
                                            <TouchableOpacity activeOpacity={1} onPress={call_staff.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon type={Icons.MaterialIcons} name="call" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                                            </TouchableOpacity>
                                            <View style={{ width: '10%' }} />
                                            {cancel_loading == false ?
                                                <TouchableOpacity onPress={showDialog.bind(this)} activeOpacity={1} style={{ width: '55%', backgroundColor: colors.error_background, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.error, fontWeight: 'bold' }}>{t('cancel')}</Text>
                                                </TouchableOpacity>
                                                :
                                                <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                                                    <LottieView source={loader} autoPlay loop />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <Text style={{ color: colors.theme_fg_two, fontSize: 15, fontweight: regular }}>Loading...</Text>
                            </View>
                        }
                    </ScrollView>
                )}
            </BottomSheet>
            <Dialog
                visible={dialog_visible}
                width="90%"
                animationDuration={100}
                dialogTitle={<DialogTitle title="Reason to cancel your booking." />}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="Close"
                            textStyle={{ fontSize: 16, color: colors.theme_fg_two, fontweight: regular }}
                            onPress={call_dialog_visible}
                        />
                    </DialogFooter>
                }
                onTouchOutside={() => {
                    call_dialog_visible()
                }}
            >
                <DialogContent>
                    <FlatList
                        data={cancellation_reason}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={call_work_cancel.bind(this, item.id, item.type)} activeOpacity={1} >
                                <View style={{ padding: 10 }}>
                                    <Text style={{ fontweight: regular, fontSize: 12, color: colors.theme_fg_two }}>{item.reason}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                    />
                </DialogContent>
            </Dialog>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: colors.lite_bg
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

function mapStateToProps(state) {
    return {
        initial_lat: state.booking.initial_lat,
        initial_lng: state.booking.initial_lng,
        initial_region: state.booking.initial_region,
    };
}

export default connect(mapStateToProps, null)(WorkDetails);