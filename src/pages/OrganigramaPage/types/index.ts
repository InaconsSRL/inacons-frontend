export interface Employee {
    id: string;
    name: string;
    role: string;
}

export interface Position {
    id: string;
    name: string;
    employeeId: string | null;
}

export interface Project {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    positions: Position[];
}

export interface Notification {
    message: string;
    type: 'error' | 'success' | 'info';
}