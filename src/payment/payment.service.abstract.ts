import {Context} from "telegraf";

export abstract class PaymentServiceAbstract {
    abstract sendPaymentButton(context: Context): Promise<void>;
    abstract processPayment(context: Context): Promise<void>;
    abstract sendPaymentButtonContextReply(context: Context): Promise<void>;
    abstract checkPaymentStatus(orderId: string): Promise<boolean>;
}