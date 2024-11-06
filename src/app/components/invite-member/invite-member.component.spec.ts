import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InviteMemberComponent } from './invite-member.component';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('InviteMemberComponent', () => {
  let component: InviteMemberComponent;
  let fixture: ComponentFixture<InviteMemberComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let toastr: ToastrService;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserInfo']);
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['inviteMemberToProject']);

    await TestBed.configureTestingModule({
      declarations: [InviteMemberComponent],
      imports: [ToastrModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProjectService, useValue: projectServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteMemberComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    toastr = TestBed.inject(ToastrService);

    component.selectedProjectId = 1; // Simule un ID de projet pour les tests
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an error if email or projectId is missing', () => {
    spyOn(toastr, 'error'); // Espionne l'appel à toastr.error
    component.email = '';
    component.onSubmit();
    expect(toastr.error).toHaveBeenCalledWith('Veuillez remplir tous les champs', 'Erreur');
  });

  it('should call projectService.inviteMemberToProject if email and projectId are provided', () => {
    const mockUserInfo = { userId: 1, username: 'testUser' };
    authService.getUserInfo.and.returnValue(mockUserInfo);
    projectService.inviteMemberToProject.and.returnValue(of({ message: 'Invitation envoyée' }));
    spyOn(toastr, 'success');
    component.email = 'test@example.com';
    component.onSubmit();
    expect(projectService.inviteMemberToProject).toHaveBeenCalledWith(1, 1, 'test@example.com');
    expect(toastr.success).toHaveBeenCalledWith('Invitation envoyée avec succès', 'Succès');
  });

  it('should handle error when inviteMemberToProject fails', () => {
    const mockUserInfo = { userId: 1, username: 'testUser' };
    authService.getUserInfo.and.returnValue(mockUserInfo);
    projectService.inviteMemberToProject.and.returnValue(throwError(() => new Error('Erreur d\'invitation')));
    spyOn(toastr, 'error');
    component.email = 'test@example.com';
    component.onSubmit();
    expect(toastr.error).toHaveBeenCalledWith('Erreur lors de l\'invitation du membre', 'Erreur');
  });
});
