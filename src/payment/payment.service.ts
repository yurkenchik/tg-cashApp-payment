import {Injectable} from "@nestjs/common";
import {Context, Telegraf} from "telegraf";
import axios from "axios";
import {InjectBot} from "nestjs-telegraf";
import {ConfigService} from "@nestjs/config";
import {PaymentServiceAbstract} from "./payment.service.abstract";

@Injectable()
export class PaymentService extends PaymentServiceAbstract {

    constructor(
        @InjectBot()
        private readonly telegramBot: Telegraf<Context>,
        private readonly configService: ConfigService
    ) {
        super();
    }

    async sendPaymentButton(context: Context): Promise<void> {
        await this.sendPaymentButtonContextReply(context);
        this.telegramBot.action('pay_1', async (context) => {
            await context.reply('Processing your payment...');
            await this.processPayment(context);
        });
    }

    async processPayment(context: Context): Promise<void> {
        const paymentLink = await this.createCashAppPayment(1);
        await context.reply(paymentLink ? `Complete your payment: ${paymentLink}` : 'Payment failed. Please try again later.');
        await this.sendPaymentButtonContextReply(context);
    }

    async createCashAppPayment(amount: number): Promise<string> {
        const apiKey = this.configService.get<string>("CASH_APP_API_KEY");
        if (!apiKey) {
            console.error("CashApp API is not provided");
            return null;
        }
        try {
            const response = await axios.post(
                "https://api.cash.app/v2/payments",
                { amount, currency: "USD", note: "Service payment" },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`
                    }
                }
            );
            console.log("Payment Response:", response.data);
            return response.data?.payment_url ?? null;
        } catch (error) {
            console.error('Payment error:', error);
            return null;
        }
    }

    async sendPaymentButtonContextReply(context: Context): Promise<void> {
        await context.reply('Pay $1 using CashApp:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Pay $1', callback_data: 'pay_1' }],
                ],
            },
        });
    }
}