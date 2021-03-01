import {
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PlaneGeometry,
  TextureLoader,
} from 'three';
import BackgroundPNG from './Background1_Base-1.png';
import BackgroundNightPNG from './Background2_Base.png';

const geometry = new PlaneGeometry(20, 10, 1, 1);
const material = new MeshBasicMaterial({ color: 0xcdfcab });
const m = new Mesh(geometry, material);
m.rotation.x = -Math.PI / 2;
export default m;

const loader = new TextureLoader();
const Day = loader.load(BackgroundPNG);
Day.magFilter = NearestFilter;
const Night = loader.load(BackgroundNightPNG);
Night.magFilter = NearestFilter;
export { Day, Night };
