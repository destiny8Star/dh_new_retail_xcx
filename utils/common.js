
let commonObj = {
	successStatus: '200',
	//生成随机字符串
	getString:function (len) {
	        len = len || 32;
	        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	        var maxPos = chars.length;
	        var pwd = '';
	        for (let i = 0; i < len; i++) {
	            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	        }
	        return pwd;
	    },
    //wx.login获取code
	getCode(){
		return new Promise((resolve,reject)=>{
			uni.login({
			  provider: 'weixin',
			  success: function (loginRes) {
				  resolve(loginRes)
			  },
			  fail:function(rej){
				  reject(rej)
			  }
			});
		})
	},
	//支付
	payMent(timeStamp,nonceStr,packages,paySign,type='wxpay'){
		return	new Promise((resolve,reject)=>{
				uni.requestPayment({
					provider: type,//默认微信支付
					timeStamp:timeStamp,// String(Date.now()),
					nonceStr: nonceStr,//'A1B2C3D4E5',
					package: packages,//'prepay_id=wx20180101abcdefg',
					signType: 'MD5',
					paySign: paySign,
					success: function (res) {
						 resolve(res)
						console.log('success:' + JSON.stringify(res));
					},
					fail: function (err) {
						reject(err)
						console.log('fail:' + JSON.stringify(err));
					}
				});
		   })
	}
	
}





export default commonObj