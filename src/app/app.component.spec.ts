import { TestBed, async } from '@angular/core/testing';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { ViewUserComponent } from './user/view-user/view-user.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { UserSearchPipe } from './pipe/user-search.pipe';
import { ProjectComponent } from './project/project.component';
import { AddProjectComponent } from './project/add-project/add-project.component';
import { ViewProjectComponent } from './project/view-project/view-project.component';
import { UpdateProjectComponent } from './project/update-project/update-project.component';
import { ProjectSearchPipe } from './pipe/project-search.pipe';
import { TaskComponent } from './task/task.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { ViewTaskComponent } from './task/view-task/view-task.component';
import { UpdateTaskComponent } from './task/update-task/update-task.component';
import { TaskSearchPipe } from './pipe/task-search.pipe';
import { DateValidator } from './shared/customDateValidator';



fdescribe('AppComponent', () => {

  const appRoutes:Routes=[
    {path:'userDetails', component: UserComponent},
    {path:'projectDetails', component: ProjectComponent},
    {path:'addTask', component:AddTaskComponent},
    {path:'viewTask', component:ViewTaskComponent},
    {path:'updateTask', component:UpdateTaskComponent}
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        UserComponent,
        AddUserComponent,
        ViewUserComponent,
        UpdateUserComponent,
        UserSearchPipe,
        ProjectComponent,
        AddProjectComponent,
        ViewProjectComponent,
        UpdateProjectComponent,
        ProjectSearchPipe,
        TaskComponent,
        AddTaskComponent,
        ViewTaskComponent,
        UpdateTaskComponent,
        TaskSearchPipe,
        DateValidator
      ],
      imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes) ,
        HttpModule
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue : '/' }
      ] 
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'Project Manager'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Project Manager');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Project Manager..!');
  }));
});
