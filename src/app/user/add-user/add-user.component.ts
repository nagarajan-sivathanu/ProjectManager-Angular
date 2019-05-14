import { Component, OnInit,ViewChild,EventEmitter,Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Http,Response } from '@angular/http';
import * as _ from 'lodash';
import { User } from './../../shared/user';
import { LoggerService } from './../../service/logger.service';
import { UserService } from './../../service/user.service';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  user:User = {
    userID:'',
    empID:'',
    empFirstName:'',
    empLastName:'',
    projectID:'',
    taskID:'',
    status:'A'
  };
  addedUser:User;
  userData:User[];

  @Output() addRequest = new EventEmitter<boolean>();
  @ViewChild('f') addUserForm: NgForm;
  constructor(private userService:UserService,private logger:LoggerService,
    private router:Router) { }

  ngOnInit() {
    this.addedUser=_.clone(this.user);
  }

  onSubmit(){
    this.logger.logToConsole('Inside Add Task Component - onSubmit()');
    this.logger.logToConsole(this.addUserForm);
    this.user.empID=this.addUserForm.value.empID;
    this.user.empFirstName=this.addUserForm.value.firstName;
    this.user.empLastName=this.addUserForm.value.lastName;
    this.userService.addUser(this.user)
      .subscribe(
        (response:Response) => {
          this.logger.logToConsole(response.json());        
          this.userService.userData.next(response.json());
          alert("User Added Successfully...!!");
          this.addUserForm.resetForm();
        },
        (error) => {
          this.logger.logToConsole(error);
          alert("User Could Not Be Added Now. Please Try Again Later...!!");
        }
      );
  }

}
