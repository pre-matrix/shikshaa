import { Component, NgZone, OnInit, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
} from 'three';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css'],
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
      console.error('Container element not found.');
    }
  }

  ngAfterViewInit(): void {
    // You can add any additional setup code here
  }

  createScene(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    const material = new THREE.MeshBasicMaterial({
      color: 0xfff,
      transparent: true,
      opacity: 0.1, // Adjust the opacity for the outside/front side
      side: THREE.DoubleSide, // Use a double-sided material
    });


    // Create the geometry
    const geometry = new THREE.BoxGeometry();

    // Create the mesh using both materials
    this.cube = new THREE.Mesh(geometry,material);
    this.scene.add(this.cube);

    // Create the edges for the cube
    const edgesMaterials = [
      new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.1 }), // Black
      new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.1 }), // Red
      new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1 }), // Green
      new THREE.LineBasicMaterial({ color: 0x0000ff }), // Blue
      new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.1 }), // Yellow
    ];

    // Create an array to hold the separate edge sets
    const edgesSets = [];

    const edgesGeometry = new THREE.EdgesGeometry(geometry);

    // Create and position each set of edges
    for (let i = 0; i < edgesMaterials.length; i++) {
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterials[i]);
      edges.position.copy(this.cube.position);
      edgesSets.push(edges);
    }

    // Add the edge sets to the cube
    for (const edges of edgesSets) {
      this.cube.add(edges);
    }

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
