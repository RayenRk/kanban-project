export interface Task {
    _id?: string; // Optional if you are using MongoDB ObjectID
    name: string;
    description: string;
    status: 'pending' | 'in progress' | 'completed'; 
    project: string; 
    responsible: string; // Assuming responsible is stored as ID referencing User model
  }
  