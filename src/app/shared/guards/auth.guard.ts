import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(EmployeeService);
  return userService.token ? true : false;
};
