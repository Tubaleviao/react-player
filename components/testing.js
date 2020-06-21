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
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        priority: 'max',
      });
    }
  };

  componentDidMount() {
  	Notifications.createCategoryAsync('outside', [
	  {
	    actionId: 'pause',
	    buttonTitle: 'Pause',
	    isDestructive: true,
	    isAuthenticationRequired: false,
	  },
	  {
	    actionId: 'forward',
	    buttonTitle: 'Forward',
	    isDestructive: false,
	    isAuthenticationRequired: false,
	  },
	])

    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

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
        		title:'hello', categoryId:'outside', body: 'something', 
        		android:{sticky: true}, data: {a:'a',b:'b'} })} />
      </View>
    );
  }
}