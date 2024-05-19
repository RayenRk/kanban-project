import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from '../../models/tasks';
import { ApiService } from '../../services/kanban-api.service';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [DragDropModule, HttpClientModule, AsyncPipe,ReactiveFormsModule,CommonModule,MatFormFieldModule
    ,MatInputModule, FormsModule, MatIconModule, MatDividerModule, MatButtonModule
  ],
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
  constructor(private apiService: ApiService,public dialog: MatDialog) {}

  tasks$!: Observable<any[]>;
  tasks: Task[] = [];
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];
  username: string | null = null;


  ngOnInit(): void {
    this.username =this.apiService.getUsername();
    // Check if user is authenticated before fetching projects
    if (this.apiService.isLoggedIn()) {
    this.apiService.getAllTasksCurrent().subscribe((data: Task[]) => {
      //this.apiService.findTasksOfEachUser(this.apiService.getUserId()).subscribe((data: Task[]) => {
        
        this.tasks = data;
        this.todo = this.tasks.filter((task) => task.status === 'todo');
        this.progress = this.tasks.filter((task) => task.status === 'inprogress');
        this.done = this.tasks.filter((task) => task.status === 'done');
      });
      
      
    } else {
      // Handle unauthenticated user
      console.error('User is not authenticated.');
    }


  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    })
  }

  fetchTasks(): void {
    this.tasks$ = this.apiService.getAllTasksCurrent();
  }

    
    

  // Implement the drop method
  drop(event: CdkDragDrop<any[]>) {

    // Check if user is authenticated before fetching projects
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Determine the new status based on the target container
      let newStatus!: string;
      if (event.container.id === 'todoList') {
        newStatus = 'todo';
      } else if (event.container.id === 'progressList') {
        newStatus = 'inprogress';
      } else if (event.container.id === 'doneList') {
        newStatus = 'done';
      }

      // Update the task status
      task.status = newStatus;

      // Call the service method to update the task status in the database
      this.apiService.updateTask(task._id, { status: newStatus }).subscribe(
        (updatedTask: Task) => {
          console.log('Task status updated successfully', updatedTask);
        },
        (error) => {
          console.error('Error updating task status', error);
        }
      );
    }
  }

  // implement addTask method
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-animations-example-dialog.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent
    ,MatInputModule, FormsModule, MatIconModule, MatDividerModule, MatButtonModule]
})
export class DialogAnimationsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
}
