<script>
	export default {
		onLaunch: function(opt) {
		    console.log("onlaunch获取opt",opt)
			
			// A----如果是扫码进来，切割获取 "," 前后的数据1是用户邀请，2是商户邀请,3是商品分享
			let scene = decodeURIComponent(opt.query.scene)
			// B----如果是点击分享链接进来，获取fromUserId
			let  from_user_id = opt.query.fromUserId
			console.log("onlaunch获取opt2222",scene,from_user_id)
			//定义后台需要的两个参数fromUserId,merId并赋值为0
			let fromUserId = 0
			let merId = 0
			if(scene && scene!='undefined'){//从扫码进来
				let arr = scene.split("-")
				console.log("arr",arr)
				if(arr[0] == 1){
					fromUserId = arr[1]
				}else if(arr[0] == 2){
					merId = arr[1]
				}else{
					let id = arr[1]
					this.$http.get("app/terminal/user/my/shire/info/public?id="+id)
					.then(res=>{
						console.log("获取userid11",res)
						fromUserId = res.data.terminal_user_id
					})
					.catch(rej=>{
						console.log("获取失败",rej)
					})
				}
			}
			if(from_user_id){//从点击链接进来
				fromUserId = from_user_id
			}
		
			// #ifdef  MP-WEIXIN
			//进小程序就获取code
			let openId;
			this.$cObj.getCode()
			.then(res=>{
				console.log("res户籍去code",res)
				return this.$http.get("app/user/public/getOpenid?js_code="+res.code+"&unique_type=1")
			})
			.then(res=>{
				console.log("获取openid",res)
				openId = res.data
				uni.setStorageSync("open_id",openId)
				// console.log("opt刚打开小程序获取信息",opt,decodeURIComponent(opt.query.scene))
				//初次打开小程序，从缓存中获取token
			  
				let token = uni.getStorageSync( 'token')
				// console.log("token",token)
				if(token){
					this.$store.commit("setToken",token)
					//如果有token，判断是否过期，过期的话重新登陆
					return this.$http.get("app/user/checkLogin")
				}else{
				
					//若果没有,就是登陆接口
				    return 	this.$http.post("app/user/public/appLogin",{
							  unique_type:1,
							  login_type:3,
							   openid:openId,
							  recommend_offline_mer_sub_id: merId,
							  recommend_terminal_user_id: fromUserId
					 })
				}
			})
			.then(res=>{
				console.log("res",res)
				if(res.data){
					console.log("登录结果",res);
					uni.setStorageSync("token",res.data)
					this.$store.commit("setToken",res.data)
				}
			})
			.catch(rej=>{
				console.log("获取openid失败，其他异常",rej)
				//过期
				if(rej.data.code == "200302"){  //toke过期,重新授权
					 this.$http.post("app/user/public/appLogin",{
						  unique_type:1,
						  login_type:3,
						  openid:openId,
						  recommend_offline_mer_sub_id: 0,
						  recommend_terminal_user_id: 0
					  })
					.then(res=>{
						 console.log("登录结果",res);
						 uni.setStorageSync("token",res.data)
						 this.$store.commit("setToken",res.data)
					})
					.catch(rej=>{
						 console.log("登录失败",rej);
						 this.$tips.toast(rej.data.message||"网络异常")
					})
				}else if(rej.data.code == 8001) {
					// uni.setStorageSync("open_id",rej.data.message)
					uni.$emit("is_new", true);
				}else{
					this.$tips.toast(rej.data.message||"网络异常")
				}
			})
			// #endif
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* html { */
	page {
		background: #F7F8FA;
		z-index: -1;
		font-size: 24rpx;
		color: #2D2320;
		font-family:PingFangSC-Medium,PingFang SC;
	}
	view {
		box-sizing: border-box
	}
	image,img {
		max-width: 750rpx;
		width: 100%;
		height: 100%;
	}
	.icon_img {
		width: 48rpx;
		height: 48rpx;
	}
	.noMore {
		width: 100%;
		color: #bebebe;
		text-align: center;
		margin: 10rpx 0;
	}
	
	/*每个页面公共css */
		// .button-default {
		// 	padding: 0 14px;
		// }
		
		/* 弹性布局 start*/
		.ly-flex-center {
			display: flex;
			align-items: center;
		}
		.ly-flex-center-center {
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.ly-flex-end {
			display: flex;
			align-items: flex-end;
		}
		.ly-flex-start {
			display: flex;
			align-items: flex-start;
		}
		.ly-flex-stretch {
			display: flex;
			align-items: stretch;
		}
		.ly-flex-baseline {
			display: flex;
			align-items: baseline;
		}
		.ly-flex-baseline-between {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
		}
		.ly-flex-start-around {
			display: flex;
			align-items: flex-start;
			justify-content: space-around;
		}
		.ly-flex-center-around {
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
		.ly-flex-start-between {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
		}
		.ly-flex-center-between {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.ly-flex-center-warp {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
		}
		.ly-flex-between-warp {
			display: flex;
			/* align-items: center; */
			justify-content: space-between;
			flex-wrap: wrap;
		}
		.ly_flex_column {
			display: flex;
			flex-direction: column;
		}
		.ly_flex_center_column {
			display: flex;
			flex-direction: column;
			align-items: center;
		}		
		.ly_flex_between_column {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}		
		.ly_flex_center_around_column {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
		}		
		.flex{
			display: flex;
			flex-wrap: wrap;
		}
		.flex_be{
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
		}
		.flex_arr{
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;
		}
		
		/* 弹性布局 end */
</style>
