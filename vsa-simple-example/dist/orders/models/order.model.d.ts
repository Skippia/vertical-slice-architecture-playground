export declare class OrderItem {
    productId: string;
    quantity: number;
}
export declare class Order {
    orderId: string;
    customerId: string;
    items: OrderItem[];
    processedAt: Date;
}
