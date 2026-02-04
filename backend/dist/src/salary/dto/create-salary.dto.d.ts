export declare class CreateSalaryDto {
    employeeId: string;
    year: number;
    month: number;
    basicSalary: number;
    bonus?: number;
    overtime?: number;
    deductions?: number;
    advance?: number;
    paymentMethod?: string;
    bankAccountId?: string;
    notes?: string;
}
