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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_enum_1 = require("../enum/user.enum");
const class_transformer_1 = require("class-transformer");
class CreateUserDto {
    fullName;
    email;
    lastLogin;
    status;
    password;
    role;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Full name of the user',
        example: 'John Doe',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: '❌ Full name is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address of the user',
        example: 'john@example.com',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: '❌ Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: '❌ Invalid email address' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last login status of the user',
        example: Date.now(),
        default: Date.now(),
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateUserDto.prototype, "lastLogin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'active status of the user',
        example: 'Active',
        default: 'Active',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: '❌ Status is required', }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password for the user account (min 6 characters)',
        example: 'password123',
        minLength: 6,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: '❌ Password is required' }),
    (0, class_validator_1.MinLength)(6, { message: '❌ Password must be at least 6 characters' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role of the user',
        example: 'Admin',
        enum: user_enum_1.UserRole,
    }),
    (0, class_validator_1.IsNotEmpty)({ message: '❌ Role is required' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
//# sourceMappingURL=create-user.dto.js.map