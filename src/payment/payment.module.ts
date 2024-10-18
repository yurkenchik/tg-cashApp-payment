import {Module} from "@nestjs/common";
import {PaymentService} from "./services/payment.service";
import {PaymentUpdate} from "./payment.update";
import {ConfigModule} from "@nestjs/config";
import {PaymentController} from "./payment.controller";
import {SquareService} from "./services/square.service";

@Module({
    providers: [PaymentService, PaymentUpdate, SquareService],
    controllers: [PaymentController],
    imports: [ConfigModule],
    exports: [PaymentService, PaymentUpdate, SquareService],
})
export class PaymentModule {}