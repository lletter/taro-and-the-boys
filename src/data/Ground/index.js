import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

const geometry = new PlaneGeometry(20, 10, 1, 1);
const material = new MeshBasicMaterial({ color: 0xcdfcab });
const m = new Mesh(geometry, material);
m.rotation.x = -Math.PI / 2;
export default m;
