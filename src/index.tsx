import React, { useEffect, useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
import Table from './module.js';
import { genWidth, handleSizePlan1, handleSizePlan2, handleSizePlan3 } from './util';
import './index.css';

// 调整table表头
const ResizeableTitle = (Iprops) => {
    const { onResize, width, onClick, allowDrag, ...restProps } = Iprops;

    if (!width) {
        return <th {...restProps} className={Iprops.className + ' resize-table'} />;
    }

    let dragging = false;
    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
            onResizeStop={() => {
                dragging = true;
            }}
            // @ts-ignore
            onClick={(...args) => {
                if (!dragging && onClick) onClick(args);
                dragging = false;
            }}
        >
            <th {...restProps} className={Iprops.className + ' resize-table has-resize'} />
        </Resizable>
    );
};

// 拖拽调整table

export const _ResizeTable = (props, _ref) => {
    const ref = useRef(null);
    const colRef = useRef(null);
    const {
        components: _components,
        defaultMinDragWidth = 50,
        enableWidthAsDefaultDragWidth = false,
        autoExpand = true,
    } = props;
    const [cols, setCols] = useState(props.columns);
    const [columns, setColumns] = useState(cols);
    // 定义头部组件

    const components = {
        header: {
            cell: ResizeableTitle,
        },
        ..._components,
    };

    const getColItem = (_item) => {
        return cols.find((item) => {
            return (
                (_item.key && item.key && _item.key === item.key) ||
                (_item.title && item.title && _item.title === item.title) ||
                (_item.dataIndex && item.dataIndex && _item.dataIndex === item.dataIndex)
            );
        });
    };

    const genCols = (columns) => {
        const refs = _ref || ref;
        const tableInstanceClientWidth = refs.current?.clientWidth;

        const re = columns.map((item, index) => {
            // 默认宽度100
            const width = genWidth(item.width, tableInstanceClientWidth);
            return {
                ...item,
                width,
                allowDrag: true,
                // eslint-disable-next-line no-nested-ternary
                minDragableWidth: item.minDragableWidth
                    ? item.minDragableWidth
                    : enableWidthAsDefaultDragWidth
                        ? item.width || 50
                        : defaultMinDragWidth,
            };
        });

        const totalWidth = re.reduce((pre, cur) => {
            if (cur.width) return pre + cur.width;
            return pre;
        }, 0);

        if (tableInstanceClientWidth > totalWidth && columns.every((item) => item.width)) {
            const factor = tableInstanceClientWidth / totalWidth;
            const mutiledCols = re.map((item) => {
                return {
                    ...item,
                    width: item.width * factor * 0.95,
                };
            });
            return mutiledCols;
        }
        return re;
    };
    // 处理拖拽
    const handleResize = (index) => {
        const refs = _ref || ref;
        const tableInstanceClientWidth = refs.current?.clientWidth;
        const totalWidth = cols.reduce((pre, cur) => {
            if (cur.width) return pre + cur.width;
            return pre;
        }, 0);
        return (e, { size }) => {
            let nextColumns;
            if (!cols.every((item) => item.width) && totalWidth < tableInstanceClientWidth) {
                nextColumns = handleSizePlan1({ cols, refs, size, index });
            } else if (totalWidth > tableInstanceClientWidth) {
                nextColumns = handleSizePlan3({
                    cols,
                    size,
                    index,
                });
            } else {
                nextColumns = handleSizePlan2({
                    cols,
                    size,
                    index,
                    autoExpand,
                    tableInstanceClientWidth,
                });
            }
            if (nextColumns) setCols(nextColumns);
        };
    };

    const refresh_ = () => {
        const _cols = (cols || []).map((col, index) => {
            const { width } = col;
            return {
                ...col,
                width,
                onHeaderCell: (column) => ({
                    width: column.width,
                    onResize: handleResize(index),
                    ...column,
                }),
            };
        });
        setColumns(_cols);
    };

    useEffect(() => {
        // 每次 更新 把值 复制给 colRef
        colRef.current = cols;
    }, [cols]);

    useEffect(() => {
        refresh_();
    }, [cols]);

    useEffect(() => {
        if (props.columns.length !== cols.length) {
            setCols(genCols(props.columns));
            return;
        }
        const re = props.columns.map((item) => {
            const colItem = getColItem(item); //获取要改变的列
            if (!colItem) return item;
            for (const key in item) {
                if (key === 'width') continue;
                colItem[key] = item[key];
            }
            return colItem;
        });
        setCols(re);
    }, [props.columns]);

    useEffect(() => {
        queueMicrotask(() => {
            setCols(genCols(props.columns));
        });
        window.addEventListener('resize', () => {
            queueMicrotask(() => {
                setCols(genCols(props.columns));
            });
        });
    }, []);
    return (
        <div className="resize-table">
            <Table
                tableLayout="fixed"
                ref={_ref || ref}
                size="small"
                scroll={{ x: '100%' }}
                {...props}
                components={components}
                columns={columns}
            />
        </div>
    );
};

export const ResizeTable = React.forwardRef(_ResizeTable);