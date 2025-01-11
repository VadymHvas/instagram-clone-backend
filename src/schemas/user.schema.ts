import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document{
    @Prop({required: true})
    public username: string;

    @Prop({required: true})
    public password: string;

    @Prop({required: true})
    public name: string;

    // Path to image
    @Prop({default: "", type: String})
    public avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);