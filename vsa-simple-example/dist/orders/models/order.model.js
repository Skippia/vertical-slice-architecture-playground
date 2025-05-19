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
exports.Order = exports.OrderItem = void 0;
const classes_1 = require("@automapper/classes");
class OrderItem {
    productId;
    quantity;
}
exports.OrderItem = OrderItem;
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], OrderItem.prototype, "productId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
class Order {
    orderId;
    customerId;
    items;
    processedAt;
}
exports.Order = Order;
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", String)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, classes_1.AutoMap)(() => OrderItem),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, classes_1.AutoMap)(),
    __metadata("design:type", Date)
], Order.prototype, "processedAt", void 0);
//# sourceMappingURL=order.model.js.map