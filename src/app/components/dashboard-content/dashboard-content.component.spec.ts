import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardContentComponent } from './dashboard-content.component';

describe('DashboardContentComponent', () => {
  let component: DashboardContentComponent;
  let fixture: ComponentFixture<DashboardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardContentComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
