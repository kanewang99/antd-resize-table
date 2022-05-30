import React, { useRef, useState, useEffect } from 'react';
import { Table } from 'antd';
import { Resizable } from 'react-resizable';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

var isPercentage = function isPercentage(inResult) {
  var patt1 = new RegExp(/^\d+%$/);
  var result = patt1.test(inResult);
  return result;
};
var isNumber = function isNumber(string) {
  if (!string) return false;
  return Number(string).toString() !== 'NaN';
};
var toPoint = function toPoint(percent) {
  var str = Number(percent.replace('%', ''));
  str = str / 100;
  return str;
};
var deletePx = function deletePx(str) {
  if (typeof str === 'number') return str;
  if (isNumber(str === null || str === void 0 ? void 0 : str.replace('px', ''))) return Number(str === null || str === void 0 ? void 0 : str.replace('px', ''));
  return Number(str);
};
var genWidth = function genWidth(width, tableInstanceClientWidth) {
  if (!width) width = 100;

  if (isPercentage(width)) {
    // 计算百分比
    width = tableInstanceClientWidth * toPoint(width);
  } // 处理 px 转换为数字


  width = deletePx(width); // 其他参数传递改变columns

  return width;
};

// 调整table表头
var ResizeableTitle = function (Iprops) {
    var onResize = Iprops.onResize, width = Iprops.width, onClick = Iprops.onClick, _a = Iprops.allowDrag, allowDrag = _a === void 0 ? true : _a, restProps = __rest(Iprops, ["onResize", "width", "onClick", "allowDrag"]);
    if (!width && !allowDrag) {
        return React.createElement("th", __assign({}, restProps));
    }
    var dragging = false;
    return (React.createElement(Resizable, { width: width, height: 0, onResize: onResize, draggableOpts: { enableUserSelectHack: false }, onResizeStop: function () {
            dragging = true;
        }, onClick: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!dragging && onClick)
                onClick(args);
            dragging = false;
        } },
        React.createElement("th", __assign({}, restProps))));
};
// 拖拽调整table
var _ResizeTable = function (props, _ref) {
    var ref = useRef(null);
    var _components = props.components;
    var _a = useState(props.columns), cols = _a[0], setCols = _a[1];
    var _b = useState(cols), columns = _b[0], setColumns = _b[1];
    // 定义头部组件
    var components = __assign({ header: {
            cell: ResizeableTitle,
        } }, _components);
    var getColItem = function (_item) {
        return cols.find(function (item) {
            return ((_item.key && item.key && _item.key === item.key) ||
                (_item.title && item.title && _item.title === item.title) ||
                (_item.dataIndex && item.dataIndex && _item.dataIndex === item.dataIndex));
        });
    };
    var genCols = function (columns) {
        var _a;
        var refs = _ref || ref;
        var tableInstanceClientWidth = (_a = refs.current) === null || _a === void 0 ? void 0 : _a.clientWidth;
        var re = columns.map(function (item, index) {
            // 默认宽度100
            var width = genWidth(item.width, tableInstanceClientWidth);
            return __assign(__assign({}, item), { width: width, fixed: index === (columns === null || columns === void 0 ? void 0 : columns.length) - 1 ? 'right' : '' });
        });
        var totalWidht = re.reduce(function (pre, cur) {
            return pre + cur.width;
        }, 0);
        if (tableInstanceClientWidth > totalWidht) {
            var factor_1 = tableInstanceClientWidth / totalWidht;
            var mutiledCols = re.map(function (item) {
                return __assign(__assign({}, item), { width: item.width * factor_1 * 0.9 });
            });
            return mutiledCols;
        }
        return re;
    };
    // 处理拖拽
    var handleResize = function (index) {
        var _a;
        var refs = _ref || ref;
        var tableInstanceClientWidth = (_a = refs.current) === null || _a === void 0 ? void 0 : _a.clientWidth;
        return function (e, _a) {
            var size = _a.size;
            var nextColumns = __spreadArray([], cols, true);
            var _b = nextColumns[index], maxDragableWidth = _b.maxDragableWidth, minDragableWidth = _b.minDragableWidth;
            if (maxDragableWidth && size.width > genWidth(maxDragableWidth, tableInstanceClientWidth))
                return;
            if (minDragableWidth && size.width < genWidth(minDragableWidth, tableInstanceClientWidth))
                return;
            // 拖拽是调整宽度
            nextColumns[index] = __assign(__assign({}, nextColumns[index]), { width: size.width });
            setCols(nextColumns);
            e.stopPropagation();
        };
    };
    var refresh_ = function () {
        var _cols = (cols || []).map(function (col, index) {
            var width = col.width;
            return __assign(__assign({}, col), { width: width, onHeaderCell: function (column) { return (__assign({ width: column.width, onResize: handleResize(index) }, column)); } });
        });
        setColumns(_cols);
    };
    useEffect(function () {
        refresh_();
    }, [cols]);
    useEffect(function () {
        if (props.columns.length !== cols.length) {
            setCols(genCols(props.columns));
            return;
        }
        var re = props.columns.map(function (item) {
            var colItem = getColItem(item); //获取要改变的列
            if (!colItem)
                return item;
            for (var key in item) {
                if (key === 'width')
                    continue;
                colItem[key] = item[key];
            }
            return colItem;
        });
        setCols(re);
    }, [props.columns]);
    useEffect(function () {
        queueMicrotask(function () {
            setCols(genCols(props.columns));
        });
        window.addEventListener('resize', function () {
            queueMicrotask(function () {
                setCols(genCols(props.columns));
            });
        });
    }, []);
    return (React.createElement("div", { className: "resize-table" },
        React.createElement(Table, __assign({ ref: _ref || ref, size: "small", scroll: { x: 0 } }, props, { components: components, columns: columns }))));
};
var ResizeTable = React.forwardRef(_ResizeTable);

export { ResizeTable, _ResizeTable };
