import {PaymentData} from "../interfaces/payment-data.interface";

export function getPaymentData(amount: number, locationId: string): PaymentData | null {
    return {
        idempotency_key: new Date().getTime().toString(),
        order: {
            location_id: locationId,
            line_items: [
                {
                    name: "Cash App Service Payment",
                    quantity: "1",
                    base_price_money: { amount: amount * 100, currency: "USD" }
                }
            ]
        },
        checkout_options: {
            ask_for_shipping_address: false,
            redirect_url: "http://localhost:3000/payment/confirmation"
        }
    }
}