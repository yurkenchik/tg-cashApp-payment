
interface CheckoutOptions {
    ask_for_shipping_address: boolean;
    redirect_url: string;
}

interface BasePriceMoney {
    amount: number;
    currency: string;
}

interface LineItem {
    name: string;
    quantity: string;
    base_price_money: BasePriceMoney;
}

interface Order {
    location_id: string;
    line_items: LineItem[];

}

export interface PaymentData {
    idempotency_key: string;
    order: Order;
    checkout_options: CheckoutOptions;
}