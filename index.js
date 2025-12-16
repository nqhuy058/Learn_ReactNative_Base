/**
 * @format
 */

import { AppRegistry } from 'react-native';
import RootLayout from './src/app/_layout';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => RootLayout);