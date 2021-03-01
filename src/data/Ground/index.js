import { NearestFilter, TextureLoader } from 'three';
import BackgroundPNG from './Background1.png';
import BackgroundNightPNG from './Background2.png';
import BackgroundTemplePNG from './Background3.png';

const loader = new TextureLoader();
const Day = loader.load(BackgroundPNG);
Day.magFilter = NearestFilter;
const Night = loader.load(BackgroundNightPNG);
Night.magFilter = NearestFilter;
const Temple = loader.load(BackgroundTemplePNG);
Temple.magFilter = NearestFilter;
export { Day, Night, Temple };
