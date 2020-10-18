export const getFirstHourOfMatrix = () => {
    const td = <HTMLTableDataCellElement>document.querySelector('.uv-cell');
    const text = td.innerText;
    const hour = Number(text.replace(/:.*/g, ''));

    return hour;
};
