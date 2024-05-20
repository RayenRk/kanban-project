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
import { Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/projects';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [DragDropModule, HttpClientModule, AsyncPipe,ReactiveFormsModule,CommonModule],
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
  tasks$!: Observable<any[]>;
  tasks: Task[] = [];
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];
  username: string | null = null;
  projects: Project[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.username = this.apiService.getUsername();

    if (this.apiService.isLoggedIn()) {
      this.apiService.getCurrentProject().subscribe(
        (project) => {
          this.projects = project.name;
        },
        (error) => {
          console.error('Error fetching project name:', error);
        }
      );

      this.apiService.getAllTasksCurrent().subscribe((data: Task[]) => {
        this.tasks = data;
        this.todo = this.tasks.filter((task) => task.status === 'todo');
        this.progress = this.tasks.filter((task) => task.status === 'inprogress');
        this.done = this.tasks.filter((task) => task.status === 'done');
      });
    } else {
      console.error('User is not authenticated.');
    }
  }

  fetchTasks(): void {
    this.tasks$ = this.apiService.getAllTasksCurrent();
  }

  getProjectName(projects: Project[], projectId: string): string {
    const project = projects.find(project => project._id === projectId);
    return project ? project.name : 'Unknown'; 
  }
  

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      let newStatus!: string;
      if (event.container.id === 'todoList') {
        newStatus = 'todo';
      } else if (event.container.id === 'progressList') {
        newStatus = 'inprogress';
      } else if (event.container.id === 'doneList') {
        newStatus = 'done';
      }

      task.status = newStatus;

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

  // Add the trackById method
  trackById(index: number, item: Task): string {
    return item._id || 'no-id'; // Assuming each task has a unique _id property
  }
}