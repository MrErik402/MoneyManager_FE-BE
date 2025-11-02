export interface NotificationFromDB {
    id: string;
    userID: string;
    severity: string;
    title: string;
    message: string;
    createdAt: Date;
    
}