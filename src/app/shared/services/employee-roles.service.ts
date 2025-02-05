import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EmployeeRoles } from '../models/employee-roles';

@Injectable({
  providedIn: 'root'
})
export class EmployeeRolesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiURL}/EmployeeRoles`
  getEmployeeRoles() {
    return this.http.get<EmployeeRoles[]>(this.baseUrl);
  }
}
