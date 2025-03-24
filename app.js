// app.js
App({
  globalData: {
    chargingRecords: [],
    totalDegrees: 0,
    dateRange: '2025-03-01至2025-03-31'
  },
  onLaunch() {
    // 初始化充电记录数据
    this.initChargingData();
  },
  
  // 初始化充电记录数据
  initChargingData() {
    // 请求真实接口获取充电记录数据
    this.requestChargingData();
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
    this.globalData.dateRange = `${displayStartDate}至${displayEndDate}`;
    this.globalData.startDate = displayStartDate;
    this.globalData.endDate = displayEndDate;
    
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
      url: 'https://xcx.xs25.cn/mobile/order/query/page',
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
            "createTime": "2025-03-23 15:12:04",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1903709361931902976",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "34.140",
            "chargeTimeLen": 343,
            "createTime": "2025-03-22 20:36:28",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1903425545241718784",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "7.620",
            "chargeTimeLen": 82,
            "createTime": "2025-03-22 17:18:31",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1903377734710173696",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "5.500",
            "chargeTimeLen": 60,
            "createTime": "2025-03-22 15:31:18",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1903363899341250560",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "19.600",
            "chargeTimeLen": 202,
            "createTime": "2025-03-21 23:04:02",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1903100334038413312",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "2.060",
            "chargeTimeLen": 23,
            "createTime": "2025-03-21 17:24:35",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1903014878332428288",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "11.100",
            "chargeTimeLen": 115,
            "createTime": "2025-03-21 11:12:00",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1902921136703365120",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "12.840",
            "chargeTimeLen": 140,
            "createTime": "2025-03-20 18:50:52",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1902674191934136320",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "36.170",
            "chargeTimeLen": 365,
            "createTime": "2025-03-19 23:40:26",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1902384685389541376",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "11.460",
            "chargeTimeLen": 126,
            "createTime": "2025-03-19 17:56:15",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1902298068968632320",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "10.210",
            "chargeTimeLen": 111,
            "createTime": "2025-03-16 22:42:10",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1901282886255472640",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "13.900",
            "chargeTimeLen": 145,
            "createTime": "2025-03-15 18:08:34",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1901080898188193792",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "36.080",
            "chargeTimeLen": 360,
            "createTime": "2025-03-15 01:55:18",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1901080768802304000",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "19.390",
            "chargeTimeLen": 203,
            "createTime": "2025-03-13 23:34:56",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1900208972263694336",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "14.360",
            "chargeTimeLen": 152,
            "createTime": "2025-03-04 18:31:20",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1896871074017681408",
            "orderMoney": 0.0,
            "orderStatus": "6",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "22.790",
            "chargeTimeLen": 225,
            "createTime": "2025-03-01 20:47:02",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1895818067146547200",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          },
          {
            "chargeElec": "25.710",
            "chargeTimeLen": 251,
            "createTime": "2025-02-28 22:47:41",
            "gunName": "长城坦克3723351770A枪",
            "invoiced": "未开票",
            "operatorId": 76,
            "orderCode": "1895657929718734848",
            "orderMoney": 0.0,
            "orderStatus": "4",
            "pileCode": "343723351770"
          }
        ],
        "startRow": 0,
        "total": 19
      },
      "success": true
    };
  },
  
  // 处理充电记录数据
  processChargingData(apiData) {
    try {
      // 验证API数据结构
      if (!apiData || !apiData.data || !apiData.data.resultSet || !Array.isArray(apiData.data.resultSet)) {
        console.error('API数据结构不符合预期', apiData);
        // 如果数据结构不正确，使用静态数据
        apiData = this.getStaticData();
      }
      
      // 处理API数据，转换为我们需要的格式
      const records = apiData.data.resultSet
        .map(item => {
          // 预处理，将 chargeElec 转换为浮点数
          if (item && item.chargeElec !== undefined) {
            item.chargeElec = parseFloat(item.chargeElec) || 0;
          }
          return item;
        })
        .filter(item => {
          // 确保必要字段存在且有效
          return item && 
                 item.chargeElec !== undefined && 
                 item.chargeElec > 0 && 
                 item.createTime && 
                 item.chargeTimeLen !== undefined;
        })
        .map((item, index) => {
          try {
            // 从创建时间中提取日期和时间
            // 确保使用中国北京时间 (UTC+8)
            const createDateStr = item.createTime;
            
            // 解析创建时间字符串
            // 假设时间格式为: 'YYYY-MM-DD HH:MM:SS'
            let year, month, day, hour, minute, second;
            
            // 处理不同的日期格式
            if (createDateStr.includes('-')) {
              // 处理带时间的格式
              const parts = createDateStr.split(' ');
              const dateParts = parts[0].split('-');
              year = parseInt(dateParts[0]);
              month = parseInt(dateParts[1]) - 1; // JavaScript 月份从 0 开始
              day = parseInt(dateParts[2]);
              
              // 如果有时间部分
              if (parts.length > 1 && parts[1].includes(':')) {
                const timeParts = parts[1].split(':');
                hour = parseInt(timeParts[0]);
                minute = parseInt(timeParts[1]);
                second = timeParts.length > 2 ? parseInt(timeParts[2]) : 0;
              } else {
                hour = 0;
                minute = 0;
                second = 0;
              }
            } else {
              // 如果是其他格式，尝试直接解析
              const tempDate = new Date(createDateStr);
              year = tempDate.getFullYear();
              month = tempDate.getMonth();
              day = tempDate.getDate();
              hour = tempDate.getHours();
              minute = tempDate.getMinutes();
              second = tempDate.getSeconds();
            }
            
            // 创建北京时间的 Date 对象
            const createDate = new Date(Date.UTC(year, month, day, hour - 8, minute, second));
            const formattedCreateTime = this.formatDateTime(createDate);
            
            // 计算结束时间
            const endDate = new Date(createDate.getTime() + (parseInt(item.chargeTimeLen) || 0) * 60 * 1000);
            const formattedEndTime = this.formatDateTime(endDate);
            
            // 直接指定周几，确保始终有值
            // 在这里我们使用最简单的方法，不依赖复杂的日期计算
            // 0=周日, 1=周一, ..., 6=周六
            let week = 0;
            
            try {
              // 尝试使用标准方法获取周几
              week = createDate.getDay();
            } catch (e) {
              console.error('获取周几出错', e);
              // 如果出错，使用当前日期
              week = new Date().getDay();
            }
            
            // 确保 week 始终是 0-6 的数字
            if (week === undefined || week === null || isNaN(week)) {
              week = 0;
            }
            
            // 直接在返回数据中指定周几的中文名称
            const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const weekIndex = (week >= 0 && week <= 6) ? week : 1; // 默认周一
            
            return {
              id: index + 1,
              createTime: formattedCreateTime,
              endTime: formattedEndTime,
              minutes: parseInt(item.chargeTimeLen) || 0,
              degrees: item.chargeElec, // 直接使用已转换为浮点数的 chargeElec
              week: week,
              weekName: weekNames[weekIndex] // 直接包含周几的中文名称
            };
          } catch (itemError) {
            console.error('处理单条记录时出错', itemError, item);
            // 返回一个默认记录
            return {
              id: index + 1,
              createTime: '数据错误',
              endTime: '数据错误',
              minutes: 0,
              degrees: 0,
              week: 0,
              weekName: '周一' // 默认周一
            };
          }
        });
      
      // 计算总度数
      const totalDegrees = records.reduce((total, record) => total + (record.degrees || 0), 0);
      
      // 更新全局数据
      this.globalData.chargingRecords = records;
      // 保存为数字类型，不转换为字符串
      this.globalData.totalDegrees = totalDegrees;
    } catch (error) {
      console.error('处理充电数据时出错', error);
      // 出错时使用静态数据
      const staticData = this.getStaticData();
      this.processChargingData(staticData);
    }
  },
  
  // 格式化日期时间为 MM-DD HH:MM 格式
  formatDateTime(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  },
  
  // 计算总度数
  calculateTotalDegrees() {
    return this.globalData.chargingRecords.reduce((total, record) => {
      // 添加空值检查，确保 degrees 是有效的数字
      const degrees = record.degrees || 0;
      return total + degrees;
    }, 0);
  },
  
  // 获取所有充电记录
  getChargingRecords() {
    return this.globalData.chargingRecords;
  },
  
  // 获取总电量度数
  getTotalDegrees() {
    return this.globalData.totalDegrees;
  }
})
