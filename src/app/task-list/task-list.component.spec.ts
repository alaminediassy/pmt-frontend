import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { DndDropEvent } from 'ngx-drag-drop';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasksByUserId', 'updateTaskStatus']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo']);
    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ignorer les composants non reconnus
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('loadTasks', () => {
    it('should load tasks and filter by status', () => {
      const mockTasks = [
        { id: 1, status: 'TODO' },
        { id: 2, status: 'IN_PROGRESS' },
        { id: 3, status: 'COMPLETED' }
      ];
      authService.getUserInfo.and.returnValue({ userId: 1, username: "testUser" });
      taskService.getTasksByUserId.and.returnValue(of(mockTasks));

      component.loadTasks();

      expect(taskService.getTasksByUserId).toHaveBeenCalledWith(1);
      expect(component.tasks).toEqual(mockTasks);
      expect(component.tasksTodo.length).toBe(1);
      expect(component.tasksInProgress.length).toBe(1);
      expect(component.tasksCompleted.length).toBe(1);
    });

    it('should handle error when loading tasks', () => {
      const errorResponse = new Error('Error loading tasks');
      authService.getUserInfo.and.returnValue({ userId: 1, username: "testUser" });
      taskService.getTasksByUserId.and.returnValue(throwError(() => errorResponse));
      spyOn(console, 'error');

      component.loadTasks();

      expect(console.error).toHaveBeenCalledWith('Error while fetching tasks:', errorResponse);
    });
  });

  describe('modal handling', () => {
    it('should open and close the task modal', () => {
      component.openTaskModal();
      expect(component.isTaskModalOpen).toBeTrue();

      component.closeTaskModal();
      expect(component.isTaskModalOpen).toBeFalse();
    });

    it('should open and close the assign task modal', () => {
      const mockTask = { id: 1, project: { id: 1 } };
      component.openAssignTaskModal(mockTask);

      expect(component.isAssignTaskModalOpen).toBeTrue();
      expect(component.selectedTask).toEqual(mockTask);

      component.closeAssignTaskModal();
      expect(component.isAssignTaskModalOpen).toBeFalse();
    });

    it('should open and close the edit task modal', () => {
      const mockTask = { id: 1, project: { id: 1 } };
      component.openEditTaskModal(mockTask);

      expect(component.isEditTaskModalOpen).toBeTrue();
      expect(component.selectedTask).toEqual(mockTask);

      component.closeEditTaskModal();
      expect(component.isEditTaskModalOpen).toBeFalse();
    });
  });

  describe('onTaskDrop', () => {
    it('should update task status on drop', () => {
      const mockTask = { id: 1, project: { id: 1 }, status: 'TODO' };
      const mockEvent = { data: mockTask } as DndDropEvent;
      authService.getUserInfo.and.returnValue({ userId: 1, username: "testUser" });
      taskService.updateTaskStatus.and.returnValue(of({}));

      component.onTaskDrop(mockEvent, 'IN_PROGRESS');

      expect(taskService.updateTaskStatus).toHaveBeenCalledWith(1, 1, 1, 'IN_PROGRESS');
    });

    it('should handle error when updating task status on drop', () => {
      const mockTask = { id: 1, project: { id: 1 }, status: 'TODO' };
      const mockEvent = { data: mockTask } as DndDropEvent;
      const errorResponse = new Error('Error updating task status');
      authService.getUserInfo.and.returnValue({ userId: 1, username: "testUser" });
      taskService.updateTaskStatus.and.returnValue(throwError(() => errorResponse));
      spyOn(console, 'error');

      component.onTaskDrop(mockEvent, 'IN_PROGRESS');

      expect(console.error).toHaveBeenCalledWith('Error while updating task status:', errorResponse);
    });
  });

  describe('open and close task history panel', () => {
    it('should open task history panel with correct task details', () => {
      const mockTask = { id: 1, name: 'Test Task', project: { id: 1 } };

      component.openTaskHistoryPanel(mockTask);

      expect(component.selectedTaskId).toBe(mockTask.id);
      expect(component.selectedTaskName).toBe(mockTask.name);
      expect(component.isHistoryPanelOpen).toBeTrue();
    });

    it('should close task history panel', () => {
      component.isHistoryPanelOpen = true;

      component.closeTaskHistoryPanel();

      expect(component.isHistoryPanelOpen).toBeFalse();
    });
  });
});
