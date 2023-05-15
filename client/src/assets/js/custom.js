import * as THREE from 'three';
import { PointerLockControls } from 'three-stdlib';
//console.log(THREE);

const scene = new THREE.Scene();
//console.log(scene);

const camera = new THREE.PerspectiveCamera(
    75, //field of view
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1, //near plane
    1000 //far plane
);
camera.position.z = 5; //move camera back 5 units

scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: false }); //for smooth adges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); //bg
document.body.appendChild(renderer.domElement); // add renderer to our html

//set light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); //color, intensity, distance, decay
scene.add(ambientLight);

//direction light
const sunLight = new THREE.DirectionalLight(0xdddddd, 1.0); //color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

//geometry
const geometry = new THREE.BoxGeometry(1, 1, 1); //box geometry is the shape of object
//material
const material = new THREE.MeshBasicMaterial({ color: "#7282ca" }); // color of the object
const cube = new THREE.Mesh(geometry, material); // create cube
scene.add(cube);

//texture of the floor
const floorTexture = new THREE.TextureLoader().load('img/floor.jpg');
floorTexture.wrapS = THREE.RepeatWrapping; // horisontal
floorTexture.wrapT = THREE.RepeatWrapping; // vertical
floorTexture.repeat.set(20, 20); // how many times texture repeat

//create floor plane
const planeGeometry = new THREE.PlaneGeometry(50, 50); //box geometry is the shape of object
const planeMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    side: THREE.DoubleSide
}); // color of the object
const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial); // create floor
floorPlane.rotation.x = Math.PI / 2; // this is 90 deg
floorPlane.position.y = -Math.PI; // this is -180 deg
scene.add(floorPlane);

//create walls plane
const wallGroup = new THREE.Group(); // create a group of all walls
scene.add(wallGroup);

//front wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshLambertMaterial({ color: "green" })
); // color of front wall 
frontWall.position.z = -25; // to move front wall back from camera

//left wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshLambertMaterial({ color: "blue" })
); // color of left wall 
leftWall.rotation.y = Math.PI / 2; // rotate left wall on 90deg
leftWall.position.x = -25; // move left wall on x to left

//right wall
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshLambertMaterial({ color: "blue" })
); // color of right wall 
rightWall.rotation.y = Math.PI / 2; // rotate right wall on 90deg
rightWall.position.x = 25; // move right wall on x to right

wallGroup.add(frontWall, leftWall, rightWall); //add all walls to group

//loop through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
    wallGroup.children[i].BBox = new THREE.Box3();
    wallGroup.children[i].BBox.setFromObject(wallGroup.children[i]);
}

//create ceiling
const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
const ceilingMaterial = new THREE.MeshLambertMaterial({ color: 'purple' }); // color ceiling
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingPlane.rotation.x = Math.PI / 2; // rotate ceiling on 90deg
ceilingPlane.position.y = 10; // move ceiling on y to up
scene.add(ceilingPlane);

//create our painting block
function createPainting(imageUrl, width, height, position) {
    const textureLoader = new THREE.TextureLoader();
    const paintingTexture = textureLoader.load(imageUrl);
    const paintingMaterial = new THREE.MeshBasicMaterial({
        map: paintingTexture
    });
    const paintingGeometry = new THREE.PlaneGeometry(width, height);
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);

    painting.position.set(position.x, position.y, position.z);

    return painting;
};

// paint 1
const painting1 = createPainting(
    'img/gallery/img-1.jpg', 10, 5, new THREE.Vector3(-10, 5, -24.99)
);
// paint 2
const painting2 = createPainting(
    'img/gallery/img-2.jpg', 10, 5, new THREE.Vector3(10, 5, -24.99)
);

scene.add(painting1, painting2);

//attach camera to controls
const controls = new PointerLockControls(camera, document.body);

//start play gallery and hide main menu
function startExpirience() {
    //lock pointer
    controls.lock();

    //hide menu
    hideMenu();
}
const canvas = document.querySelector('canvas');
canvas.style.display = "none";

const playButton = document.getElementById('play-button');
playButton.addEventListener('click', startExpirience);

//hide menu 
function hideMenu() {
    const menu = document.getElementById('menu-wrap');
    const canvas = document.querySelector('canvas');

    menu.classList.add('hide');
    canvas.style.display = "block";
};
//show menu 
function showMenu() {
    const menu = document.getElementById('menu-wrap');
    const canvas = document.querySelector('canvas');

    menu.classList.remove('hide');
    canvas.style.display = "none";
};

controls.addEventListener('unlock', showMenu);

//add controls, when we press keys
document.addEventListener('keydown', onKeyDown, false);
function onKeyDown(event) {
    // 37 left, 38 up, 39 right, 40 down and keyss for WASD move
    let keycode = event.which;

    if (keycode === 39 || keycode === 68) {
        controls.moveRight(0.08);
    } else if (keycode === 37 || keycode === 65) {
        controls.moveRight(-0.08);
    } else if (keycode === 38 || keycode === 87) {
        controls.moveForward(0.08);
    } else if (keycode === 40 || keycode === 83) {
        controls.moveForward(-0.08);
    }

};

//render - show and rotate cube
let render = function () {
    cube.rotation.x = cube.rotation.x + 0.01;
    cube.rotation.y = cube.rotation.y + 0.01;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

render();
