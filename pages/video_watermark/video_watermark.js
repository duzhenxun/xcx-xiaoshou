// pages/video_watermark/video_watermark.js
Page({
  data: {
    videoUrl: '', // 用户输入的视频链接
    videoInfo: null, // 解析后的视频信息
    isLoading: false, // 加载中状态
    errorMsg: '', // 错误消息
    history: [], // 历史记录
    downloadProgress: 0, // 下载进度
    isDownloading: false, // 是否正在下载
    downloadState: '' // 下载状态：starting, downloading, success, error, canceled
  },
  
  onLoad() {
    // 加载历史记录
    const history = wx.getStorageSync('videoHistory') || [];
    
    // 设置默认文案
    const defaultText = "0.71 06/28 SLJ:/ t@E.uf # 回头看才发现自己也咬着牙走了很远的路 一想起你，我就牙疼。你可知道，牙疼要命。你这个熊孩子👶🏻  https://v.douyin.com/t6t44OSTZbw/ 复制此链接，打开Dou音搜索，直接观看视频！";
    
    this.setData({ 
      history,
      videoUrl: defaultText
    });
  },
  
  // 输入框内容变化
  onUrlInput(e) {
    this.setData({
      videoUrl: e.detail.value,
      errorMsg: ''
    });
  },
  
  // 粘贴链接
  pasteUrl() {
    wx.getClipboardData({
      success: (res) => {
        if (res.data && res.data.indexOf('douyin.com') > -1) {
          this.setData({
            videoUrl: res.data,
            errorMsg: ''
          });
          wx.showToast({
            title: '已粘贴链接',
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: '剪贴板中无有效链接',
            icon: 'none'
          });
        }
      }
    });
  },
  
  // 从分享文本中提取抖音链接
  extractDouyinUrl(text) {
    const urlRegex = /https:\/\/v\.douyin\.com\/[\w-]+\/?/;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  },
  
  // 解析视频
  parseVideo() {
    const shareText = this.data.videoUrl.trim();
    
    if (!shareText) {
      this.setData({ errorMsg: '请输入或粘贴视频链接' });
      return;
    }
    
    // 提取抖音链接
    const douyinUrl = this.extractDouyinUrl(shareText);
    if (!douyinUrl) {
      this.setData({ errorMsg: '未找到有效的抖音链接' });
      return;
    }
    
    this.setData({ isLoading: true, errorMsg: '', videoInfo: null });
    
    // 调用API解析视频
    const apiUrl = `https://xcx.xs25.cn/jiexi/api/douyinjx?url=${douyinUrl}`;
    console.log('解析API:', apiUrl);
    wx.request({
      url: apiUrl,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.code === 200) {
          // 解析成功
          const videoData = res.data.data;
          const additionalData = videoData.additional_data[0] || {};
          
          // 构建视频信息对象
          const videoInfo = {
            title: additionalData.desc || '抖音视频',
            author: additionalData.nickname || '抖音用户',
            authorAvatar: additionalData.url || '',
            authorSignature: additionalData.signature || '',
            coverUrl: videoData.cover_url || '',  // 如果API返回了封面URL
            videoUrl: videoData.video_url || videoData.play_url,
            parseTime: videoData.parse_time || '',
            originalUrl: douyinUrl
          };
          
          // 更新历史记录 - 相同链接只保存最新的一条
          // 先移除可能存在的相同链接记录
          let history = this.data.history.filter(item => item.originalUrl !== douyinUrl);
          // 添加新记录到最前面
          history = [videoInfo, ...history];
          // 限制历史记录数量
          if (history.length > 20) history.pop();
          
          this.setData({
            videoInfo: videoInfo,
            history: history,
            isLoading: false,
            errorMsg: '解析成功，可以点击下载按钮下载视频'
          });
          
          // 保存到本地存储
          wx.setStorageSync('videoHistory', history);
          
          // 显示成功消息，并在3秒后隐藏
          setTimeout(() => {
            this.setData({ errorMsg: '' });
          }, 3000);
        } else {
          // 解析失败
          this.setData({ 
            isLoading: false, 
            errorMsg: res.data.msg || '视频解析失败，请检查链接是否正确' 
          });
        }
      },
      fail: (err) => {
        console.error('API请求失败', err);
        this.setData({ 
          isLoading: false, 
          errorMsg: '网络请求失败，请检查网络连接' 
        });
      }
    });
  },
  
  // 处理下载失败的公共方法
  handleDownloadFailure() {
    wx.showModal({
      title: '下载失败',
      content: '视频下载失败，您可以复制链接在浏览器中下载或者重试',
      confirmText: '复制链接',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.copyVideoUrl();
        }
      }
    });
  },
  
  // 复制视频地址
  copyVideoUrl() {
    if (!this.data.videoInfo) {
      wx.showToast({
        title: '请先解析视频',
        icon: 'none'
      });
      return;
    }
    
    wx.setClipboardData({
      data: this.data.videoInfo.videoUrl,
      success: () => {
        wx.showToast({
          title: '已复制视频地址',
          icon: 'success'
        });
      }
    });
  },
  
  // 下载视频
  downloadVideo() {
    if (!this.data.videoInfo) {
      wx.showToast({
        title: '请先解析视频',
        icon: 'none'
      });
      return;
    }
    
    // 下载已在进行中，提供取消选项
    if (this.data.isDownloading) {
      this.showCancelDownloadOption();
      return;
    }
    
    // 重置下载状态并显示下载进度条
    this.setData({
      downloadProgress: 0,
      isDownloading: true,
      downloadState: 'starting'
    });
    
    // 显示加载提示
    wx.showLoading({
      title: '准备下载...',
      mask: true
    });
    
    let videoUrl = this.data.videoInfo.videoUrl;
    
    // 处理zjcdn.com域名的视频URL，解决小程序访问限制问题
    // if (videoUrl.includes('zjcdn.com')) {
    //   // 简化的URL替换逻辑，只针对zjcdn.com域名
    //   const regex = /https:\/\/([^.]+)\.zjcdn\.com\//;
    //   const match = videoUrl.match(regex);
    //   if (match && match[1]) {
    //     const domain = match[1];
    //     videoUrl = videoUrl.replace(`https://${domain}.zjcdn.com/`, `https://xcx.xs25.cn/down/${domain}/`);
    //     console.log('处理后的视频URL:', videoUrl);
    //   }
    // }
    
    // 生成文件名 - 作者名加"-"加介绍的前20个字
    let fileName = '';
    if (this.data.videoInfo) {
      // videoInfo.author 已经映射了 additionalData.nickname
      const nickname = this.data.videoInfo.author || '';
      // videoInfo.title 已经映射了 additionalData.desc，只取前20个字符
      const desc = (this.data.videoInfo.title || '').slice(0, 20);
      // 处理非法字符
      const safeNickname = nickname.replace(/[\/:\\*?\"<>|]/g, '_');
      const safeDesc = desc.replace(/[\/:\\*?\"<>|]/g, '_');
      // 组合文件名
      fileName = `${safeNickname}-${safeDesc}`;
      // 碰到空文件名则使用默认名
      if (fileName === '-') fileName = 'douyin_video';
    } else {
      fileName = 'douyin_video';
    }
    console.log('下载文件名：'+fileName);
     
    // 确保URL被正确编码处理
    // 注意：使用转换后的videoUrl进行编码
    let encodedVideoUrl = videoUrl;
    
    // 如果URL中包含中文等特殊字符，直接对整个URL进行编码
    // 小程序环境不支持URL构造器，使用更简单的方法
    try {
      // 直接对整个URL进行编码，微信小程序会自动处理
      encodedVideoUrl = encodeURI(videoUrl);
      console.log('编码后的URL:', encodedVideoUrl);
    } catch(e) {
      console.error('URL编码失败', e);
      // 使用原始URL作为后备
      encodedVideoUrl = videoUrl;
    }
    
    console.log('转换后的下载链接:'+ encodedVideoUrl);
    
    // 下载文件 - 存储任务引用以便后续取消
    this.downloadTask = wx.downloadFile({
      url: encodedVideoUrl,
      header: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        'Accept': '*/*',
        'Connection': 'keep-alive'
      },
      // 加入更长的超时时间，便于大文件下载
      timeout: 120000, // 2分钟
      // 启用高性能设置
      useHighPerformanceMode: true,
      enableHttp2: true,
      enableQuic: true,
      success: (res) => {
        // 隐藏加载提示
        wx.hideLoading();
        
        // 成功下载完成
        if (res.statusCode === 200) {
          // 更新下载状态
          this.setData({ downloadState: 'success' });
          
          // 将临时文件保存到相册 (小程序不能指定保存文件名，但我们会在提示中显示)
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              // 显示成功提示并包含文件名信息
              wx.showModal({
                title: '保存成功',
                content: `视频已保存到相册
文件名: ${fileName}`,
                showCancel: false
              });
            },
            fail: (err) => {
              console.error('保存失败', err);
              this.setData({ downloadState: 'error' });
              
              // 分析错误类型以提供更具体的提示
              const errMsg = err.errMsg || '';
              if (errMsg.includes('auth')) {
                // 权限错误
                wx.showModal({
                  title: '权限错误',
                  content: '保存视频需要相册权限，请授权后重试',
                  confirmText: '去授权',
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting();
                    }
                  }
                });
              } else {
                // 其他错误
                wx.showModal({
                  title: '保存失败',
                  content: '视频保存失败，可以尝试使用复制链接方式',
                  confirmText: '复制链接',
                  success: (res) => {
                    if (res.confirm) {
                      this.copyVideoUrl();
                    }
                  }
                });
              }
            },
            complete: () => {
              this.setData({ isDownloading: false });
              this.cleanupDownloadTask();
            }
          });
        } else {
          this.setData({ 
            isDownloading: false,
            downloadState: 'error' 
          });
          
          // 下载失败，提供复制链接选项
          wx.showModal({
            title: '下载失败',
            content: `下载失败(${res.statusCode})，是否复制视频链接在浏览器中下载？`,
            confirmText: '复制链接',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) {
                this.copyVideoUrl();
              }
            }
          });
        }
      },
      fail: (err) => {
        console.error('下载视频失败', err);
        wx.hideLoading();
        
        this.setData({ 
          isDownloading: false,
          downloadState: 'error' 
        });
        
        // 直接显示下载失败，提供复制链接选项
        this.handleDownloadFailure();
        this.cleanupDownloadTask();
      }
    });
    
    // 监听下载进度变化
    this.downloadTask.onProgressUpdate((res) => {
      const progress = res.progress;
      const totalMB = (res.totalBytesExpectedToWrite / (1024 * 1024)).toFixed(2);
      const downloadedMB = (res.totalBytesWritten / (1024 * 1024)).toFixed(2);
      
      this.setData({
        downloadProgress: progress,
        downloadState: 'downloading'
      });
      
      // 更新加载提示
      wx.showLoading({
        title: `下载中 ${progress}%`,
        mask: true
      });
      
      console.log(`下载进度: ${progress}%, ${downloadedMB}MB/${totalMB}MB`);
    });
    
    // 监听响应头，可提前获取文件信息
    this.downloadTask.onHeadersReceived((res) => {
      const headers = res.header;
      console.log('响应头:', headers);
      
      // 获取文件大小（如果服务器提供）
      if (headers['Content-Length']) {
        const fileSizeMB = (parseInt(headers['Content-Length']) / (1024 * 1024)).toFixed(2);
        if (fileSizeMB > 50) { // 大于50MB的文件
          wx.showToast({
            title: `文件较大(${fileSizeMB}MB)，请耐心等待`,
            icon: 'none',
            duration: 3000
          });
        }
      }
    });
  },
  
  // 清理下载相关的监听器和引用
  cleanupDownloadTask() {
    if (this.downloadTask) {
      try {
        this.downloadTask.offProgressUpdate();
        this.downloadTask.offHeadersReceived();
      } catch (e) {
        console.error('清理下载任务失败', e);
      }
      this.downloadTask = null;
    }
  },
  
  // 取消下载
  cancelDownload() {
    if (this.downloadTask && this.data.isDownloading) {
      this.downloadTask.abort();
      wx.hideLoading();
      
      this.setData({
        isDownloading: false,
        downloadProgress: 0,
        downloadState: 'canceled'
      });
      
      wx.showToast({
        title: '已取消下载',
        icon: 'none'
      });
      
      this.cleanupDownloadTask();
    }
  },
  
  // 显示取消下载选项
  showCancelDownloadOption() {
    wx.showModal({
      title: '下载进行中',
      content: `当前下载进度: ${this.data.downloadProgress}%，是否取消？`,
      confirmText: '取消下载',
      cancelText: '继续下载',
      success: (res) => {
        if (res.confirm) {
          this.cancelDownload();
        }
      }
    });
  },
  
  // 播放视频
  playVideo() {
    if (!this.data.videoInfo) {
      wx.showToast({
        title: '请先解析视频',
        icon: 'none'
      });
      return;
    }
    
    // 小程序中可以使用video组件播放，已在wxml中实现
  },
  
  // 查看历史记录
  viewHistory() {
    wx.showToast({
      title: '历史记录已加载',
      icon: 'success'
    });
  },
  
  // 清除历史记录
  clearHistory() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ history: [] });
          wx.setStorageSync('videoHistory', []);
          wx.showToast({
            title: '历史记录已清除',
            icon: 'success'
          });
        }
      }
    });
  },
  
  // 从历史记录中选择视频
  selectHistoryItem(e) {
    const index = e.currentTarget.dataset.index;
    const video = this.data.history[index];
    this.setData({
      videoInfo: video
    });
  },
  
  // 自定义分享给好友功能
  onShareAppMessage() {
    // 默认分享信息
    let shareInfo = {
      title: '视频去水印小工具',
      path: '/pages/video_watermark/video_watermark',
      imageUrl: '/images/share-cover.png' // 可以使用默认分享图片或自定义图片
    };
    
    // 如果当前有已解析的视频，则将分享内容改为当前视频信息
    if (this.data.videoInfo) {
      shareInfo.title = `${this.data.videoInfo.author}的视频：${this.data.videoInfo.title.slice(0, 20)}`;
      // 如果有封面图，使用封面图作为分享图片
      if (this.data.videoInfo.coverUrl) {
        shareInfo.imageUrl = this.data.videoInfo.coverUrl;
      }
    }
    
    console.log('正在分享：', shareInfo);
    return shareInfo;
  },
  
  // 自定义分享到朋友圈功能
  onShareTimeline() {
    // 默认分享信息
    let shareInfo = {
      title: '视频去水印小工具 - 一键去除抖音视频水印',
      query: '',
      imageUrl: '/images/share-cover.jpg'
    };
    
    // 如果当前有已解析的视频，则将分享内容改为当前视频信息
    if (this.data.videoInfo) {
      // 修改标题，包含作者和视频标题信息
      shareInfo.title = `${this.data.videoInfo.author}的视频: ${this.data.videoInfo.title.slice(0, 20)}`;
      
      // 使用视频封面作为分享图片
      if (this.data.videoInfo.coverUrl) {
        shareInfo.imageUrl = this.data.videoInfo.coverUrl;
      }
    }
    
    return shareInfo;
  }
});
