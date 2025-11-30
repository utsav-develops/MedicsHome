import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Platform  } from 'react-native';
import axios from 'axios';
import { loader, api_url, regular, bold, normal, f_xl, get_all_emar, Auth_Token, delete_emar } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import { useLocalization } from '../config/LocalizationContext';
import { useCustomTheme } from '../config/useCustomTheme';
import * as colors from '../assets/css/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import moment from 'moment';
import LottieView from 'lottie-react-native';

const MedicationDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [medications, setMedications] = useState([]);
    const [detailsVisibility, setDetailsVisibility] = useState({});
    const { t } = useLocalization();
    const [ loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();
    const { colors, isDarkMode, toggleTheme } = useCustomTheme();
//     const isFocused = useIsFocused();
//
       useFocusEffect(
          React.useCallback(() => {
            fetchMedications();
            return () => {

            };
          }, [])
        );

//     useEffect(() => {
//          if (isFocused) {
//          fetchMedications();
//          }
//          fetchMedications();
//     }, [isFocused]);

    const fetchMedications = async () => {
        try {
            const response = await axios.post(api_url + 'staff/get_all_emar', {
                patient_id: global.patient_id ? global.patient_id : global.pat_id,
                token: Auth_Token
            });
            setMedications(response.data.result);
        } catch (error) {
            console.error("Error fetching medications:", error.response);
        }
    };

    const deleteMedication = async (id) => {
        try {
            const response = await axios.post(api_url + 'staff/delete_emar', {
                MedicationID: id,
                token: Auth_Token,
            });
            setMedications(response.data.result);
            fetchMedications();
        } catch (error) {
            console.error("Error deleting medications:", error.response);
        }
    };

    const toggleDetails = useCallback((medicationID, timeIndex) => {
        setDetailsVisibility(prevState => ({
            ...prevState,
            [medicationID]: {
                ...prevState[medicationID],
                [timeIndex]: !prevState[medicationID]?.[timeIndex],
            },
        }));
    }, []);

    const handleBack = () => {navigation.goBack()};
    const handleClose = () => {navigation.dismiss()};
    const handleEdit = (MedicationID) => {
        navigation.navigate('EditMedication', { MedicationID: MedicationID });
    };


    const formatTime = (timeString) => moment(timeString, 'HH:mm:ss').format('HH:mm');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.dark_White,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: colors.theme_bg,
        },
        headerTitle: {
            fontSize: f_xl,
            fontFamily: bold,
            color: 'white',
            marginLeft: 15,
        },
        scrollView: {
            backgroundColor: colors.dark_White,
            padding: 5,
        },
        medicationItem: {
            alignSelf: 'center',
            width: '95%',
            marginBottom: 20,
        },
        medicationHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            padding: 5,
            justifyContent: 'space-between',
            borderWidth:2,
            borderRadius: 35,
            paddingVertical: 18,
            paddingHorizontal: 15,
            marginTop:15,
        },
        medicationDetails: {
            padding: 15,
            backgroundColor: colors.dark,
            borderRadius: 15,
        },
        medicationInfo: {
            fontSize: 16,
            marginBottom: 5,
            color: colors.theme_fg_two,
            fontFamily: bold,
        },
        buttonContainer: {
            height: 50,
            width: '95%',
            backgroundColor: colors.medics_blue,
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: 10,
            margin: 10,
            marginBottom: Platform.OS == 'ios' ? insets.bottom: null,
        },
        buttonText: {
            fontFamily: regular,
            fontSize: 18,
            alignSelf: "center",
            color: "white",
        },
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
        barStyle={"light-content" } />

        </View>
        <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => handleBack()}>
                <Icon type={Icons.MaterialIcons} name="arrow-back" color="white" size={30} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Medication Details</Text>
        </View>
        <ScrollView style={styles.scrollView}>
            {Array.isArray(medications) && medications.map((medication, index) => (
                <TouchableOpacity
                    key={medication.MedicationID}
                    onPress={() => toggleDetails(medication.MedicationID, index)}
                    style={styles.medicationItem}
                >
                <View>
                    <View style={[styles.medicationHeader,{borderColor: medication.status_color}]}>
                        <View style={{ alignItems: 'center', flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>

                            <View style={{ flexDirection: 'row', width: '60%' }}>
                                <View style={{ height: 20, width: 20, borderRadius: 7, backgroundColor: medication.status_color }} />
                                <View style={{ marginLeft: 10 }}>
                                  <Text style={{ fontSize: 16, fontFamily: normal, color: colors.theme_fg_two, alignSelf: 'center' }}>
                                      {medication.MedicationName}
                                  </Text>
                                </View>
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 14, fontFamily: normal, color: colors.theme_fg_two, alignSelf: 'center' }}>
                                    {medication.status_name}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => toggleDetails(medication.MedicationID, index)}>
                            {detailsVisibility[medication.MedicationID]?.[index] ? (
                                <Icon type={Icons.Ionicons} name="chevron-up-outline" color={colors.theme_fg_two} style={{ fontSize: 22, alignSelf: 'center' }} />
                            ) : (
                                <Icon type={Icons.Ionicons} name="chevron-down-outline" color={colors.theme_fg_two} style={{ fontSize: 22, alignSelf: 'center' }} />
                            )}
                        </TouchableOpacity>
                    </View>
                    {detailsVisibility[medication.MedicationID]?.[index] && (
                        <View style={styles.medicationDetails}>
{/*                             <Text style={{ fontSize: 20, fontFamily: bold, color: colors.theme_fg_two, alignSelf: 'center', marginBottom: 10 }}> */}
{/*                                 {medication.MedicationName} */}
{/*                             </Text> */}

                             <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={styles.medicationInfo}>Meal Instruction</Text>
                                <Text style={[styles.medicationInfo, { fontFamily: regular, fontSize: 14 }]}>{medication.meal}</Text>
                             </View>
                             <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={styles.medicationInfo}>Route</Text>
                                <Text style={[styles.medicationInfo, { fontFamily: regular, fontSize: 14 }]}>{medication.Route}</Text>
                            </View>
                            <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={styles.medicationInfo}>Frequency</Text>
                                <Text style={[styles.medicationInfo, { fontFamily: regular, fontSize: 14 }]}>{medication.Frequency}</Text>
                            </View>
                            <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={styles.medicationInfo}>Dosage</Text>
                                <Text style={[styles.medicationInfo, { fontFamily: regular, fontSize: 14 }]}>{medication.Dosage}</Text>
                            </View>
                            <View style={{ marginTop: 5, padding: 5, width: '100%', height: 60, borderRadius: 10, justifyContent: 'center', backgroundColor: colors.medics_green, alignItems: 'center' }}>
                                <Text style={{fontSize: 15, marginBottom: 5, color: colors.theme_fg_two, fontFamily: regular, color: 'white' }}>
                                    {medication.StartDate} to {medication.EndDate}
                                </Text>
                                <Text style={{fontSize: 15, marginBottom: 5, color: colors.theme_fg_two, fontFamily: regular, color: 'white' }}>
                                     {medication.AdministrationTime
                                     ? medication.AdministrationTime
                                         .split(',')
                                         .map(time => formatTime(time.trim().replace(/[\[\]"]/g, '')))
                                         .join(', ')
                                     : 'No times available'}
                                </Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <View style={{marginTop: 10}}>
                                    <Text style={styles.medicationInfo}>Formulation</Text>
                                    <Text style={[styles.medicationInfo, { fontFamily: regular, fontSize: 14 }]}>{medication.Formulation}</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <Text style={styles.medicationInfo}>Indications</Text>
                                    <Text style={[styles.medicationInfo, { fontFamily: regular, fontSize: 14 }]}>{medication.Indications}</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <Text style={styles.medicationInfo}>Contraindications</Text>
                                    <Text style={[styles.medicationInfo, { fontFamily: regular, fontSize: 14 }]}>{medication.Contraindications}</Text>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <Text style={styles.medicationInfo}>Side Effects</Text>
                                    <Text style={[styles.medicationInfo, { fontFamily: regular, fontSize: 14 }]}>{medication.SideEffects}</Text>
                                </View>
                            </View>
                            <View style={{ width: '100%', borderWidth: 1, borderColor: colors.theme_fg_two, backgroundColor: 'white', marginTop: 10 }} />
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <View style={{ width: '65%' }}>
                                    <Text style={{ fontSize: 16, color: colors.error }}>{medication.Interactions}</Text>
                                </View>
                                <View style={{ width: '35%' }}>
                                    <Text style={{ fontSize: 13, color: colors.theme_fg_two, fontFamily: bold }}>Administered By</Text>
                                    <Text style={{ fontSize: 16, color: colors.theme_fg_two }}>{medication.AdministeredBy}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                <TouchableOpacity onPress={() => handleEdit(medication.MedicationID)} style={{ backgroundColor: colors.medics_grey, height: 25, width: 35, borderRadius: 15, justifyContent: 'center' }}>
                                    <Icon type={Icons.MaterialCommunityIcons} name="note-edit" color='white' style={{ fontSize: 18, alignSelf: 'center' }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteMedication(medication.MedicationID)} style={{ backgroundColor: 'red', height: 25, width: 35, borderRadius: 15, justifyContent: 'center', marginLeft: 10 }}>
                                    <Icon type={Icons.MaterialCommunityIcons} name="trash-can" color='white' style={{ fontSize: 18, alignSelf: 'center' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
        <View style={styles.buttonContainer}>
            {loading === false ? (
                <TouchableOpacity
                    onPress={()=>navigation.navigate('AddMedication')}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        Add Medication
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                    <LottieView source={btnLoaderWhite} autoPlay loop />
                </View>
            )}
        </View>
        </View>
    </>
    );
};

export default MedicationDetails;
