// index.js - 主导航页面
Page({
  data: {
    modules: [
      { id: 1, name: '视频去水印', icon: '/images/icon-video.png', page: '/pages/video_watermark/video_watermark' },
      { id: 2, name: '图片修复', icon: '/images/icon-image.png', page: '/pages/image_repair/image_repair' },
      { id: 3, name: '证件照', icon: '/images/icon-id.png', page: '/pages/id_photo/id_photo' },
      { id: 4, name: '报名统计', icon: '/images/icon-stats.png', page: '/pages/registration_stats/registration_stats' },
      { id: 5, name: '随机发号', icon: '/images/icon-random.png', page: '/pages/random_number/random_number' },
      { id: 6, name: '充电记录', icon: '/images/icon-charging.png', page: '/pages/charging_records/charging_records' },
      { id: 7, name: '报价预警', icon: '/images/icon-coming.png', page: '/pages/module7/module7' },
      { id: 8, name: '更多功能', icon: '/images/icon-more.png', page: '/pages/module8/module8' }
    ]
  },
  
  // 点击模块跳转到对应页面
  navigateToModule(e) {
    const moduleId = e.currentTarget.dataset.id;
    const moduleName = e.currentTarget.dataset.name;
    const page = e.currentTarget.dataset.page;
    
    // 已完成的功能直接跳转（目前只有视频去水印和充电记录）
    if (moduleId === 1 || moduleId === 6) {
      wx.navigateTo({
        url: page
      });
    } else {
      // 其他未完成的功能跳转到开发中页面
      wx.navigateTo({
        url: '/pages/coming_soon/coming_soon?name=' + encodeURIComponent(moduleName)
      });
    }
  },
  
  onLoad() {
    console.log('主页导航加载完成');
  },
  
  // 自定义分享给好友功能
  onShareAppMessage() {
    return {
      title: '小手工具集合 - 多功能实用工具箱',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png' // 可以使用默认分享图片或自定义图片
    };
  },

  // 自定义分享到朋友圈功能
  onShareTimeline() {
    return {
      title: '小手工具集合 - 实用多功能工具箱',
      query: '',
      imageUrl: '/images/share-cover.png'
    };
  }
})
