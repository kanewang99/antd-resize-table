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
    // ???????????????
    width = tableInstanceClientWidth * toPoint(width);
  } // ?????? px ???????????????


  width = deletePx(width); // ????????????????????????columns

  return width;
};
var getTotalWidth = function getTotalWidth(cols, tableInstanceClientWidth) {
  var totalWidht = cols.reduce(function (pre, cur) {
    return pre + cur.width;
  }, 0);
  var factor = tableInstanceClientWidth / totalWidht;
  return totalWidht * factor;
};

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "  .resize-table .react-resizable {\r\n      position: relative;\r\n      background-clip: padding-box;\r\n  }\r\n\r\n  .resize-table .rainbow-ant-badge-status-text {\r\n      font-size: 13px !important;\r\n  }\r\n\r\n  /* ?????????????????? */\r\n  .resize-table .react-resizable-handle {\r\n      position: absolute;\r\n      right: 0;\r\n      bottom: 0;\r\n      z-index: 6;\r\n      width: 10px;\r\n      height: 100%;\r\n      cursor: col-resize;\r\n  }\r\n\r\n  .resize-table .ellipsis-text {\r\n      display: -webkit-box;\r\n      width: 100%;\r\n      overflow: hidden;\r\n      font-size: 13px;\r\n      white-space: break-spaces;\r\n      word-break: break-all;\r\n      -webkit-box-orient: vertical;\r\n  }";
styleInject(css_248z);

// ??????table??????
var ResizeableTitle = function (Iprops) {
    var onResize = Iprops.onResize, width = Iprops.width, onClick = Iprops.onClick, _a = Iprops.allowDrag, allowDrag = _a === void 0 ? true : _a, restProps = __rest(Iprops, ["onResize", "width", "onClick", "allowDrag"]);
    if (!width || !allowDrag) {
        return React.createElement("th", __assign({}, restProps));
    }
    var dragging = false;
    return (React.createElement(Resizable, { width: width, height: 0, onResize: onResize, draggableOpts: { enableUserSelectHack: false }, onResizeStop: function () {
            dragging = true;
        }, 
        // @ts-ignore
        onClick: function () {
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
// ????????????table
var _ResizeTable = function (props, _ref) {
    var ref = useRef(null);
    var _components = props.components, _a = props.defaultMinDragWidth, defaultMinDragWidth = _a === void 0 ? 50 : _a, _b = props.enableWidthAsDefaultDragWidth, enableWidthAsDefaultDragWidth = _b === void 0 ? false : _b, autoExpand = props.autoExpand;
    var _c = useState(props.columns), cols = _c[0], setCols = _c[1];
    var _d = useState(cols), columns = _d[0], setColumns = _d[1];
    // ??????????????????
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
            // ????????????100
            var width = genWidth(item.width, tableInstanceClientWidth);
            return __assign(__assign({}, item), { width: width, 
                // eslint-disable-next-line no-nested-ternary
                minDragableWidth: item.minDragableWidth
                    ? item.minDragableWidth
                    : enableWidthAsDefaultDragWidth
                        ? item.width
                        : defaultMinDragWidth });
        });
        var totalWidht = re.reduce(function (pre, cur) {
            return pre + cur.width;
        }, 0);
        if (tableInstanceClientWidth > totalWidht) {
            var factor_1 = tableInstanceClientWidth / totalWidht;
            var mutiledCols = re.map(function (item) {
                return __assign(__assign({}, item), { minWidth: item.width, width: item.width * factor_1 * 0.95 });
            });
            return mutiledCols;
        }
        return re;
    };
    // ????????????
    var handleResize = function (index) {
        var _a;
        var refs = _ref || ref;
        var tableInstanceClientWidth = (_a = refs.current) === null || _a === void 0 ? void 0 : _a.clientWidth;
        return function (e, _a) {
            var size = _a.size;
            var Columns = __spreadArray([], cols, true);
            var currentColumns = Columns[index];
            var nextColumns = Columns[index + 1];
            var lostWidth = size.width - currentColumns.width;
            var totalWidth = getTotalWidth(Columns, tableInstanceClientWidth);
            if (!nextColumns) {
                Columns.map(function (item) {
                    item.width += lostWidth / Columns.length;
                });
                setCols(Columns);
                e.stopPropagation();
                return;
            }
            if (lostWidth <= 0 && currentColumns) {
                var idx = index;
                var cur = currentColumns;
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
                console.log(cur.width, cur.minDragableWidth);
                if (cur.width >= cur.minDragableWidth) {
                    nextColumns.width -= lostWidth;
                    cur.width += lostWidth;
                }
            }
            else {
                var idx = index;
                var cur = nextColumns;
                while (cur) {
                    if (cur.minDragableWidth && cur.width > cur.minDragableWidth) {
                        break;
                    }
                    idx++;
                    cur = Columns[idx];
                }
                if (!cur) {
                    if (!autoExpand)
                        return;
                    Columns[index] = __assign(__assign({}, Columns[index]), { width: size.width });
                }
                else {
                    console.log(cur.width, cur.minDragableWidth);
                    if (cur.width >= cur.minDragableWidth) {
                        cur.width -= lostWidth;
                        currentColumns.width += lostWidth;
                    }
                }
            }
            setCols(Columns);
            e.stopPropagation();
            console.log({ totalWidth: totalWidth });
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
            var colItem = getColItem(item); //?????????????????????
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
