import {User} from './../shared/user';
import {Project} from './../shared/project';
export class Task{
    taskID:string;
    taskName:string;
    parent:boolean;
    parentTask:Task;
    startDate:string;
    endDate:string;
    status:string;
    priority:number;
    user:User;
    project:Project;
}