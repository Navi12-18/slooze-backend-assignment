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
exports.RestaurantsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const restaurants_service_1 = require("./restaurants.service");
const restaurant_model_1 = require("./models/restaurant.model");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let RestaurantsResolver = class RestaurantsResolver {
    restaurantsService;
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    restaurants(user) {
        return this.restaurantsService.findAll(user);
    }
    restaurant(user, id) {
        return this.restaurantsService.findById(user, id);
    }
};
exports.RestaurantsResolver = RestaurantsResolver;
__decorate([
    (0, graphql_1.Query)(() => [restaurant_model_1.RestaurantModel]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsResolver.prototype, "restaurants", null);
__decorate([
    (0, graphql_1.Query)(() => restaurant_model_1.RestaurantModel),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RestaurantsResolver.prototype, "restaurant", null);
exports.RestaurantsResolver = RestaurantsResolver = __decorate([
    (0, graphql_1.Resolver)(() => restaurant_model_1.RestaurantModel),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsResolver);
//# sourceMappingURL=restaurants.resolver.js.map