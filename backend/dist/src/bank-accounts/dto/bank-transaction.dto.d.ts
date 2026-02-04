export declare class DepositDto {
    amount: number;
    description?: string;
    reference?: string;
}
export declare class WithdrawDto {
    amount: number;
    description?: string;
    reference?: string;
}
export declare class TransferDto {
    toAccountId: string;
    amount: number;
    description?: string;
    reference?: string;
}
