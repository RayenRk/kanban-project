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
  selector: 'app-dialog-done',
  templateUrl: 'dialog-done.component.html',
  styleUrls: ['dialog-done.component.scss', '../drag-drop/drag-drop.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent
    ,MatInputModule, FormsModule, MatIconModule, MatDividerModule, MatButtonModule,ReactiveFormsModule]
})
export class DialogDoneComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<DialogDoneComponent>, public apiService: ApiService,
    public fb : FormBuilder
  ) {}

  donetaskForm!: FormGroup;
  tasks$!: Observable<any[]>;
  tasks: Task[] = [];
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];
  username: string | null = null;

  ngOnInit(): void {
    this.donetaskForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['done'],
      responsible: ['']
    });
  }

  // Implement the method called newTask() from service to add a new task with current user after clicking Add in the dialog
  newTask(): void {
    if (this.donetaskForm.invalid) {
      return;
    }
    const projectId = window.location.pathname.split('/')[2];

    const details: Task = {
      name: this.donetaskForm.value.name,
      description: this.donetaskForm.value.description,
      status: this.donetaskForm.value.status,
      project: '',
      responsible: this.donetaskForm.value.responsible
    };

    // new task is added to the done list of tasks
    this.apiService.newTaskWithProject(projectId,details).subscribe(
      (task: Task) => {
        this.done.push(task);
      }
    );
    this.dialogRef.afterClosed().subscribe(() => {
      // reload after delay to allow for the new task to be added
      setTimeout(() => {
        window.location.reload();
      }, 200);
    });
    
  }

  submit(): void {
    this.newTask();
    this.dialogRef.close();
    // refresh the page
    window.location.reload();
  }

  close(): void {
    this.dialogRef.close();
    // refresh the page
    window.location.reload();
  }
}
