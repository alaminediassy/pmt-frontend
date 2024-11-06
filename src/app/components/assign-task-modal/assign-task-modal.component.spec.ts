import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AssignTaskModalComponent } from './assign-task-modal.component';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

describe('AssignTaskModalComponent', () => {
  let component: AssignTaskModalComponent;
  let fixture: ComponentFixture<AssignTaskModalComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjectMembers', 'assignTaskToMember']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo']);

    await TestBed.configureTestingModule({
      declarations: [AssignTaskModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignTaskModalComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should load project members when selectedProject changes', () => {
      const mockMembers = [{ id: 1, name: 'Member 1' }, { id: 2, name: 'Member 2' }];
      projectService.getProjectMembers.and.returnValue(of(mockMembers));

      component.selectedProject = { id: 1 };
      component.ngOnChanges({
        selectedProject: {
          currentValue: component.selectedProject,
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true
        }
      });

      expect(projectService.getProjectMembers).toHaveBeenCalledWith(1);
      expect(component.members).toEqual(mockMembers);
    });
  });

  describe('assignTask', () => {
    it('should assign task to selected member and emit events on success', () => {
      const mockUserInfo = { userId: 1, username: 'testUser' };
      authService.getUserInfo.and.returnValue(mockUserInfo);
      projectService.assignTaskToMember.and.returnValue(of({}));

      spyOn(component.taskAssigned, 'emit');
      spyOn(component.closeModal, 'emit');

      component.selectedProject = { id: 1 };
      component.selectedTask = { id: 2 };
      component.selectedMemberId = 3;

      component.assignTask();

      expect(projectService.assignTaskToMember).toHaveBeenCalledWith(1, 2, 3, 1);
      expect(component.taskAssigned.emit).toHaveBeenCalled();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    it('should log an error if user is not authenticated', () => {
      authService.getUserInfo.and.returnValue(null);
      spyOn(console, 'error');

      component.assignTask();

      expect(console.error).toHaveBeenCalledWith("Utilisateur non authentifié");
      expect(projectService.assignTaskToMember).not.toHaveBeenCalled();
    });

    it('should log an error if assignTaskToMember fails', () => {
      const mockUserInfo = { userId: 1, username: 'testUser' };
      authService.getUserInfo.and.returnValue(mockUserInfo);
      projectService.assignTaskToMember.and.returnValue(throwError(() => new Error('Erreur lors de l\'assignation')));

      spyOn(console, 'error');

      component.selectedProject = { id: 1 };
      component.selectedTask = { id: 2 };
      component.selectedMemberId = 3;

      component.assignTask();

      expect(console.error).toHaveBeenCalledWith('Erreur lors de l\'assignation de la tâche :', jasmine.any(Error));
    });
  });

  it('should emit closeModal event when close is called', () => {
    spyOn(component.closeModal, 'emit');
    component.close();
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
});
