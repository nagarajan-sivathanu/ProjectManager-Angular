import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  constructor() { }
  logToConsole(logMessage:any){
    console.log(logMessage);
  }
}
