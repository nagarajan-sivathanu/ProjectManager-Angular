import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { Http,Response } from '@angular/http';

import {User} from './../../shared/user';
import {Users} from './../../shared/mock-userList';
import {UserService} from './../../service/user.service';
import {LoggerService} from './../../service/logger.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  private userList:User[];
  private filteredUserList:User[];
  private user:User;
  private modUser:User;
  private newUser:User;
  private searchText:string=null;
  
  @Output() addRequest = new EventEmitter<boolean>();

  constructor(private router:Router,private logger:LoggerService,private userService:UserService) { 
    
    this.user= {
      userID:'',
      empID:'',
      empFirstName:'',
      empLastName:'',
      projectID:'',
      taskID:'',
      status:'A'
    };

  
  }

  ngOnInit() {
    this.logger.logToConsole('Inside View User Component - ngOnInit()');
    this.getUsers();
    this.userService.userData.subscribe((newUser:User ) => {
      if(newUser && this.userList){
        this.user = newUser;
        //this.userList.push(this.user);
        this.pushToArray();
        this.filteredUserList=_.clone(this.userList);
        this.logger.logToConsole('After Add/Update : '+this.userList.length);
      }
    });
  }
  
  pushToArray() {
    const index = this.userList.findIndex((e) => e.userID === this.user.userID);

    if (index === -1) {
      this.userList.push(this.user);
    } else {
      this.userList[index] = this.user;
    }
}

  getUsers(): void {
    this.logger.logToConsole('Inside View User Component - getUsers()');    
    this.userService.getUsers()
      .subscribe(
        (response:Response) => {
          this.userList = response.json();
          this.filteredUserList = _.clone(this.userList);
          this.logger.logToConsole(this.userList);
        },
        (error) => this.logger.logToConsole(error)        
      );
  } 

  onEdit(user:User):void{
    console.log('Inside View User Component --> onEdit()');
    this.modUser=_.clone(user);
    this.userService.editUserDetails.next(this.modUser);
    //this.userService.AddRequest=false;
    this.addRequest.emit(false);
  }
  onEnd(user:User):void{
    console.log('Inside View User Component --> onEnd()');
    this.modUser=_.clone(user);
    this.modUser.status='I';
    this.userService.updateUser(this.modUser)
    .subscribe(
      (response:Response) => {
        this.logger.logToConsole(response);
        this.userService.userData.next(response.json());
        alert("User deactivated Successfully...!!");
        this.addRequest.emit(true);
      },
      (error) => {
        this.logger.logToConsole(error);
        alert("User Could Not Be Update Now. Please Try Again Later...!!");
      }
    );
  }
  onSortByFName(){
    console.log('Inside View User Component --> onSortFName()');
    this.filteredUserList=_.sortBy(this.filteredUserList,[function(o){return o.empFirstName}]); 
  }
  onSortByLName(){
    console.log('Inside View User Component --> onSortFName()');
    this.filteredUserList=_.sortBy(this.filteredUserList,[function(o){return o.empLastName}]);
  }
  onSortByID(){
    console.log('Inside View User Component --> onSortByID()');
    this.filteredUserList=_.sortBy(this.filteredUserList,[function(o){return o.empID}]);
  }
  isActive(user:User){
    if(user.status==='A'){
      return false;
    }else{
      return true;
    }    
  }
}
