import { CONTINUE_TEXT } from './constants';
import { textToEMeet, eMeet, eSelectPick } from './enums';
import { getFirstHourOfMatrix } from './get-first-hour-of-matrix';

export interface IMeet {
    type: eMeet,
    day: number,
    startTime: number,
    endTime: number,
    details: string,
    location: string,
    elements: HTMLDivElement[],
    export: boolean,
}
export interface ICourse {
    name: string,
    number: string,
    meets: IMeet[],
}
interface IGetCourse {
    (): ICourse[];
}

const getCourseElements = () => {
    return Array.from(document.querySelectorAll('#ContentPlaceHolder1_matrixA_gvMatrixPeriodSchedule td div'));
};

export const getCourses : IGetCourse = () => {
    const elms = getCourseElements();

    const courses: ICourse[] = [];
    const coursesNamesToIndex = {};
    const firstHourOfMatrix = getFirstHourOfMatrix();

    elms.forEach((elm: HTMLDivElement) => {
        const rowIndex = (<HTMLTableRowElement>elm.parentElement.parentElement).rowIndex;
        const columnIndex = (<HTMLTableCellElement>elm.parentElement).cellIndex;

        const text = elm.innerText;
        const lines = text.split('\n');
        const headline = lines[0];
        const headlineNoNumber = headline.replace(/\(\d.*/, '').trim();
        let index = coursesNamesToIndex[headlineNoNumber];
        if (index === undefined) {
            index = courses.length;
            coursesNamesToIndex[headlineNoNumber] = index;
            const courseNumber = headline.match(/\((.*)\-/)[1];

            courses[index] = {
                name: headlineNoNumber,
                number: courseNumber,
                meets: [],
            }
        }

        const course = courses[index];
        const day = columnIndex - 1;
        const startTime = rowIndex + (firstHourOfMatrix - 1);
        const endTime = rowIndex + firstHourOfMatrix;
        const isContinueMeet = [lines[0], lines[1]].some(line => line.indexOf(CONTINUE_TEXT) !== -1);
        if (!isContinueMeet) {
            const meetType = textToEMeet[lines[1]];
            const otherLines = lines.filter((_, index) => [0, 1].indexOf(index) === -1);
            const locationIndex = otherLines.findIndex(line => line.match(/[0-9]/));
            const location = otherLines[locationIndex];
            const detailsLines = otherLines.filter((_, index) => index !== locationIndex);

            course.meets.push({
                type: meetType,
                day: day,
                startTime,
                endTime,
                details: detailsLines.filter(line => line.length > 0).join('\\n'),
                location,
                elements: [elm],
                export: true,
            });
        } else {
            const meet = course.meets.find(meet => {
                return (meet.endTime === startTime) && (meet.day === day);
            });
            meet.endTime = endTime;
            meet.elements.push(elm);
        }
    });

    return courses;
};

export const setCoursesExport = ({ courses, courseIndex, meetIndex }: {
    courses: ICourse[],
    courseIndex?: number,
    meetIndex?: number,
}, setExport = undefined) => {
    courses.forEach((course, currentCourseIndex) => {
        if (courseIndex === undefined || currentCourseIndex === courseIndex) {
            course.meets.forEach((meet, currentMeetIndex) => {
                if (meetIndex === undefined || currentMeetIndex === meetIndex) {
                    if (setExport === undefined) {
                        setExport = !meet.export;
                    }
                    meet.export = setExport;
                }
            });
        }
    });
}

export const addMeetClickListener = ({ courses }, onClick) => {
    const listeners = [];
    courses.forEach((course, courseIndex) => {
        listeners[courseIndex] = [];

        course.meets.forEach((meet, meetIndex) => {
            listeners[courseIndex][meetIndex] = [];
            meet.elements.forEach((element, elementIndex) => {
                listeners[courseIndex][meetIndex][elementIndex] = () => {
                    onClick({ courseIndex, meetIndex, elementIndex });
                }
                element.addEventListener('click', listeners[courseIndex][meetIndex][elementIndex]);
            });
        });
    });

    const removeListeners = () => {
        courses.forEach((course, courseIndex) => {
            course.meets.forEach((meet, meetIndex) => {
                meet.elements.forEach((element, elementIndex) => {
                    element.removeEventListener('click', listeners[courseIndex][meetIndex][elementIndex]);
                });
            });
        });
    };

    return removeListeners;
}

export const updateView = ({ courses, selectPick } : { courses: ICourse[], selectPick: eSelectPick }) => {
    const tableElm = document.querySelector('table#ContentPlaceHolder1_matrixA_gvMatrixPeriodSchedule');
    if (selectPick === eSelectPick.all) {
        tableElm.classList.remove('uv-multi-select');
    } else {
        tableElm.classList.add('uv-multi-select');
    }

    courses.forEach(course => {
        course.meets.forEach(meet => {
            meet.elements.forEach(element => {
                if (meet.export) {
                    element.classList.add('uv-selected');
                } else {
                    element.classList.remove('uv-selected');
                }
            });
        });
    });

    const isAllSelected = courses.every(course => course.meets.every(meet=> meet.export));

    const clearBtn = <HTMLButtonElement>document.querySelector('.uv-container .clearBtn');
    clearBtn.innerText = isAllSelected ? 'בטל הכל' : 'בחר הכל';
}