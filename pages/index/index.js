// index.js
Page({
  data: {
    chargingRecords: [],
    totalDegrees: 0,
    dateRange: '2025-03-01至2025-03-31',
    startDate: '',
    endDate: ''
  },
  onLoad() {
    // 初始化日期选择器的默认值
    const app = getApp();
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayFormatted = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
    
    this.setData({
      startDate: firstDay,
      endDate: lastDayFormatted
    });
    
    // 自动执行查询操作，无需用户手动点击查询按钮
    this.autoSearch();
  },
  onShow() {
    // 页面显示时也自动查询
    this.autoSearch();
  },
  
  // 自动查询方法
  autoSearch() {
    // 显示加载中提示，但不显示遮罩层
    wx.showLoading({
      title: '加载中...',
      mask: false
    });
    
    const app = getApp();
    // 请求最新数据
    app.requestChargingData(this.data.startDate, this.data.endDate);
    
    // 延迟加载数据，等待请求完成
    setTimeout(() => {
      this.loadChargingData();
      
      // 隐藏加载中提示
      wx.hideLoading();
      
      // 显示加载完成的提示
      wx.showToast({
        title: '数据已更新',
        icon: 'success',
        duration: 1500
      });
    }, 800);
  },
  
  // 加载充电记录数据
  loadChargingData() {
    const app = getApp();
    const records = app.getChargingRecords();
    const totalDegrees = app.getTotalDegrees();
    const dateRange = app.globalData.dateRange;
    const startDate = app.globalData.startDate || this.data.startDate;
    const endDate = app.globalData.endDate || this.data.endDate;
    
    this.setData({
      chargingRecords: records,
      totalDegrees: totalDegrees ? totalDegrees.toFixed(2) : '0.00',
      dateRange: dateRange,
      startDate: startDate,
      endDate: endDate
    });
  },
  
  // 开始日期选择器变化事件
  bindStartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    });
  },
  
  // 结束日期选择器变化事件
  bindEndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    });
  },
  
  // 点击查询按钮
  handleSearch() {
    // 显示加载中提示
    wx.showLoading({
      title: '正在查询...',
      mask: true
    });
    
    const app = getApp();
    app.requestChargingData(this.data.startDate, this.data.endDate);
    
    // 延迟一下再加载数据，等待请求完成
    setTimeout(() => {
      this.loadChargingData();
      
      // 隐藏加载中提示
      wx.hideLoading();
      
      // 显示加载完成的提示
      wx.showToast({
        title: '数据已更新',
        icon: 'success',
        duration: 1500
      });
    }, 800);
  },
  

  // 获取星期几的中文名称
  getWeekdayName(weekday) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[weekday];
  }
})
