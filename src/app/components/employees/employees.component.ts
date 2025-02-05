import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../shared/services/employee.service';
import { Employee } from '../../shared/models/employee';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeRolesService } from '../../shared/services/employee-roles.service';
import { EmployeeRoles } from '../../shared/models/employee-roles';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private employeeRolesService = inject(EmployeeRolesService);
  listEmployee: Employee[] = [];
  managersList: Employee[] = [];
  listEmployeeRoles: EmployeeRoles[] = [];
  showAddEmployeeForm = false;
  editingEmployee: Partial<Employee> | null = null;
  idEditingEmployee: string = '';
  showDeleteConfirmation = false;
  employeeIdToDelete: string = '';
  newEmployee: Employee = { name: '', idNumber: '', roleId: 0, managerId: 0 };
  managerRoleId: number = 0;

  ngOnInit(): void {
    this.fetchEmployees();
    this.fetchEmployeeRoles();
  }
  fetchEmployees(): void {
    this.employeeService.getAllActiveEmployees().subscribe({
      next: (data: Employee[]) => {
        this.listEmployee = data;
        this.managersList = data.filter(emp => emp.managerId === null || emp.employeeRoles?.code == 322);
      },
      error: (err) => {
        return alert(`failed ${err}`)
      }
    });
  }
  fetchEmployeeRoles(): void {
    this.employeeRolesService.getEmployeeRoles().subscribe({
      next: (data: EmployeeRoles[]) => {
        this.listEmployeeRoles = data;
        this.managerRoleId = this.listEmployeeRoles?.find(emp => emp.name === 'Manager')?.id || 0;
      },
      error: (err) => {
        return alert(`failed ${err}`)
      }
    });
  }
  toggleAddEmployee(): void {
    this.showAddEmployeeForm = !this.showAddEmployeeForm;
  }
  addNewEmployee(): void {
    const newEmployee: Employee = {
      name: this.newEmployee.name,
      idNumber: this.newEmployee.idNumber,
      roleId: this.newEmployee.roleId,
      managerId: this.newEmployee.managerId,
    };
    if (!this.newEmployee?.roleId) return alert('Invalid RoleId');
    if (!this.newEmployee.name || this.newEmployee.name.length > 100) return alert('Invalid Name');

    const idRegex = /^\d{8,9}$/;
    if (!this.newEmployee.idNumber || !idRegex.test(this.newEmployee.idNumber) || parseInt(this.newEmployee.idNumber, 10) <= 0) return alert('Invalid ID Number');
    this.employeeService.addEmployee(newEmployee).subscribe({
      next: () => {
        this.fetchEmployees();
        this.newEmployee = {
          name: '',
          idNumber: '',
          roleId: 0,
          managerId: 0,
        };
        this.showAddEmployeeForm = false;
        alert('Employee added successfully!');
      },
      error: (err) => {
        console.error('Error adding employee:', err);
        alert('Failed to add employee');
      }
    });

  }
  editEmployee(employee: any): void {
    this.editingEmployee = { ...employee };
    this.idEditingEmployee = employee.id;

  }
  updateEmployee(): void {
    const updatedEmployee: Employee = {
      name: this.editingEmployee?.name ?? '',
      idNumber: this.editingEmployee?.idNumber ?? '',
      roleId: this.editingEmployee?.roleId ?? 0,
      managerId: this.editingEmployee?.managerId ?? undefined,
    };
    if (!updatedEmployee.name || updatedEmployee.name.length > 100) return alert('Invalid Name');
    if (this.managerRoleId == this.editingEmployee?.roleId) {
      updatedEmployee.managerId = undefined;
    }
    else if (this.editingEmployee?.managerId == undefined) {
      return alert('Invalid Manager');
    }

    this.employeeService.updateEmployee(updatedEmployee, this.idEditingEmployee).subscribe({
      next: () => {
        this.fetchEmployees();
        this.editingEmployee = null;
      },
      error: (err) => {
        console.error('Error adding employee:', err);
        alert('Failed to update employee');
      }
    });

  }

  confirmDeleteEmployee(employee: any): void {
    this.employeeIdToDelete = employee.id;
    this.showDeleteConfirmation = true;
  }

  deleteEmployee(): void {
    if (!this.employeeIdToDelete) return;
    this.employeeService.deleteEmployee(this.employeeIdToDelete).subscribe({
      next: () => {
        this.fetchEmployees();
        this.showDeleteConfirmation = false;
        this.employeeIdToDelete = '';
      },
      error: (err) => {
        console.error('Error adding employee:', err);
        alert('Failed to delete employee');
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.employeeIdToDelete = '';
  }
  cancelEdit(): void {
    this.editingEmployee = null;
  }
}
