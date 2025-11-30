import React, { useEffect, useRef, useState } from "react";
import {
  View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, StatusBar, Modal
} from "react-native";
import { useNavigation,useRoute } from "@react-navigation/native";
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import { normal, bold, regular, img_url, api_url, get_documents, upload_icon, id_proof_icon, speciality_certificate_icon, speciality_insurance_icon, speciality_image_icon, speciality_vaccine_icon, speciality_dbs_icon, f_xl, f_l, f_xs, f_s, f_m,NEA_bill } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import * as colors from '../assets/css/Colors';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';


const AddressVerify = (props) => {
   const statusMap = {
        "waiting for upload": 14,
        "waiting for approval": 15,
        "approved": 16,
        "rejected": 17
      };
  const navigation = useNavigation();
  const route = useRoute();
  let dropDownAlertRef = useRef();
  const [loading, setLoading] = useState(false);
  const[workplace_fav_id, setworkplacefavid]=useState(route.params.workplace_fav_id);
  const [modalVisible, setModalVisible] = useState(false);

  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();
  const [address_proof, setaddressproof] = useState({
    path: speciality_insurance_icon,
    status: 0,
    status_name: "Waiting for upload",
    color: colors.warning
  });
  const [upload_status, setUploadStatus] = useState(0);

  useEffect(() => {
    subscribe = navigation.addListener("focus", async () => {
      call_get_documents();
    });
    return subscribe;
  }, []);

  const find_document = (list) => {
    list.map((data, index) => {
      let status = data.status;
      let lowerCaseStatus = status.toLowerCase();
      let status_num=parseInt(statusMap[lowerCaseStatus]);
      let value = { path: { uri: img_url + data.path }, status:status_num , status_name: data.status, color: get_status_foreground(status_num) }
       setaddressproof(value);
    })
  }

  const get_status_foreground = (status) => {
    if (status == 17) {
      return colors.error
    } else if (status == 14 || status == 15) {
      return colors.warning
    } else if (status == 16) {
      return colors.success
    }
  }

  const move_to_upload = (slug, status, path) => {
    let table = "workplace_favourites";
    let find_field = "id";
    let find_value =  workplace_fav_id;
    let status_field = "approval_status";
      navigation.navigate("DocumentUpload", { slug: "Address_Image", path: path, status: status, table: table, find_field: find_field, find_value: find_value, status_field: status_field });

  }

  const go_back = () => {
    navigation.navigate('Home');
  }

   const openModal = () => {
          setModalVisible(true);
    }

      const closeModal = () => {
        setModalVisible(false);
      }

  const call_get_documents = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_documents,
      data: { workplace_id: workplace_fav_id, lang: global.lang }
    })
      .then(async response => {
        setLoading(false);

        // Check if all documents are uploaded and awaiting approval
        const allDocumentsUploaded = response.data.result.documents.every(doc => doc.status === 15);
        if (allDocumentsUploaded) {
          setUploadStatus(1);
        } else {
          find_document(response.data.result.documents)
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        dropDownAlertRef.alertWithType('error', t('error'), t('smthgWentWrong'));
      });
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
  const styles = StyleSheet.create({
    header: {
      height: 60,
      backgroundColor: colors.theme_bg,
      flexDirection: 'row',
      alignItems: 'center'
    },
    flex_1: {
      flex: 1
    },
    icon: {
      color: colors.theme_fg_three
    },
    header_body: {
      flex: 3,
      justifyContent: 'center'
    },
    upload_image: {
      width: 150,
      height: 150,
      borderColor: colors.theme_bg_three,
      borderWidth: 1
    },
    body_section: {
      width: '100%',
      backgroundColor: colors.theme_bg_three,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 20,
      marginBottom: 30,
      paddingBottom: 20
    },
    footer_section: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 10
    },
    name_title: {
      alignSelf: 'center',
      color: colors.theme_fg,
      alignSelf: 'center',
      fontSize: 20,
      letterSpacing: 0.5,
      fontFamily: bold
    },
    footer: {
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: colors.theme_bg
    },
    container:{
    backgroundColor: colors.lite_bg
    },
    cnf_button_style: {
      backgroundColor: colors.theme_bg,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
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
        />
        </View>
      <View style={[styles.header]}>
        <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
      {upload_status == 0 ?
        <View style={{ padding: 10 }}>
          <View>
            <Text style={{ fontFamily: bold, color: colors.theme_fg, fontSize: f_xl }}>
              {t('addressVerification')}
            </Text>
            <View style={{ margin: 5 }} />
          </View>

          <View style={{ margin: 10 }} />
          <View>
            <Text style={{ fontFamily: bold, color: colors.theme_fg_two, fontSize: f_l }}>
              {t('addressProof')}
            </Text>
            <Text style={{ fontFamily: normal, color: colors.grey, fontSize: f_xs }}>
              {t('documentVisible')}
            </Text>
            <View style={{ margin: 10 }} />
            <TouchableOpacity onPress={move_to_upload.bind(this, 'address_proof', address_proof.status_name, address_proof.path)} activeOpacity={1} style={{ borderWidth: 1, padding: 10, borderRadius: 5, borderStyle: 'dashed', flexDirection: 'row' }}>
              <View style={{ width: '70%' }}>
                <Text style={{ fontFamily: bold, color: address_proof.color, fontSize: f_s }}>{address_proof.status_name}</Text>
                <View style={{ margin: 5 }} />
                <Text style={{ fontFamily: normal, color: colors.grey, fontSize: f_xs }}>{t('addressProofImage')}</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={address_proof.path} style={{ height: 75, width: 75 }} />
              </View>
            </TouchableOpacity>
          </View>
            <View style={{ marginTop: 10}}/>
            <TouchableOpacity onPress={openModal} activeOpacity={1} style={{ padding: 10, borderRadius: 5, flexDirection: 'row', backgroundColor: colors.theme_dark }}>
              <View style={{ width: '70%' }}>
                <Text style={{ fontFamily: bold, color: address_proof.color, fontSize: f_s }}>{t('notice')}</Text>
                <Text style={{ fontFamily: normal, color: colors.theme_fg_two, fontSize: f_xs }}>{t('safetyInfo')}</Text>
              </View>
              <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={NEA_bill} style={{ height: 75, width: 75 }} />
              </View>
            </TouchableOpacity>
        </View>
        :
        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: bold, color: colors.theme_fg_two, fontSize: f_s }}>{t('waitAdmin')}</Text>
          <View style={{ margin: 20 }} />
          <TouchableOpacity onPress={go_back.bind(this)} activeOpacity={1} style={{ width: '100%', backgroundColor: colors.btn_color, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.theme_fg_two, fontSize: f_m, color: colors.theme_fg_three, fontFamily: bold }}>{t('goToHome')}</Text>
          </TouchableOpacity>
        </View>
      }
    </ScrollView>
     <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor:colors.theme_dark, width:'75%', height:'85%', alignSelf: 'center', marginTop:'20%', borderRadius:20,padding:20 }}>
              <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ height: 741.8, width:200 }} source={ NEA_bill } />
              </ScrollView>
               <TouchableOpacity onPress={closeModal} style={{ margin:10, backgroundColor: colors.medics_blue, padding: 5, borderRadius:10 }}>
                 <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
               </TouchableOpacity>
            </View>
          </Modal>
    {drop_down_alert()}
    </>
  );
};



export default connect(null, null)(AddressVerify);