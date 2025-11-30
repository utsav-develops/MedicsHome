//List
import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar
} from "react-native";
import { useNavigation, useFocusEffect, useRoute  } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight,f_m, check_policies, screenWidth, bold, regular, api_url, privacy_policies, accept_policies, f_l, f_s, f_25, f_xl } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import axios from 'axios';
import CheckBox from '@react-native-community/checkbox'; // Make sure to install this package if not already installed
import DropdownAlert from 'react-native-dropdownalert';
import Animated, {useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCustomTheme } from  '../config/useCustomTheme';

const PrivacyPolicies = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const route = useRoute();
  const [from, setfrom] = useState(route.params?.from);
  const viewableItems = useSharedValue([]);
  const [acceptedPolicies, setAcceptedPolicies] = useState({});
  const [counter, setCounter] = useState(0);
  const [policydata, setpolicydata] = useState("");
  const dropdownRef = useRef(null);
  const [showDetails, setShowDetails] = useState(false); // State to control visibility of additional data
  const [rowcount, setrowcount] = useState(0);
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleTheme, colors } = useCustomTheme();


  useFocusEffect(
      React.useCallback(() => {
        check_policy();
      }, [])
    );

  const toggleDetails = () => {
    setShowDetails(prevShowDetails => !prevShowDetails);
  };

   const showAlert = () => {
      dropdownRef.current.alertWithType('info', 'Title', 'Message');
    };

  const go_back = () => {
    navigation.goBack();
  }
   const booleanMap = {
      true: 1,
      false: 0,
    };
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  const check_policy = () => {
      setLoading(true);
      axios({
        method: 'post',
        url: api_url + check_policies,
        data: { workplace_id : global.id}
      })
        .then(async response => {
          setLoading(false);
            setpolicydata(response.data);
        })
        .catch(error => {
          setLoading(false);
          alert('Sorry something went wrong')
        });
    }

  const handleAcceptPolicy = (id, accepted) => {
    setAcceptedPolicies(prevState => ({
      ...prevState,
      [id]: accepted,
    }));
    };
    const handleSubmit = () => {
      setLoading(true);
      // Iterate over acceptedPolicies and make Axios calls for each policy
      Promise.all(
        Object.entries(acceptedPolicies).map(([id, accepted]) => {
          return axios({
            method: 'post',
            url: api_url + accept_policies,
            data: {
              privacy_policy_id: id,
              status: 1, // 1 or 0
              accepted_at: dateString,
              staff_id: 0,
              workplace_id: global.id
            }
          });
        })
      )
      .then(responses => {
        setLoading(false);
        dropdownRef.current.alertWithType('success', t('success'), t('dataSentSuccessfully'));
        go_back();
      })
      .catch(error => {
        // Error occurred in one or more Axios calls
        setLoading(false);
        console.error("Error in one or more requests:", error);
        alert('Sorry, something went wrong');
      });
    };



  useEffect(() => {
    check_policy();
    call_privacy_policies();
    if(from==="booking"){
        dropdownRef.current.alertWithType('error', t('sorry'), t('acceptPolicies'));
    }
  }, []);

  const call_privacy_policies = () => {
    setLoading(true);
    axios({
      method: 'post',
      url: api_url + privacy_policies,
      data: { lang: global.lang }
    })
      .then(async response => {
        setLoading(false);
        setData(response.data.result);
        setrowcount(response.data.total_rows);
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong')
      });
  }

  type ListItemProps = {
    viewableItems: Animated.SharedValue<ViewToken[]>;
    item: {
        id: number;
    };
};

const ListItem: React.FC<ListItemProps> = React.memo(({ item, viewableItems }) => {
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
    <Animated.View style={[{ width: '100%' }, rStyle]}>
      <View style={{ backgroundColor: colors.theme_bg_three, padding: 10, margin: 10, borderRadius: 10 }}>
        <TouchableOpacity onPress={toggleDetails} style={{ flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center' }}>

              <TouchableOpacity onPress={toggleDetails}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_l, fontFamily: bold }}>
                {item.title}
              </Text>
              </TouchableOpacity>
            <View>
                {policydata.status === 1 &&(
                 <TouchableOpacity onPress={toggleDetails}>
                   {showDetails ? (
                             <Text style={{color:colors.theme_fg_two}}>▲</Text> // Arrow pointing up when details are shown
                           ) : (
                             <Text style={{color:colors.theme_fg_two}}>▼</Text> // Arrow pointing down when details are hidden
                           )}
                 </TouchableOpacity>
                 )}
             </View>
          </TouchableOpacity>
          {policydata.status === 0 ? (
            <View>
              <View style={{ margin: 5 }} />
              <Text style={{ color: colors.grey, fontSize: f_s, fontFamily: regular }}>
                {item.description}
              </Text>
              <CheckBox
                value={acceptedPolicies[item.id]}
                tintColors={{true: colors.medics_grey}}
                onValueChange={(newValue) => {
                  handleAcceptPolicy(item.id, newValue);
                  if (newValue) {
                    // Increment counter if checkbox is checked
                    setCounter(prevCounter => prevCounter + 1);
                  } else {
                    // Decrement counter if checkbox is unchecked
                    setCounter(prevCounter => prevCounter - 1);
                  }
                }}
              />
              <Text style={{ color: colors.grey, fontSize: f_s, fontFamily: regular }}>
                I accept
              </Text>
            </View>
          ) : (
            showDetails === true ? (
              <View>
                <View style={{ margin: 5 }} />
                <Text style={{ color: colors.grey, fontSize: f_s, fontFamily: regular }}>
                  {item.description}
                </Text>
              </View>
            ) : null
          )}
      </View>
    </Animated.View>
  );

});


const onViewableItemsChanged = ({viewableItems: vItems}) => {
    viewableItems.value = vItems;
};

const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.theme_lite
  },
  header: {
    height: 60,
    backgroundColor: colors.theme_bg,
    flexDirection: 'row',
    alignItems: 'center'
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
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colors.theme_bg}
      />
      <View style={[styles.header]}>
          <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
              <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
          </TouchableOpacity>
          <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('privacyPolicies')}</Text>
          </View>
          <DropdownAlert ref={dropdownRef}/>
      </View>
        <FlatList
            data={data}
            contentContainerStyle={{ paddingTop: 20 }}
            viewabilityConfigCallbackPairs={
                viewabilityConfigCallbackPairs.current
            }
            renderItem={({ item }) => {
                return <ListItem item={item} viewableItems={viewableItems} />;

            }}
        />
        <View style={{ margin: 45 }} />
        <View style={{ position: 'absolute', bottom: 5, width: '100%', height: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            {
              policydata.status === 0 ? ( // If policy status is 1
                counter === rowcount ? ( // If counter is rowcount
                  <TouchableOpacity
                    onPress={handleSubmit}
                    activeOpacity={1}
                    style={{ width: '90%', backgroundColor: colors.medics_blue, borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: 'white', fontSize: f_m, fontFamily: bold }}>{t('submit')}</Text>
                  </TouchableOpacity>
                ) : ( // If counter is not rowcount
                  <View style={{ width: '90%', backgroundColor: 'gray', borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'black', fontSize: f_m, fontFamily: bold }}>{t('submit')}</Text>
                  </View>
                )
              ) : ( // If policy status is not 1
                <View style={{ width: '90%', backgroundColor: 'gray', borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'black', fontSize: f_m, fontFamily: bold }}>{t('acceptedAt')} {policydata.accepted_at} {t('accepted_At')} </Text>
                </View>
              )
            }

        </View>
    </SafeAreaView>
    </>
  );
};



export default PrivacyPolicies;