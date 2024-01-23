import { Component, ElementRef, NgZone, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-atomic-structure',
  template: `
    <div id="einfo" class="info">electrons</div>
    <div id="ninfo" class="info">neutrons</div>
    <div id="pinfo" class="info">protons</div>
  `,
  styles: [`
    body {
      margin: 0;
      overflow: hidden;
    }

    canvas {
      display: block;
    }

    .info {
      position: absolute;
      padding: 4px;
      font-size: 12px;
      font-family: 'poppins', sans-serif;
      font-weight: 700;
      width: fit-content;
      text-align: center;
      z-index: 100;
      display: block;
      color: aliceblue;
      background-color: rgba(240, 248, 255, 0.254);
      border: solid 2px #767676;
      border-radius: 5px;
    }
  `]
})
export class AtomicStructureComponent implements OnInit, OnDestroy {

  private isPaused = false;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private electronGroup1s!: THREE.Group;
  private electronGroup2s!: THREE.Group;
  private nucleus!: THREE.Group;
  private einfoDiv!: any;
  private ninfoDiv!: any;
  private pinfoDiv!: any;
  private controls!: OrbitControls;
  private clickedParticle!: any;

  constructor(private el: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.setupScene();
    this.createParticles();
    this.setupControls();
    this.setupClickEvents();
    this.animate();
    this.onWindowResize();
  }

  ngOnDestroy(): void {
    this.ngZone.runOutsideAngular(() => {
      window.removeEventListener('resize', () => this.onWindowResize());
    });
  }

  private setupScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.nativeElement.appendChild(this.renderer.domElement);

    // Set up lights, materials, and other scene elements

    var ambientLight = new THREE.AmbientLight(0x404040, 3);
    this.scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff, 0.3);
    spotLight.position.set(
      this.camera.position.x + 10, this.camera.position.y + 10, this.camera.position.z + 10,
    )
    var spotLight2 = new THREE.SpotLight(0xffffff, 0.3);
    spotLight.position.set(
      this.camera.position.x - 10, this.camera.position.y - 10, this.camera.position.z - 10,
    )
    this.scene.add(spotLight, spotLight2);

    var protonGeometry = new THREE.SphereGeometry(0.1, 64, 64);
    var neutronGeometry = new THREE.SphereGeometry(0.1, 64, 64);

    var onesGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    var twosGeometry = new THREE.SphereGeometry(3, 64, 64);

    let texture = new THREE.CanvasTexture(new FlakesTexture());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 10;
    texture.repeat.y = 6;

    var pMaterial = new THREE.MeshPhysicalMaterial({
      color: 0X8418ca,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.01,
      roughness: 0.5,
      normalMap: texture,
      normalScale: new THREE.Vector2(0.1, 0.1),
      side: THREE.DoubleSide,
    });

    var nMaterial = new THREE.MeshPhysicalMaterial({
      color: 0X9840,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.01,
      roughness: 0.5,
      normalMap: texture,
      normalScale: new THREE.Vector2(0.1, 0.1),
      side: THREE.DoubleSide,
    });

    var eMaterial = new THREE.MeshPhysicalMaterial({
      color: 0Xff5050,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.1,
      roughness: 0.5,
      normalMap: texture,
      normalScale: new THREE.Vector2(0.1, 0.1),
      side: THREE.DoubleSide,
    });

    var onesMaterial = new THREE.MeshPhysicalMaterial({
      color: 0Xffff99,
      transparent: true,
      opacity: 0.1
    });

    var twosMaterial = new THREE.MeshPhysicalMaterial({
      color: 0X99c2ff,
      transparent: true,
      opacity: 0.15
    });

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 1;
    this.controls.maxDistance = 30;
  }

  private createParticles(): void {
    // Create proton, neutron, and electron particles
    this.nucleus = new THREE.Group();
    this.electronGroup1s = new THREE.Group();
    this.electronGroup2s = new THREE.Group();

    this.createProtons();
    this.createNeutrons();
    this.createElectron(new THREE.MeshPhysicalMaterial(), 1.5, 2, this.electronGroup1s);
    this.createElectron(new THREE.MeshPhysicalMaterial(), 3, 8, this.electronGroup2s);

    this.nucleus.add(this.electronGroup1s, this.electronGroup2s);
    this.scene.add(this.nucleus);
  }

  private createProtons(): void {
    const protonGeometry = new THREE.SphereGeometry(0.1, 64, 64);
    const pMaterial = new THREE.MeshPhysicalMaterial({
      color: 0X8418ca,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.01,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < 8; i++) {
      const proton = new THREE.Mesh(protonGeometry, pMaterial);
      const angle = (i / 8) * Math.PI * 2;
      const radiusp = 0.4;
      proton.position.set(Math.cos(angle) * radiusp, Math.sin(angle) * radiusp, 0);
      proton.name = 'p' + i;
      this.nucleus.add(proton);
    }
  }

  private createNeutrons(): void {
    const neutronGeometry = new THREE.SphereGeometry(0.1, 64, 64);
    const nMaterial = new THREE.MeshPhysicalMaterial({
      color: 0X9840,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.01,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < 8; i++) {
      const neutron = new THREE.Mesh(neutronGeometry, nMaterial);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 0.2;
      neutron.position.set(-Math.cos(angle) * radius, -Math.sin(angle) * radius, 0);
      neutron.name = 'n' + i;
      this.nucleus.add(neutron);
    }
  }

  private createElectron(material: THREE.MeshPhysicalMaterial, radius: number, count: number, group: THREE.Group<THREE.Object3DEventMap>): void {
    const electronGeometry = new THREE.SphereGeometry(0.1, 16, 8);

    for (let i = 0; i < count; i++) {
      const electron = new THREE.Mesh(electronGeometry, material);
      const angle = (i / count) * Math.PI * 2;
      electron.name = 'el' + i;
      electron.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
      group.add(electron);
    }
  }

  

  private setupClickEvents(): void {
    this.renderer.domElement.addEventListener('click', (event) => this.onClick(event), false);
  }

  private onClick(event: MouseEvent): void {
    // Handle click events on particles
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects([
      ...this.electronGroup1s.children,
      ...this.electronGroup2s.children,
      ...this.nucleus.children,
    ]);

    if (intersects.length > 0) {
      const clickedParticle = intersects[0].object;
      console.log('Clicked on particle:', clickedParticle.name);
      this.clickedParticle.material.color.set(Math.random() * 0xffffff);

      // Add Web Speech API
      let particleType = '';

      if (clickedParticle.name && clickedParticle.name.startsWith('p')) {
        particleType = 'Proton';
      } else if (clickedParticle.name && clickedParticle.name.startsWith('n')) {
        particleType = 'Neutron';
      } else {
        particleType = 'Electron';
      }

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance('Clicked on ' + particleType);
      synth.speak(utterance);
    }
  }

  private updateInfoDivPosition(particle: THREE.Object3D<THREE.Object3DEventMap>, infoDiv: any): void {
    // Update info div position
    // ...
  }

  private updateNutronInfoDivPosition(nutron: THREE.Object3D<THREE.Object3DEventMap>, ninfoDiv: any): void {
    // Update neutron info div position
    // ...
  }

  private updateProtonInfoDivPosition(proton: THREE.Object3D<THREE.Object3DEventMap>, pinfoDiv: any): void {
    // Update proton info div position
    // ...
  }

  private animate(): void {
    if (!this.isPaused) {
      requestAnimationFrame(() => this.animate());

      this.electronGroup2s.children.forEach(electron => {
        this.updateInfoDivPosition(electron, this.einfoDiv);
      });

      this.nucleus.children.forEach(nutron => {
        this.updateNutronInfoDivPosition(nutron, this.ninfoDiv);
      });

      this.nucleus.children.forEach(proton => {
        this.updateProtonInfoDivPosition(proton, this.pinfoDiv);
      });

      this.electronGroup1s.rotation.x += 0.01;
      this.electronGroup1s.rotation.y += 0.01;

      this.electronGroup2s.rotation.z += 0.001;

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
