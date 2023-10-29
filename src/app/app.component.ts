import { Component, DoCheck } from "@angular/core";
import { Route, Router } from "@angular/router";
import { AuthService } from "./service/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements DoCheck {
  title = "shikshaa";
  isMenuRequire = false;
  id: any;
  element: any;
  isAdmin = false;
  isActive: any;
  res: any;
  isStudent = false;
  userName: string = ""; // Variable to store the user's name

  constructor(private router: Router, private service: AuthService) {}
  ngDoCheck(): void {
    let currentUrl = this.router.url;

    if (currentUrl == "/login" || currentUrl == "/register") {
      this.isMenuRequire = false;
    } else {
      this.isMenuRequire = true;
    }
    const userRole = this.service.getUserRole();
    this.isAdmin = userRole === "admin";
    this.isStudent = userRole === "Student";

    this.userName = this.service.getUserName();
  }
}
