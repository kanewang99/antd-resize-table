import { deletePx, isPercentage, toPoint, genWidth } from './util';
import React, { useEffect, useState } from 'react';
import Table from './module.js';
import { Resizable } from 'react-resizable';
import { useRef } from 'react';

// 调整table表头
const ResizeableTitle = (Iprops) => {
    const { onResize, width, onClick, allowDrag = true, ...restProps } = Iprops;
    if (!width && !allowDrag) {
        return <th {...restProps} />;
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
            onClick={(...args) => {
                if (!dragging && onClick) onClick(args);
                dragging = false;
            }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

// 拖拽调整table

export const _ResizeTable = (props, _ref) => {
    const ref = useRef(null);
    const { components: _components } = props;
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
                fixed: index === columns?.length - 1 ? 'right' : '',
            };
        });
        const totalWidht = re.reduce((pre, cur) => {
            return pre + cur.width;
        }, 0);

        if (tableInstanceClientWidth > totalWidht) {
            const factor = tableInstanceClientWidth / totalWidht;
            const mutiledCols = re.map((item) => {
                return {
                    ...item,
                    width: item.width * factor * 0.9,
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
        return (e, { size }) => {
            const nextColumns = [...cols] as any;
            const { maxDragableWidth, minDragableWidth } = nextColumns[index];
            if (maxDragableWidth && size.width > genWidth(maxDragableWidth, tableInstanceClientWidth))
                return;
            if (minDragableWidth && size.width < genWidth(minDragableWidth, tableInstanceClientWidth))
                return;
            // 拖拽是调整宽度
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            setCols(nextColumns);
            e.stopPropagation();
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
                ref={_ref || ref}
                size="small"
                scroll={{ x: 0 }}
                {...props}
                components={components}
                columns={columns}
            />
        </div>
    );
};

export const ResizeTable = React.forwardRef(_ResizeTable);

