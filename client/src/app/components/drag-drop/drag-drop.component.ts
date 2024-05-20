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
import {MatDialog,} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogInprogressComponent } from '../dialog-inprogress/dialog-inprogress.component';
import { DialogDoneComponent } from '../dialog-done/dialog-done.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [DragDropModule, HttpClientModule, AsyncPipe,ReactiveFormsModule,CommonModule,MatFormFieldModule
    ,MatInputModule, FormsModule, MatIconModule, MatDividerModule, MatButtonModule,
    DialogInprogressComponent, DialogDoneComponent, DialogComponent
  ],
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {

  constructor(private apiService: ApiService,public dialog: MatDialog, private route:ActivatedRoute) {}

  tasks$!: Observable<any[]>;
  tasks: Task[] = [];
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];
  username: string | null = null;
  projectname: string | null = null;


  ngOnInit(): void {
    this.username =this.apiService.getUsername();
    this.apiService.getProjectNameById(this.route.snapshot.paramMap.get('projectId')!).subscribe((projectName: string) => {
      this.projectname = projectName;
    });
    // Check if user is authenticated before fetching projects
    if (this.apiService.isLoggedIn()) {
        const projectId = this.route.snapshot.paramMap.get('projectId');
        this.apiService.getAllTasksCurrentWithProject(projectId!).subscribe((data: Task[]) => {
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

  deleteTask(taskId: string): void {
    if (this.apiService.isLoggedIn()) {
      this.apiService.deleteTask(taskId).subscribe(
        (data) => {
          console.log('Task deleted successfully', data);
          this.apiService.getAllTasksCurrent().subscribe((data: Task[]) => {
            this.tasks = data;
            this.todo = this.tasks.filter((task) => task.status === 'todo');
            this.progress = this.tasks.filter((task) => task.status === 'inprogress');
            this.done = this.tasks.filter((task) => task.status === 'done');
          }
          );
        },
        (error) => {
          console.error('Error deleting task', error);
        }
      );
    } else {
      // Handle unauthenticated user
      console.error('User is not authenticated.');
    }
  }

  openDialogTodo(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { projectId: this.route.snapshot.paramMap.get('projectId')}
    });
  }

  openDialogInprogress(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogInprogressComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  openDialogDone(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogDoneComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
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
}


