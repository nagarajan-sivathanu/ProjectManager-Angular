import { Component, OnInit } from '@angular/core';

import {UserService} from './../service/user.service';
import {LoggerService} from './../service/logger.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

 private isAddRequest:boolean=true;
 constructor(private logger:LoggerService,private userService:UserService) {
  }

  ngOnInit() {
    this.isAddRequest=this.userService.AddRequest;
  }

  typeOfRequest(value:boolean){
    this.isAddRequest=value;
  }

}
