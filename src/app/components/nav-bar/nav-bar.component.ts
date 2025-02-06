import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  constructor(private router: Router) { }
  get token(): string | null {
    return sessionStorage.getItem('myToken');
  }
  logout(): void {
    sessionStorage.removeItem('myToken');
    this.router.navigate(['/login']);
  }
}
