import {Context} from "telegraf";

export abstract class PaymentServiceAbstract {
    abstract sendPaymentButton(context: Context): Promise<void>;
    abstract processPayment(context: Context): Promise<void>;
    abstract createCashAppPayment(amount: number): Promise<string>;
    abstract sendPaymentButtonContextReply(context: Context): Promise<void>;
}