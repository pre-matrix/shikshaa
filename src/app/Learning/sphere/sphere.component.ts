import { Component, ElementRef, NgZone, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Color } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FlakesTexture from '../../../assets/FlakesTexture.js';
@Component({
  selector: 'app-sphere',
  templateUrl: './sphere.component.html',
  styleUrls: ['./sphere.component.css']
})
export class SphereComponent implements OnInit, AfterViewInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sphereMesh!: THREE.Mesh;
  private bandMesh!: THREE.Mesh;
  private controls!: OrbitControls;

  constructor(private ngZone: NgZone, private el: ElementRef) {}

  ngOnInit(): void {
    this.createScene();
    this.animate();
  }

  ngAfterViewInit(): void {
    // Additional setup code can go here
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 50;
  }

  ngOnDestroy(): void {
    // Clean up resources on component destruction
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const container = this.el.nativeElement.querySelector('#sphereCanvas');
    if (container) {
      container.appendChild(this.renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff);
      ambientLight.position.set(5, 5, 5);
      this.scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      this.scene.add(pointLight);

      const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
      let texture = new THREE.CanvasTexture(new FlakesTexture());
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.x = 10;
      texture.repeat.y = 6;

      const material = new THREE.MeshPhysicalMaterial({
        color: 0x8418ca,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        metalness: 0.0001,
        roughness: 1,
        normalMap: texture,
        normalScale: new THREE.Vector2(0.1, 0.1),
        side: THREE.DoubleSide,
      });

      this.sphereMesh = new THREE.Mesh(sphereGeometry, material);
      this.sphereMesh.rotation.x = Math.PI / 2;
      this.scene.add(this.sphereMesh);

      const bandGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
      const bandMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
      });

      this.bandMesh = new THREE.Mesh(bandGeometry, bandMaterial);
      this.scene.add(this.bandMesh);

      this.camera.position.z = 5;
      // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

      // Sliders
      const sliderX = document.getElementById('sliderX') as HTMLInputElement;
      const sliderY = document.getElementById('sliderY') as HTMLInputElement;
      const sliderRot = document.getElementById('sliderRot') as HTMLInputElement;

      // Event listeners for sliders
      sliderX.addEventListener('input', this.moveObjects.bind(this));
      sliderY.addEventListener('input', this.moveObjects.bind(this));
      sliderRot.addEventListener('input', this.moveObjects.bind(this));
    } else {
      console.error('Container element not found.');
    }
  }

  moveObjects() {
    this.sphereMesh.position.x = parseFloat((document.getElementById('sliderX') as HTMLInputElement).value);
    this.sphereMesh.position.y = parseFloat((document.getElementById('sliderY') as HTMLInputElement).value);
    this.sphereMesh.rotation.z = parseFloat((document.getElementById('sliderRot') as HTMLInputElement).value);

    this.bandMesh.position.x = parseFloat((document.getElementById('sliderX') as HTMLInputElement).value);
    this.bandMesh.position.y = parseFloat((document.getElementById('sliderY') as HTMLInputElement).value);
    this.bandMesh.rotation.z = parseFloat((document.getElementById('sliderRot') as HTMLInputElement).value);
  }

  animate() {
    this.ngZone.runOutsideAngular(() => {
      const animateFn = () => {
        if (this.controls) {
          this.controls.update();
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(animateFn);
      };
      animateFn();
    });
  }
}
