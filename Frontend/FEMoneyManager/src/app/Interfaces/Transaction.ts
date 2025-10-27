type Type = {
    type : "kiadás" | "bevétel";
}

export interface Category {
    id: string; //UniqID
    walletID: string; //UniqID-t kap
    amount: number;
    categoryID: string; //UniqID-t kap
    type: Type
}