import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class TodosInput {
  @Field(() => Float)
  startDate: number;

  @Field(() => Float)
  endDate: number;
}
