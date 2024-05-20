export interface Task {
  projectName?: string;
  _id?: string; // Optional if you are using MongoDB ObjectID
  name: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done'; 
  project: string; 
  responsible: string;
  projectId: string; // Add this property to reference the project


}
