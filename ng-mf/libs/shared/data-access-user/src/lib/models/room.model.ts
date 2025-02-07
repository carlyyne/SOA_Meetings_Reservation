export interface Room {
    _id?: string;
    name: string;
    capacity: number;
    resources: string[];
    reservations: string[];
}