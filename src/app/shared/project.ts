import {User} from './../shared/user';
export class Project{
    projectID:string;
    projectName:string;
    startDate:string;
    endDate:string;
    status:string;
    //managerID:string;
    priority:number;
    user:User;
}