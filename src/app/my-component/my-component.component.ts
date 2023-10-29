import { Component, NgZone, OnInit, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponentComponent implements OnInit, AfterViewInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;

  constructor(private ngZone: NgZone, private render: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    // Access the container element
    const container = this.el.nativeElement.querySelector('#myCanvas');
    if (container) {
      this.createScene(container);
      this.animate();
    } else {
      console.error("Container element not found.");
    }
  }

  ngAfterViewInit(): void {
    // You can add any additional setup code here
  }

  createScene(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true,  preserveDrawingBuffer: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);
    
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;
  }

  animate() {
    this.ngZone.run(() => {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    });

    requestAnimationFrame(() => this.animate());
  }
}
