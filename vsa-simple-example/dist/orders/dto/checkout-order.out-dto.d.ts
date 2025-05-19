export declare class _OrderItemResponseDto {
    productId: string;
    quantity: number;
}
export declare class CheckoutOrderResponseDto {
    orderId: string;
    customerId: string;
    items: _OrderItemResponseDto[];
    processedAt: Date;
    success: boolean;
    message: string;
}
