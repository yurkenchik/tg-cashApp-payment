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
            await context.reply('Processing your payment from local...');
            await this.processPayment(context);
        });
    }

    async processPayment(context: Context): Promise<void> {
        const paymentLink = await this.createPaymentLink(1);
        await context.reply(paymentLink ? `Complete your payment: ${paymentLink}` : 'Payment failed. Please try again later.');
    }

    async createPaymentLink(amount: number): Promise<string> {
        const apiKey = this.configService.get<string>("SQUARE_SANDBOX_ACCESS_TOKEN");
        const locationId = await this.getLocationId();

        if (!apiKey || !locationId) {
            console.error("Square API credentials are not provided");
            return null;
        }

        try {
            const response = await axios.post(
                "https://connect.squareupsandbox.com/v2/online-checkout/payment-links",
                {
                    idempotency_key: new Date().getTime().toString(),
                    order: {
                        location_id: locationId,
                        line_items: [
                            {
                                name: "Service Payment",
                                quantity: "1",
                                base_price_money: { amount: amount * 100, currency: "USD" }
                            }
                        ]
                    },
                    checkout_options: {
                        ask_for_shipping_address: false,
                        redirect_url: "http://localhost:3000/payment/confirmation"
                    }
                },
                {
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }
                }
            );
            return response.data?.payment_link?.url;
        } catch (error) {
            console.error('Checkout error:', error.response?.data ?? error.message);
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

    async getLocationId(): Promise<string | null> {
        const apiKey = this.configService.get<string>("SQUARE_SANDBOX_ACCESS_TOKEN");
        if (!apiKey) {
            console.error("Square API credentials are not provided");
            return null;
        }

        try {
            const response = await axios.get("https://connect.squareupsandbox.com/v2/locations", {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`
                }
            });

            const locations = response.data?.locations;
            return locations && locations.length > 0 ? locations[0].id : null;
        } catch (error) {
            console.error('Location fetch error:', error.response?.data ?? error.message);
            return null;
        }
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