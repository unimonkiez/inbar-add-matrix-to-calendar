const getTds = () => {
    return Array.from(document.querySelectorAll('#ContentPlaceHolder1_matrixA_gvMatrixPeriodSchedule td'));
};
const getDataTds = () => {
    const tds = getTds();
    return tds.filter(td => td.innerHTML !== '&nbsp;');
};
export const modTable = () => {
    const tds = getDataTds();
    tds.forEach(td => {
        const html = td.innerHTML;
        td.classList.add('uv-cell');
        td.innerHTML = `${html.replace(/<span/g, '<div class="uv-course"><span').replace('br><div class="uv-course">', 'br></div><div class="uv-course">')}</div>`;
    });
};
