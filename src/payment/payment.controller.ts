import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {PaymentService} from "./payment.service";

@Controller('payment')
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) {}

    @Get("confirmation")
    async handlePaymentConfirmation(@Query('order_id') orderId: string): Promise<string> {
        const paymentSuccessful = await this.paymentService.checkPaymentStatus(orderId);
        return paymentSuccessful ? "Payment successful" : "Payment failed";
    }
}