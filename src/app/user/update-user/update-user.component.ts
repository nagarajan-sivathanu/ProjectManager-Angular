import { Component, OnInit, EventEmitter,Output,ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Http,Response } from '@angular/http';

import {User} from './../../shared/user';
import {Users} from './../../shared/mock-userList';
import {UserService} from './../../service/user.service';
import {LoggerService} from './../../service/logger.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  private user:User = {
    userID:'',
    empID:'',
    empFirstName:'',
    empLastName:'',
    projectID:'',
    taskID:'',
    status:'A'
  };
  @ViewChild('f') updateUserForm: NgForm;
  @Output() addRequest = new EventEmitter<boolean>();
  constructor(private router:Router,private logger:LoggerService,private userService:UserService) { 
    this.userService.editUserDetails.subscribe((newUser:User ) => this.user = newUser);
  }

  ngOnInit() {
  }

  onCancel(){
    console.log('Inside Update User Component --> onCancel()');
    this.addRequest.emit(true);
    this.router.navigate(['/userDetails']);  
  }

  onUpdate(){
    console.log('Inside Update User Component --> onUpdate()');
    this.user.empID=this.updateUserForm.value.empID;
    this.user.empFirstName=this.updateUserForm.value.firstName;
    this.user.empLastName=this.updateUserForm.value.lastName;
    this.userService.updateUser(this.user)
    .subscribe(
      (response:Response) => {
        this.logger.logToConsole(response.json());
        this.userService.userData.next(response.json());
        alert("User Updated Successfully...!!");
        this.updateUserForm.resetForm();
        this.addRequest.emit(true);
      },
      (error) => {
        this.logger.logToConsole(error);
        alert("User Could Not Be Update Now. Please Try Again Later...!!");
      }
    );
  }
}
