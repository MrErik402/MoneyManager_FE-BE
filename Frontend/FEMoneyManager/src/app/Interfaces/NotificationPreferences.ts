export interface NotificationPreferences {
    id: string;
    userID: string;
    lowBalanceThreshold: number;
    negativeBalanceEnabled: boolean;
    highBalanceThreshold: number;
    createdAt: Date;
    updatedAt: Date;
}


