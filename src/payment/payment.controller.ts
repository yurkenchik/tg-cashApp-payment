import {Controller, Get, Query, Res} from "@nestjs/common";
import {PaymentService} from "./services/payment.service";
import {Response} from "express";
import {SquareService} from "./services/square.service";

@Controller('payment')
export class PaymentController {

    constructor(
        private readonly paymentService: PaymentService,
        private readonly squareService: SquareService,
    ) {}

    @Get("confirmation")
    async handlePaymentConfirmation(@Query('order_id') orderId: string): Promise<string> {
        const paymentSuccessful = await this.paymentService.checkPaymentStatus(orderId);
        return paymentSuccessful ? "Payment successful" : "Payment failed";
    }

    @Get("cash-app")
    async createCashAppPayment(@Res() response: Response) {
        try {
            const paymentLink = await this.squareService.createCashAppPaymentLink(Date.now().toString());
            return response.redirect(paymentLink);
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    }
}