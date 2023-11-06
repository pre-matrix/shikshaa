import { Component, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent implements  AfterViewInit {
  points: number = 0;
  constructor() { }
  ngOnInit(){
    this.points = 0;
  }
  ngAfterViewInit() {
    const radiusSlider = document.getElementById("radiusSlider") as HTMLInputElement;
    const circle = document.getElementById("circle") as HTMLElement;
    const circle2 = document.getElementById("circle2") as HTMLElement;
    const radiusLine = document.getElementById("radiusLine") as HTMLElement;
    const radiusText = document.getElementById("radiusText") as HTMLElement;
    const circumferenceText = document.getElementById("circumferenceText") as HTMLElement;
    const rewardPoints = document.getElementById("rewardPoints") as HTMLElement;
    const badgeContainer = document.getElementById("badgeContainer") as HTMLElement
    const overlay = document.getElementById("overlay") as HTMLElement;
    const dialogText = document.getElementById("dialog-text") as HTMLElement;
    const okButton = document.getElementById("ok-button") as HTMLElement;
    const congratsOverlay = document.getElementById("congrats-overlay") as HTMLElement;

    
    const maxPoints = 35; // Set your maximum achievable points

    const updatePoints = (amount: number) => {
      this.points += amount;
      if (this.points === 25) {
        congratsOverlay.style.display = "block";
        badgeContainer.innerText = "Expert"
        // function addBadge(badgeText: string) {
        //   const badge = document.createElement("div");
        //   badge.className = "badge";
        //   badge.textContent = badgeText;
        //   badgeContainer.appendChild(badge);
        // }
      }
      rewardPoints.textContent = `Points: ${this.points}`;
    }



    radiusLine.addEventListener("click", ()=> {
      rlinemod();
      updatePoints(10);
    }, true);

    circle2.addEventListener("click", () => {
      cirmod();
      updatePoints(15);
    }, true);

 
    dialogText.textContent = "Please click on the radius and circumference of the circle.";
    overlay.style.display = "block";
    congratsOverlay.style.display = "none";

    okButton.addEventListener("click", function () {
      overlay.style.display = "none";
    });

    radiusSlider.addEventListener("input", updateCircle);

    function updateCircle() {
      const radius = +radiusSlider.value;
      circle.style.width = `${radius * 4}px`;
      circle.style.height = `${radius * 4}px`;
      circle2.style.width = `${radius * 4}px`;
      circle2.style.height = `${radius * 4}px`;
      radiusLine.style.width = `${radius * 4 + 10}px`;

      radiusText.textContent = `radius: ${radius}px`;
      circumferenceText.textContent = `Circumference: ${Math.round(2 * Math.PI * radius).toFixed(2)}px`;
    }

    function rlinemod() {
      radiusText.style.color = 'red';
      radiusText.style.fontSize = '18px';
    }


    radiusLine.addEventListener("click", rlinemod, true);
  

    function cirmod() {
      circumferenceText.style.color = 'red';
      circumferenceText.style.fontSize = '18px';
    }



    circle2.addEventListener("click", cirmod, true);


    // Initial update
    updateCircle();
  }




  
}
