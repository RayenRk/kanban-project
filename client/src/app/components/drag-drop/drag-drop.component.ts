import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from '../../models/tasks';
import { ApiService } from '../../services/kanban-api.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [DragDropModule, HttpClientModule, AsyncPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
  tasks$!: Observable<any[]>;
  tasks: Task[] = [];
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.apiService.getAllTasksCurrent().subscribe(
      (data: Task[]) => {
        this.tasks = data;
        this.todo = this.tasks.filter((task) => task.status === 'todo');
        this.progress = this.tasks.filter((task) => task.status === 'inprogress');
        this.done = this.tasks.filter((task) => task.status === 'done');
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  drop(event: CdkDragDrop<any[]>) {
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
          // Revert the change in case of an error
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          task.status = event.previousContainer.id === 'todoList' ? 'todo' : 
                        event.previousContainer.id === 'progressList' ? 'inprogress' : 'done';
        }
      );
    }
  }
}
