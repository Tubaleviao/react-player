/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App3';
import {name as appName} from './app.json';
import tp from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);
tp.registerPlaybackService(() => require('./service.js'));