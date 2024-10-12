import {Module} from "@nestjs/common";
import {PaymentService} from "./payment.service";
import {PaymentUpdate} from "./payment.update";
import {ConfigModule} from "@nestjs/config";
import {PaymentController} from "./payment.controller";

@Module({
    providers: [PaymentService, PaymentUpdate],
    controllers: [PaymentController],
    imports: [ConfigModule],
    exports: [PaymentService, PaymentUpdate],
})
export class PaymentModule {}