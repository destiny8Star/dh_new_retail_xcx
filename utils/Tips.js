export default class Tips {
  constructor() {
    this.isLoading = false;
  }
 static toast(title, onHide, icon = 'none') {
    uni.showToast({
      title: title,
      icon: icon,
      mask: true,
      duration: 1000
    });
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 1000)
    }
  }

  static alert(title) {
    uni.showToast({
      title: title,
	  image: require('./alert.png'),
      mask: true,
      duration: 1000
    })
  }

  static error(title, onHide) {
    uni.showToast({
      title: title,
      image: require('./alert.png'),
      mask: true,
      duration: 1500
    });
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 1500);
    }
  }

  static loading(title = '加载中') {
    if (Tips.isLoading) {
      return;
    }
    Tips.isLoading = true;
    uni.showLoading({
      title: title,
      mask: true
    });
  }

  static loaded() {
    if (Tips.isLoading) {
      Tips.isLoading = false;
      uni.hideLoading();
    }
  }



  /**
     * 弹出确认窗口
     */
  static confirm(text, payload = {}, title = '提示') {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title,
        content: text,
        showCancel: true,
        success: res => {
          if (res.confirm) {
            resolve(payload);
          } else if (res.cancel) {
            reject(payload);
          }
        },
        fail: res => {
          reject(payload);
        }
      })
    });
  }
  /**
    * 弹出确认窗口
    */
  static modal(text, title = '提示') {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: title,
        content: text,
        showCancel: false,
        success: res => {
          resolve(res)
        },
        fail: res => {
          reject(res);
        }
      })
    })
  }
}

Tips.isLoading = false;