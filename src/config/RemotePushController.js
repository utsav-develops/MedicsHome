import React, {useEffect} from 'react'; 
import firebase from '@react-native-firebase/app'; 
import '@react-native-firebase/messaging'; 
import PushNotification from 'react-native-push-notification'; 
import {Platform} from 'react-native'; 
import PushNotificationIOS from '@react-native-community/push-notification-ios'; 
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging'; 


const RemotePushController = () => {
    useEffect(() => { 
        firebase.messaging().onMessage(response => { 
            console.log("fcm message: " + JSON.stringify(response));
            if (Platform.OS !== 'ios') { 
                showNotification(response.notification); 
                return; 
            } 
            PushNotificationIOS.requestPermissions().then(() => 
                showNotification(response.notification), 
            ); 
        }); 
    }, 
    []
    ); 
    const showNotification = ( notification: FirebaseMessagingTypes.Notification) => { 
        PushNotificationIOS.localNotification({ title: notification.title, message: notification.body }); 
    }; 
    return <></>; 
}
export default RemotePushController;