import React, { useRef, useState, useEffect } from 'react';
import { Resizable } from 'react-resizable';
import { Table } from 'antd';

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  if (isPercentage(width)) {
    // 计算百分比
    width = tableInstanceClientWidth * toPoint(width);
  } // 处理 px 转换为数字


  width = deletePx(width); // 其他参数传递改变columns

  return width;
};
function handleSizePlan1(_ref) {
  var _refs$current, _refs$current2;

  var cols = _ref.cols,
      refs = _ref.refs,
      size = _ref.size,
      index = _ref.index;
  var totalWidth = cols.reduce(function (pre, cur) {
    if (!cur.width) return pre;
    return pre + cur.width;
  }, 0);
  var nodeList = Array.from((_refs$current = refs.current) === null || _refs$current === void 0 ? void 0 : _refs$current.querySelectorAll('.resize-table'));
  var notResizeNodeList = Array.from((_refs$current2 = refs.current) === null || _refs$current2 === void 0 ? void 0 : _refs$current2.querySelectorAll('th:not(.has-resize)'));
  var totalColWidth = nodeList.reduce(function (pre, cur) {
    return pre + cur.clientWidth;
  }, 0);

  var nextColumns = _toConsumableArray(cols);

  var lostSize = size.width - nextColumns[index].width;
  if (lostSize === 0) return;

  if (lostSize > 0 && lostSize + totalWidth > totalColWidth - 31 * notResizeNodeList.length) {
    return;
  }

  nextColumns[index] = _objectSpread2(_objectSpread2({}, nextColumns[index]), {}, {
    width: size.width
  }); // eslint-disable-next-line consistent-return

  return nextColumns;
}
function handleSizePlan2(_ref2) {
  var cols = _ref2.cols,
      size = _ref2.size,
      index = _ref2.index,
      autoExpand = _ref2.autoExpand,
      tableInstanceClientWidth = _ref2.tableInstanceClientWidth;

  var Columns = _toConsumableArray(cols);

  var currentColumns = Columns[index];
  var nextColumns = Columns[index + 1];
  var lostWidth = size.width - currentColumns.width;

  if (lostWidth <= 0) {
    if (!nextColumns) {
      var totalWidth = cols.reduce(function (pre, cur) {
        return pre + cur.width;
      }, 0);
      if (totalWidth + lostWidth <= tableInstanceClientWidth) return;
    }

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

    if (cur.width > cur.minDragableWidth) {
      var minLostWidth = cur.width - cur.minDragableWidth;
      var lowestChangeWidth = Math.abs(lostWidth) > minLostWidth ? -minLostWidth : lostWidth;

      if (nextColumns) {
        nextColumns.width -= lowestChangeWidth;
      }

      cur.width += lowestChangeWidth;
    }
  } else {
    var _idx = index;
    var _cur = nextColumns;

    while (_cur) {
      if (_cur.minDragableWidth && _cur.width > _cur.minDragableWidth) {
        break;
      }

      _idx++;
      _cur = Columns[_idx];
    }

    if (!_cur) {
      if (!autoExpand) return;
      Columns[index] = _objectSpread2(_objectSpread2({}, Columns[index]), {}, {
        width: size.width
      });
    } else {
      if (_cur.width >= _cur.minDragableWidth) {
        var _minLostWidth = _cur.width - _cur.minDragableWidth;

        var _lowestChangeWidth = Math.abs(lostWidth) > _minLostWidth ? _minLostWidth : lostWidth;

        _cur.width -= _lowestChangeWidth;
        currentColumns.width += _lowestChangeWidth;
      }
    }
  }

  return Columns;
}
function handleSizePlan3(_ref3) {
  var cols = _ref3.cols,
      size = _ref3.size,
      index = _ref3.index;

  var nextColumns = _toConsumableArray(cols);

  nextColumns[index] = _objectSpread2(_objectSpread2({}, nextColumns[index]), {}, {
    width: size.width
  }); // eslint-disable-next-line consistent-return

  return nextColumns;
}

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

var css_248z = "  .resize-table .react-resizable {\r\n      position: relative;\r\n      background-clip: padding-box;\r\n  }\r\n\r\n  .resize-table .rainbow-ant-badge-status-text {\r\n      font-size: 13px !important;\r\n  }\r\n\r\n  /* 显示拖拽手势 */\r\n  .resize-table .react-resizable-handle {\r\n      position: absolute;\r\n      right: 0;\r\n      bottom: 0;\r\n      z-index: 6;\r\n      width: 10px;\r\n      height: 100%;\r\n      cursor: col-resize;\r\n  }\r\n\r\n  .resize-table .ellipsis-text {\r\n      display: -webkit-box;\r\n      width: 100%;\r\n      overflow: hidden;\r\n      font-size: 13px;\r\n      white-space: break-spaces;\r\n      word-break: break-all;\r\n      -webkit-box-orient: vertical;\r\n  }";
styleInject(css_248z);

// 调整table表头
var ResizeableTitle = function (Iprops) {
    var onResize = Iprops.onResize, width = Iprops.width, onClick = Iprops.onClick; Iprops.allowDrag; var restProps = __rest(Iprops, ["onResize", "width", "onClick", "allowDrag"]);
    if (!width) {
        return React.createElement("th", __assign({}, restProps, { className: Iprops.className + ' resize-table' }));
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
        React.createElement("th", __assign({}, restProps, { className: Iprops.className + ' resize-table has-resize' }))));
};
// 拖拽调整table
var _ResizeTable = function (props, _ref) {
    var ref = useRef(null);
    var colRef = useRef(null);
    var _components = props.components, _a = props.defaultMinDragWidth, defaultMinDragWidth = _a === void 0 ? 50 : _a, _b = props.enableWidthAsDefaultDragWidth, enableWidthAsDefaultDragWidth = _b === void 0 ? false : _b, _c = props.autoExpand, autoExpand = _c === void 0 ? true : _c;
    var _d = useState(props.columns), cols = _d[0], setCols = _d[1];
    var _e = useState(cols), columns = _e[0], setColumns = _e[1];
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
            return __assign(__assign({}, item), { width: width, allowDrag: true, 
                // eslint-disable-next-line no-nested-ternary
                minDragableWidth: item.minDragableWidth
                    ? item.minDragableWidth
                    : enableWidthAsDefaultDragWidth
                        ? item.width || 50
                        : defaultMinDragWidth });
        });
        var totalWidth = re.reduce(function (pre, cur) {
            if (cur.width)
                return pre + cur.width;
            return pre;
        }, 0);
        if (tableInstanceClientWidth > totalWidth && columns.every(function (item) { return item.width; })) {
            var factor_1 = tableInstanceClientWidth / totalWidth;
            var mutiledCols = re.map(function (item) {
                return __assign(__assign({}, item), { width: item.width * factor_1 * 0.95 });
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
        var totalWidth = cols.reduce(function (pre, cur) {
            if (cur.width)
                return pre + cur.width;
            return pre;
        }, 0);
        return function (e, _a) {
            var size = _a.size;
            var nextColumns;
            if (!cols.every(function (item) { return item.width; }) && totalWidth < tableInstanceClientWidth) {
                nextColumns = handleSizePlan1({ cols: cols, refs: refs, size: size, index: index });
            }
            else if (totalWidth > tableInstanceClientWidth) {
                nextColumns = handleSizePlan3({
                    cols: cols,
                    size: size,
                    index: index,
                });
            }
            else {
                nextColumns = handleSizePlan2({
                    cols: cols,
                    size: size,
                    index: index,
                    autoExpand: autoExpand,
                    tableInstanceClientWidth: tableInstanceClientWidth,
                });
            }
            if (nextColumns)
                setCols(nextColumns);
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
        // 每次 更新 把值 复制给 colRef
        colRef.current = cols;
    }, [cols]);
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
        React.createElement(Table, __assign({ tableLayout: "fixed", ref: _ref || ref, size: "small", scroll: { x: '100%' } }, props, { components: components, columns: columns }))));
};
var ResizeTable = React.forwardRef(_ResizeTable);

export { ResizeTable, _ResizeTable };
