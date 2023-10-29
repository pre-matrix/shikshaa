import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AuthService } from "../service/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { UpdatepopupComponent } from "../updatepopup/updatepopup.component";

@Component({
  selector: "app-userlisting",
  templateUrl: "./userlisting.component.html",
  styleUrls: ["./userlisting.component.css"],
})
export class UserlistingComponent implements AfterViewInit {
  element: any;
  userList: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: AuthService, private dialog: MatDialog) {}
  ngAfterViewInit(): void {
    
  }
 
  ngOnInit(): void {
    this.loadUser();
  }

 
  loadUser() {
    this.service.GetAll().valueChanges().subscribe((res: any) => {
      
      this.userList = res;
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  displayedColumns: string[] = [
    "id",
    "name",
    "email",
    "role",
    "status",
    "action",
  ];

  updateUser(code: any) {
    this.openDialog('100ms', '600ms', code)
  }
  openDialog(enteranimation: any, exitanimation: any, code: string) {
    const popup = this.dialog.open(UpdatepopupComponent,{
      enterAnimationDuration:enteranimation,
      exitAnimationDuration:exitanimation,
      width: '20%',
      data: {
        usercode: code,
      }
    });

    popup.afterClosed().subscribe(res=>{
      this.loadUser();
    })
  }
}
