import { prop, getModelForClass } from '@typegoose/typegoose';

class Community {
  @prop({ required: true })
  public name?: string;

  @prop()
  public logo?: string;
  

  @prop() 
  public users?: Array<string>;
}

export const CommunityModel = getModelForClass(Community);
