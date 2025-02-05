import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../shared/services/employee.service';
import { EmployeeRolesService } from '../../shared/services/employee-roles.service';
import { Employee } from '../../shared/models/employee';
import { EmployeeRoles } from '../../shared/models/employee-roles';

@Component({
  selector: 'app-contractor-employees',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './contractor-employees.component.html',
  styleUrl: './contractor-employees.component.scss'
})
export class ContractorEmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private employeeRolesService = inject(EmployeeRolesService);
  listOSEmployee: Employee[] = [];
  managersList: Employee[] = [];
  listEmployeeRoles: EmployeeRoles[] = [];
  managerRoleId: number = 0;
  showAddEmployeeForm = false;
  editingEmployee: Partial<Employee> | null = null;
  idEditingEmployee: string = '';
  showDeleteConfirmation = false;
  employeeIdToDelete: string = '';
  newOSEmployee: Employee = { name: '', idNumber: '', roleId: 0, managerId: 0 };
  idOSEmployee: number = 0;
  ngOnInit(): void {
    this.fetchOSEmployees();
    this.fetchEmployeeRoles();
    this.fetchManagers();
  }
  fetchOSEmployees(): void {
    this.employeeService.getAllOSEmployee().subscribe({
      next: (data: Employee[]) => {
        this.listOSEmployee = data;
      },
      error: (err) => {
        return alert(`failed ${err}`)
      }

    });
  }
  fetchManagers(): void {
    this.employeeService.getManagement().subscribe({
      next: (data: Employee[]) => {
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
        this.idOSEmployee = this.listEmployeeRoles?.find(emp => emp.name === 'OS Employee')?.id || 0;
      },
      error: (err) => {
        return alert(`failed ${err}`)
      }

    });
  }
  toggleAddEmployee(): void {
    this.showAddEmployeeForm = !this.showAddEmployeeForm;
  }
  addNewOSEmployee(): void {
    const newEmployee: Employee = {
      name: this.newOSEmployee.name,
      idNumber: this.newOSEmployee.idNumber,
      roleId: this.idOSEmployee,
      managerId: this.newOSEmployee.managerId,
    };

    if (!this.newOSEmployee.name || this.newOSEmployee.name.length > 100) return alert('Invalid Name');

    const idRegex = /^\d{8,9}$/;
    if (!this.newOSEmployee.idNumber || !idRegex.test(this.newOSEmployee.idNumber) || parseInt(this.newOSEmployee.idNumber, 10) <= 0) return alert('Invalid ID Number');
    if (this.newOSEmployee.managerId === 0) return alert('Invalid Manager');
    this.employeeService.addEmployee(newEmployee).subscribe({
      next: () => {
        this.fetchOSEmployees();
        this.newOSEmployee = {
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

    this.employeeService.updateEmployee(updatedEmployee, this.idEditingEmployee).subscribe({
      next: () => {
        this.fetchOSEmployees();
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
        this.fetchOSEmployees();
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
