import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";

interface Payment {
  id: number;
  walletDirect: string;
  date: string;
  paymentType: string;
  accountType: string;
  accountName: string;
  phone: string;
  amount: number;
  note: string;
}

interface PaymentReceiptModalProps {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
}

const PaymentReceiptModal = ({ open, onClose, payment }: PaymentReceiptModalProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${payment?.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              padding: 20px;
              color: #1a1a1a;
            }
            .receipt-container {
              max-width: 400px;
              margin: 0 auto;
              border: 2px solid #2d3748;
              padding: 24px;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #cbd5e0;
              padding-bottom: 16px;
              margin-bottom: 16px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #14b8a6;
              margin-bottom: 4px;
            }
            .subtitle {
              font-size: 12px;
              color: #718096;
            }
            .receipt-title {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              margin: 16px 0;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px dotted #e2e8f0;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .label {
              color: #718096;
              font-size: 13px;
            }
            .value {
              font-weight: 500;
              font-size: 13px;
            }
            .amount-section {
              background: #f7fafc;
              padding: 16px;
              margin: 16px 0;
              border-radius: 8px;
              text-align: center;
            }
            .amount-label {
              font-size: 12px;
              color: #718096;
              margin-bottom: 4px;
            }
            .amount-value {
              font-size: 28px;
              font-weight: bold;
              color: #14b8a6;
            }
            .footer {
              text-align: center;
              border-top: 2px dashed #cbd5e0;
              padding-top: 16px;
              margin-top: 16px;
            }
            .footer-text {
              font-size: 12px;
              color: #718096;
            }
            .thank-you {
              font-size: 14px;
              font-weight: 600;
              margin-top: 8px;
            }
            @media print {
              body { padding: 0; }
              .receipt-container { border: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Payment Receipt</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={handlePrint} className="gap-1">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="receipt-container">
          {/* Header */}
          <div className="header text-center border-b-2 border-dashed border-border pb-4 mb-4">
            <div className="logo text-2xl font-bold text-primary">POS Software</div>
            <div className="subtitle text-xs text-muted-foreground">Digital POS Management</div>
            <div className="text-xs text-muted-foreground mt-1">01958-104255, 01958-104250</div>
          </div>

          {/* Receipt Title */}
          <div className="receipt-title text-center text-lg font-bold uppercase tracking-widest my-4">
            Payment Receipt
          </div>

          {/* Receipt Number */}
          <div className="info-row flex justify-between py-2 border-b border-dotted border-border">
            <span className="label text-muted-foreground text-sm">Receipt No:</span>
            <span className="value font-medium text-sm">#{payment.id.toString().padStart(6, '0')}</span>
          </div>

          {/* Date */}
          <div className="info-row flex justify-between py-2 border-b border-dotted border-border">
            <span className="label text-muted-foreground text-sm">Date:</span>
            <span className="value font-medium text-sm">{payment.date}</span>
          </div>

          {/* Account Type */}
          <div className="info-row flex justify-between py-2 border-b border-dotted border-border">
            <span className="label text-muted-foreground text-sm">Account Type:</span>
            <span className="value font-medium text-sm">{payment.accountType}</span>
          </div>

          {/* Account Name */}
          <div className="info-row flex justify-between py-2 border-b border-dotted border-border">
            <span className="label text-muted-foreground text-sm">{payment.accountType} Name:</span>
            <span className="value font-medium text-sm">{payment.accountName}</span>
          </div>

          {/* Phone */}
          {payment.phone && (
            <div className="info-row flex justify-between py-2 border-b border-dotted border-border">
              <span className="label text-muted-foreground text-sm">Phone:</span>
              <span className="value font-medium text-sm">{payment.phone}</span>
            </div>
          )}

          {/* Payment Type */}
          <div className="info-row flex justify-between py-2 border-b border-dotted border-border">
            <span className="label text-muted-foreground text-sm">Payment Type:</span>
            <span className="value font-medium text-sm">{payment.paymentType}</span>
          </div>

          {/* Wallet Payment */}
          <div className="info-row flex justify-between py-2 border-b border-dotted border-border">
            <span className="label text-muted-foreground text-sm">Wallet Payment:</span>
            <span className="value font-medium text-sm">{payment.walletDirect === "Yes" ? "Yes" : "No"}</span>
          </div>

          {/* Note */}
          {payment.note && (
            <div className="info-row flex justify-between py-2 border-b border-dotted border-border">
              <span className="label text-muted-foreground text-sm">Note:</span>
              <span className="value font-medium text-sm">{payment.note}</span>
            </div>
          )}

          {/* Amount Section */}
          <div className="amount-section bg-muted/50 p-4 my-4 rounded-lg text-center">
            <div className="amount-label text-xs text-muted-foreground mb-1">Total Amount</div>
            <div className="amount-value text-3xl font-bold text-primary">
              ৳{payment.amount.toLocaleString()}
            </div>
          </div>

          {/* Footer */}
          <div className="footer text-center border-t-2 border-dashed border-border pt-4 mt-4">
            <div className="footer-text text-xs text-muted-foreground">
              This is a computer generated receipt
            </div>
            <div className="thank-you text-sm font-semibold mt-2">
              Thank you for your payment!
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReceiptModal;
