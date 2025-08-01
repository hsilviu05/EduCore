import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Authentication</h2>
    <p>Login or register to access the platform.</p>
  `
})
export class AuthComponent {}