import { Routes } from '@angular/router';
//import { AppComponent } from './app.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ContractorEmployeesComponent } from './components/contractor-employees/contractor-employees.component';
import { ManagementEmployeesComponent } from './components/management-employees/management-employees.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'contractor-employees', component: ContractorEmployeesComponent },
    { path: 'management-employees', component: ManagementEmployeesComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },

];
