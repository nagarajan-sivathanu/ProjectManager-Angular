import { Component, OnInit, Output,Input, EventEmitter } from '@angular/core';
import { DatePipe,formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Http,Response } from '@angular/http';
import * as _ from 'lodash';

import {User} from './../../shared/user';
import {Project} from './../../shared/project';
import {Task} from './../../shared/task';
import {TaskService} from './../../service/task.service';
import {UserService} from './../../service/user.service';
import {ProjectService} from './../../service/project.service';
import {LoggerService} from './../../service/logger.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.css']
})
export class ViewProjectComponent implements OnInit {
  private user:User;
  private modProject:Project;
  private project:Project;
  private pipe:DatePipe;
  private totalNoOfTasks:number=0;
  private completedTasks:number=0;
  private projects:Project[];
  private filteredProjects:Project[];
  private sortedProjects:Project[];
  private searchText:string=null;
  private task:Task;
  private tasks:Task[];
  private filteredTasks:Task[];
  private pjtTaskMap:Map<Project,number> = new Map<Project,number>();
  private sortingOrder:Set<number>=new Set<number>();
  private sortedPjtTaskMap:Map<Project,number> = new Map<Project,number>();
  //private keys : number[] = [];
  private keys:IterableIterator<number>=null;

  @Output() addRequest = new EventEmitter<boolean>();
  constructor(private logger:LoggerService,private userService:UserService,
              private projectService:ProjectService, private taskService:TaskService) { 
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
      startDate:'',
      endDate:'',
      status:'A',
      priority:15,
      user:this.user,
      project:this.project      
    }   
  }

  ngOnInit() {
    this.logger.logToConsole('Inside view projects - ngOnInit()');
    this.getProjects();
    this.getTasks();
    this.pipe = new DatePipe('en');
    this.projectService.projectData.subscribe((newProject:Project ) => {
      if(newProject && this.projects){
        this.project = newProject;
        this.pushToArray();
        this.filteredProjects=_.clone(this.projects);
        this.logger.logToConsole('After Add/Update : '+this.projects.length);
      }
    });
  }
  pushToArray() {
    const index = this.projects.findIndex((e) => e.projectID === this.project.projectID);

    if (index === -1) {
      this.projects.push(this.project);
    } else {
      this.projects[index] = this.project;
    }
  }
  getProjects():void{
    this.logger.logToConsole('Inside view projects - getProjects()');   
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
  onUpdate(project:Project){
    this.logger.logToConsole('Inside view projects - onUpdate()');
    this.modProject=_.clone(project);
    this.projectService.editProjectDetails.next(this.modProject);
    this.addRequest.emit(false);
  }
  onSuspend(project:Project){
    this.logger.logToConsole('Inside view projects - onSuspend()');
    this.modProject=_.clone(project);
    this.modProject.status='I';
    this.projectService.updateProject(this.modProject)
    .subscribe(
      (response:Response) => {
        this.logger.logToConsole(response.json());
        this.projectService.projectData.next(response.json());
        alert("Project Suspended Successfully...!!");
        this.addRequest.emit(true);
      },
      (error) => {
        this.logger.logToConsole(error);
        alert("User Could Not Be Update Now. Please Try Again Later...!!");
      }
    );
  }
  onSortByStartDate(){
    this.logger.logToConsole('Inside view projects - onSortByStartDate()');
    this.filteredProjects=_.sortBy(this.filteredProjects,[function(o){return o.startDate}]); 
  }
  onSortByEndDate(){
    this.logger.logToConsole('Inside view projects - onSortByEndDate()');
    this.filteredProjects=_.sortBy(this.filteredProjects,[function(o){return o.endDate}]); 
  }
  onSortByPriority(){
    this.logger.logToConsole('Inside view projects - onSortByPriority()');
    this.filteredProjects=_.sortBy(this.filteredProjects,[function(o){return o.priority}]); 
  }
  onSortByCompleted(){
    this.logger.logToConsole('Inside view projects - onSortByCompleted()');
    this.filteredProjects=[];
    for(let item of Array.from(this.pjtTaskMap.entries()).sort()){
      this.filteredProjects.push(item[0]);
    }
  }
  isActive(project:Project){
    if(project.status==='A'){
      return false;
    }else{
      return true;
    }    
  }
  getNoOfTasks(project:Project,identifier:string){
    this.filteredTasks=_.filter(this.tasks, function(o){
      if(project!=null && o!=null){
          if(o.project.projectName==project.projectName){
            return o;
          }
      }
    });
    this.totalNoOfTasks=this.filteredTasks.length;
    this.filteredTasks=_.filter(this.filteredTasks, function(o){
      if(o!=null && o.status=='I'){
        return o;
      }
    });
    this.completedTasks=this.filteredTasks.length;
    this.pjtTaskMap.set(project,this.completedTasks);
    this.sortingOrder.add(this.filteredTasks.length);
    if(identifier=='total'){
      return this.totalNoOfTasks;
    }else if (identifier=='completed'){
      return this.completedTasks;
    }
  }

}
