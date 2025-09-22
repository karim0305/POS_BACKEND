import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './product/product.module';
import { PurchaseModule } from './purchase/purchase.module';
import { SaleModule } from './sale/sale.module';
import { UserModule } from './user/user.module';
import { SupplierModule } from './supplier/supplier.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CustomerModule } from './customer/customer.module';
import { ReportsModule } from './reports/reports.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, any>) => {
        if (!config.JWT_SECRET) {
          throw new Error('JWT_SECRET is required in .env');
        }
        if (!config.MONGODB_URI) {
          throw new Error('MONGODB_URI is required in .env');
        }
        if (!config.JWT_EXPIRES_IN) {
          throw new Error('JWT_EXPIRES_IN is required in .env');
        }
        return config;
      },
    }),

    // ✅ MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),

    ProductsModule,
    PurchaseModule,
    SaleModule,
    UserModule,
    SupplierModule,
    DashboardModule,
    CustomerModule,
    ReportsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
