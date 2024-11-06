import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EditTaskModalComponent } from './edit-task-modal.component';
import { TaskService } from '../../services/task.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EditTaskModalComponent', () => {
  let component: EditTaskModalComponent;
  let fixture: ComponentFixture<EditTaskModalComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['updateTask']);

    await TestBed.configureTestingModule({
      declarations: [EditTaskModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditTaskModalComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.taskForm).toBeDefined();
    expect(component.taskForm.get('name')?.valid).toBeFalse();
    expect(component.taskForm.get('dueDate')?.valid).toBeFalse();
  });

  it('should prefill the form when selectedTask changes', () => {
    const mockTask = {
      name: 'Test Task',
      description: 'Test Description',
      dueDate: '2023-12-31',
      completionDate: '2023-12-30',
      priority: 'High'
    };
    component.selectedTask = mockTask;

    component.ngOnChanges({
      selectedTask: {
        currentValue: mockTask,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component.taskForm.get('name')?.value).toBe(mockTask.name);
    expect(component.taskForm.get('dueDate')?.value).toBe(mockTask.dueDate);
    expect(component.taskForm.get('priority')?.value).toBe(mockTask.priority);
  });

  it('should emit taskUpdated and closeModal events on successful form submission', () => {
    const mockTask = { id: 1, name: 'Test Task' };
    const mockProject = { id: 1 };
    component.selectedTask = mockTask;
    component.selectedProject = mockProject;

    component.taskForm.setValue({
      name: 'Updated Task',
      description: 'Updated Description',
      dueDate: '2023-12-31',
      completionDate: '2023-12-30',
      priority: 'Medium'
    });

    taskService.updateTask.and.returnValue(of({}));
    spyOn(component.taskUpdated, 'emit');
    spyOn(component.closeModal, 'emit');

    component.onSubmit();

    expect(taskService.updateTask).toHaveBeenCalledWith(1, 1, jasmine.any(Object));
    expect(component.taskUpdated.emit).toHaveBeenCalled();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should display an error message on update failure', () => {
    const mockTask = { id: 1, name: 'Test Task' };
    const mockProject = { id: 1 };
    component.selectedTask = mockTask;
    component.selectedProject = mockProject;

    component.taskForm.setValue({
      name: 'Updated Task',
      description: 'Updated Description',
      dueDate: '2023-12-31',
      completionDate: '2023-12-30',
      priority: 'Medium'
    });

    taskService.updateTask.and.returnValue(throwError(() => new Error('Update failed')));
    spyOn(console, 'error');

    component.onSubmit();

    expect(taskService.updateTask).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error updating task:', jasmine.any(Error));
    expect(component.submissionError).toBe('An error occurred while updating the task. Please try again.');
  });

  it('should emit closeModal when close is called', () => {
    spyOn(component.closeModal, 'emit');

    component.close();

    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
