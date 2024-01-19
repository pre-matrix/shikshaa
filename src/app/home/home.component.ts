import { Component } from '@angular/core';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent {

  currentComponent: string = 'my-component';
  isCubeOn: boolean = true;
  isBackbut: boolean = false;

  switchToCircleComponent() {
    this.currentComponent = 'circle-component';
    this.isCubeOn= false;
    this.isBackbut= true;
  }

  switchToSphereComponent() {
    this.currentComponent = 'sphere-component';
    this.isCubeOn= false;
    this.isBackbut= true;
  }

  switchToMyComponent() {
    this.currentComponent = 'my-component';
    this.isCubeOn= true;
    this.isBackbut= false;
  }

  switchToAtomComponent() {
    this.currentComponent = 'atom-component';
    this.isCubeOn= false;
    this.isBackbut= true;
  }

 
}


