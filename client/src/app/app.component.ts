import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DragDropComponent, RegisterComponent,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Kanban Board';
}
