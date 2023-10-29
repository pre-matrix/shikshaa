import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private builder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    sessionStorage.clear();
  }
  
  loginform = this.builder.group({
    id: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  });

  proceedlogin() {
    if (this.loginform.valid) {
      const userId = String(this.loginform.value.id);
      const password = this.loginform.value.password;
  
      this.service.Getbycode(userId).valueChanges().subscribe((item) => {
        if (item) {
          const user = item[0]; // Assuming the query returns an array with a single user
          if (user && user.password === password) {
            if (user.isactive) {
              // Check if user.id is defined before setting it in sessionStorage
              if (user.id !== null && user.id !== undefined && user.role !== null && user.role !== undefined) {
                sessionStorage.setItem('username', user.id);
                sessionStorage.setItem('role', user.role);
                this.router.navigate(['/user']);
              } else {
                this.toastr.warning('User ID is undefined.');
              }
            } else {
              this.toastr.warning('InActive User. Please contact Admin.');
            }
          } else {
            this.toastr.warning('Invalid credentials');
          }
        } else {
          this.toastr.warning('User not found');
        }
      });
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }
  
 
  
}
