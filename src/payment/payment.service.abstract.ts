import {Context} from "telegraf";

export abstract class PaymentServiceAbstract {
    abstract sendPaymentButton(context: Context): Promise<void>;
    abstract processPayment(context: Context): Promise<void>;
    abstract createPaymentLink(amount: number): Promise<string>;
    abstract sendPaymentButtonContextReply(context: Context): Promise<void>;
    abstract getLocationId(): Promise<string | null>;
    abstract checkPaymentStatus(orderId: string): Promise<boolean>;
}