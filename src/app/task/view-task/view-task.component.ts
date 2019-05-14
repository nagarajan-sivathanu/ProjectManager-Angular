import { Component, OnInit,ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
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
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  private projectName:string='';
  private searchText:string='';
  private displayPrjModal:string='none';
  private selectedProject:Project;
  private projects:Project[];
  private filteredProjects:Project[];
  private tasks:Task[];
  private filteredTasks:Task[];

  constructor(private modalService: NgbModal,private logger:LoggerService,
    private userService:UserService,private projectService:ProjectService,
    private taskService:TaskService,private router:Router) { }

  ngOnInit() {
    this.getProjects();
    this.getTasks();
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
  openPrjModal(){
    this.logger.logToConsole("inside openPrjModal()");
    this.displayPrjModal='block';
  }
  closePrjModal(){
    this.logger.logToConsole("inside closePrjModal()");
     this.displayPrjModal='none'; 
  }
  onSelectProject(project:Project){
    this.projectName=project.projectName;
    this.logger.logToConsole(this.filteredTasks);
    this.filteredTasks=_.filter(this.tasks, function(o){
      if(project!=null && o!=null){
          if(o.project.projectID==project.projectID && o.parent==false){
            return o;
          }
      }
    });
    this.logger.logToConsole('Validate :'+this.filteredTasks);
    this.closePrjModal();
  }
  onSortByStartDate(){
    this.logger.logToConsole('Inside View Task Component - onSortByStartDate()');
    this.filteredTasks=_.sortBy(this.filteredTasks,[function(o){return o.startDate}]); 
  }
  onSortByEndDate(){
    this.logger.logToConsole('Inside View Task Component - onSortByEndDate()');
    this.filteredTasks=_.sortBy(this.filteredTasks,[function(o){return o.endDate}]);
  }
  onSortByPriority(){
    this.logger.logToConsole('Inside View Task onSortByPriority()');
    this.filteredTasks=_.sortBy(this.filteredTasks,[function(o){return o.priority}]);
  }
  onSortByCompleted(){
    this.logger.logToConsole('Inside View Task onSortByCompleted()');
    this.filteredTasks=_.orderBy(this.filteredTasks,[function(o){return o.status}],'desc');
  }
  onEdit(task:Task):void{
    this.logger.logToConsole('Inside View Task Component - onEdit()');
    this.logger.logToConsole(task);
    task.startDate=formatDate(task.startDate,'yyyy-MM-dd','en');
    task.endDate=formatDate(task.endDate,'yyyy-MM-dd','en');
    this.taskService.editTaskDetails.next(task);
    this.router.navigate(['/updateTask']);
  }
  onEnd(task:Task):void{
    this.logger.logToConsole('Inside View Task Component - onEnd()');
    task.status='I';
    task.startDate=formatDate(task.startDate,'yyyy-MM-dd','en');
    task.endDate=formatDate(task.endDate,'yyyy-MM-dd','en');
    this.taskService.updateTask(task)
    .subscribe(
      (response:Response) => {
        this.logger.logToConsole(response);
        alert("Task Ended Successfully...!!");
      },
      (error) => {
        this.logger.logToConsole(error);
        alert("Task Could Not Be Updated Now. Please Try Again Later...!!");
      }
    );
  }
  isActive(currentTask:Task){
    if(currentTask.status==='A'){
      return false;
    }else{
      return true;
    }    
  }

}
