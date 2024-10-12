import {InjectBot, Start, Update} from "nestjs-telegraf";
import {Context, Telegraf} from "telegraf";
import {PaymentService} from "./payment.service";
import {Injectable} from "@nestjs/common";

@Update()
@Injectable()
export class PaymentUpdate {

    constructor(
        @InjectBot()
        private readonly telegramBot: Telegraf<Context>,
        private readonly paymentService: PaymentService
    ) {
        this.telegramBot.action('pay_1', async (ctx) => {
            await ctx.reply('Processing your payment...');
            await this.paymentService.processPayment(ctx);
        });
    }

    @Start()
    async startBot(context: Context): Promise<void> {
        console.log("Telegram bot has started");
        await this.paymentService.sendPaymentButton(context);
    }
}