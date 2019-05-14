import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Http,Response,Headers } from '@angular/http';

import { Project } from './../shared/project';
import { User } from './../shared/user';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private isAddRequest:boolean=true;

  headers=new Headers({'Content-Type':'application/json'});

  editProjectDetails = new BehaviorSubject({});
  projectData = new BehaviorSubject({});
  constructor(private http:Http) { }

  public get AddRequest(){
    return this.isAddRequest;
  }
  public set AddRequest(val){
    this.isAddRequest=val;
  }

  getProjects(){
    return this.http.get('http://localhost:8085/projects/',{headers:this.headers});
  }
  addProject(project:Project){
    return this.http.post('http://localhost:8085/projects/',project,{headers:this.headers});
  }
  updateProject(project:Project){
    return this.http.put('http://localhost:8085/projects/',project,{headers:this.headers});
  }
  
}
