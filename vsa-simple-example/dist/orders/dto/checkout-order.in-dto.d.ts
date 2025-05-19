export declare class _OrderItemRequestDto {
    productId: string;
    quantity: number;
}
export declare class CheckoutOrderRequestDto {
    orderId: string;
    customerId: string;
    items: _OrderItemRequestDto[];
}
