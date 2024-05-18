import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Task } from '../../models/tasks';
import { ApiService } from '../../services/kanban-api.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  tasks: Task[] = [];
  todo: Task[] = [];
  progress: Task[] = [];
  done: Task[] = [];

  isLoggedIn: boolean = false;
  userId: string | null = null;

  ngOnInit(): void {

    this.apiService.getAllTasks().subscribe((data: Task[]) => {
    //this.apiService.findTasksOfEachUser(this.apiService.getUserId()).subscribe((data: Task[]) => {
      
      this.tasks = data;
      this.todo = this.tasks.filter((task) => task.status === 'todo');
      this.progress = this.tasks.filter((task) => task.status === 'inprogress');
      this.done = this.tasks.filter((task) => task.status === 'done');
    });
  }

  // Implement the drop method
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
        }
      );
    }
  }
}
