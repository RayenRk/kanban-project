import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Task } from '../../models/tasks';
import { AsyncPipe } from '@angular/common';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  templateUrl: 'dialog-task.component.html',
  styleUrls: ['dialog-task.component.scss'],
  imports:[
    MatDialogContent,
    MatDialogActions,
    AsyncPipe,
    MatIconModule,
    TitleCasePipe,
  ]
})
export class DialogTaskComponent {

  task: Task;
  projectName: string | null = null;
  currentUserName: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.task = data.task;
    this.projectName = data.projectname;
    this.currentUserName = data.currentUserName;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
