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
scene.add(camera);
camera.position.z = 5; //move camera back 5 units

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: false }); //for smooth adges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); //bg
document.body.appendChild(renderer.domElement); // add renderer to our html

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
    'img/gallery/img-1.jpg',
    10,
    5,
    new THREE.Vector3(-10, 5, -24.99)
);
// paint 2
const painting2 = createPainting(
    'img/gallery/img-2.jpg',
    10,
    5,
    new THREE.Vector3(10, 5, -24.99)
);

// Painting on the left wall
const painting3 = createPainting(
    'img/gallery/img-1.jpg',
    10,
    5,
    new THREE.Vector3(-24.99, 5, -10)
);
painting3.rotation.y = Math.PI / 2;

// Painting on the right wall
const painting4 = createPainting(
    'img/gallery/img-2.jpg',
    10,
    5,
    new THREE.Vector3(24.99, 5, -10)
);
painting4.rotation.y = -Math.PI / 2;

scene.add(painting1, painting2, painting3, painting4);

// We can use a combination of ambient light and spotlights to create a more natural and immersive lighting environment.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Spotlights can be used to simulate ceiling-mounted lights or track lights that focus on specific areas or artworks.
function createSpotlight(x, y, z, intensity, targetPosition) {
    const spotlight = new THREE.SpotLight(0xffffff, intensity);
    spotlight.position.set(x, y, z);
    spotlight.target.position.copy(targetPosition);
    spotlight.castShadow = true;
    spotlight.angle = Math.PI / 6; // 30 degrees
    spotlight.penumbra = 0.9;
    spotlight.decay = 2;
    spotlight.distance = 40;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    return spotlight;
}

// Add spotlights to the scene
const spotlight1 = createSpotlight(-15, 20, -10, 1.5, painting1.position);
const spotlight2 = createSpotlight(15, 20, -10, 1.5, painting2.position);
const spotlight3 = createSpotlight(-35, 20, -10, 1.5, painting3.position);
const spotlight4 = createSpotlight(35, 20, -10, 1.5, painting4.position);

// Add new spotlights to the scene
scene.add(spotlight3, spotlight4);
scene.add(spotlight3.target);
scene.add(spotlight4.target);

scene.add(spotlight1, spotlight2);
scene.add(spotlight1.target);
scene.add(spotlight2.target);

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

// Create wall material with realistic colors and texture
const textureLoader = new THREE.TextureLoader();
const wallTexture = textureLoader.load('/img/texture-3.jpg');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 1);
const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

//front wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(85, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture })
); // color of front wall 
frontWall.position.z = -25; // to move front wall back from camera

//left wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture })
); // color of left wall 
leftWall.rotation.y = Math.PI / 2; // rotate left wall on 90deg
leftWall.position.x = -25; // move left wall on x to left

//right wall
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture })
); // color of right wall 
rightWall.rotation.y = Math.PI / 2; // rotate right wall on 90deg
rightWall.position.x = 25; // move right wall on x to right

//back Wall
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(85, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture })
);
backWall.position.z = 20;

wallGroup.add(frontWall, leftWall, rightWall, backWall); //add all walls to group

//loop through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
    wallGroup.children[i].BoundingBox = new THREE.Box3();
    wallGroup.children[i].BoundingBox.setFromObject(wallGroup.children[i]);
};

// check if the player intersects with the wall
function checkCollision() {
    const playerBoundingBox = new THREE.Box3(); // create a bounding box for the player
    const cameraWorldPosition = new THREE.Vector3(); // create a vector to hold the camera position
    camera.getWorldPosition(cameraWorldPosition); // get the camera position and store it in the vector. Note: The camera represents the player's position in our case.
    playerBoundingBox.setFromCenterAndSize(
        // setFromCenterAndSize is a method that takes the center and size of the box. We set the player's bounding box size and center it on the camera's world position.
        cameraWorldPosition,
        new THREE.Vector3(1, 1, 1)
    );

    // loop through each wall
    for (let i = 0; i < wallGroup.children.length; i++) {
        const wall = wallGroup.children[i]; // get the wall
        if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
            // check if the player's bounding box intersects with any of the wall bounding boxes
            return true; // if it does, return true
        }
    }

    return false; // if it doesn't, return false
}

//create ceiling
const ceilingTexture = textureLoader.load('img/texture-3.jpg');
const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
const ceilingMaterial = new THREE.MeshLambertMaterial({ map: ceilingTexture }); // color ceiling
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingPlane.rotation.x = Math.PI / 2; // rotate ceiling on 90deg
ceilingPlane.position.y = 10; // move ceiling on y to up
scene.add(ceilingPlane);

// Optimize the lights and shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Enable shadows on objects
floorPlane.receiveShadow = true;
ceilingPlane.receiveShadow = true;
frontWall.castShadow = true;
frontWall.receiveShadow = true;
leftWall.castShadow = true;
leftWall.receiveShadow = true;
rightWall.castShadow = true;
rightWall.receiveShadow = true;
backWall.castShadow = true;
backWall.receiveShadow = true;
painting1.castShadow = true;
painting1.receiveShadow = true;
painting2.castShadow = true;
painting2.receiveShadow = true;

//attach camera to controls
const controls = new PointerLockControls(camera, document.body);

//start play gallery and hide main menu
function startExpirience() {
    //reset clock
    clock.start();

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
const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    s: false,
    a: false,
    d: false,
};

document.addEventListener(
    'keydown',
    (event) => {
        if (event.key in keysPressed) {
            keysPressed[event.key] = true;
        }
    },
    false
);

document.addEventListener(
    'keyup',
    (event) => {
        if (event.key in keysPressed) {
            keysPressed[event.key] = false;
        }
    },
    false
);

//press arrows key or wasd
const clock = new THREE.Clock();

// parameters we get from setupRendering where updateMovement is called. setupRendering gets the parameters from main.jsss
export const updateMovement = (delta, controls, camera, walls) => {
    const moveSpeed = 5 * delta; // moveSpeed is the distance the camera will move in one second. We multiply by delta to make the movement framerate independent. This means that the movement will be the same regardless of the framerate. This is important because if the framerate is low, the movement will be slow and if the framerate is high, the movement will be fast. This is not what we want. We want the movement to be the same regardless of the framerate.

    const previousPosition = camera.position.clone(); // clone the camera position and store it in previousPosition. We will use this to reset the camera position if there is a collision

    // cose self-explanatory
    if (keysPressed.ArrowRight || keysPressed.d) {
        controls.moveRight(moveSpeed);
    }
    if (keysPressed.ArrowLeft || keysPressed.a) {
        controls.moveRight(-moveSpeed);
    }
    if (keysPressed.ArrowUp || keysPressed.w) {
        controls.moveForward(moveSpeed);
    }
    if (keysPressed.ArrowDown || keysPressed.s) {
        controls.moveForward(-moveSpeed);
    }

    // After the movement is applied, we check for collisions by calling the checkCollision function. If a collision is detected, we revert the camera's position to its previous position, effectively preventing the player from moving through walls.
    if (checkCollision()) {
        camera.position.copy(previousPosition); // reset the camera position to the previous position. The `previousPosition` variable is a clone of the camera position before the movement. We use `copy` instead of `set` because `set` will set the position to the same object, so if we change the previousPosition, the camera position will also change. `copy` creates a new object with the same values as the previousPosition.
    }
};

//render - show and rotate cube
let render = function () {
    const delta = clock.getDelta(); // get the time between frames
    updateMovement(delta, controls, camera);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};

render();
