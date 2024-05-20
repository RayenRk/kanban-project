import { Task } from './tasks';

export interface Project {
    _id?: string; 
    name: string;
    description: string;
    dateStart?: Date;
    dateEnd?: Date;
    tasks: Task[];
    owner: string; // Assuming owner is stored as ID referencing User model
  }
  