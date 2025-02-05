import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/employee';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiURL}/Employee`

  public get token(): string | null {
    return sessionStorage.getItem('myToken');
  }
  public set token(token: string | null) {
    if (token) {
      sessionStorage.setItem('myToken', token);
    }
  }
  getAllActiveEmployees() {
    return this.http.get<Employee[]>(`${this.baseUrl}/AllActiveEmployees`);
  }
  getManagement() {
    return this.http.get<Employee[]>(`${this.baseUrl}/AllManagement`);
  }
  getAllOSEmployee() {
    return this.http.get<Employee[]>(`${this.baseUrl}/AllOSEmployee`);
  }
  getEmployeeByIdNumber(id: string) {
    return this.http.get<Employee>(`${this.baseUrl}/EmployeeByNumberId/${id}`);
  }
  addEmployee(e: Employee) {
    return this.http.post<Employee>(`${this.baseUrl}`, e);
  }
  updateEmployee(e: Employee, id: string) {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, e);
  }
  deleteEmployee(id: string) {
    return this.http.delete<Employee>(`${this.baseUrl}/${id}`);
  }
}