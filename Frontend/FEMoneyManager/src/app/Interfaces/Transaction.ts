export interface Transaction {
    id: string; //UniqID
    walletID: string; //UniqID-t kap
    amount: number;
    categoryID: string; //UniqID-t kap
    type: "kiadás" | "bevétel";
}