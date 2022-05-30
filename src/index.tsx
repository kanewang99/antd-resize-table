import { deletePx, isPercentage, toPoint } from './util';
import React, { useEffect, useState } from 'react';
import { Table } from './module'
import { Resizable } from 'react-resizable';
import './index.css'

// 调整table表头
const ResizeableTitle = (Iprops, ref) => {
    const { onResize, width, onClick, ...restProps } = Iprops;
    if (!width) {
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

export const _ResizeTable = (props, ref) => {
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
        let tableInstanceClientWidth = ref.current?.clientWidth;
        const re = columns.map((item, index) => {
            // 默认宽度100
            let { width } = item;
            if (!width) width = 100;
            if (isPercentage(width)) {
                // 计算百分比
                width = tableInstanceClientWidth * toPoint(width);
            }

            // 处理 px 转换为数字
            width = deletePx(width);
            // 其他参数传递改变columns
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
                    width: item.width * factor * 0.98,
                };
            });
            return mutiledCols;
        }
        return re;
    };
    // 处理拖拽
    const handleResize = (index) => {
        return (e, { size }) => {
            const nextColumns = [...cols];
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
            let { width } = col;
            return {
                ...col,
                width,
                onHeaderCell: (column) => ({
                    width: column.width,
                    onResize: handleResize(index),
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
            for (let key in item) {
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
    }, []);
    return (
        <div className='resize-table'>
            <Table
                ref={ref}
                size="small"
                scroll={{ x: 0 }}
                {...props}
                components={components}
                columns={columns}
            /></div>
    );
};


export const ResizeTable = React.forwardRef(_ResizeTable)