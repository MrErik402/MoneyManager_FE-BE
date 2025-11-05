export interface Transaction {
    id: string;
    walletID: string;
    amount: number;
    categoryID: string;
    type: "kiadás" | "bevétel";
    date?: Date | string;
    isRecurring?: boolean;
    recurrenceFrequency?: "daily" | "weekly" | "monthly";
    nextRecurrenceDate?: Date | string;
    originalTransactionID?: string;
}