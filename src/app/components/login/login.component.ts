import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../shared/services/employee.service';
import { NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../shared/models/employee';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private employeeService = inject(EmployeeService)
  idNumber: string = '';
  employee: Employee = { name: '', idNumber: '', roleId: 0, managerId: 0 };

  constructor(private router: Router) { }

  onSubmit() {
    if (this.idNumber && this.idNumber.length === 8) {
      this.idNumber = '0' + this.idNumber;
    }
    this.employee.idNumber = this.idNumber
    this.employeeService.login(this.employee)
      .subscribe({
        next: (x) => {
          this.employeeService.token = x.toString();
          this.router.navigate(['/home']);
        },
        error: () => {
          return alert('The employee is not exist');
        }
      });
    this.employeeService.getEmployeeByNumberId(this.idNumber)
      .subscribe({
        next: (employee: Employee) => {
          const employeeDetails = {
            id: employee.id,
            role: employee.employeeRoles?.code
          };

          sessionStorage.setItem('employeeDetails', JSON.stringify(employeeDetails));
        },
        error: () => {
          return alert('failed');
        }
      });

  }
}
