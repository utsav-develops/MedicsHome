import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Modal,Dimensions, ScrollView, StyleSheet, TouchableOpacity, LayoutAnimation, Image, StatusBar, Platform, } from 'react-native';
import axios from 'axios';
import { no_data_loader,loader, api_url, regular, bold, normal, f_xl, get_session_emar, img_url, sign_emar, Auth_Token } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useLocalization } from '../config/LocalizationContext';
import { useCustomTheme } from '../config/useCustomTheme';
import * as colors from '../assets/css/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from 'moment';
import LottieView from 'lottie-react-native';
import DropdownAlert from "react-native-dropdownalert";

const eMAR = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [medications, setMedications] = useState([]);
    const { t } = useLocalization();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();
    const [activeTab, setActiveTab] = useState('scheduled');
    const [first_name, setFirstName] = useState(route.params?.first_name);
    const [last_name, setLastName] = useState(route.params?.last_name);
    const [profilePicture, setProfilePicture] = useState('');
    const [openMedications, setOpenMedications] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessionID, setSessionID] = useState('');
    const signatureRef = useRef(null);
    let dropDownAlertRef = useRef();
  console.log("patient id " + global.patient_id);

  console.log("pat id " +global.pat_id);

    const drop_down_alert = () => {
        return (
          <DropdownAlert
            ref={(ref) => {
              if (ref) {
                dropDownAlertRef = ref;
              }
            }}
          />
        );
      };


    useEffect(() => {
        fetchMedications();
    }, []);

    const fetchMedications = async () => {
    setLoading(true);
        try {
            const response = await axios.post(api_url + 'staff/get_session_emar', {
                patient_id: global.patient_id ? global.patient_id : global.pat_id,
                token: Auth_Token
            });

            setMedications(response.data.result);
            setFirstName(response.data.patient_details.first_name);
            setLastName(response.data.patient_details.last_name);
            setProfilePicture(response.data.patient_details.profile_picture);
            console.log(response.data.result);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching medications:", error.response);
        }
    };



    const openSignatureModal = (id) =>{
      setSessionID(id);
      console.log(id);
       setIsModalOpen(true);
    };

    const closeSigntaureModal = () =>{
        setIsModalOpen(false);
    };

    const handleBack = () => {
        navigation.goBack();
    };




    const handle_empty = () => {
        dropDownAlertRef.alertWithType('error', 'Validation Error','Please Sign The eMAR Chart To Assign The Medicine');

    };

    const handleClear = () => {
        signatureRef.current?.clearSignature();
    };

    const formatTime = (time) => {
        // Assuming `time` is in "HH:mm" format (24-hour format)
        return moment(time, "HH:mm").format("h:mm A");
    };


    const toggleDropdown = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpenMedications((prevOpenMedications) => ({
            ...prevOpenMedications,
            [index]: !prevOpenMedications[index],
        }));
    };

    const filteredMedications = medications.filter(medication =>
        (activeTab === 'scheduled' && medication.status !== 10) ||
        (activeTab === 'unscheduled' && medication.status === 10)
    );

    const colorSet = ['#B8CCFF', '#EFB0FF', '#FFA9A9', '#A9FFBC']



    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.dark,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
            paddingHorizontal: 15,
            justifyContent: 'space-between',
        },
        headerTitle: {
            fontSize: 20,
            fontFamily: bold,
            color: colors.theme_fg_two,
            marginLeft: 15,
        },
        tabs: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: colors.dark,
            marginVertical: 20,
            borderRadius: 60,
            shadowColor: colors.medics_grey,
            shadowOffset: { height: 10 },
            shadowOpacity: 0.9,
            shadowRadius: 10,
            elevation: 5,
            position: 'absolute',
            alignSelf: 'center',
            bottom: 1,
        },
        tab: {
            marginVertical: 5,
            paddingVertical: 10,
            width: '40%',
            alignItems: 'center',
            borderRadius: 15,
            marginBottom: 5,
        },
        activeTab: {
            borderColor: colors.medics_blue,
            borderRadius: 15,
            alignItems: 'center',
            borderBottomWidth: 3,
        },
        tabText: {
            fontSize: 16,
            color: colors.theme_fg_two,
            fontFamily: normal,
            padding: 2,
        },
        scrollView: {
            backgroundColor: colors.dark,
            marginTop: 10,
        },
        addMed: {
            backgroundColor: colors.medics_blue,
            height: 70,
            width: 70,
            borderRadius: 30,
            position: 'absolute',
            bottom: 70,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
        },
        medicationItem: {
            alignSelf: 'center',
            width: '90%',
            borderRadius: 60,
            paddingVertical: 7,
            paddingHorizontal: 7,
            marginBottom: 10,
        },
        dropdown: {
            borderTopWidth: 2,
            borderColor: 'white',
        },
        medicationHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            height: 75,
            width: '95%',
            padding: 5,
            justifyContent: 'space-between',
        },
        signButton: {
            backgroundColor: '#007aff',
            padding: 8,
            borderRadius: 5,
            width: 160,
            marginTop: 10,
            justifyContent: 'center',
            alignSelf: 'flex-end',
            alignItems: 'center',
        },
        medicationInfo: {
            fontSize: 16,
            marginBottom: 5,
            fontFamily: bold
        },
        modalContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
        modalContent: {
          width: "100%",
          padding: 10,
          backgroundColor: colors.dark,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          position: "absolute",
          bottom: 0,
          minHeight: "50%",
        },
        modalText: {
          fontSize: 18,
          marginBottom: 20,
          fontFamily: normal,
          color: colors.theme_fg_two,
        },
        closeButton: {
          padding: 10,
          borderRadius: 5,
          width: "49%",
          alignItems: "center",
        },
        closeButtonText: {
          color: "#fff",
          fontSize: 16,
          fontFamily: bold,
        },
         signatureCanvas: {
             width: '100%',
             aspectRatio:1,
             bottom:10,
         },
    });

    const signatureWebStyle = `
            .m-signature-pad {
                box-shadow: none;
                border: none;
            }
            .m-signature-pad--body {
                border: none;
            }
            .m-signature-pad--footer {
                display: none;
                margin: 0px;
            }
            body,html {
                width: 100%; height: 100%;
            }
            .m-signature-pad--body canvas {
                background-color: #f2f2f2;
                width: 100%; height: 100%;
                borderRadius: 15;
            }
        `;



    return (
        <>
            <View
                style={{
                     backgroundColor: colors.dark,
                    height: Platform.OS === 'ios' ? insets.top : null,
                }}>
            <StatusBar
            backgroundColor = {colors.dark}
            barStyle={isDarkMode === false ? "dark-content" : "light-content"}/>
      </View>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 60, height: 60, borderRadius: 40, }}>
                            {profilePicture ? (
                                <Image
                                    style={{ height: undefined, width: undefined, flex: 1, borderRadius: 60 }}
                                    source={{ uri: profilePicture }}
                                />
                            ) : (
                                <Image
                                    style={{ height: undefined, width: undefined, flex: 1, borderRadius: 60 }}
                                    source={require('../assets/img/user.png')}
                                />
                            )}
                        </View>
                        <View>
                            <Text style={[styles.headerTitle]}>{t('hi')}, {first_name}</Text>
                            <Text style={[styles.headerTitle, { fontSize: 16, marginTop: 5, fontFamily: normal }]}>{t('hopedoingWell')}</Text>
                        </View>
                    </View>

                    <View>
                        <TouchableOpacity onPress={handleBack}>
                            <Icon type={Icons.MaterialIcons} name="close" color={colors.theme_fg_two} size={34} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.scrollView}>
                {medications.length == 0 &&
                    <View style={{ height: '100%', width: '100%', alignSelf: 'center', alignItems: 'center', position: 'absolute' }}>
                    	<LottieView source={no_data_loader} autoPlay loop />
                    </View>
                }
                    {filteredMedications.map((medication, index) => {
                    const itemColor = colorSet[index % colorSet.length];
                    const textColor = 'black';
                    return (
                    <>
                    {
                    medication.status != 10 ?
                    <Text style={{ color: colors.text_grey, fontFamily: normal, fontSize: 20, paddingHorizontal:40, paddingVertical: 10}}>{formatTime(medication.time)}</Text>
                    :
                    null
                    }

                    {medication.status == 2 || medication.status == 4 ? (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toggleDropdown(index)}
                            style={[styles.medicationItem, { backgroundColor: itemColor }]}
                        >
                            <View style={styles.medicationHeader}>
                                <View style={{ flexDirection: 'row', width: '80%', marginLeft: 10 }}>
                                    <View style={{ height: 50, width: 50 }}>
                                        <Image
                                            style={{ height: undefined, width: undefined, flex: 1, resizeMode: 'contain' }}
                                            source={{ uri: img_url + medication.image }}
                                        />
                                    </View>
                                    <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                                        <Text style={[styles.medicationInfo, { color: textColor }]}>{medication.MedicationName}</Text>
                                        <Text style={[styles.medicationInfo, { color: textColor, fontSize: 14, fontFamily: normal }]}>{medication.status_name}</Text>
                                    </View>
                                </View>
                                <View style={{ width: '20%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ height: 20, width: 20, borderRadius: 20, backgroundColor: medication.status_color }} />
{/*                                     <MaterialIcons name={openMedications[index] ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={textColor} /> */}
                                </View>
                            </View>

                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            key={index}
                            style={[styles.medicationItem, { backgroundColor: itemColor }]}
                        >
                            <View style={styles.medicationHeader}>
                                <View style={{ flexDirection: 'row',  marginLeft: 10 }}>
                                    <View style={{ height: 50, width: 50 }}>
                                        <Image
                                            style={{ height: undefined, width: undefined, flex: 1, resizeMode: 'contain' }}
                                            source={{ uri: img_url + medication.image }}
                                        />
                                    </View>
                                    <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                                        <Text style={[styles.medicationInfo, { color: textColor }]}>{medication.MedicationName}</Text>
                                        <Text style={[styles.medicationInfo, { color: textColor, fontSize: 14, fontFamily: normal }]}>{medication.status_name}</Text>
                                    </View>
                                </View>
                                <View style={{  flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ height: 20, width: 20, borderRadius: 20, backgroundColor: medication.status_color }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                        </>
                    );
                    })}
                    {loading == true &&
                    <View style={{ height: 100, width: 100, alignSelf: 'center', }}>
                    	<LottieView source={loader} autoPlay loop />
                    </View>
                    }
                    <View style={{ margin: 70 }}/>
                </ScrollView>

                 <View style={styles.tabs}>
                         <TouchableOpacity
                             style={[styles.tab, activeTab === 'scheduled' && styles.activeTab]}
                             onPress={() => setActiveTab('scheduled')}
                         >
                             <Text allowFontScaling={true} style={styles.tabText}>{t('scheduled')}</Text>
                         </TouchableOpacity>

                         <TouchableOpacity
                             style={[styles.tab, activeTab === 'unscheduled' && styles.activeTab]}
                             onPress={() => setActiveTab('unscheduled')}
                         >
                             <Text style={styles.tabText}>{t('unscheduled')}</Text>
                         </TouchableOpacity>
                     </View>
                     <TouchableOpacity style={styles.addMed} onPress={() => { navigation.navigate('MedicationDetails'); }}>
                         <Icon type={Icons.MaterialIcons} name="add" size={60} color="white" />
                     </TouchableOpacity>
                 </View>
            {drop_down_alert()}

        </>
    );
};

export default eMAR;
