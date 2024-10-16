import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPanelComponent } from './test-panel.component';

describe('TestPanelComponent', () => {
  let component: TestPanelComponent;
  let fixture: ComponentFixture<TestPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
