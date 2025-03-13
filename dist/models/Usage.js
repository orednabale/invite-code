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
exports.Usage = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const InviteCode_1 = require("./InviteCode");
let Usage = class Usage {
};
exports.Usage = Usage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Usage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => InviteCode_1.InviteCode, inviteCode => inviteCode.usages),
    __metadata("design:type", InviteCode_1.InviteCode)
], Usage.prototype, "inviteCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.usedCodes),
    __metadata("design:type", User_1.User)
], Usage.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Usage.prototype, "usedIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Usage.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Usage.prototype, "usedAt", void 0);
exports.Usage = Usage = __decorate([
    (0, typeorm_1.Entity)()
], Usage);
//# sourceMappingURL=Usage.js.map