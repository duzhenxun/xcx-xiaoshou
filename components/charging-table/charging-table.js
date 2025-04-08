// components/charging-table/charging-table.js
Component({
  properties: {
    // 充电记录数据
    chargingRecords: {
      type: Array,
      value: []
    }
  },
  
  data: {
    // 组件内部数据
  },
  
  lifetimes: {
    attached() {
      // 组件实例进入页面节点树时执行
      console.log('充电表格组件已加载');
    },
    detached() {
      // 组件实例被从页面节点树移除时执行
    }
  },
  
  methods: {}
})
