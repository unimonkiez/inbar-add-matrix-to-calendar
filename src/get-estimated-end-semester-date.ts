export const getEstimatedEndSemesterDate = (onChange) => {
    const select = <HTMLSelectElement>document.querySelector('.ToolBarCell1 select');
    const getValue = () => {
        const date = new Date();
        date.setDate(1);
        let month;
        switch (select.value) {
            case '1':
            default:
                month = 1;
                break;
            case '2':
                month = 6;
                break;
            case '3':
                month = 9;
                break;
        }
        date.setMonth(month);
        return date;
    };
    const defaultValue = getValue();
    if (onChange) {
        select.addEventListener('change', () => {
            onChange(getValue());
        });
    }
    return defaultValue;
};
