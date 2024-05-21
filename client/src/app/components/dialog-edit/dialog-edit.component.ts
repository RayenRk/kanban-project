import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/kanban-api.service';
import { DialogTaskComponent } from '../dialog-task/dialog-task.component';

@Component({
    selector: 'app-edit-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule // Import ReactiveFormsModule instead of FormsModule
    ],
    templateUrl: './dialog-edit.component.html',
    styleUrls: ['./dialog-edit.component.scss']
})
export class DialogEditComponent implements OnInit {
    
    constructor(
        private fb: FormBuilder,
        private apiService: ApiService,
        public dialogRef: MatDialogRef<DialogEditComponent>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public task: any
    ) { }

    taskForm!: FormGroup;

    ngOnInit(): void {
        // Initialize the form with the task details
        this.taskForm = this.fb.group({
            name: [this.task.name, Validators.required],
            description: [this.task.description, Validators.required],
            status: [this.task.status, Validators.required],
            responsible: [this.task.responsible, Validators.required]
        });
    }

    onSave(): void {
      if (this.taskForm.valid) {
          this.apiService.updateTask(this.task._id, this.taskForm.value).subscribe(() => {
              this.dialogRef.close(); // Close the edit dialog after update

              // Call getAllTasksCurrentProject after the dialog is closed
            this.apiService.getAllTasksCurrentWithProject(this.task.project).subscribe(() => {
              // Optionally, perform any action after fetching tasks
              
          });
  
              // Open or reload task details dialog
              const taskDetailsDialogRef = this.dialog.open(DialogTaskComponent, {
                  data: this.task // Pass the original task data or updated data if needed
              });
          }, (error) => {
              console.error('Update task failed', error);
              // Optionally, handle error
          });
      }
      // close the dialog and reload the page
      this.dialogRef.close();
      window.location.reload();
      // open the task details dialog with a delay after the page is reloaded
      setTimeout(() => {
        const taskDetailsDialogRef = this.dialog.open(DialogTaskComponent, {
            data: this.task // Pass the original task data or updated data if needed
        });
      }, 2000); 
      
    }
  

    onClose(): void {
        // If user cancels, just close the dialog
        this.dialogRef.close();
    }
}