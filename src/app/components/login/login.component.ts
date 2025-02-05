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
  name: string = '';
  idNumber: string = '';
  employee: Employee = { name: '', idNumber: '', roleId: 0, managerId: 0 };

  constructor(private router: Router) { }

  onSubmit() {
    if (this.idNumber && this.idNumber.length === 8) {
      this.idNumber = '0' + this.idNumber;
    }

    this.employeeService.getEmployeeByIdNumber(this.idNumber)
      .subscribe({
        next: (data: Employee) => {
          this.employee = data;

        },
        error: () => {
          return alert('The employee is not exist')
        }
      });

    sessionStorage.setItem('userName', this.name);
    sessionStorage.setItem('userIdNumber', this.idNumber);

    this.router.navigate(['/home']);


  }
}
