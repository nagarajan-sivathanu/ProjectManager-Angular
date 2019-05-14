import { Component, OnInit,ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Http,Response } from '@angular/http';
import {User} from './../../shared/user';
import {Project} from './../../shared/project';
import {UserService} from './../../service/user.service';
import {ProjectService} from './../../service/project.service';
import {LoggerService} from './../../service/logger.service';
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  today: number;
  tomorrow:number;
  private stDate:string;
  private eDate:string;
  private currentDate:string;
  private priority:number=0;
  display:string='none';
  requireStartAndEndDate:boolean=false;
  isValidStartAndEndDate:boolean=true;
  private userList:User[];
  private filteredUserList:User[];
  private project:Project;
  private user:User;
  private selectedManager:User;
  private managerSearch:string=null;
  private searchText:string=null;
  
  @ViewChild('f') addProjectForm: NgForm;

  constructor(private modalService: NgbModal,private logger:LoggerService,private userService:UserService,private projectService:ProjectService) {
    this.today = Date.now();  
    this.tomorrow = this.today+(24*60*60*1000);
    this.currentDate=formatDate(this.today,'yyyy-MM-dd','en');
    this.stDate=formatDate(this.today,'yyyy-MM-dd','en');
    this.eDate=formatDate(this.tomorrow,'yyyy-MM-dd','en');
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
      //managerID:''
      user:this.user
    }
    this.getUsers();
   }

  ngOnInit() {
  }
  openModal(){
    console.log("inside open Modal ()");
    console.log(this.addProjectForm.value.manager);
    this.display="block"; 
  }
  onCloseHandled(){
     this.display='none'; 
  }

  getUsers(): void {
    this.logger.logToConsole('Inside Add Project Component - getUsers()');    
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
  onSelect(user:User){
    this.selectedManager=user;
    console.log('Selected Manager : '+this.selectedManager.empFirstName);
  
    this.managerSearch=this.selectedManager.empLastName+", "+this.selectedManager.empFirstName;
    //this.project.managerID=this.selectedManager.empID;
    this.project.user=this.selectedManager;
    this.onCloseHandled();
  } 
  isCheckBoxClicked(event){
    console.log('Inside Add Project Component - isCheckBoxClicked()');
    if ( event.target.checked ) {
        this.requireStartAndEndDate=true;
        this.stDate=formatDate(this.today,'yyyy-MM-dd','en');
        this.eDate=formatDate(this.tomorrow,'yyyy-MM-dd','en');      
    }else{
      this.requireStartAndEndDate=false;
    }
    console.log("Start & End Dates Required??? "+this.requireStartAndEndDate);
  }
  clearForm(){
    this.addProjectForm.resetForm();
    this.requireStartAndEndDate=false;
    this.priority=0;  
  }

  onSubmit(){
    this.project.projectName=this.addProjectForm.value.projectName;
    this.project.priority=this.priority;
    this.project.startDate=this.addProjectForm.value.startDate;
    this.project.endDate=this.addProjectForm.value.endDate;

    console.log(this.project);
    this.projectService.addProject(this.project)
    .subscribe(
      (response:Response) => {
        this.logger.logToConsole(response.json());        
        this.projectService.projectData.next(response.json());
        alert("Project Added Successfully...!!");
        this.addProjectForm.resetForm();
        this.requireStartAndEndDate=false;
        this.priority=0;
      },
      (error) => {
        this.logger.logToConsole(error);
        alert("Project Could Not Be Added Now. Please Try Again Later...!!");
      }
    );
  }
}
