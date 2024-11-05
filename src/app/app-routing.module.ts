import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import { ProjectListComponent } from './project-list/project-list.component';
import { TaskListComponent } from './task-list/task-list.component';
import { AuthGuard } from './auth.guard';
import { TaskHistoryComponent } from './task-history/task-history.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectListComponent },

  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canMatch: [AuthGuard], 
    children: [
      { path: 'projects', component: ProjectListComponent },
      { path: 'tasks', component: TaskListComponent },
      { path: 'history', component: TaskHistoryComponent },
    ] 
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
