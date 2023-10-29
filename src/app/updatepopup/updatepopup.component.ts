import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../service/auth.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";


@Component({
  selector: "app-updatepopup",
  templateUrl: "./updatepopup.component.html",
  styleUrls: ["./updatepopup.component.css"],
})
export class UpdatepopupComponent implements OnInit {
  element: any;

  constructor(
    private builder: FormBuilder,
    private service: AuthService,
    private dialogref: MatDialogRef<UpdatepopupComponent>,
    private toastr: ToastrService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.service
      .GetAllRoll()
      .valueChanges()
      .subscribe((res) => {
        this.rolelist = res;
      });
  }

  ngOnInit(): void {
    if (this.data.usercode != null && this.data.usercode != "") {
      this.loaduserdata(this.data.usercode);
    }
  }

  rolelist: any;
  editData: any;
  idd: any;
  

  

  registerform = this.builder.group({
    id: this.builder.control(""),
    name: this.builder.control(""),
    password: this.builder.control(""),
    email: this.builder.control(""),
    gender: this.builder.control("male"),
    role: this.builder.control("", Validators.required),
    isactive: this.builder.control(false),
  });

  loaduserdata(code: any) {
    this.service
      .Getbycode(code)
      .valueChanges()
      .subscribe((res) => {
        this.editData = res[0];
        console.log(this.editData);
  
        const formData = this.registerform.setValue ({
          id: this.editData.id,
          name: this.editData.name,
          password: this.editData.password,
          email: this.editData.email,
          gender: this.editData.gender,
          role: this.editData.role,
          isactive: this.editData.isactive,
        });
  
        
        this.idd = this.registerform.value.id; // to get user id to show on popup
      });
  }
  updateUser() {
  if (this.registerform.valid) {
    const id = this.registerform.get('id')?.value as string;
    
    if (id!== "") {
      this.service.Updateuser(id, this.registerform.value)
        .then(() => {
          this.toastr.success("Data updated successfully", "success");
          this.dialogref.close();

        })
        .catch((error) => {
          console.error("Error updating data: ", error);
          // Handle the error as needed
        });
    } else {
      this.toastr.warning("Please Select Role for the user");
    }
  } else {
    this.toastr.warning("Please Select Role for the user");
  }
}


  
}
