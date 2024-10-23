import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import moment from 'moment';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent implements OnInit, OnChanges {

  @Input() isModalOpen: boolean = false;      // Indicates if the modal is open
  @Input() selectedTask: any = null;          // The selected task to be edited
  @Input() selectedProject: any = null;       // The project to which the task belongs
  @Output() closeModal = new EventEmitter<void>();    // Event to close the modal
  @Output() taskUpdated = new EventEmitter<void>();   // Event emitted after the task is updated

  taskForm!: FormGroup;
  submissionError: string | null = null;      // Variable to store submission error

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit(): void {
    // Initialize the form with default values
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      completionDate: [''],
      priority: ['', Validators.required]
    });
  }

  // ngOnChanges to handle input updates and pre-fill form fields when the task is selected
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedTask'] && this.selectedTask) {
      console.log('Selected task:', this.selectedTask);
  
      // Assure-toi que le formGroup est initialisé
      if (this.taskForm) {
        // Prefill the form with selected task data
        this.taskForm.patchValue({
          name: this.selectedTask.name,
          description: this.selectedTask.description,
          dueDate: this.selectedTask.dueDate,
          completionDate: this.selectedTask.completionDate || '',
          priority: this.selectedTask.priority
        });
      } else {
        console.error('FormGroup taskForm is not initialized yet.');
      }
    }
  }
  

  // Method to format the date for input fields (yyyy-MM-dd)
  formatDateForInput(date: string | null): string | null {
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }

  // Method to handle form submission and task update
  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    // Prepare the updated task data
    const updatedTask = {
      ...this.selectedTask, // Use selectedTask instead of undefined this.task
      ...this.taskForm.value,
      completionDate: this.taskForm.value.completionDate ? moment(this.taskForm.value.completionDate).format('YYYY-MM-DD') : null,
      dueDate: this.taskForm.value.dueDate ? moment(this.taskForm.value.dueDate).format('YYYY-MM-DD') : null
    };

    // Call the service to update the task
    this.taskService.updateTask(this.selectedProject.id, this.selectedTask.id, updatedTask).subscribe({
      next: (response) => {
        this.taskUpdated.emit();  // Emit the update event
        this.closeModal.emit();   // Close the modal after successful update
      },
      error: (err) => {
        console.error('Error updating task:', err);
        this.submissionError = 'An error occurred while updating the task. Please try again.';  // Handle error
      }
    });
  }

  // Method to close the modal
  close(): void {
    this.closeModal.emit();  // Emit the event to notify the parent to close the modal
  }
}
