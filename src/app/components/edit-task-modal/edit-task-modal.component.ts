import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent implements OnInit, OnChanges {

  @Input() isModalOpen: boolean = false;
  @Input() selectedTask: any = null;         // La tâche sélectionnée à modifier
  @Input() selectedProject: any = null;      // Le projet auquel appartient la tâche
  @Output() closeModal = new EventEmitter<void>();   // Événement pour fermer le modal
  @Output() taskUpdated = new EventEmitter<void>();  // Événement déclenché après la mise à jour de la tâche

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit(): void {
    // Initialisation du formulaire de modification avec les valeurs par défaut
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      completionDate: [''],
      priority: ['', Validators.required]
    });

    console.log("Les valeurs remplies : ", this.taskForm)
  }

  // Cette méthode est appelée lorsque les valeurs des @Input changent
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTask'] && this.selectedTask) {
      console.log('Tâche sélectionnée :', this.selectedTask);
  
      this.taskForm.patchValue({
        name: this.selectedTask.name || '',
        description: this.selectedTask.description || '',
        dueDate: this.selectedTask.dueDate ? this.formatDate(this.selectedTask.dueDate) : '',
        completionDate: this.selectedTask.completionDate ? this.formatDate(this.selectedTask.completionDate) : '',
        priority: this.selectedTask.priority || ''
      });
  
      console.log('Formulaire après patchValue :', this.taskForm.value);
    }
  }
  
  

  // Méthode pour formater la date au format "yyyy-MM-dd" attendu par le champ <input type="date">
  formatDate(date: string): string {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);  // Retourne la date au format "yyyy-MM-dd"
  }

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {
    if (this.taskForm.valid && this.selectedTask) {
      const taskData = this.taskForm.value;

      // Appel du service pour mettre à jour la tâche
      this.taskService.updateTask(this.selectedProject.id, this.selectedTask.id, taskData).subscribe({
        next: () => {
          this.taskUpdated.emit();   // Émettre l'événement de mise à jour
          this.closeModal.emit();    // Fermer le modal après mise à jour
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour de la tâche :', error);
        }
      });
    }
  }

  // Méthode pour fermer le modal
  close(): void {
    this.closeModal.emit();  // Émet l'événement pour informer le parent que le modal doit être fermé
  }
}
