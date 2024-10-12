import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {TelegrafModule} from "nestjs-telegraf";
import {PaymentModule} from "./payment/payment.module";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        TelegrafModule.forRoot({
            token: process.env.TELEGRAM_BOT_TOKEN
        }),
        PaymentModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
