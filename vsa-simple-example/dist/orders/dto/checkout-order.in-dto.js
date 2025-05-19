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
exports.CheckoutOrderRequestDto = exports._OrderItemRequestDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const classes_1 = require("@automapper/classes");
class _OrderItemRequestDto {
    productId;
    quantity;
}
exports._OrderItemRequestDto = _OrderItemRequestDto;
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], _OrderItemRequestDto.prototype, "productId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], _OrderItemRequestDto.prototype, "quantity", void 0);
class CheckoutOrderRequestDto {
    orderId;
    customerId;
    items;
}
exports.CheckoutOrderRequestDto = CheckoutOrderRequestDto;
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CheckoutOrderRequestDto.prototype, "orderId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CheckoutOrderRequestDto.prototype, "customerId", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => _OrderItemRequestDto),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => _OrderItemRequestDto),
    __metadata("design:type", Array)
], CheckoutOrderRequestDto.prototype, "items", void 0);
//# sourceMappingURL=checkout-order.in-dto.js.map