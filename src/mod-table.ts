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
        td.innerHTML = `${html.replace(/<span/g, '<div><span').replace('br><div>', 'br></div><div>')}</div>`;
    });
};
