import {Injectable} from "@nestjs/common";
import {Client, Environment} from "square";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class SquareService {

    private readonly client: Client;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.client = new Client({
            environment: Environment.Production,
            accessToken: this.configService.get<string>('SQUARE_SANDBOX_ACCESS_TOKEN'),
        })
    }

    async createCashAppPaymentLink(referenceId: string): Promise<string> {
        const { catalogApi, checkoutApi } = this.client;

        try {
            const response = await checkoutApi.createPaymentLink({
                idempotencyKey: referenceId,
                order: {
                    locationId: await this.getLocationId(),
                    lineItems: [
                        {
                            name: 'Cash App Payment',
                            quantity: '1',
                            basePriceMoney: {
                                amount: BigInt(100),
                                currency: "USD",
                            },
                        },
                    ],
                },
                // @ts-ignore
                acceptedPaymentMethods: {
                    cashAppPay: true,
                    card: false,
                }
            })
            console.log("API RESPONSE: ", response);
            if (response.result.paymentLink) {
                return response.result.paymentLink.url;
            } else {
                throw new Error('Failed to create payment link');
            }
        } catch (error) {
            console.error('Error creating payment link: ', error);
            throw error;        }
    }

    private async getLocationId(): Promise<string | null> {
        try {
            const response = await this.client.locationsApi.listLocations();
            const locations = response.result.locations;

            if (!locations || locations.length <= 0) {
                console.log('No locations found.');
                return null;
            }

            return locations[0].id;
        } catch (error) {
            console.error('Error fetching locations:', error);
            return null;
        }
    }
}