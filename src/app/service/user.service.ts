import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Http,Response,Headers } from '@angular/http';

import { User } from './../shared/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAddRequest:boolean=true;
  headers=new Headers({'Content-Type':'application/json'});
  userData = new BehaviorSubject({});
  editUserDetails = new BehaviorSubject({});

  constructor(private http:Http) { }

  public get AddRequest(){
    return this.isAddRequest;
  }
  public set AddRequest(val){
    this.isAddRequest=val;
  }
  
  
  getUsers(){
    return this.http.get('http://localhost:8085/users/',{headers:this.headers});
  }
  addUser(user:User){
    return this.http.post('http://localhost:8085/users/',user,{headers:this.headers});
  }
  updateUser(user:User){
    return this.http.put('http://localhost:8085/users/',user,{headers:this.headers});
  }
}
