// coming_soon.js - 功能开发中页面
Page({
  data: {
    moduleName: '',
    returnTime: '近期'
  },
  
  onLoad(options) {
    // 获取从导航传来的模块名称
    if (options && options.name) {
      // 确保正确解码中文名称
      const moduleName = decodeURIComponent(options.name);
      
      this.setData({
        moduleName: moduleName
      });
      
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: moduleName || '功能开发中'
      });
    }
  },
  
  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
