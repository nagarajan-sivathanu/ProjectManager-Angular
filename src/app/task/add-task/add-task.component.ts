import { Component, OnInit,ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Http,Response } from '@angular/http';
import {User} from './../../shared/user';
import {Project} from './../../shared/project';
import {Task} from './../../shared/task';
import {UserService} from './../../service/user.service';
import {ProjectService} from './../../service/project.service';
import {LoggerService} from './../../service/logger.service';
import {TaskService} from './../../service/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  
  private today: number;
  private tomorrow:number;
  private stDate:string;
  private eDate:string;
  private display:string='none';
  private displayPrjModal:string='none';
  private displayParentModal:string='none';
  private projectName:string='';
  private managerSearch:string='';
  private selectedParent:string='';
  private searchText:string='';
  private taskPriority:any=15;
  //private isParentTask:boolean=false;

  private project:Project;
  private user:User;
  private task:Task;
  private selectedManager:User;
  //private selectedProject:Project;

  private userList:User[];
  private filteredUserList:User[];
  private projects:Project[];
  private filteredProjects:Project[];
  private tasks:Task[];
  private filteredTasks:Task[];
  private parentTasks:Task[];
  //private filteredParentTasks:Task[];

  @ViewChild('f') addTaskForm: NgForm;

  constructor(private modalService: NgbModal,private logger:LoggerService,
              private userService:UserService,private projectService:ProjectService,
              private taskService:TaskService) {
    this.logger.logToConsole("Inside Add Task Component Constructor");
    this.today = Date.now();  
    this.tomorrow = this.today+(24*60*60*1000);  
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
      user:this.user
    }
    this.task={
      taskID:'',
      taskName:'',
      parent:false,
      parentTask:null,
      startDate:this.stDate,
      endDate:this.eDate,
      status:'A',
      priority:15,
      user:this.user,
      project:this.project      
    }   
  
  }

  ngOnInit() {
    this.getUsers();
    this.getProjects();
    this.getTasks();
  }

  getUsers(): void {
    this.logger.logToConsole('Inside Add Task Component - getUsers()');    
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
  getProjects():void{
    this.logger.logToConsole('Inside Add Task Component - getProjects()');   
    this.projectService.getProjects()
    .subscribe(
      (response:Response) => {
        this.projects = response.json();
        this.filteredProjects = _.clone(this.projects);
        this.logger.logToConsole(this.projects);
      },
      (error) => this.logger.logToConsole(error)        
    ); 
  }
  getTasks():void{
    this.logger.logToConsole('Inside Add Task Component - getTasks()');
    this.taskService.getTasks()
      .subscribe(
        (response:Response) => {
          this.tasks = response.json();
          this.filteredTasks = _.clone(this.tasks);
          this.logger.logToConsole(this.tasks);
        }
      )
  }

  openUserModal(){
    this.logger.logToConsole("inside openUserModal()");
    this.displayPrjModal='none';
    this.displayParentModal='none';
    this.display="block"; 
  }
  openPrjModal(){
    this.logger.logToConsole("inside openPrjModal()");
    this.display="none"; 
    this.displayParentModal='none';
    this.displayPrjModal='block';
  }
  openParenModal(){
    this.logger.logToConsole("inside openPrjModal()");
    this.display="none"; 
    this.displayPrjModal='none';
    this.displayParentModal='block';    
  }
  closeUserModal(){
    this.logger.logToConsole("inside closeUserModal()");
     this.display='none'; 
  }
  closePrjModal(){
    this.logger.logToConsole("inside closePrjModal()");
     this.displayPrjModal='none'; 
  }
  closeParentModal(){
    this.logger.logToConsole("inside closeParentModal()");
    this.displayParentModal='none'; 
  }
  onSelect(user:User){
    this.selectedManager=user;
    console.log('Selected Manager : '+this.selectedManager.empFirstName);
      this.managerSearch=this.selectedManager.empLastName+", "+this.selectedManager.empFirstName;
      //this.user=this.selectedManager;
      this.task.user=this.selectedManager;
    this.closeUserModal();
  } 
  onSelectProject(project:Project){
    this.logger.logToConsole(project);
      //this.selectedProject=project;
      //this.project=this.selectedProject;
      this.task.project=project;
      this.projectName=this.task.project.projectName;
     //this.filteredTasks.splice(0,this.filteredTasks.length);
     this.logger.logToConsole(this.filteredTasks);
      this.filteredTasks=_.filter(this.tasks, function(o){
        if(project!=null && o!=null){
            if(o.project.projectName==project.projectName){
              return o;
            }
        }
      });
      this.parentTasks=_.filter(this.filteredTasks, function(o){
        if(o!=null && o.parent==true){
          return o;
        }
      });
      this.logger.logToConsole("List of All Tasks Associated with Project");
      this.logger.logToConsole(this.filteredTasks);
      this.logger.logToConsole("List of PARENT Tasks Associated with Project");
      this.logger.logToConsole(this.parentTasks);
    this.closePrjModal();
  } 
  onSelectParent(parentTask:Task){
    this.task.parentTask=parentTask;
    this.selectedParent=parentTask.taskName;
    this.closeParentModal();
  }
 
  isCheckBoxClicked(event){
    console.log('Inside Add Task Component - isCheckBoxClicked()');
    if ( event.target.checked ) {
        //this.isParentTask=true;
        this.task.parent=true;
        this.task.priority=0;
        this.task.startDate=null;
        this.task.endDate=null;
        this.selectedParent="";
          
    }else{     
      //this.isParentTask=false;
      this.task.parent=false;
      this.task.priority=15;
      this.task.startDate=formatDate(this.today,'yyyy-MM-dd','en');
      this.task.endDate=formatDate(this.tomorrow,'yyyy-MM-dd','en');   
    }
  }
  clearForm(){
    this.logger.logToConsole("Inside Add Task Component - clearForm()");
    this.addTaskForm.resetForm();
    //this.isParentTask=false;
    this.task.parent=false;
    this.task.priority=15;
    
    this.task.startDate=this.stDate;
    this.task.endDate=this.eDate;  
    this.logger.logToConsole(this.task.startDate+" , "+this.task.endDate);
    this.task.project=this.project;
  }
  isDisabled(){
    if(this.task.parent==true){
     if(!this.addTaskForm.controls.prjtName.valid || !this.addTaskForm.controls.taskname.valid || !this.addTaskForm.controls.userName.valid){
       return true;
     }else{
       return false;
     }
    }else{
        this.logger.logToConsole(this.addTaskForm);
        if(!this.addTaskForm.controls.prjtName.valid || !this.addTaskForm.controls.taskname.valid || !this.addTaskForm.controls.userName.valid || !this.addTaskForm.controls.startDate.valid || !this.addTaskForm.controls.endDate.valid){
          return true;  
        }else{
          return false;
        }        
    }
  }

  onSubmit(){
    this.logger.logToConsole('Inside Add Task Component - onSubmit()');
    this.logger.logToConsole(this.task.parent);
    this.taskService.addTask(this.task)
    .subscribe(
      (response:Response) => {
        this.logger.logToConsole(response.json());        
        alert("Task Added Successfully...!!");
        this.clearForm();
        console.log(this.addTaskForm);
      },
      (error) => {
        this.logger.logToConsole(error);
        alert("Task Could Not Be Added Now. Please Try Again Later...!!");
      }
    );
  }


}
