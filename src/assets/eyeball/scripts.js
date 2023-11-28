scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor("#b5e5e5");
document.body.appendChild(renderer.domElement);

renderer.outputEncoding = THREE.RGBADepthPacking;


window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth,window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();
})

camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 5);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

pointlight = new THREE.PointLight(0xffffff, 1);
pointlight.position.set(200, 200,200);
scene.add(pointlight);



let texture = new THREE.CanvasTexture(new FlakesTexture());
texture.wrapS = THREE.Repeatwrapping;
texture.wrapT = THREE.Repeatwrapping;
texture.repeat.x = 10;
texture.repeat.y = 6;

const ballMaterial = {
	clearcoat: 1.0,
	clearcoatRoughness: 0.1,
	metalness: 0.01,
	roughness: 0.5,
	color: 0X8418ca,
	normalMap: texture,
	normalScale: new THREE.Vector2(0.1, 0.1)
}; 

var ballGeo = new THREE.SphereGeometry(1,64, 64);
var ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);

var ballMesh = new THREE.Mesh(ballGeo, ballMat);
scene.add(ballMesh);




animate();


function animate() {
	// controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}

