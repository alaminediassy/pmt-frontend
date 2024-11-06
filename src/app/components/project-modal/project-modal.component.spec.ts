import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectModalComponent } from './project-modal.component';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ProjectModalComponent', () => {
  let component: ProjectModalComponent;
  let fixture: ComponentFixture<ProjectModalComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['createProject']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'getUserInfo']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [ProjectModalComponent],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectModalComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when closeModal is called', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should call projectService.createProject and navigate to /dashboard on successful project creation', () => {
    // Arrange
    const mockToken = 'mockToken';
    const mockUserInfo = { userId: 1, username: 'testUser' };
    const mockProjectResponse = { message: 'Projet créé avec succès' };

    authService.getToken.and.returnValue(mockToken);
    authService.getUserInfo.and.returnValue(mockUserInfo);
    projectService.createProject.and.returnValue(of(mockProjectResponse));
    spyOn(component.close, 'emit');

    // Act
    component.projectName = 'Test Project';
    component.projectDescription = 'Description for test project';
    component.projectStartDate = '2024-11-06';
    component.onSubmit();

    // Assert
    expect(projectService.createProject).toHaveBeenCalledWith(
      { name: 'Test Project', description: 'Description for test project', startDate: '2024-11-06' },
      '1',
      'mockToken'
    );
    expect(toastr.success).toHaveBeenCalledWith('Projet créé avec succès', 'Succès');
    expect(component.close.emit).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show an error and navigate to /login if user is not authenticated', () => {
    // Arrange
    authService.getToken.and.returnValue(null);
    authService.getUserInfo.and.returnValue(null);

    // Act
    component.onSubmit();

    // Assert
    expect(toastr.error).toHaveBeenCalledWith('Erreur d\'authentification', 'Erreur');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show an error if project creation fails', () => {
    // Arrange
    const mockToken = 'mockToken';
    const mockUserInfo = { userId: 1, username: 'testUser' };
    const errorResponse = { message: 'Erreur lors de la création du projet' };

    authService.getToken.and.returnValue(mockToken);
    authService.getUserInfo.and.returnValue(mockUserInfo);
    projectService.createProject.and.returnValue(throwError(errorResponse));

    // Act
    component.projectName = 'Test Project';
    component.projectDescription = 'Description for test project';
    component.projectStartDate = '2024-11-06';
    component.onSubmit();

    // Assert
    expect(projectService.createProject).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Erreur lors de la création du projet', 'Erreur');
  });
});
