```jsx
import { ResizeTable } from "antd-resize-table";
const columns = [
    {
        width: 100; //  100 ｜ '100' ｜ '15%'  该值为渲染的最小宽度 实际可能大于该数值 当该值为百分比时，会被计算为当前表格实际宽度*百分比
        key: 'key1', //同antd 
        dataIndex: "key1", //同antd
        title: 'key1', //同antd
        minDragableWidth: 100 //  100 ｜ '100' ｜ '15%' //最小可拖拽宽度
    }
]

<ResizeTable
    defaultMinDragWidth={100} // defaultMinDragWidth: 50 number 默认为 50 最小可拖拽宽度 所有列都具有width时生效。
    enableWidthAsDefaultDragWidht={true} // enableWidthAsDefaultDragWidth : boolean 默认为 false 将最小可拖拽宽度设置与 width 一致 所有列都具有width时生效。 优先级大于 defaultMinDragWidth 小于 minDragableWidth
    dataSource={[{key1:'key1'}]}
    columns={columns} 
    autoExpand={true}  // autoExpand 默认为false 当列宽之和大于table实际宽度时允许滚动。
/>
```
codesandbox demo https://codesandbox.io/s/angry-sinoussi-w2nqkd?file=/src/App.js

默认渲染规则：
1. 当有一列或者多列不具有width属性时，拖拽任意列出了修改该列外还会修改不具有width属性的列。 且仅有不具有width属性的列受表格实际宽度影响，有width属性的列宽度初始化时为固定宽度。

2. 当所有列都具有宽度时，列宽随着表格实际宽度变化而变化。拖动会影响拖动列及旁边列，当表格width相加大于表格实际宽度时，拖拽只修改被拖动列的宽度。


其他 Api 使用和 antd Table 完全一致