"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutOrderResponseDto = exports._OrderItemResponseDto = void 0;
const classes_1 = require("@automapper/classes");
class _OrderItemResponseDto {
    productId;
    quantity;
}
exports._OrderItemResponseDto = _OrderItemResponseDto;
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], _OrderItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], _OrderItemResponseDto.prototype, "quantity", void 0);
class CheckoutOrderResponseDto {
    orderId;
    customerId;
    items;
    processedAt;
    success;
    message;
}
exports.CheckoutOrderResponseDto = CheckoutOrderResponseDto;
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CheckoutOrderResponseDto.prototype, "orderId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CheckoutOrderResponseDto.prototype, "customerId", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => _OrderItemResponseDto),
    __metadata("design:type", Array)
], CheckoutOrderResponseDto.prototype, "items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Date)
], CheckoutOrderResponseDto.prototype, "processedAt", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Boolean)
], CheckoutOrderResponseDto.prototype, "success", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], CheckoutOrderResponseDto.prototype, "message", void 0);
//# sourceMappingURL=checkout-order.out-dto.js.map