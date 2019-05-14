import { Component, OnInit } from '@angular/core';

import {LoggerService} from './../service/logger.service';
import {ProjectService} from './../service/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  private isAddRequest:boolean=true;
  constructor(private logger:LoggerService,private projectService:ProjectService) { }

  ngOnInit() {
    this.isAddRequest=this.projectService.AddRequest;
  }

  typeOfRequest(value:boolean){
    this.isAddRequest=value;
  }

}
