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

export const genWidth = (width, tableInstanceClientWidth) => {
    if (isPercentage(width)) {
        // 计算百分比
        width = tableInstanceClientWidth * toPoint(width);
    }

    // 处理 px 转换为数字
    width = deletePx(width);
    // 其他参数传递改变columns
    return width;
};

export const getTotalWidth = (cols, tableInstanceClientWidth) => {
    const totalWidht = cols.reduce((pre, cur) => {
        return pre + cur.width;
    }, 0);
    const factor = tableInstanceClientWidth / totalWidht;
    return totalWidht * factor;
};

export function hasClass (element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

export function handleSizePlan1 ({ cols, refs, size, index }) {
    const totalWidth = cols.reduce((pre, cur) => {
        if (!cur.width) return pre;
        return pre + cur.width;
    }, 0);
    const nodeList = Array.from(refs.current?.querySelectorAll('.resize-table'));
    const notResizeNodeList = Array.from(refs.current?.querySelectorAll('th:not(.has-resize)'));
    const totalColWidth = nodeList.reduce((pre, cur) => {
        return pre + cur.clientWidth;
    }, 0);

    const nextColumns = [...cols];
    const lostSize = size.width - nextColumns[index].width;

    if (lostSize === 0) return;
    if (lostSize > 0 && lostSize + totalWidth > totalColWidth - 31 * notResizeNodeList.length) {
        return;
    }
    nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
    };
    // eslint-disable-next-line consistent-return
    return nextColumns;
}

export function handleSizePlan2 ({ cols, size, index, autoExpand, tableInstanceClientWidth }) {
    const Columns = [...cols];
    const currentColumns = Columns[index];
    const nextColumns = Columns[index + 1];
    const lostWidth = size.width - currentColumns.width;
    if (lostWidth <= 0) {
        if (!nextColumns) {
            const totalWidth = cols.reduce((pre, cur) => {
                return pre + cur.width;
            }, 0);
            if (totalWidth + lostWidth <= tableInstanceClientWidth) return;
        }
        let idx = index;
        let cur = currentColumns;
        while (cur) {
            if (cur.minDragableWidth && cur.width > cur.minDragableWidth) {
                break;
            }
            idx--;
            cur = Columns[idx];
        }
        if (!cur) {
            return;
        }
        if (cur.width > cur.minDragableWidth) {
            const minLostWidth = cur.width - cur.minDragableWidth;
            const lowestChangeWidth = Math.abs(lostWidth) > minLostWidth ? -minLostWidth : lostWidth;
            if (nextColumns) {
                nextColumns.width -= lowestChangeWidth;
            }
            cur.width += lowestChangeWidth;
        }
    } else {
        let idx = index;
        let cur = nextColumns;
        while (cur) {
            if (cur.minDragableWidth && cur.width > cur.minDragableWidth) {
                break;
            }
            idx++;
            cur = Columns[idx];
        }
        if (!cur) {
            if (!autoExpand) return;
            Columns[index] = {
                ...Columns[index],
                width: size.width,
            };
        } else {
            if (cur.width >= cur.minDragableWidth) {
                const minLostWidth = cur.width - cur.minDragableWidth;
                const lowestChangeWidth = Math.abs(lostWidth) > minLostWidth ? minLostWidth : lostWidth;
                cur.width -= lowestChangeWidth;
                currentColumns.width += lowestChangeWidth;
            }
        }
    }
    return Columns;
}

export function handleSizePlan3 ({ cols, size, index }) {
    const nextColumns = [...cols];
    nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
    };
    // eslint-disable-next-line consistent-return
    return nextColumns;
}