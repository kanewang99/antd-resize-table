export const isPercentage = (inResult) => {
    const patt1 = new RegExp(/^\d+%$/);
    const result = patt1.test(inResult);
    return result;
};
export const isNumber = (string) => {
    if (!string) return false;
    return Number(string).toString() !== 'NaN';
};

export const toPoint = (percent) => {
    let str = Number(percent.replace('%', ''));
    str = str / 100;
    return str;
};

export const deletePx = (str) => {
    if (typeof str === 'number') return str;
    if (isNumber(str?.replace('px', ''))) return Number(str?.replace('px', ''));
    return Number(str);
};