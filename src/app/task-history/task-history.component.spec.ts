import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskHistoryComponent } from './task-history.component';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { of, throwError } from 'rxjs';

describe('TaskHistoryComponent', () => {
  let component: TaskHistoryComponent;
  let fixture: ComponentFixture<TaskHistoryComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTaskHistory']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserById']);

    await TestBed.configureTestingModule({
      declarations: [TaskHistoryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskHistoryComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    // Initialisation des IDs de projet et de tâche
    component.projectId = 1;
    component.taskId = 1;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load task history on init', () => {
    const mockHistory = [{ changedBy: 1, change: 'Task updated' }];
    taskService.getTaskHistory.and.returnValue(of(mockHistory));  // Mock de getTaskHistory pour retourner un Observable
    spyOn(component, 'fetchUserName');

    component.ngOnInit();  // Appelle la méthode ngOnInit pour charger les données

    expect(taskService.getTaskHistory).toHaveBeenCalledWith(1, 1);
    expect(component.taskHistory).toEqual(mockHistory);
    expect(component.fetchUserName).toHaveBeenCalledWith(1);
  });

  it('should handle error on task history load', () => {
    const errorResponse = new Error('Error fetching task history');
    taskService.getTaskHistory.and.returnValue(throwError(() => errorResponse));  // Simule une erreur
    spyOn(console, 'error');

    component.loadTaskHistory();

    expect(console.error).toHaveBeenCalledWith('Error fetching task history:', errorResponse);
  });

  it('should fetch user name and cache it', () => {
    const userId = 1;
    const mockUser = { username: 'testUser' };
    userService.getUserById.and.returnValue(of(mockUser));  // Mock de getUserById pour retourner un Observable

    component.fetchUserName(userId);

    expect(userService.getUserById).toHaveBeenCalledWith(userId);
    expect(component.userCache[userId]).toEqual('testUser');
  });

  it('should handle error on user fetch and cache as "Utilisateur inconnu"', () => {
    const userId = 2;
    userService.getUserById.and.returnValue(throwError(() => new Error('User not found')));  // Simule une erreur

    component.fetchUserName(userId);

    expect(userService.getUserById).toHaveBeenCalledWith(userId);
    expect(component.userCache[userId]).toEqual('Utilisateur inconnu');
  });

  it('should emit closeHistoryPanel event when closePanel is called', () => {
    spyOn(component.closeHistoryPanel, 'emit');

    component.closePanel();

    expect(component.closeHistoryPanel.emit).toHaveBeenCalled();
  });
});
