export const getNames = e => {
    return Object.keys(e).filter(function (key) { return isNaN(+key); });
};
export const getNamesAndValues = e => {
    return getNames(e).map(function (_name) { return { name: _name, value: e[_name] }; });
};
export const getNameFromValue = (e, value) => {
    const all = getNamesAndValues(e).filter(function (pair) { return pair.value === value; });
    return all.length == 1 ? all[0].name : null;
};
export const getValues = e => {
    return getNames(e).map(function (name) { return e[name]; });
};