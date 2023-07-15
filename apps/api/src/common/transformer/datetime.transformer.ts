import dayjs, { type Dayjs } from 'dayjs';
import { FindOperator, ValueTransformer } from 'typeorm';

/**
 * string <-> dayjs instance
 */
export const DatetimeTransformer: ValueTransformer = {
  // Entity -> Database
  to(time: dayjs.Dayjs | FindOperator<any>): Date | FindOperator<Date> {
    if (time) {
      if (time instanceof FindOperator && dayjs.isDayjs(time.value)) {
        return new FindOperator(time.type, time.value.toDate());
      }

      if (dayjs.isDayjs(time)) {
        return time.toDate();
      }
    }

    return undefined;
  },
  // Database -> Entity
  from(value: Date): Dayjs {
    if (value) {
      const dateTime = dayjs(value);

      if (dateTime.isValid()) {
        return dateTime;
      }
    }

    return undefined;
  },
};
