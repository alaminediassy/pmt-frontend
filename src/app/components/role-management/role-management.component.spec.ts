import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleManagementComponent } from './role-management.component';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RoleManagementComponent', () => {
  let component: RoleManagementComponent;
  let fixture: ComponentFixture<RoleManagementComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['assignRoleToMember']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [RoleManagementComponent],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore les erreurs de template
    }).compileComponents();

    fixture = TestBed.createComponent(RoleManagementComponent);
    component = fixture.componentInstance;
    projectService = TestBed.inject(ProjectService) as jasmine.SpyObj<ProjectService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close event when closePanel is called', () => {
    spyOn(component.close, 'emit');
    component.closePanel();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should update modifiedRoles on role change', () => {
    const mockEvent = { target: { value: 'Admin' } } as unknown as Event;
    component.updateRole(1, mockEvent);
    expect(component.modifiedRoles[1]).toEqual('Admin');
  });

  it('should save changes and emit rolesUpdated on success', () => {
    component.project = { id: 1 };
    component.modifiedRoles = { 1: 'Admin' };

    projectService.assignRoleToMember.and.returnValue(of({ message: 'Rôle mis à jour pour le membre 1' }));
    spyOn(component.rolesUpdated, 'emit');
    spyOn(component.close, 'emit');

    component.saveChanges();

    expect(projectService.assignRoleToMember).toHaveBeenCalledWith(1, 1, 'Admin');
    expect(toastr.success).toHaveBeenCalledWith('Rôle mis à jour pour le membre 1');
    expect(component.rolesUpdated.emit).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should handle HttpErrorResponse and display an error message', () => {
    component.project = { id: 1 };
    component.modifiedRoles = { 1: 'Admin' };

    const errorResponse = new HttpErrorResponse({
      error: { message: 'Erreur lors de la mise à jour du rôle' },
      status: 400
    });
    projectService.assignRoleToMember.and.returnValue(throwError(() => errorResponse));

    component.saveChanges();

    expect(projectService.assignRoleToMember).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Erreur lors de la mise à jour du rôle');
  });

  it('should handle unknown error and display a generic error message', () => {
    component.project = { id: 1 };
    component.modifiedRoles = { 1: 'Admin' };

    projectService.assignRoleToMember.and.returnValue(throwError(() => new Error('Unknown error')));

    component.saveChanges();

    expect(projectService.assignRoleToMember).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith('Erreur inconnue lors de la mise à jour');
  });
});
