```js
import { ResizeTable } from "@antd-resize-table";
import "antd-resize-table/lib/resize-table.css";
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
<ResizeTable dataSource={[{key1:'key1'}]} columns={columns} />
```

其他 Api 使用和 antd Table 完全一致

#### notice：

1. 表格的 tableLayout 固定为 fixed
2. 表格最后一列固定且 fixed 为 right
3. 表格有默认的 scroll={x:0} 强制内容超过滚动

#### 表格列宽计算规则：

1. antd 每个列的宽度只存在最小宽度，如果所有列的宽度相加为小于表格的实际宽度，每次拖动包括首次渲染 antd 都会重新计算其宽度。
   每列宽实际为其平均值，如果最小宽度大于平均值则取最小值。
2. 在上一条规则之上。当首次渲染所有表格列宽度相加小于表格的实际宽度时，antd-resize-table 会重写 columns 中每一列的 width 属性，columns 总宽度将略小于实际宽度。拖动后 antd 将不会重新计算其宽度
3. 当首次渲染所有表格列宽度相加大于表格的实际宽度时，最后一列将固定在最右侧（fixed：right）。