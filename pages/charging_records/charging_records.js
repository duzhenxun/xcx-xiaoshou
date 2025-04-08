// charging_records.js
Page({
  data: {
    chargingRecords: [],
    totalDegrees: 0,
    dateRange: '2025-04-01至2025-04-30',
    startDate: '',
    endDate: ''
  },
  onLoad() {
    // 初始化日期选择器的默认值
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
    
    // 请求最新数据
    this.requestChargingData(this.data.startDate, this.data.endDate);
    
    // 延迟加载数据，等待请求完成
    setTimeout(() => {
      // 直接使用当前页面中的数据
      
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
  
  // 请求充电记录数据
  requestChargingData(customStartDate, customEndDate) {
    // 设置当前时间
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    let startTime, endTime, displayStartDate, displayEndDate;
    
    if (customStartDate && customEndDate) {
      // 使用自定义日期范围
      startTime = `${customStartDate} 00:00:00`;
      endTime = `${customEndDate} 23:59:59`;
      displayStartDate = customStartDate;
      displayEndDate = customEndDate;
    } else {
      // 使用默认日期范围（当前月的第一天到最后一天）
      const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const lastDayFormatted = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
      
      startTime = `${firstDay} 00:00:00`;
      endTime = `${lastDayFormatted} 23:59:59`;
      displayStartDate = firstDay;
      displayEndDate = lastDayFormatted;
    }
    
    // 更新日期范围显示
    this.setData({
      dateRange: `${displayStartDate}至${displayEndDate}`,
      startDate: displayStartDate,
      endDate: displayEndDate
    });
    
    // 请求参数
    const requestData = {
      "pageNum": 1,
      "pageSize": 10000,
      "condition": {
        "sub": {
          "orderStatus": "",
          "pileCode": "343723351770"
        },
        "startTime": startTime,
        "endTime": endTime
      }
    };
    
    // 发起请求
    wx.request({
      url: 'https://xcx.xs25.cn/chongdian/mobile/order/query/page',
      method: 'POST',
      data: requestData,
      header: {
        'Phone': '18888873646',
        'Authorization': 'a769a4ee-d88b-4999-9b2a-77f1b5db1ef6',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/20) uni-app',
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data && res.data.success && res.data.data && res.data.data.resultSet) {
          this.processChargingData(res.data);
        } else {
          // 请求失败或数据不完整，使用静态数据
          this.processChargingData(this.getStaticData());
          console.error('API请求失败或数据格式不正确，使用静态数据');
        }
      },
      fail: (err) => {
        // 请求失败，使用静态数据
        this.processChargingData(this.getStaticData());
        console.error('API请求失败，使用静态数据', err);
        
        // 显示错误提示
        wx.showToast({
          title: '请求失败，使用静态数据',
          icon: 'none',
          duration: 2000
        });
        
        // 如果是域名错误，显示特定提示
        if (err.errMsg && err.errMsg.includes('domain list')) {
          wx.showModal({
            title: '域名错误',
            content: '请在小程序后台配置允许访问的域名，或在开发者工具中关闭域名检查',
            showCancel: false
          });
        }
      }
    });
  },
  
  // 获取静态数据（作为备用）
  getStaticData() {
    return {
      "data": {
        "endRow": 10000,
        "hasNextPage": false,
        "hasPrevPage": false,
        "pageNum": 1,
        "pageSize": 10000,
        "pages": 1,
        "resultSet": [
          {
            "chargeElec": "10.580",
            "chargeTimeLen": 114,
            "createTime": "2025-04-07 15:12:04",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1903709361931902976",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          }
        
        ],
        "startRow": 1,
        "total": 7
      },
      "success": true
    };
  },
  
  // 处理充电记录数据
  processChargingData(apiData) {
    if (!apiData || !apiData.data || !apiData.data.resultSet) return;
    
    const resultSet = apiData.data.resultSet;
    let records = [];
    let totalDegrees = 0;
    
    // 创建一个新的Date对象
    const now = new Date();
    
    resultSet.forEach((item, index) => {
      // 解析开始时间
      const createTime = new Date(item.createTime.replace(/-/g, '/'));
      
      // 计算结束时间
      const endTime = new Date(createTime.getTime() + (item.chargeTimeLen * 60 * 1000));
      
      // 计算weekday（周几），使用北京时间（UTC+8）
      const beijingCreateTime = new Date(createTime.getTime() + (8 * 60 * 60 * 1000));
      const weekday = beijingCreateTime.getUTCDay(); // 0是周日，1是周一，以此类推
      
      // 转换为度数的浮点数
      const chargeElec = parseFloat(item.chargeElec);
      totalDegrees += chargeElec;
      
      // 格式化开始和结束时间
      const formattedCreateTime = this.formatDateTime(createTime);
      const formattedEndTime = this.formatDateTime(endTime);
      
      // 创建记录对象并添加到数组中
      records.push({
        id: index + 1,
        createTime: formattedCreateTime,
        endTime: formattedEndTime,
        minutes: item.chargeTimeLen,
        degrees: chargeElec.toFixed(2),
        week: weekday,
        weekName: this.getWeekdayName(weekday),
        highConsumption: chargeElec > 40 // 高于40度标记为高耗电
      });
    });
    
    // 更新数据
    this.setData({
      chargingRecords: records,
      totalDegrees: totalDegrees.toFixed(2)
    });
  },
  
  // 格式化日期时间为 MM-DD HH:MM 格式
  formatDateTime(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${month}-${day} ${hours}:${minutes}`;
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
    
    // 请求数据
    this.requestChargingData(this.data.startDate, this.data.endDate);
    
    // 延迟一下再关闭加载提示
    setTimeout(() => {
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
  },

  // 自定义分享给好友功能
  onShareAppMessage() {
    // 获取当前用户充电记录的状态信息
    const recordCount = this.data.chargingRecords.length;
    const totalDegrees = this.data.totalDegrees.toFixed(2);
    
    return {
      title: `充电记录统计 - 共${recordCount}条记录，总计${totalDegrees}度电`,
      path: '/pages/charging_records/charging_records',
      imageUrl: '/images/share-cover.png'
    };
  },

  // 自定义分享到朋友圈功能
  onShareTimeline() {
    const totalDegrees = this.data.totalDegrees.toFixed(2);
    
    return {
      title: `充电记录查询小工具 - 本月已用电${totalDegrees}度`,
      query: '',
      imageUrl: '/images/share-cover.png'
    };
  }
})
