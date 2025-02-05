import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EmployeeService } from '../services/employee.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(EmployeeService);
  const token = userService.token;
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  }
  return next(req);
};
