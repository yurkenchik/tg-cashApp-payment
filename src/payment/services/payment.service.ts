import {Injectable} from "@nestjs/common";
import {Context, Telegraf} from "telegraf";
import axios from "axios";
import {InjectBot} from "nestjs-telegraf";
import {ConfigService} from "@nestjs/config";
import {PaymentServiceAbstract} from "../payment.service.abstract";
import {SquareService} from "./square.service";

@Injectable()
export class PaymentService extends PaymentServiceAbstract {

    constructor(
        @InjectBot()
        private readonly telegramBot: Telegraf<Context>,
        private readonly configService: ConfigService,
        private readonly squareService: SquareService,
    ) {
        super();
    }

    async sendPaymentButton(context: Context): Promise<void> {
        await this.sendPaymentButtonContextReply(context);
        this.telegramBot.action('pay_1', async (context) => {
            await context.reply('Processing your payment from local...');
            await this.processPayment(context);
        });
    }

    async processPayment(context: Context): Promise<void> {
        const paymentLink = await this.squareService.createCashAppPaymentLink(Date.now().toString());
        await context.reply(paymentLink ? `Complete your payment: ${paymentLink}` : 'Payment failed. Please try again later.');
        await this.sendPaymentButton(context);
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

    async checkPaymentStatus(orderId: string): Promise<boolean> {
        const apiKey = this.configService.get<string>("SQUARE_SANDBOX_ACCESS_TOKEN");
        try {
            const response = await axios.get(
                `https://connect.squareupsandbox.com/v2/orders/${orderId}`,
                {
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }
                }
            );
            const paymentStatus = response.data?.order?.state;
            return paymentStatus === 'COMPLETED';
        } catch (error) {
            console.error('Payment status error:', error.response?.data ?? error.message);
            return false;
        }
    }
}
