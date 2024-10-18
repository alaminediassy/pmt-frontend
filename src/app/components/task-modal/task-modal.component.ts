import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';  // Pour afficher les notifications

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnInit {
  @Input() isModalOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  taskForm!: FormGroup;
  projects: any[] = [];
  selectedProjectId: number | null = null;
  userId: number | null = null;  // Stockage de l'ID utilisateur

  constructor(
    private fb: FormBuilder, 
    private projectService: ProjectService, 
    private authService: AuthService,
    private toastr: ToastrService  // Injecter le service Toastr pour les notifications
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      projectId: ['', Validators.required]
    });

    // Vérification de l'authentification de l'utilisateur
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.userId) {
      this.userId = userInfo.userId;  // Assigner l'ID utilisateur
      this.loadUserProjects();  // Charger les projets de l'utilisateur
    } else {
      console.error('Utilisateur non authentifié ou informations utilisateur manquantes');
    }
  }

  // Charger les projets de l'utilisateur connecté
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

  // Méthode appelée lors de la soumission du formulaire
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

      // Appel pour créer la tâche
      this.projectService.createTask(taskData, this.userId).subscribe({
        next: () => {
          this.toastr.success('Tâche créée avec succès !');
          this.closeModal.emit();  // Ferme le modal après la création
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

  // Méthode pour fermer le modal
  close() {
    this.closeModal.emit();
  }
}
