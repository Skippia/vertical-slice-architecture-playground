/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/checkout-service/src/app.module.ts":
/*!*************************************************!*\
  !*** ./apps/checkout-service/src/app.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const Joi = __webpack_require__(/*! joi */ "joi");
const logger_1 = __webpack_require__(/*! @app/common/modules/logger */ "./libs/common/src/modules/logger/index.ts");
const filters_1 = __webpack_require__(/*! @app/common/filters */ "./libs/common/src/filters/index.ts");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const logger_interceptor_1 = __webpack_require__(/*! @app/common/modules/logger/winston/logger.interceptor */ "./libs/common/src/modules/logger/winston/logger.interceptor.ts");
const middlewares_1 = __webpack_require__(/*! @app/common/middlewares */ "./libs/common/src/middlewares/index.ts");
const checkout_module_1 = __webpack_require__(/*! ./modules/checkout/checkout.module */ "./apps/checkout-service/src/modules/checkout/checkout.module.ts");
const rmq_1 = __webpack_require__(/*! @app/common/modules/rmq */ "./libs/common/src/modules/rmq/index.ts");
const rabbitmq_1 = __webpack_require__(/*! ./common/contracts/rabbitmq */ "./apps/checkout-service/src/common/contracts/rabbitmq/index.ts");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(middlewares_1.GenerateTraceIdMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                validationSchema: Joi.object({
                    PORT: Joi.string().required(),
                    POSTGRES_HOST: Joi.string().required(),
                    POSTGRES_PORT: Joi.number().required(),
                    POSTGRES_USER: Joi.string().required(),
                    POSTGRES_PASSWORD: Joi.string().required(),
                    POSTGRES_DB: Joi.string().required(),
                }),
                ignoreEnvFile: process.env.NODE_ENV === 'production',
                envFilePath: [
                    './apps/checkout-service/.env.dev',
                    './apps/checkout-service/.env.pg.dev',
                ],
            }),
            logger_1.WinstonLoggerModule.forRoot(),
            checkout_module_1.CheckoutModule,
            rmq_1.MessageBrokerModule.register(rabbitmq_1.EXCHANGES_CONFIG, rabbitmq_1.QUEUE_BINDINGS),
        ],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.AllExceptionFilter,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logger_interceptor_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);


/***/ }),

/***/ "./apps/checkout-service/src/common/contracts/rabbitmq/exchanges-config.ts":
/*!*********************************************************************************!*\
  !*** ./apps/checkout-service/src/common/contracts/rabbitmq/exchanges-config.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EXCHANGES_CONFIG = exports.EXCHANGE_TYPE_BY_NAME = exports.EXCHANGE_NAME = void 0;
exports.EXCHANGE_NAME = {
    AMQP_EXCHANGE_CHECKOUT: 'ex.checkout',
};
exports.EXCHANGE_TYPE_BY_NAME = {
    'ex.checkout': 'direct',
};
exports.EXCHANGES_CONFIG = Object.keys(exports.EXCHANGE_NAME).map((exchangeName) => ({
    name: exports.EXCHANGE_NAME[exchangeName],
    type: exports.EXCHANGE_TYPE_BY_NAME[exchangeName],
}));


/***/ }),

/***/ "./apps/checkout-service/src/common/contracts/rabbitmq/index.ts":
/*!**********************************************************************!*\
  !*** ./apps/checkout-service/src/common/contracts/rabbitmq/index.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./exchanges-config */ "./apps/checkout-service/src/common/contracts/rabbitmq/exchanges-config.ts"), exports);
__exportStar(__webpack_require__(/*! ./queues */ "./apps/checkout-service/src/common/contracts/rabbitmq/queues.ts"), exports);
__exportStar(__webpack_require__(/*! ./queue-bindings */ "./apps/checkout-service/src/common/contracts/rabbitmq/queue-bindings.ts"), exports);


/***/ }),

/***/ "./apps/checkout-service/src/common/contracts/rabbitmq/queue-bindings.ts":
/*!*******************************************************************************!*\
  !*** ./apps/checkout-service/src/common/contracts/rabbitmq/queue-bindings.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QUEUE_BINDINGS = void 0;
const exchanges_config_1 = __webpack_require__(/*! ./exchanges-config */ "./apps/checkout-service/src/common/contracts/rabbitmq/exchanges-config.ts");
const queues_1 = __webpack_require__(/*! ./queues */ "./apps/checkout-service/src/common/contracts/rabbitmq/queues.ts");
exports.QUEUE_BINDINGS = [
    {
        name: queues_1.QUEUE_NAME.CHECKOUT_SYNC_PROJECTION_QUEUE,
        exchange: exchanges_config_1.EXCHANGE_NAME.AMQP_EXCHANGE_CHECKOUT,
        routingKey: 'checkout.sync.projection',
        createQueueIfNotExists: true,
        options: {
            durable: true,
        },
    },
];


/***/ }),

/***/ "./apps/checkout-service/src/common/contracts/rabbitmq/queues.ts":
/*!***********************************************************************!*\
  !*** ./apps/checkout-service/src/common/contracts/rabbitmq/queues.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QUEUE_NAME = void 0;
exports.QUEUE_NAME = {
    CHECKOUT_SYNC_PROJECTION_QUEUE: 'q.checkout-sync-projection',
};


/***/ }),

/***/ "./apps/checkout-service/src/modules/checkout/checkout.controller.ts":
/*!***************************************************************************!*\
  !*** ./apps/checkout-service/src/modules/checkout/checkout.controller.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const checkout_service_1 = __webpack_require__(/*! ./checkout.service */ "./apps/checkout-service/src/modules/checkout/checkout.service.ts");
let CheckoutController = class CheckoutController {
    checkoutService;
    constructor(checkoutService) {
        this.checkoutService = checkoutService;
    }
    getHello() {
        return this.checkoutService.getHello();
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], CheckoutController.prototype, "getHello", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof checkout_service_1.CheckoutService !== "undefined" && checkout_service_1.CheckoutService) === "function" ? _a : Object])
], CheckoutController);


/***/ }),

/***/ "./apps/checkout-service/src/modules/checkout/checkout.module.ts":
/*!***********************************************************************!*\
  !*** ./apps/checkout-service/src/modules/checkout/checkout.module.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const checkout_service_1 = __webpack_require__(/*! ./checkout.service */ "./apps/checkout-service/src/modules/checkout/checkout.service.ts");
const checkout_controller_1 = __webpack_require__(/*! ./checkout.controller */ "./apps/checkout-service/src/modules/checkout/checkout.controller.ts");
const user_module_1 = __webpack_require__(/*! ../user/user.module */ "./apps/checkout-service/src/modules/user/user.module.ts");
const product_module_1 = __webpack_require__(/*! ../product/product.module */ "./apps/checkout-service/src/modules/product/product.module.ts");
const product_model_module_1 = __webpack_require__(/*! ../product-model/product-model.module */ "./apps/checkout-service/src/modules/product-model/product-model.module.ts");
let CheckoutModule = class CheckoutModule {
};
exports.CheckoutModule = CheckoutModule;
exports.CheckoutModule = CheckoutModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, product_module_1.ProductModule, product_model_module_1.ProductModelModule],
        controllers: [checkout_controller_1.CheckoutController],
        providers: [checkout_service_1.CheckoutService],
    })
], CheckoutModule);


/***/ }),

/***/ "./apps/checkout-service/src/modules/checkout/checkout.service.ts":
/*!************************************************************************!*\
  !*** ./apps/checkout-service/src/modules/checkout/checkout.service.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CheckoutService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let CheckoutService = class CheckoutService {
    getHello() {
        return 'Hello World!';
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)()
], CheckoutService);


/***/ }),

/***/ "./apps/checkout-service/src/modules/product-model/product-model.module.ts":
/*!*********************************************************************************!*\
  !*** ./apps/checkout-service/src/modules/product-model/product-model.module.ts ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductModelModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ProductModelModule = class ProductModelModule {
};
exports.ProductModelModule = ProductModelModule;
exports.ProductModelModule = ProductModelModule = __decorate([
    (0, common_1.Module)({})
], ProductModelModule);


/***/ }),

/***/ "./apps/checkout-service/src/modules/product/product.module.ts":
/*!*********************************************************************!*\
  !*** ./apps/checkout-service/src/modules/product/product.module.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProductModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({})
], ProductModule);


/***/ }),

/***/ "./apps/checkout-service/src/modules/user/user.module.ts":
/*!***************************************************************!*\
  !*** ./apps/checkout-service/src/modules/user/user.module.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({})
], UserModule);


/***/ }),

/***/ "./libs/common/src/filters/all-exception.filter.ts":
/*!*********************************************************!*\
  !*** ./libs/common/src/filters/all-exception.filter.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllExceptionFilter = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const base_exception_filter_1 = __webpack_require__(/*! ./base-exception-filter */ "./libs/common/src/filters/base-exception-filter/index.ts");
const winston_logger_service_1 = __webpack_require__(/*! @app/common/modules/logger/winston/winston-logger.service */ "./libs/common/src/modules/logger/winston/winston-logger.service.ts");
const winston_logger_decorator_1 = __webpack_require__(/*! @app/common/modules/logger/winston/winston-logger.decorator */ "./libs/common/src/modules/logger/winston/winston-logger.decorator.ts");
let AllExceptionFilter = class AllExceptionFilter extends base_exception_filter_1.BaseCustomExceptionFilter {
    logger;
    mapHandlers = {
        exceptions: {
            TypeError: base_exception_filter_1.typeErrorExceptionHandler,
        },
    };
    constructor(logger) {
        super(logger);
        this.logger = logger;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const exceptionName = exception?.constructor?.name;
        if (this.isControlledException(exceptionName)) {
            const { statusCode, message, stack } = this.mapHandlers.exceptions[exceptionName](exception);
            this.logMessage(request, message, statusCode, stack);
            return this.handleResponse({ request, response, statusCode, message });
        }
        this.resolveDefaultError({ exception, request, response });
    }
    isControlledException(exceptionName) {
        return Object.keys(this.mapHandlers.exceptions).includes(exceptionName);
    }
};
exports.AllExceptionFilter = AllExceptionFilter;
exports.AllExceptionFilter = AllExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __param(0, (0, winston_logger_decorator_1.InjectLogger)(AllExceptionFilter.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof winston_logger_service_1.WinstonLoggerService !== "undefined" && winston_logger_service_1.WinstonLoggerService) === "function" ? _a : Object])
], AllExceptionFilter);


/***/ }),

/***/ "./libs/common/src/filters/base-exception-filter/base-custom-exception-filter.ts":
/*!***************************************************************************************!*\
  !*** ./libs/common/src/filters/base-exception-filter/base-custom-exception-filter.ts ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseCustomExceptionFilter = void 0;
class BaseCustomExceptionFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    handleResponse({ request, response, message, statusCode, }) {
        const responseData = {
            message,
            statusCode,
            timestamp: new Date().toISOString(),
            path: request.url,
        };
        response.status(statusCode).json(responseData);
    }
    logMessage(request, message, statusCode, stack) {
        if (statusCode === 500) {
            this.logger.error(`End Request for ${request.path},
        method=${request.method} status=${statusCode}, 
        message=${message ? message : null},
        statusCode: ${statusCode >= 500 ? stack : ''}`);
        }
        else {
            this.logger.warn(`End Request for ${request.path},
         method=${request.method} status=${statusCode}
         message=${message ? message : null}`);
        }
    }
    getDefaultErrorResponse(exception) {
        const error = {
            statusCode: exception?.response?.statusCode,
            message: exception?.response?.message,
            stack: exception?.response?.stack,
        };
        const statusCode = error?.statusCode || 500;
        const message = error?.message || 'Unexpected exception error';
        const stack = error?.stack;
        return { statusCode, message, stack };
    }
    resolveDefaultError({ exception, request, response, }) {
        const { message, statusCode, stack } = this.getDefaultErrorResponse(exception);
        this.logMessage(request, message, statusCode, stack);
        return this.handleResponse({ request, response, statusCode, message });
    }
}
exports.BaseCustomExceptionFilter = BaseCustomExceptionFilter;


/***/ }),

/***/ "./libs/common/src/filters/base-exception-filter/index.ts":
/*!****************************************************************!*\
  !*** ./libs/common/src/filters/base-exception-filter/index.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./types-errors-handlers/type-error-exception-handler */ "./libs/common/src/filters/base-exception-filter/types-errors-handlers/type-error-exception-handler.ts"), exports);
__exportStar(__webpack_require__(/*! ./base-custom-exception-filter */ "./libs/common/src/filters/base-exception-filter/base-custom-exception-filter.ts"), exports);


/***/ }),

/***/ "./libs/common/src/filters/base-exception-filter/types-errors-handlers/type-error-exception-handler.ts":
/*!*************************************************************************************************************!*\
  !*** ./libs/common/src/filters/base-exception-filter/types-errors-handlers/type-error-exception-handler.ts ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.typeErrorExceptionHandler = typeErrorExceptionHandler;
function typeErrorExceptionHandler(exception) {
    return {
        statusCode: 400,
        message: exception.message
            .substring(exception.message.indexOf('\n\n\n') + 1)
            .trim(),
    };
}


/***/ }),

/***/ "./libs/common/src/filters/index.ts":
/*!******************************************!*\
  !*** ./libs/common/src/filters/index.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./all-exception.filter */ "./libs/common/src/filters/all-exception.filter.ts"), exports);


/***/ }),

/***/ "./libs/common/src/middlewares/generator-trace-id.middleware.ts":
/*!**********************************************************************!*\
  !*** ./libs/common/src/middlewares/generator-trace-id.middleware.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GenerateTraceIdMiddleware = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const async_hooks_1 = __webpack_require__(/*! async_hooks */ "async_hooks");
const logger_constants_1 = __webpack_require__(/*! @app/common/modules/logger/logger.constants */ "./libs/common/src/modules/logger/logger.constants.ts");
let GenerateTraceIdMiddleware = class GenerateTraceIdMiddleware {
    asyncStorage;
    constructor(asyncStorage) {
        this.asyncStorage = asyncStorage;
    }
    use(req, res, next) {
        const traceId = req.headers['x-request-id'] || (0, uuid_1.v4)();
        res.locals.traceId = traceId;
        const store = new Map().set('traceId', traceId);
        this.asyncStorage.run(store, () => {
            next();
        });
    }
};
exports.GenerateTraceIdMiddleware = GenerateTraceIdMiddleware;
exports.GenerateTraceIdMiddleware = GenerateTraceIdMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_constants_1.ASYNC_STORAGE)),
    __metadata("design:paramtypes", [typeof (_a = typeof async_hooks_1.AsyncLocalStorage !== "undefined" && async_hooks_1.AsyncLocalStorage) === "function" ? _a : Object])
], GenerateTraceIdMiddleware);


/***/ }),

/***/ "./libs/common/src/middlewares/index.ts":
/*!**********************************************!*\
  !*** ./libs/common/src/middlewares/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./generator-trace-id.middleware */ "./libs/common/src/middlewares/generator-trace-id.middleware.ts"), exports);


/***/ }),

/***/ "./libs/common/src/modules/logger/index.ts":
/*!*************************************************!*\
  !*** ./libs/common/src/modules/logger/index.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./winston */ "./libs/common/src/modules/logger/winston/index.ts"), exports);


/***/ }),

/***/ "./libs/common/src/modules/logger/logger.constants.ts":
/*!************************************************************!*\
  !*** ./libs/common/src/modules/logger/logger.constants.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ASYNC_STORAGE = void 0;
exports.ASYNC_STORAGE = 'async_storage';


/***/ }),

/***/ "./libs/common/src/modules/logger/winston/index.ts":
/*!*********************************************************!*\
  !*** ./libs/common/src/modules/logger/winston/index.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./winston-logger.module */ "./libs/common/src/modules/logger/winston/winston-logger.module.ts"), exports);


/***/ }),

/***/ "./libs/common/src/modules/logger/winston/logger.interceptor.ts":
/*!**********************************************************************!*\
  !*** ./libs/common/src/modules/logger/winston/logger.interceptor.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
const winston_logger_constants_1 = __webpack_require__(/*! ./winston-logger.constants */ "./libs/common/src/modules/logger/winston/winston-logger.constants.ts");
const winston_logger_decorator_1 = __webpack_require__(/*! ./winston-logger.decorator */ "./libs/common/src/modules/logger/winston/winston-logger.decorator.ts");
const winston_logger_service_1 = __webpack_require__(/*! ./winston-logger.service */ "./libs/common/src/modules/logger/winston/winston-logger.service.ts");
let LoggingInterceptor = class LoggingInterceptor {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        if (!response.locals?.traceId) {
            return next.handle();
        }
        const startDate = Date.now();
        const request = ctx.getRequest();
        this.logger.http(JSON.stringify({
            type: winston_logger_constants_1.LOG_TYPE.REQUEST_ARGS,
            path: request?.path,
            method: request?.method,
            ip: request?.ip,
        }));
        return next.handle().pipe((0, operators_1.tap)(() => {
            this.logger.http(JSON.stringify({
                type: winston_logger_constants_1.LOG_TYPE.RESPONSE_RESULT,
                path: request?.path,
                method: request?.method,
                ip: request?.ip,
                duration: `${Date.now() - startDate}ms`,
            }));
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, winston_logger_decorator_1.InjectLogger)(LoggingInterceptor.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof winston_logger_service_1.WinstonLoggerService !== "undefined" && winston_logger_service_1.WinstonLoggerService) === "function" ? _a : Object])
], LoggingInterceptor);


/***/ }),

/***/ "./libs/common/src/modules/logger/winston/winston-logger.config.ts":
/*!*************************************************************************!*\
  !*** ./libs/common/src/modules/logger/winston/winston-logger.config.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultOptions = void 0;
const winston_1 = __webpack_require__(/*! winston */ "winston");
const colors = __webpack_require__(/*! colors/safe */ "colors/safe");
const customFormat = winston_1.format.printf((args) => {
    const { service, level, timestamp, message, traceId } = args;
    const logData = {
        level,
        source: colors.yellow(service),
        timestamp,
        message,
        traceId: colors.gray(traceId),
    };
    return JSON.stringify(logData);
});
exports.defaultOptions = {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'isoDateTime' }), winston_1.format.json(), customFormat),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.timestamp({ format: 'isoDateTime' }), winston_1.format.json(), winston_1.format.colorize({ all: true })),
            handleExceptions: true,
        }),
    ],
};


/***/ }),

/***/ "./libs/common/src/modules/logger/winston/winston-logger.constants.ts":
/*!****************************************************************************!*\
  !*** ./libs/common/src/modules/logger/winston/winston-logger.constants.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LOG_TYPE = exports.NESTJS_WINSTON_CONFIG_OPTIONS = void 0;
exports.NESTJS_WINSTON_CONFIG_OPTIONS = 'NESTJS_WINSTON_CONFIG_OPTIONS';
exports.LOG_TYPE = {
    REQUEST_ARGS: 'Request args',
    RESPONSE_RESULT: 'Response result',
};


/***/ }),

/***/ "./libs/common/src/modules/logger/winston/winston-logger.decorator.ts":
/*!****************************************************************************!*\
  !*** ./libs/common/src/modules/logger/winston/winston-logger.decorator.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLoggerToken = getLoggerToken;
exports.InjectLogger = InjectLogger;
exports.getLoggerContexts = getLoggerContexts;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const winston_logger_service_1 = __webpack_require__(/*! ./winston-logger.service */ "./libs/common/src/modules/logger/winston/winston-logger.service.ts");
const loggerContexts = new Set();
function getLoggerToken(context) {
    return `${winston_logger_service_1.WinstonLoggerService.name}:${context}`;
}
function InjectLogger(context = '') {
    loggerContexts.add(context);
    return (0, common_1.Inject)(getLoggerToken(context));
}
function getLoggerContexts() {
    return [...loggerContexts.values()];
}


/***/ }),

/***/ "./libs/common/src/modules/logger/winston/winston-logger.module.ts":
/*!*************************************************************************!*\
  !*** ./libs/common/src/modules/logger/winston/winston-logger.module.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WinstonLoggerModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WinstonLoggerModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const async_hooks_1 = __webpack_require__(/*! async_hooks */ "async_hooks");
const logger_constants_1 = __webpack_require__(/*! ../logger.constants */ "./libs/common/src/modules/logger/logger.constants.ts");
const winston_logger_config_1 = __webpack_require__(/*! ./winston-logger.config */ "./libs/common/src/modules/logger/winston/winston-logger.config.ts");
const winston_logger_decorator_1 = __webpack_require__(/*! ./winston-logger.decorator */ "./libs/common/src/modules/logger/winston/winston-logger.decorator.ts");
const winston_logger_constants_1 = __webpack_require__(/*! ./winston-logger.constants */ "./libs/common/src/modules/logger/winston/winston-logger.constants.ts");
const winston_logger_service_1 = __webpack_require__(/*! ./winston-logger.service */ "./libs/common/src/modules/logger/winston/winston-logger.service.ts");
const asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
let WinstonLoggerModule = WinstonLoggerModule_1 = class WinstonLoggerModule {
    static forRoot(customOptions = {}) {
        const options = { ...winston_logger_config_1.defaultOptions, ...customOptions };
        const contexts = (0, winston_logger_decorator_1.getLoggerContexts)();
        return {
            module: WinstonLoggerModule_1,
            providers: [
                {
                    provide: logger_constants_1.ASYNC_STORAGE,
                    useValue: asyncLocalStorage,
                },
                {
                    provide: winston_logger_constants_1.NESTJS_WINSTON_CONFIG_OPTIONS,
                    useValue: options,
                },
                ...contexts.map((context) => ({
                    provide: (0, winston_logger_decorator_1.getLoggerToken)(context),
                    useFactory: () => {
                        const logger = new winston_logger_service_1.WinstonLoggerService(options, asyncLocalStorage);
                        logger.setContext(context);
                        return logger;
                    },
                })),
            ],
            exports: [
                logger_constants_1.ASYNC_STORAGE,
                winston_logger_constants_1.NESTJS_WINSTON_CONFIG_OPTIONS,
                ...contexts.map((context) => (0, winston_logger_decorator_1.getLoggerToken)(context)),
            ],
        };
    }
};
exports.WinstonLoggerModule = WinstonLoggerModule;
exports.WinstonLoggerModule = WinstonLoggerModule = WinstonLoggerModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], WinstonLoggerModule);


/***/ }),

/***/ "./libs/common/src/modules/logger/winston/winston-logger.service.ts":
/*!**************************************************************************!*\
  !*** ./libs/common/src/modules/logger/winston/winston-logger.service.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WinstonLoggerService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const winston_1 = __webpack_require__(/*! winston */ "winston");
const async_hooks_1 = __webpack_require__(/*! async_hooks */ "async_hooks");
const winston_logger_constants_1 = __webpack_require__(/*! ./winston-logger.constants */ "./libs/common/src/modules/logger/winston/winston-logger.constants.ts");
const logger_constants_1 = __webpack_require__(/*! ../logger.constants */ "./libs/common/src/modules/logger/logger.constants.ts");
let WinstonLoggerService = class WinstonLoggerService extends common_1.ConsoleLogger {
    asyncStorage;
    logger;
    constructor(config, asyncStorage) {
        super();
        this.asyncStorage = asyncStorage;
        this.logger = (0, winston_1.createLogger)(config);
    }
    setContext(serviceName) {
        this.logger.defaultMeta = {
            ...this.logger.defaultMeta,
            service: serviceName,
        };
    }
    getTraceId() {
        return this.asyncStorage.getStore()?.get('traceId');
    }
    error(message) {
        this.logger.error(message, { traceId: this.getTraceId() });
    }
    warn(message) {
        this.logger.warn(message, { traceId: this.getTraceId() });
    }
    info(message) {
        this.logger.info(message, { traceId: this.getTraceId() });
    }
    http(message) {
        this.logger.http(message, { traceId: this.getTraceId() });
    }
    verbose(message) {
        this.logger.verbose(message, { traceId: this.getTraceId() });
    }
    debug(message) {
        this.logger.debug(message, { traceId: this.getTraceId() });
    }
};
exports.WinstonLoggerService = WinstonLoggerService;
exports.WinstonLoggerService = WinstonLoggerService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __param(0, (0, common_1.Inject)(winston_logger_constants_1.NESTJS_WINSTON_CONFIG_OPTIONS)),
    __param(1, (0, common_1.Inject)(logger_constants_1.ASYNC_STORAGE)),
    __metadata("design:paramtypes", [typeof (_a = typeof winston_1.LoggerOptions !== "undefined" && winston_1.LoggerOptions) === "function" ? _a : Object, typeof (_b = typeof async_hooks_1.AsyncLocalStorage !== "undefined" && async_hooks_1.AsyncLocalStorage) === "function" ? _b : Object])
], WinstonLoggerService);


/***/ }),

/***/ "./libs/common/src/modules/rmq/index.ts":
/*!**********************************************!*\
  !*** ./libs/common/src/modules/rmq/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./rmq.module */ "./libs/common/src/modules/rmq/rmq.module.ts"), exports);


/***/ }),

/***/ "./libs/common/src/modules/rmq/rmq.module.ts":
/*!***************************************************!*\
  !*** ./libs/common/src/modules/rmq/rmq.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessageBrokerModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageBrokerModule = void 0;
const nestjs_rabbitmq_1 = __webpack_require__(/*! @golevelup/nestjs-rabbitmq */ "@golevelup/nestjs-rabbitmq");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const Joi = __webpack_require__(/*! joi */ "joi");
let MessageBrokerModule = MessageBrokerModule_1 = class MessageBrokerModule {
    static register(EXCHANGES_CONFIG, QUEUE_BINDINGS) {
        return {
            module: MessageBrokerModule_1,
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema: Joi.object({
                        AMQP_URI: Joi.string().required(),
                    }),
                    envFilePath: './apps/checkout-service/.env.amqp.dev',
                    ignoreEnvFile: process.env.NODE_ENV === 'production',
                }),
                nestjs_rabbitmq_1.RabbitMQModule.forRootAsync({
                    inject: [config_1.ConfigService],
                    useFactory: (configService) => ({
                        exchanges: EXCHANGES_CONFIG,
                        queues: QUEUE_BINDINGS,
                        connectionInitOptions: {
                            wait: false,
                        },
                        defaultExchangeType: 'direct',
                        defaultSubscribeErrorBehavior: nestjs_rabbitmq_1.MessageHandlerErrorBehavior.NACK,
                        channels: {
                            default: {
                                prefetchCount: 1,
                                default: true,
                            },
                        },
                        uri: configService.get('AMQP_URI'),
                        enableControllerDiscovery: true,
                    }),
                }),
            ],
            exports: [nestjs_rabbitmq_1.RabbitMQModule],
        };
    }
};
exports.MessageBrokerModule = MessageBrokerModule;
exports.MessageBrokerModule = MessageBrokerModule = MessageBrokerModule_1 = __decorate([
    (0, common_1.Module)({})
], MessageBrokerModule);


/***/ }),

/***/ "@golevelup/nestjs-rabbitmq":
/*!*********************************************!*\
  !*** external "@golevelup/nestjs-rabbitmq" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("@golevelup/nestjs-rabbitmq");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "async_hooks":
/*!******************************!*\
  !*** external "async_hooks" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("async_hooks");

/***/ }),

/***/ "colors/safe":
/*!******************************!*\
  !*** external "colors/safe" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("colors/safe");

/***/ }),

/***/ "joi":
/*!**********************!*\
  !*** external "joi" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("joi");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("winston");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*******************************************!*\
  !*** ./apps/checkout-service/src/main.ts ***!
  \*******************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/checkout-service/src/app.module.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT');
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    await app.listen(port);
}
bootstrap();

})();

/******/ })()
;