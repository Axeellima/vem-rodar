import { AppRegistry } from 'react-native';
import App from './src/redux/index';
import NavigationSwitch from './src/navigation/index';
import dotenv from 'dotenv';
dotenv.config();
export default NavigationSwitch;

AppRegistry.registerComponent('appName', () => App);
