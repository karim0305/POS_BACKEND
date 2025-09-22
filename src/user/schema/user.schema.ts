import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;


@Prop({ type: Date, default: Date.now })
lastLogin: Date;

  @Prop({ required: true,  default: "Active" })
  status: string;

  @Prop({ required: true })
  password: string;



  @Prop({ required: true,  default: "Admin" })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
