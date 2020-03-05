import { eMeet, eMeetText } from './enums';
import { ICourse, IMeet } from './courses';

export const getEventName = (course: ICourse, meet: IMeet) => {
    if (meet.type === eMeet.freeHours) {
        return `${course.name} (${course.number})`;
    }
    return `${eMeetText[meet.type]} - ${course.name} (${course.number})`;
};
