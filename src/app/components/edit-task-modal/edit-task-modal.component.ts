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

  @Input() isModalOpen: boolean = false;
  @Input() selectedTask: any = null;
  @Input() selectedProject: any = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();

  taskForm!: FormGroup;
  submissionError: string | null = null;

  constructor(private fb: FormBuilder, private taskService: TaskService) {}


  /**
   * Lifecycle hook that initializes the reactive form for editing tasks.
   */
  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      completionDate: [''],
      priority: ['', Validators.required]
    });
  }

  
  /**
   * Lifecycle hook that is triggered when any input properties change.
   * Used here to pre-fill the form with the selected task data.
   * @param changes - Object containing changes to input properties.
   */
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
  

  /**
   * Formats a date string for the input field.
   * @param date - Date string to format.
   * @returns Formatted date string in 'YYYY-MM-DD' format.
   */
  formatDateForInput(date: string | null): string | null {
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }


  /**
   * Handles form submission by updating the task data.
   * Calls the TaskService to save changes, then emits events to update
   * the task list and close the modal upon success.
   */
  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const updatedTask = {
      ...this.selectedTask, 
      ...this.taskForm.value,
      completionDate: this.taskForm.value.completionDate ? moment(this.taskForm.value.completionDate).format('YYYY-MM-DD') : null,
      dueDate: this.taskForm.value.dueDate ? moment(this.taskForm.value.dueDate).format('YYYY-MM-DD') : null
    };

    this.taskService.updateTask(this.selectedProject.id, this.selectedTask.id, updatedTask).subscribe({
      next: (response) => {
        this.taskUpdated.emit();  
        this.closeModal.emit();
      },
      error: (err) => {
        console.error('Error updating task:', err);
        this.submissionError = 'An error occurred while updating the task. Please try again.';  // Handle error
      }
    });
  }

  /**
   * Closes the modal by emitting an event to the parent component.
   */
  close(): void {
    this.closeModal.emit();  // Emit the event to notify the parent to close the modal
  }
}
