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
  
  methods: {
    // 判断电量是否较高（用于显示红色）
    isHighDegree(degrees) {
      // 简化判断逻辑，因为 degrees 已经在数据处理阶段转换为浮点数
      return degrees > 22;
    }
  }
})
