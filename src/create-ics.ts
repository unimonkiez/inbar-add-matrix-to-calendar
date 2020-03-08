import { ics } from './ics.js';
import { ICourse } from './courses';
import { getEventName } from './get-event-name';

interface ICreateIcs {
    (params: {
        courses: ICourse[];
        untilDate: Date;
    }): void;
}

export const createIcs : ICreateIcs = ({ courses , untilDate }) => {
    var cal = ics();
    const now = new Date();
    courses.forEach(course => {
        course.meets
            .filter(meet => meet.export)
            .forEach(meet => {
                const dayDiff = meet.day - now.getDay();
                const dayOffset = dayDiff >= 0 ? dayDiff : (7 + dayDiff);
                const beginDate = new Date(now.valueOf());
                beginDate.setDate(beginDate.getDate() + dayOffset);
                beginDate.setMilliseconds(0);
                beginDate.setSeconds(0);
                beginDate.setMinutes(0);
                beginDate.setHours(meet.startTime);
                const endDate = new Date(now.valueOf());
                endDate.setDate(endDate.getDate() + dayOffset);
                endDate.setMilliseconds(0);
                endDate.setSeconds(0);
                endDate.setMinutes(0);
                endDate.setHours(meet.endTime);
                cal.addEvent(getEventName(course, meet), meet.details, meet.location, beginDate, endDate, {
                    freq: 'WEEKLY',
                    until: untilDate,
                });
            });
    });
    cal.download();
};
