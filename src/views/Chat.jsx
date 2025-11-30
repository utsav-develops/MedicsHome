//Fixed
import React, { useState, useEffect } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ImageBackground,
    StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { bold, img_url, api_url, chat_bg, f_xl,get_profile, normal } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import database from '@react-native-firebase/database';
import { GiftedChat,Bubble  } from 'react-native-gifted-chat';
import { useLocalization } from '../config/LocalizationContext';
import Translations from '../config/Translations';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useCustomTheme } from  '../config/useCustomTheme';




var Sound = require('react-native-sound');

Sound.setCategory('Playback');

var whoosh = new Sound('notification.wav', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

});


const Chat = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [work_id,setWorkId] = useState(route.params.work_id)
    const [staff_name,setstaffname] = useState(route.params.staff_name);
    const [messages,setMessages] = useState([])
    const { t } = useLocalization();
    const insets = useSafeAreaInsets();
    const [profile_picture, setpp] = useState('');
    const { isDarkMode, toggleTheme, colors } = useCustomTheme();

    const styles = StyleSheet.create({
      header: {
          height: 60,
          backgroundColor: colors.theme_bg,
          flexDirection: 'row',
          alignItems: 'center'
      },
      segment_active_bg: {
          minWidth: 120, // Static width
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15,
          backgroundColor: colors.theme_bg,
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
              color: colors.theme_fg_two,
              fontSize: 16,
              fontFamily: bold,
              color: colors.theme_fg_three

          },

      segment_inactive_fg: {
              color: colors.theme_fg_two,
              fontSize: 16,
              fontFamily: normal,
              color: colors.theme_fg_two }
  });


    const go_back = () => {
        navigation.goBack();
    }
    const renderBubble = (props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#007AFF', // Blue color for messages sent by the user
              },
              left: {
                backgroundColor: '#f0f0f0', // Light gray color for messages received
              },
            }}
            textStyle={{
              right: {
                color: '#fff',
              },
              left: {
                color: '#000',
              },
            }}
            // Customizing the top view of the bubble to include the sender's name
            renderUsernameOnMessage={true} // This will automatically use 'user.name' to show the username
          />
        );
      };

    const call_get_profile = () => {
        axios({
            method: 'post',
            url: api_url + get_profile,
            data: { workplace_id: global.id, lang: global.lang }
        })
        .then(async response => {
            setpp(response.data.result.profile_picture);
        })
        .catch(error => {
            alert('Sorry something went wrong')
        });
    }

    useEffect(() => {
        call_get_profile();
        refOn(message => setMessages(oldArray => [message, ...oldArray]));
        const _unblur = navigation.addListener('blur', async () => {
            whoosh.stop();
        });
        return _unblur;
    }, []);

    const refOn = callback => {
        database().ref(`/chat/${work_id}`)
          .limitToLast(20)
          .on('child_added', snapshot => callback(parse(snapshot)));
    }

    const parse = snapshot => {
        if(messages.length > 0){
          notification_sound();
        }
        const { text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const message = {_id, text, user };
        return message;
    };

    const onSend = messages => {
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = {text, user };
            database().ref(`/chat/${work_id}`).push(message);
        }
    }

    const notification_sound  = () => {
        whoosh.play();
    }

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
        <ImageBackground
            style={{flex: 1 ,width: '100%', height: '100%', backgroundColor: colors.lite_chat}}
        >

            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: bold }}>{t('chatStaff')} ({staff_name})</Text>
                </View>
            </View>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                textInputStyle={{color:colors.medics_grey, height:50, paddingBottom:10,}}
                user={{
                    _id: global.id+'-Cr',
                    name: global.first_name,
                    avatar: profile_picture
                }}
                showUserAvatar
                renderBubble={renderBubble}
            />
        </ImageBackground>
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.theme_bg,
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default Chat;