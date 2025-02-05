import { EmployeeRoles } from "./employee-roles";

export interface Employee {
    id?: number,
    name: string,
    idNumber: string,
    employeeRoles?: EmployeeRoles,
    roleId: number,
    manager?: Employee | null,
    managerId?: number,
}

