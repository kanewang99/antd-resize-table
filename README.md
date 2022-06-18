```js
import { ResizeTable } from "antd-resize-table";
```

```jsx
const columns = [
    {
        width: 100; //  100 ｜ '100' ｜ '15%'  该值为渲染的最小宽度 实际可能大于该数值  默认为100  当该值为百分比时，会被计算为当前表格实际宽度*百分比
        key: 'key1', //同antd 必传
        dataIndex: "key1", //同antd 必传
        title: 'key1', //同antd
        allowDrag: true, //是否允许拖拽 默认为true  注意该列的拖动按钮在title的左侧
        maxDragableWidth: 200 //  100 ｜ '100' ｜ '15%' //最大可拖拽宽度
        minDragableWidth: 100 //  100 ｜ '100' ｜ '15%' //最小可拖拽宽度
    }
]

<ResizeTable
    defaultMinDragWidth={100}
    enableWidthAsDefaultDragWidht={true}
    dataSource={[{key1:'key1'}]}
    columns={columns}
    autoExpand={true}
/>
```

// defaultMinDragWidth: 50 // number 默认为 50 最小可拖拽宽度
// enableWidthAsDefaultDragWidth : boolean 默认为 false 将最小可拖拽宽度设置与 width 一致
优先级大于 defaultMinDragWidth 小于 minDragableWidth
其他 Api 使用和 antd Table 完全一致
// autoExpand 默认为false 当列宽之和大于table实际宽度时时候允许滚动，初始总列宽大于实际宽度时值为true