import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


camera.position.z = 6;
camera.position.y = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window );
controls.target.set(0, 0, 0);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 0.1;
controls.maxDistance = 1000;
controls.maxPolarAngle = Math.PI / 2;


const geometry = new THREE.BoxGeometry(0.025, 0.025, 0.025);
const material = new THREE.MeshBasicMaterial({ color: 0x00af00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// cube.rotation.x += 2;
cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;



const branches = [];
branches.push({l: 0.8, beta: Math.PI / 6});
branches.push({l: 0.8, beta: Math.PI / 12});
branches.push({l: 0.8, beta: -Math.PI / 6});
branches.push({l: 0.8, beta: -Math.PI / 12});


// for(var i = 0; i < 7; i++) {
//     branches.push({l: 0.6, beta: Math.PI / 2 / (i+2)});
// }
// for(var i = 0; i < 7; i++) {
//     branches.push({l: 0.6, beta: -Math.PI / 2 / (i+2)});
// }

drawNode(0, -1, 0, 0, 0, 1);

renderer.render(scene, camera);
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
animate();

function drawNode(x0, y0, x1, y1, prevAlfa, level) {
    // draw the line
    var vectors = [];
    vectors.push(new THREE.Vector3().fromArray([x0, y0, 0]));
    vectors.push(new THREE.Vector3().fromArray([x1, y1, 0]));
    var lg = new THREE.BufferGeometry().setFromPoints(vectors);
    const lm = new THREE.LineBasicMaterial({ color: new THREE.Color(1/ (level *  0.5), 1 / level, 0) });
    var line = new THREE.Line(lg, lm);
    scene.add(line);
    var cube2 = cube.clone();
    cube2.position.x = x1;
    cube2.position.y = y1;
    cube2.position.z = 0;
    // scene.add(cube2);

    if (level > 6) {
        return;
    }

    branches.forEach((branch) => {
        var L = Math.pow(branch['l'], level);
        var alfa = branch['beta'];

        var nextAlfa = alfa + prevAlfa;

        var x2 = x1 + L * Math.cos(Math.PI / 2 - nextAlfa);
        var y2 = y1 + L * Math.sin(Math.PI / 2 - nextAlfa);

        drawNode(x1, y1, x2, y2, nextAlfa, level + 1);
    });

}
