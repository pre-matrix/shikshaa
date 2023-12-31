import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Toast } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  get(arg0: string) {
    throw new Error("Method not implemented.");
  }
  value: any;
  valid: any;
  setValue(arg0: { id: any; name: any; password: any; email: any; gender: any; role: any; isactive: any; }) {
    throw new Error("Method not implemented.");
  }
      constructor (private builder: FormBuilder, private service:AuthService, private router:Router,private toastr: ToastrService ){}
        registerform = this.builder.group({
          id: this.builder.control('', Validators.compose([Validators.required, Validators.minLength(5)])),
          name: this.builder.control('', Validators.required),
          password: this.builder.control('', Validators.compose([Validators.required, Validators.pattern('')])),
          email: this.builder.control('', Validators.compose([Validators.required, Validators.email])),
          gender: this.builder.control('male'),
          role: this.builder.control(''),
          isactive: this.builder.control(false)
        });

        proceedregister() {
          if (this.registerform.valid) {
            this.service.RegisterUser(this.registerform.value)
            .then((result:any) => {
              this.toastr.warning('Please contact admin for enable access.'+'Registered successfully')
              this.router.navigate(['login'])
            });
          } else {
            this.toastr.warning('Please enter valid data.');
          }
        }
}