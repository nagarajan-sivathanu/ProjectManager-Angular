import { Component, OnInit, EventEmitter,Output,ViewChild  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Http,Response } from '@angular/http';
import { formatDate } from '@angular/common';

import {User} from './../../shared/user';
import {Project} from './../../shared/project';
import {ProjectService} from './../../service/project.service';
import {UserService} from './../../service/user.service';
import {LoggerService} from './../../service/logger.service';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.css']
})
export class UpdateProjectComponent implements OnInit {
  today: number;
  tomorrow:number;
  private stDate:string;
  private eDate:string;
  private currentDate:string;
  private project:Project;
  private user:User;
  private managerSearch:string=null;
  private requireStartAndEndDate:boolean=false;
  private display:string='none';
  private userList:User[];
  private filteredUserList:User[];
  private searchText:string=null;
  private selectedManager:User;
  @Output() addRequest = new EventEmitter<boolean>();
  @ViewChild('f') updateProjectForm: NgForm;

  constructor(private router:Router,private logger:LoggerService,private projectService:ProjectService,private userService:UserService) { 
    this.today = Date.now();  
    this.tomorrow = this.today+(24*60*60*1000);
    this.stDate=formatDate(this.today,'yyyy-MM-dd','en');
    this.eDate=formatDate(this.tomorrow,'yyyy-MM-dd','en');
    this.currentDate=formatDate(this.today,'yyyy-MM-dd','en');
    this.user={
      userID:'',
      empID:'',
      empFirstName:'',
      empLastName:'',
      projectID:'',
      taskID:'',
      status:'A'
    };
    this.project={
      projectID:'',
      projectName:'',
      startDate:'',
      endDate:'',
      status:'A',
      priority:0,
      user:this.user
    }
    this.projectService.editProjectDetails.subscribe((newProject:Project ) => 
    {
        this.project = newProject;
        if(this.project.startDate != null && this.project.endDate != null){
          this.requireStartAndEndDate=true;
          this.project.startDate=formatDate(this.project.startDate,'yyyy-MM-dd','en');
          this.project.endDate=formatDate(this.project.endDate,'yyyy-MM-dd','en');
        }else{
          this.requireStartAndEndDate=false;
        }
        
        console.log("Before Getting Manager Name");
        this.managerSearch=this.project.user.empLastName+", "+this.project.user.empFirstName;
        console.log("Manager Name : "+this.managerSearch);
    });
    this.getUsers();
  }
  
  ngOnInit() {
  }

  isCheckBoxClicked(event){
    console.log('Inside Update Project Component - isCheckBoxClicked()');
    if ( event.target.checked ) {
        this.requireStartAndEndDate=true;
        this.project.startDate=formatDate(this.today,'yyyy-MM-dd','en');
        this.project.endDate=formatDate(this.tomorrow,'yyyy-MM-dd','en');      
    }else{
      this.requireStartAndEndDate=false;
    }
    console.log("Start & End Dates Required??? "+this.requireStartAndEndDate);
  }
  getUsers(): void {
    this.logger.logToConsole('Inside Update Project Component - getUsers()');    
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
  openModal(){
    console.log("inside open Modal ()");
    this.display="block"; 
  }
  onCloseHandled(){
     this.display='none'; 
  }
  onSelect(user:User){
    this.selectedManager=user;
    console.log('Selected Manager : '+this.selectedManager.empFirstName);
  
    this.managerSearch=this.selectedManager.empLastName+", "+this.selectedManager.empFirstName;
    this.project.user=this.selectedManager;
    this.onCloseHandled();
  } 
  onCancel(){
    this.logger.logToConsole('Inside Update User Component --> onCancel()');
    this.addRequest.emit(true);
  }
  onUpdate(){
    this.logger.logToConsole('Inside Update Project Component --> onUpdate()');
    this.project.projectName=this.updateProjectForm.value.projectName;
    this.project.startDate=this.updateProjectForm.value.startDate;
    this.project.endDate=this.updateProjectForm.value.endDate;
    this.logger.logToConsole(this.project);
    this.projectService.updateProject(this.project)
    .subscribe(
      (response:Response) => {
        this.logger.logToConsole(response.json());
        this.projectService.projectData.next(response.json());
        alert("User Updated Successfully...!!");
        this.updateProjectForm.resetForm();
        this.addRequest.emit(true);
        this.requireStartAndEndDate=false;
      },
      (error) => {
        this.logger.logToConsole(error);
        alert("User Could Not Be Update Now. Please Try Again Later...!!");
      }
    );
  }

}
