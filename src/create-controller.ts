import { CONTAINER_ID } from './constants';
import { eSelectPick, eSelectPickText } from './enums';
import { getEstimatedEndSemesterDate } from './get-estimated-end-semester-date';
import { getValues } from './enum-values';

export const createController = ({ selectPick: defaultSelectPick, }, { onCreateIcs, onOpenGoogleSettings, cancelOrClearAll, onSelectPickTypeChange, }) => {
    const container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.classList.add('uv-container');
    container.innerHTML = `
    <h3>
        ייצוא מערכת השעות ליומן ע"י יובל
    </h3>
    <form method="get">
        <div>
            <label>
                <span>
                    תאריך סוף סמסטר: 
                </span>
                <input type="date">
            </label>
        </div>
        <div>
            <label>
                <span>
                    סוג ייצוא: 
                </span>
                <select>
                    ${getValues(eSelectPick).map(selectPick => (`<option ${selectPick === defaultSelectPick ? 'selected' : ''} value="${selectPick}">${eSelectPickText[selectPick]}</option>`)).join('')}
                </select>
            </label>
            <button type="button" class="clearBtn ${defaultSelectPick === eSelectPick.all ? 'hide' : ''}">בטל / בחר הכל</button>
        </div>
        <div>
            <button type="submit">ייצוא</button>
            <button type="button" class="google">לעמוד ייבוא בgoogle calendar</button>
        </div>
    </form>
    `;
    const inputDate = <HTMLInputElement>container.querySelector('input[type="date"]');
    const form = container.querySelector('form');
    const select = container.querySelector('select');
    const clearBtn = container.querySelector('.clearBtn');
    const googleBtn = container.querySelector('.google');
    form.addEventListener('submit', e => {
        e.stopPropagation();
        e.preventDefault();
        if (onCreateIcs) {
            onCreateIcs();
        }
    });
    select.addEventListener('change', () => {
        const selectPickType = Number(select.value);
        if (selectPickType === eSelectPick.all) {
            clearBtn.classList.add('hide');
        }
        else {
            clearBtn.classList.remove('hide');
        }
        if (onSelectPickTypeChange) {
            onSelectPickTypeChange(selectPickType);
        }
    });
    googleBtn.addEventListener('click', () => {
        if (onOpenGoogleSettings) {
            onOpenGoogleSettings();
        }
    });
    clearBtn.addEventListener('click', () => {
        if (cancelOrClearAll) {
            cancelOrClearAll({ selectPickType: Number(select.value) });
        }
    });
    const setDateValue = date => {
        const local = new Date(date);
        local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        inputDate.value = local.toJSON().slice(0, 10);
    };
    const defaultValue = getEstimatedEndSemesterDate(newValue => {
        setDateValue(newValue);
    });
    setDateValue(defaultValue);
    const getEndSemesterDate = () => {
        return new Date(inputDate.value);
    };
    const get = () => {
        return new Date(inputDate.value);
    };
    const beforeNode = document.querySelector('.dvToolbar');
    beforeNode.parentNode.insertBefore(container, beforeNode.nextSibling);
    return { getEndSemesterDate };
};
