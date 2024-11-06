import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BreadcrumbComponent } from './breadcrumb.component';
import { By } from '@angular/platform-browser';


describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render breadcrumb items correctly', () => {
    // Simuler des données de breadcrumb
    component.breadcrumbs = [
      { label: 'Home', url: '/' },
      { label: 'Projects', url: '/projects' },
      { label: 'Current Project' }
    ];

    fixture.detectChanges();

    // Vérifier que chaque élément de breadcrumb est affiché
    const breadcrumbElements = fixture.debugElement.queryAll(By.css('.breadcrumb-item'));
    expect(breadcrumbElements.length).toBe(3);

    // Vérifier le premier élément avec URL
    const firstItem = breadcrumbElements[0].nativeElement;
    expect(firstItem.textContent.trim()).toBe('Home');
    expect(firstItem.querySelector('a').getAttribute('href')).toBe('/');

    // Vérifier le deuxième élément avec URL
    const secondItem = breadcrumbElements[1].nativeElement;
    expect(secondItem.textContent.trim()).toBe('Projects');
    expect(secondItem.querySelector('a').getAttribute('href')).toBe('/projects');

    // Vérifier le dernier élément sans URL
    const lastItem = breadcrumbElements[2].nativeElement;
    expect(lastItem.textContent.trim()).toBe('Current Project');
    expect(lastItem.querySelector('a')).toBeNull();
  });

  it('should handle empty breadcrumb array without errors', () => {
    component.breadcrumbs = [];
    fixture.detectChanges();

    const breadcrumbElements = fixture.debugElement.queryAll(By.css('.breadcrumb-item'));
    expect(breadcrumbElements.length).toBe(0);
  });
});