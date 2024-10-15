import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})

export class ProjectListComponent implements OnInit {
  projects: any[] = [];

  constructor(private projectService: ProjectService, private authService: AuthService) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.userId) {
      this.projectService.getProjectsByUserId(userInfo.userId).subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des projets:', error);
        }
      });
    }
  }
}
