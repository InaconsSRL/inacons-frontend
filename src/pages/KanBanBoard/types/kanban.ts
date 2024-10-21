// src/types/kanban.ts

export interface Task {
    id: string;
    title: string;
    description: string;
    projectCode: string;
    requestType: string;
    purchaseType: string;
    deliveryDate: string;
    approvedBy: string;
    assignees: string[];
  }
  
  export interface Column {
    id: string;
    title: string;
    tasks: Task[];
    limit?: number;
    color: string;
  }
  
  export interface Board {
    columns: Column[];
  }
