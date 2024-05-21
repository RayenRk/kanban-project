import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Task } from '../../models/tasks';
import { AsyncPipe } from '@angular/common';
import { TitleCasePipe } from '@angular/common';
import { DialogEditComponent } from '../dialog-edit/dialog-edit.component';
import { ApiService } from '../../services/kanban-api.service';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  templateUrl: 'dialog-task.component.html',
  styleUrls: ['dialog-task.component.scss'],
  imports:[
    MatDialogContent,
    MatDialogActions,
    AsyncPipe,
    TitleCasePipe,
  ]
})
export class DialogTaskComponent {

  task: Task;
  projectName: string | null = null;
  currentUserName: string | null = null;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.task = data.task;
    this.projectName = data.projectname;
    this.currentUserName = data.currentUserName;
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(DialogEditComponent, {
        width: '500px',
        data: this.task // Pass the task data to the edit dialog
    });

        dialogRef.afterClosed().subscribe(result => {
          // Update the task with the new data from the edit dialog if the user clicks Save
          if (result) {
            this.task = result;
            if (this.task._id) {
              this.apiService.updateTask(this.task._id, this.task).subscribe({
                next: () => {
                  console.log('Task updated successfully');
                  this.apiService.getAllTasksCurrentWithProject(this.task.project).subscribe();
                },
                error: (error) => {
                  console.error('Update task error:', error);
                }
              });
            } else {
              console.error('Task ID is undefined');
            }
          }
        });
      }

      onClose(): void {
        this.dialogRef.close();
      }
    }
