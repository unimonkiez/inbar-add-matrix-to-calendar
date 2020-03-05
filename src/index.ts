import { GOOGLE_CAL_IMPORT_URL, CONTAINER_ID } from './constants';
import { getCourses, setCoursesExport, addMeetClickListener, updateView } from './courses';
import { openInNewTab } from './open-in-new-tab';
import { createController } from './create-controller';
import { createIcs } from './create-ics';
import { modTable } from './mod-table';
import { eSelectPick } from './enums';

if (!document.querySelector(`#${CONTAINER_ID}`)) {
    modTable();

    const data = {
        courses: getCourses(),
        selectPick: eSelectPick.all,
    };

    const controller = createController(
        {
            selectPick: data.selectPick,
        },
        {
            onCreateIcs: () => {
                createIcs({
                    courses: data.courses,
                    getEndSemesterDate: controller.getEndSemesterDate,
                });
            },
            onOpenGoogleSettings: () => {
                openInNewTab(GOOGLE_CAL_IMPORT_URL);
            },
            cancelOrClearAll: () => {
                const allSelected = data.courses.every(course => course.meets.every(meet => meet.export));
                setCoursesExport({ courses: data.courses }, !allSelected);
                updateView(data);
            },
            onSelectPickTypeChange: (newSelectPickType) => {
                data.selectPick = newSelectPickType;
                if (data.selectPick === eSelectPick.all) {
                    setCoursesExport({ courses: data.courses }, true);
                }
                updateView(data);
            },
        }
    );
    updateView(data);
    addMeetClickListener({ courses: data.courses }, ({ courseIndex, meetIndex }) => {
        setCoursesExport({ courses: data.courses, courseIndex, meetIndex });
        updateView(data);
    });
}
