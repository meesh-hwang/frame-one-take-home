import { prop, getModelForClass } from '@typegoose/typegoose';

class User {
	@prop({ required: true })
	public email?: string;

	@prop({ required: true, select: false })
	public passwordHash?: string;

	@prop()
	public profilePicture?: string;

	@prop({ required: true, select: false, default: [] })
	public experiencePoints?: { points: number, timestamp: Date }[];

	@prop({ select: true })
	public community?: string;
}

export const UserModel = getModelForClass(User);