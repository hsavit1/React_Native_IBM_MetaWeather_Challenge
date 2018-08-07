import { NativeModules } from 'react-native';
import url from 'url';
import { reactotronRedux } from 'reactotron-redux';
import Reactotron from 'reactotron-react-native';

const { hostname } = url.parse(NativeModules.SourceCode.scriptURL);

console.disableYellowBox = true;

Reactotron.configure({ name: 'IBM MetaWeather', host: hostname })
	.useReactNative()
	.use(reactotronRedux())
	.connect()
	.clear();
