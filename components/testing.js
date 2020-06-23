import React from 'react';
import { Text, View, Button, Vibration, Platform } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

export default class Testing extends React.Component {

  state = {
    notification: {origin: 'ha', data: {ha:'hi', hu: 'ho'}},
  };

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('chan', {
        name: 'chan',
        priority: 'max',
        sound: false,
        vibrate: false,
      });
    }
  }

  componentDidMount() {

    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(not => {});
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Origin: {this.state.notification.origin}</Text>
          <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
        </View>
        <Button title={'Press to Send Notification'} onPress={
        	() => Notifications.presentLocalNotificationAsync({
        		title:'hello', body: 'something', 
        		android:{channelId: 'chan', sticky: true},
            ios: {_displayInForeground: true} })} />
      </View>
    );
  }
}