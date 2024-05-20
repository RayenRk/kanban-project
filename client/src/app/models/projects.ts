export interface Project {
    _id?: string; 
    name: string;
    description: string;
    dateStart?: Date;
    dateEnd?: Date;
    tasks: string[]; // Assuming tasks are stored as IDs referencing Task model
    owner: string; // Assuming owner is stored as ID referencing User model
  }
  