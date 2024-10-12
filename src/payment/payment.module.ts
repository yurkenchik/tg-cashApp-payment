import {Module} from "@nestjs/common";
import {PaymentService} from "./payment.service";
import {PaymentUpdate} from "./payment.update";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [PaymentService, PaymentUpdate],
    exports: [PaymentService, PaymentUpdate],
})
export class PaymentModule {}