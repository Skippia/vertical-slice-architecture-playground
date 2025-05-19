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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCheckoutProfile = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@automapper/nestjs");
const core_1 = require("@automapper/core");
const order_model_1 = require("./models/order.model");
const checkout_order_in_dto_1 = require("./dto/checkout-order.in-dto");
const checkout_order_out_dto_1 = require("./dto/checkout-order.out-dto");
let OrderCheckoutProfile = class OrderCheckoutProfile extends nestjs_1.AutomapperProfile {
    constructor(mapper) {
        super(mapper);
    }
    get profile() {
        return (mapper) => {
            (0, core_1.createMap)(mapper, checkout_order_in_dto_1._OrderItemRequestDto, order_model_1.OrderItem);
            (0, core_1.createMap)(mapper, order_model_1.OrderItem, checkout_order_out_dto_1._OrderItemResponseDto);
            (0, core_1.createMap)(mapper, checkout_order_in_dto_1.CheckoutOrderRequestDto, order_model_1.Order);
            (0, core_1.createMap)(mapper, order_model_1.Order, checkout_order_out_dto_1.CheckoutOrderResponseDto, (0, core_1.forMember)((dest) => dest.success, (0, core_1.mapFrom)(() => true)), (0, core_1.forMember)((dest) => dest.message, (0, core_1.mapFrom)((src) => `Order ${src.orderId} completed`)));
        };
    }
};
exports.OrderCheckoutProfile = OrderCheckoutProfile;
exports.OrderCheckoutProfile = OrderCheckoutProfile = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_1.InjectMapper)()),
    __metadata("design:paramtypes", [Object])
], OrderCheckoutProfile);
//# sourceMappingURL=order-checkout.mapper.js.map