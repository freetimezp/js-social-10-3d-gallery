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
const renderer = new THREE.WebGLRenderer({ antialias: true }); //for smooth adges
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); //bg
document.body.appendChild(renderer.domElement); // add renderer to our html

//set light
let ambientLight = new THREE.AmbientLight(0x101010, 1.0); //color, intensity, distance, decay
ambientLight.position = camera.position; //light follows camera
scene.add(ambientLight);

//direction light
let sunLight = new THREE.DirectionalLight(0xddddd, 1.0); //color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

//geometry
let geometry = new THREE.BoxGeometry(1, 1, 1); //box geometry is the shape of object
//material
let material = new THREE.MeshBasicMaterial({ color: "#7282ca" }); // color of the object
let cube = new THREE.Mesh(geometry, material); // create cube
scene.add(cube);

//texture of the floor
let floorTexture = new THREE.TextureLoader().load('assets/img/floor.jpg');

floorTexture.wrapS = THREE.RepeatWrapping; // horisontal
floorTexture.wrapT = THREE.RepeatWrapping; // vertical
floorTexture.repeat.set(20, 20); // how many times texture repeat

//create floor plane
let planeGeometry = new THREE.PlaneGeometry(50, 50); //box geometry is the shape of object
let planeMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    side: THREE.DoubleSide
}); // color of the object
let floorPlane = new THREE.Mesh(planeGeometry, planeMaterial); // create floor
floorPlane.rotation.x = Math.PI / 2; // this is 90 deg
floorPlane.position.y = -Math.PI; // this is -180 deg
scene.add(floorPlane);

//add controls, when we press keys
document.addEventListener('keydown', onKeyDown, false);
function onKeyDown(event) {
    // 37 left, 38 up, 39 right, 40 down
    let keycode = event.which;

    if (keycode === 39) {
        camera.translateX(-0.05);
    } else if (keycode === 37) {
        camera.translateX(0.05);
    } else if (keycode === 38) {
        camera.translateY(-0.05);
    } else if (keycode === 40) {
        camera.translateY(0.05);
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
