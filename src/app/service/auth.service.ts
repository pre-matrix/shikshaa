import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/compat/database";
import { getDatabase, ref, set } from "firebase/database";

import { User } from '../models/user.model';
import { Role } from '../models/role.model';


@Injectable({
  providedIn: "root",
})
export class AuthService {
 
  private dbPath = "/user";
  private rollPath = "/role";
  

  usersRef: AngularFireList<User>;
  roleRef: AngularFireList<Role>;
 

  constructor(private db: AngularFireDatabase) {
    this.usersRef = db.list(this.dbPath);
    this.roleRef = db.list(this.rollPath);

  }

  GetAll(): AngularFireList<User> {
    return this.usersRef;
  }

  RegisterUser(user: User) {
    const userRef = this.db.object(`/user/${user.id}`);
    return userRef.set(user);
  }

  Updateuser(key: string, value: any){
    return this.usersRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.usersRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.usersRef.remove();
  }

  GetAllRoll(): AngularFireList<Role> {
    return this.roleRef;
  }

  getUserName() {
    return sessionStorage.getItem("username") || "";
  }

  proceedregister(user: User): any {
    return this.usersRef.push(user);
  }

  isloggedin() {
    return sessionStorage.getItem("username") != null;
  }

  getUserRole() {
    return sessionStorage.getItem("role") != null
      ? sessionStorage.getItem("role")?.toString()
      : "";
  }

  // Get data by code using AngularFire
  Getbycode(code: any): AngularFireList<User> {
    return this.db.list(this.dbPath, (ref) => ref.orderByChild('id').equalTo(code));
  }
}
