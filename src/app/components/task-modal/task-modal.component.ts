  import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
  import { FormGroup, FormBuilder, Validators } from '@angular/forms';
  import { ProjectService } from '../../services/project.service';
  import { AuthService } from '../../services/auth.service';
  import { ToastrService } from 'ngx-toastr';

  @Component({
    selector: 'app-task-modal',
    templateUrl: './task-modal.component.html',
    styleUrls: ['./task-modal.component.scss']
  })
  export class TaskModalComponent implements OnInit {
    @Input() isModalOpen: boolean = false;
    @Output() closeModal = new EventEmitter<void>();
    @Output() taskCreated = new EventEmitter<void>();
    taskForm!: FormGroup;
    projects: any[] = [];
    selectedProjectId: number | null = null;
    userId: number | null = null;  

    constructor(
      private fb: FormBuilder, 
      private projectService: ProjectService, 
      private authService: AuthService,
      private toastr: ToastrService
    ) {}

    /**
     * Lifecycle hook for component initialization
     * Sets up the form structure and loads user projects if authenticated
     */
    ngOnInit(): void {
      this.taskForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        dueDate: ['', Validators.required],
        priority: ['', Validators.required],
        projectId: ['', Validators.required]
      });

      // Check if user is authenticated and fetch their user ID
      const userInfo = this.authService.getUserInfo();
      if (userInfo && userInfo.userId) {
        this.userId = userInfo.userId;
        this.loadUserProjects();
      } else {
        console.error('Utilisateur non authentifié ou informations utilisateur manquantes');
      }
    }

    /**
     * Fetches the list of projects for the authenticated user
     * Displays an error message if the retrieval fails
     */
    loadUserProjects() {
      if (this.userId) {
        this.projectService.getProjectsByUserId(this.userId).subscribe({
          next: (projects) => {
            this.projects = projects;
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des projets:', error);
            this.toastr.error('Erreur lors du chargement des projets');
          }
        });
      }
    }

    /**
     * Handles the form submission for creating a new task
     * Validates the form, constructs task data, and calls the service to create the task
     * Emits events on successful creation or displays an error message if creation fails
     */
    onSubmit() {
      if (this.taskForm.valid && this.userId) {
        const formValues = this.taskForm.value;
        const taskData = {
          name: formValues.name,
          description: formValues.description,
          dueDate: formValues.dueDate,
          priority: formValues.priority,
          projectId: formValues.projectId
        };

        // Call service to create the task
        this.projectService.createTask(taskData, this.userId).subscribe({
          next: () => {
            this.toastr.success('Tâche créée avec succès !');
            this.taskCreated.emit();
            this.closeModal.emit(); 
          },
          error: (error) => {
            console.error('Erreur lors de la création de la tâche:', error);
            this.toastr.error('Erreur lors de la création de la tâche.');
          }
        });
      } else {
        this.toastr.warning('Formulaire invalide ou utilisateur non authentifié');
      }
    }

    /**
     * Closes the task modal and emits the close event
     */
    close() {
      this.closeModal.emit();
    }
  }
