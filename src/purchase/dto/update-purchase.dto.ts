import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {}
