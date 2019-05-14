import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Http,Response,Headers } from '@angular/http';
import { Project } from './../shared/project';
import { User } from './../shared/user';
import { Task } from './../shared/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  editTaskDetails = new BehaviorSubject({});
  headers=new Headers({'Content-Type':'application/json'});
  constructor(private http:Http) { }

  getTasks(){
    return this.http.get('http://localhost:8085/tasks/',{headers:this.headers});
  }
  addTask(task:Task){
    return this.http.post('http://localhost:8085/tasks/',task,{headers:this.headers});
  }
  updateTask(task:Task){
    return this.http.put('http://localhost:8085/tasks/',task,{headers:this.headers});
  }
}
