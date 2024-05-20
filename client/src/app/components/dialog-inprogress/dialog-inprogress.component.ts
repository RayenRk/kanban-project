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
  selector: 'app-dialog-inprogress',
  templateUrl: 'dialog-inprogress.component.html',
  styleUrls: ['dialog-inprogress.component.scss', '../drag-drop/drag-drop.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent
    ,MatInputModule, FormsModule, MatIconModule, MatDividerModule, MatButtonModule,ReactiveFormsModule]
})
export class DialogInprogressComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<DialogInprogressComponent>, public apiService: ApiService,
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

    const details: Task = {
      name: this.taskForm.value.name,
      description: this.taskForm.value.description,
      status: 'inprogress',
      project: '',
      responsible: this.taskForm.value.responsible
    };


    this.apiService.newTask(details).subscribe(
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
  }

  submit(): void {
    this.newTask();
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
    // refresh the page
    window.location.reload();
  }
}