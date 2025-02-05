import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../shared/services/employee.service';
import { EmployeeRolesService } from '../../shared/services/employee-roles.service';
import { Employee } from '../../shared/models/employee';
import { EmployeeRoles } from '../../shared/models/employee-roles';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-management-employees',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, CommonModule],
  templateUrl: './management-employees.component.html',
  styleUrl: './management-employees.component.scss'
})
export class ManagementEmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private employeeRolesService = inject(EmployeeRolesService);
  listManager: Employee[] = [];
  managersList: Employee[] = [];
  listEmployeeRoles: EmployeeRoles[] = [];
  showAddEmployeeForm = false;
  editingManager: Partial<Employee> | null = null;
  idEditingManager: string = '';
  showDeleteConfirmation = false;
  employeeIdToDelete: string = '';
  newManager: Employee = { name: '', idNumber: '', roleId: 0, managerId: 0 };
  managerRoleId: number = 0;
  managerRoles: EmployeeRoles[] = [];
  ngOnInit(): void {
    this.fetchManagers();
    this.fetchEmployeeRoles();
  }
  fetchManagers(): void {
    this.employeeService.getManagement().subscribe({
      next: (data: Employee[]) => {
        this.listManager = data;
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
        this.managerRoles = this.listEmployeeRoles.filter(role =>
          role.name == 'Manager' || role.name == 'Senior Management'
        );
      },
      error: (err) => {
        return alert(`failed ${err}`)
      }
    });
  }
  toggleAddEmployee(): void {
    this.showAddEmployeeForm = !this.showAddEmployeeForm;
  }
  addNewManager(): void {
    const newManagerEmployee: Employee = {
      name: this.newManager.name,
      idNumber: this.newManager.idNumber,
      roleId: this.newManager.roleId,
      managerId: this.newManager.managerId || undefined,
    };
    if (this.managerRoleId == this.newManager?.roleId) {
      newManagerEmployee.managerId = undefined;
    }
    else if (newManagerEmployee.managerId === undefined) {
      return alert('Invalid Manager');
    }
    if (!this.newManager?.roleId) return alert('Invalid RoleId');
    if (!this.newManager.name || this.newManager.name.length > 100) return alert('Invalid Name');

    const idRegex = /^\d{8,9}$/;
    if (!this.newManager.idNumber || !idRegex.test(this.newManager.idNumber) || parseInt(this.newManager.idNumber, 10) <= 0) return alert('Invalid ID Number');
    this.employeeService.addEmployee(newManagerEmployee).subscribe({
      next: () => {
        this.fetchManagers();
        this.newManager = {
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
    this.editingManager = { ...employee };
    this.idEditingManager = employee.id;

  }
  updateEmployee(): void {
    const updatedEmployee: Employee = {
      name: this.editingManager?.name ?? '',
      idNumber: this.editingManager?.idNumber ?? '',
      roleId: this.editingManager?.roleId ?? 0,
      managerId: this.editingManager?.managerId ?? undefined,
    };
    if (!updatedEmployee.name || updatedEmployee.name.length > 100) return alert('Invalid Name');

    if (this.managerRoleId == this.editingManager?.roleId) {
      updatedEmployee.managerId = undefined;
    }
    else if (this.editingManager?.managerId == undefined) {
      return alert('Invalid Manager');
    }
    this.employeeService.updateEmployee(updatedEmployee, this.idEditingManager).subscribe({
      next: () => {
        this.fetchManagers();
        this.editingManager = null;
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
        this.fetchManagers();
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
    this.editingManager = null;
  }
}
