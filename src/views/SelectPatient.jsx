import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  StatusBar,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from 'lottie-react-native';
import { screenHeight, screenWidth, normal, token, f_xl, bold, add_home_patient,Auth_Token,user_icon, get_home_patient, api_url, btn_loader, btnLoaderWhite } from "../config/Constants";
import Icon, { Icons } from "../components/Icons";
import { useLocalization } from "../config/LocalizationContext";
import { useCustomTheme } from "../config/useCustomTheme";
import axios from 'axios';
import moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';

const SelectPatient = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { colors } = useCustomTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = useRef();
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [patients, setPatients] = useState([]);


  const drop_down_alert = () => (
    <DropdownAlert
      ref={(ref) => {
        if (ref) {
          dropDownAlertRef = ref;
        }
      }}
    />
  );


  const go_back = () => {
    navigation.goBack();
  };

  useEffect(() => {
    fetch_patients();
  }, []);


  const fetch_patients = async () => {
    setLoading(true);
    axios({
      method: 'post',
      url: api_url + 'staff/get_home_patient',
      data: { workplace_id: global.id, token: Auth_Token, }
    })
      .then(async response => {
        setLoading(false);
        console.log(response.data.result);
        setPatients(response.data.result);
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
        alert('Sorry something went wrong');
      });
  }

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.theme_lite,
    },
    header: {
      height: 60,
      backgroundColor: colors.theme_bg,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
    },
    backButton: {
      width: "15%",
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      width: "85%",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    titleText: {
      color: colors.theme_fg_three,
      fontSize: f_xl,
      fontFamily: bold,
    },
    imageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 15,
      width: 150,
      marginTop: 10,
    },
    profileImage: {
      height: 150,
      width: 150,
      borderRadius: 75,
      borderWidth: 1,
      borderColor: colors.medics_grey,
    },
    addButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
      borderWidth: 1,
      borderColor: colors.medics_grey,
      backgroundColor: colors.medics_grey,
      height: 150,
      width: 150,
      borderRadius: 75,
    },
    addImage: {
      height: 100,
      width: 100,
      resizeMode: 'contain',
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    modalContent: {
      width: "100%",
      padding: 20,
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
    patientInfo: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 15,
    },
    patientName: {
      fontFamily: normal,
      fontSize: 16,
      textAlign: 'center',
      color: colors.theme_fg_two,
    },
    patientDOB: {
      fontFamily: normal,
      fontSize: 14,
      textAlign: 'center',
      color: colors.theme_fg_two,
      marginTop: 10,
    },
  });

  const renderpatients = ({ item }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => {navigation.navigate('eMAR'); global.pat_id= item.id}}>
        {item.profile_picture != null ?
          <Image
            style={styles.profileImage}
            source={{ uri: item.profile_picture }}
          />
          :
          <Image
            style={styles.profileImage}
            source={user_icon}
          />
        }


        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.first_name} {item.last_name}</Text>
          <Text style={styles.patientDOB}>({item.date_of_birth})</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
          <StatusBar
            backgroundColor={colors.theme_bg}
          />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={go_back}
            style={styles.backButton}
          >
            <Icon
              type={Icons.MaterialIcons}
              name="arrow-back"
              color={colors.theme_fg_three}
              style={{ fontSize: 30 }}
            />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.titleText}
            >
              Select Patient
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '100%',
            padding: 10,
            justifyContent: 'center', // Added to center items
          }}
        >
          {patients.map((item, index) => (
            <View key={index} style={styles.imageContainer}>
              {renderpatients({ item })}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SelectPatient;
