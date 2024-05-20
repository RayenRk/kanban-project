import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Task } from '../../models/tasks';
import { ApiService } from '../../services/kanban-api.service';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.scss', '../drag-drop/drag-drop.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent
    ,MatInputModule, FormsModule, MatIconModule, MatDividerModule, MatButtonModule,ReactiveFormsModule]
})
export class DialogComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<DialogComponent>, public apiService: ApiService,
    public fb : FormBuilder
  ) {}

  taskForm!: FormGroup;
  tasks$!: Observable<any[]>;
  tasks: Task[] = [];
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];
  username: string | null = null;

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: [''],
      responsible: ['']
    });
  }

  // Implement the method called newTask() from service to add a new task with current user after clicking Add in the dialog
  newTask(): void {
    if (this.taskForm.invalid) {
      return;
    }
    const projectId = window.location.pathname.split('/')[2];

    const details: Task = {
      name: this.taskForm.value.name,
      description: this.taskForm.value.description,
      status: 'todo',
      project: '',
      responsible: this.taskForm.value.responsible
    };


    this.apiService.newTaskWithProject(projectId,details).subscribe(
      (newTask: Task) => {
        this.tasks.push(newTask);
        if (newTask.status === 'todo') {
          this.todo.push(newTask);
        } else if (newTask.status === 'inprogress') {
          this.progress.push(newTask);
        } else if (newTask.status === 'done') {
          this.done.push(newTask);
        }
      },
      (error) => {
        console.error('Error adding new task', error);
      }
    );
    this.dialogRef.afterClosed().subscribe(() => {
      // reload after delay to allow for the new task to be added
      setTimeout(() => {
        window.location.reload();
      }, 200);
    });
  }

  // Implement the method called submit() to close the dialog after clicking Add
  submit(): void {
    this.newTask();
  }

  close(): void {
    this.dialogRef.close();
  }


}
