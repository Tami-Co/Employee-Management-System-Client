import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorEmployeesComponent } from './contractor-employees.component';

describe('ContractorEmployeesComponent', () => {
  let component: ContractorEmployeesComponent;
  let fixture: ComponentFixture<ContractorEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorEmployeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
