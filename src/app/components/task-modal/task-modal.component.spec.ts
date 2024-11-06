import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskModalComponent } from './task-modal.component';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TaskModalComponent', () => {
  let component: TaskModalComponent;
  let fixture: ComponentFixture<TaskModalComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let authService: jasmine.SpyObj<AuthService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjectsByUserId', 'createTask']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      declarations: [TaskModalComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskModalComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and set user ID on ngOnInit', () => {
    const mockUserInfo = { userId: 1, username: 'testUser' };
    authService.getUserInfo.and.returnValue(mockUserInfo);
    spyOn(component, 'loadUserProjects');

    component.ngOnInit();

    expect(component.userId).toEqual(1);
    expect(component.taskForm).toBeDefined();
    expect(component.loadUserProjects).toHaveBeenCalled();
  });

  it('should load projects of the authenticated user', () => {
    const mockProjects = [{ id: 1, name: 'Project 1' }];
    component.userId = 1;
    projectService.getProjectsByUserId.and.returnValue(of(mockProjects));

    component.loadUserProjects();

    expect(component.projects).toEqual(mockProjects);
  });

  it('should handle error when loading projects fails', () => {
    component.userId = 1;
    projectService.getProjectsByUserId.and.returnValue(throwError('Error loading projects'));

    component.loadUserProjects();

    expect(toastr.error).toHaveBeenCalledWith('Erreur lors du chargement des projets');
  });

  it('should submit the form and create a task on valid form', () => {
    const mockTaskData = {
      name: 'Task Name',
      description: 'Task Description',
      dueDate: '2023-10-10',
      priority: 'High',
      projectId: 1
    };
    const mockUserId = 1;
    component.userId = mockUserId;
    component.taskForm.setValue(mockTaskData);

    projectService.createTask.and.returnValue(of({}));
    spyOn(component.taskCreated, 'emit');
    spyOn(component.closeModal, 'emit');

    component.onSubmit();

    expect(projectService.createTask).toHaveBeenCalledWith(mockTaskData, mockUserId);
    expect(toastr.success).toHaveBeenCalledWith('Tâche créée avec succès !');
    expect(component.taskCreated.emit).toHaveBeenCalled();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should show warning when form is invalid on submit', () => {
    component.taskForm.patchValue({ name: '', description: '', dueDate: '', priority: '', projectId: '' });

    component.onSubmit();

    expect(toastr.warning).toHaveBeenCalledWith('Formulaire invalide ou utilisateur non authentifié');
    expect(projectService.createTask).not.toHaveBeenCalled();
  });

  it('should handle error when creating a task fails', () => {
    const mockTaskData = {
      name: 'Task Name',
      description: 'Task Description',
      dueDate: '2023-10-10',
      priority: 'High',
      projectId: 1
    };
    component.userId = 1;
    component.taskForm.setValue(mockTaskData);

    projectService.createTask.and.returnValue(throwError('Error creating task'));

    component.onSubmit();

    expect(toastr.error).toHaveBeenCalledWith('Erreur lors de la création de la tâche.');
  });

  it('should emit closeModal when close is called', () => {
    spyOn(component.closeModal, 'emit');
    component.close();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
