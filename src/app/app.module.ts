import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { InviteMemberComponent } from './components/invite-member/invite-member.component';
import { TestPanelComponent } from './test-panel/test-panel.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { TaskListComponent } from './task-list/task-list.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DashboardContentComponent } from './components/dashboard-content/dashboard-content.component';
import { DndModule } from 'ngx-drag-drop';
import { AssignTaskModalComponent } from './components/assign-task-modal/assign-task-modal.component';
import { EditTaskModalComponent } from './components/edit-task-modal/edit-task-modal.component';
import { TaskHistoryComponent } from './task-history/task-history.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    ProjectListComponent,
    ProjectModalComponent,
    InviteMemberComponent,
    TestPanelComponent,
    RoleManagementComponent,
    TaskModalComponent,
    TaskListComponent,
    BreadcrumbComponent,
    DashboardContentComponent,
    AssignTaskModalComponent,
    EditTaskModalComponent,
    TaskHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    DndModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
