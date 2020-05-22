<template>
	<view class="mine">
		<view class="mTop">
			<view class="mTop_info flex">
				<view class="mImg" >
					<block v-if="selfInfo">
						<image v-if="datas.pic" :src="datas.pic" alt="" >
						<image v-if="!datas.pic" src="../../static/image/mine/m_head.png" alt="" >
					</block>
					<block v-if="!selfInfo">
						<image src="../../static/image/mine/m_head.png" alt="" >
					</block>
				</view>
				<view class="mTop_tit" >
					<block  v-if="selfInfo">
						<view v-if="datas.nickname">{{datas.nickname}}</view>
						<button v-if="!datas.nickname" open-type="getUserInfo" class="phone_btn mTop_nickName" @getuserinfo="bindGetUserInfo">
								点击获取微信头像和昵称
						</button>
						<view class="mTop_level">普通会员</view>
					</block>
					<block v-if="!selfInfo">
						<button class="phone_btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">
								注册/登录
						</button>
					</block>
				</view>
			</view>
			
			
		</view>
		<view class="mBot">
			<!-- //账户信息 -->
			<view class="mTop_mon">
				<view class="mTop_monTop flex_be">
					<view class="mTop_monTopL">账户余额</view>
					<view class="mTop_monTopR" @click="toAccount">账户明细></view>
				</view>
				<view class="mTop_monBot flex_arr">
					<view class="mTop_monBot_item">
						<view class="mTop_monBot_itemT">{{datas.balance||0}}</view>
						<view class="mTop_monBot_itemB">可用金额(元)</view>
					</view>
					<view class="mTop_monBot_item">
						<view class="mTop_monBot_itemT">{{datas.wait_in_balance||0}}</view>
						<view class="mTop_monBot_itemB">待入账(元)</view>
					</view>
					<view class="mTop_monBot_item">
						<view class="mTop_monBot_itemT">{{datas.total_balance||0}}</view>
						<view class="mTop_monBot_itemB">累计分佣(元)</view>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="mTop_mon">
				<view class="mTop_monTop flex_be">
					<view class="mTop_monTopL">我的订单</view>
					<view class="mTop_monTopR" @click="toOrder(0)" >全部订单></view>
				</view>
				<view class="mTop_monBot flex_arr">
					<view class="mTop_ordBot_item flex" @click="toOrder(1)">
						<view class="mTop_ordBot_itemT" >
							<image src="../../static/image/mine/m_zf.png"></image>
							<view class="mTop_ordBot_itemT_dot" v-if="datas.non_payment">{{datas.non_payment||0}}</view>
						</view>
						<view class="mTop_monBot_itemB">待支付</view>
					</view>
					<view class="mTop_ordBot_item flex" @click="toOrder(2)">
						<view class="mTop_ordBot_itemT">
							<image src="../../static/image/mine/m_fh.png"></image>
							<view class="mTop_ordBot_itemT_dot" v-if="datas.unfilled_order">{{datas.unfilled_order||0}}</view>
						</view>
						<view class="mTop_monBot_itemB">待发货</view>
					</view>
					<view class="mTop_ordBot_item flex" @click="toOrder(3)">
						<view class="mTop_ordBot_itemT">
							<image src="../../static/image/mine/m_sh.png"></image>
							<view class="mTop_ordBot_itemT_dot" v-if="datas.unreceived">{{datas.unreceived||0}}</view>
						</view>
						<view class="mTop_monBot_itemB">待收货</view>
					</view>
					<view class="mTop_ordBot_item flex" @click="toOrder(4)">
						<view class="mTop_ordBot_itemT">
							<image src="../../static/image/mine/m_wc.png"></image>
						</view>
						<view class="mTop_monBot_itemB">已完成</view>
					</view>
				</view>
			</view>
			<!-- //广告 -->
			<view class="mBot_ad">
				<!-- <image src="../../static/image/mine/m_yq.png" mode=""></image> -->
				<image src="../../static/image/mine/m_yq.png" mode="" @click="showShare()"></image>
			</view>
			<!-- other -->
			<view class="mBot_other">
				<view class="mBot_otherItem" @click="toAddress">地址管理</view>
				<view class="mBot_otherItem" @click="toCoupon">优惠券</view>
				<view class="mBot_otherItem flex_be"  @click="toTeam">
					我的团队
				   <view class="mBot_otherItem_right">已邀{{datas.team_num||0}}人</view>
				</view>
			</view>
		</view>
		
		<!-- //弹出分享 -->
		<view class="shareMask" v-if="showMask" @tap="showMask=false" catchtouchmove='true' >
			<view class="s_box">
				<view @click.stop="">
					<canvas disable-scroll="true" canvas-id="share_qr_code" id="share_qr" style="width:580rpx;height:800rpx;border-radius: 32rpx;"></canvas>
					<view class="btn_box ly-flex-center-around">
						
						<button class="ly_flex_center_column" open-type="share">
							<image src="../../static/image/mine/wx@2x.png" mode=""></image>
							<text>分享到微信</text>
						</button>
						<button class="ly_flex_center_column" @click="saveImg" v-if="canSave">
							<image src="../../static/image/mine/xc@2x.png" mode=""></image>
							<text>保存到相册</text>
						</button>
						<button class="ly_flex_center_column" open-type="openSetting" v-if="!canSave">
							<image src="../../static/image/mine/xc@2x.png" mode=""></image>
							<text>保存到相册</text>
						</button>
					</view>
				</view>
			</view>
		</view> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showMask:false,//是否显示share
				datas:{},//个人信息
				selfInfo:false,//是否有个人头像信息
				shareQrImg:'',//个人分享的图片
				qrImg:"",//base64图片，从后台获取二维码
				drawHeadImg:"../../static/image/mine/m_head.png",//默认绘画的head，如果有就获取
				authToken:null,
				canSave:true,//是否可以保存图片
			}
		},
		methods: {
			//获取头像信息
			bindGetUserInfo(e){
				console.log("获取头像信息",e)
				if(!e.detail.iv)return 
				let open_id = uni.getStorageSync("open_id")
				this.$http.post("app/wx/get/pic/nickname/unionId",{
					encrypted_data:e.detail.encryptedData,
					iv:e.detail.iv,
					openid:open_id
				})
				.then(res=>{
					console.log("头像结果",res)
					this.getData()
				})
				.catch(rej=>{
					console.log("头像结果失败",rej)
					this.$tips.toast(rej.data.message||"网络异常")
				})
			},
			//获取手机号
			getPhoneNum(resP){ 
				console.log("获取手机号",resP)
				let open_id = uni.getStorageSync("open_id")
				this.$http.post("app/user/public/register",{
						open_id:open_id,
						iv:resP.detail.iv,
						unique_type:1,
						encrypted_data:resP.detail.encryptedData
					})
					.then(res=>{
						 console.log("登录结果",res);
						 uni.setStorageSync("token",res.data)
						 this.$store.commit("setToken",res.data)
						 this.authToken = res.data;
						 // uni.removeStorageSync("is_new") //去除新人标记
						 this.selfInfo = true
						 this.getData()
					})
					.catch(rej=>{
						console.log("注册失败",rej)
						this.$tips.toast("登陆失败，请稍后再试~")
					})
			  },
			  //获取信息
			getData(){
				  //请求个人数据
				  this.$tips.loading()
				  this.$http.post("app/terminal/user/my/center")
				  .then(res=>{
					console.log("获取数据",res)
				  	this.$tips.loaded()
				  	this.datas = res.data
					return res.data
				  })
				  .then(res=>{
					  console.log("拿到信息",res) 
					  if(res.pic){
						  uni.downloadFile({
							 url:`${this.$configs.RequestUrl+res.byte_pic_api}`,
							 header:{'app-auth':this.authToken,'content-type': 'application/json;charset=UTF-8'},
							 success:(res)=>{
								 console.log("获取头像",res)
								 this.drawHeadImg = res.tempFilePath
							 },
							 fail:(rej)=>{
								 console.log("获取img失败",rej)
								 this.$tips.toast(rej.data.message||"网络异常")
							 }
						  })
					  }
				  })
				  .catch(rej=>{console.log("失败",rej)
				  	this.$tips.loaded()
				  	if(rej.data.code == "200104")return;//游客
				  	this.$tips.toast(rej.data.message||"网络异常")
				  })
				  //请求获取邀请码
				  let selfInfo = this.selfInfo
				  if(selfInfo){
					 uni.downloadFile({
						 url:`${this.$configs.RequestUrl}app/wx/get/qr/code/byte`,
						 header:{'app-auth':this.authToken,'content-type': 'application/json;charset=UTF-8'},
						 success:(res)=>{
							 console.log("获取二维码",res)
							 this.qrImg = res.tempFilePath
						 },
						 fail:(rej)=>{
							 console.log("获取img失败",rej)
							 this.$tips.toast(rej.data.message||"网络异常")
						 }
					 })
				  }
				
			},
         //去账户明细
			 toAccount(){
				 if(!this.selfInfo)return this.$tips.toast("请先登陆"); 
				 uni.navigateTo({
					 url: 'account/account'
				 });
			 },
			 //地址管理
			 toAddress(){
				 if(!this.selfInfo)return this.$tips.toast("请先登陆");
				 uni.navigateTo({
					 url: './addressMan/addressMan'
				 });
			 },
			 //去卡券
			 toCoupon(){
				 if(!this.selfInfo)return this.$tips.toast("请先登陆");
				 uni.navigateTo({
					 url: './coupon/coupon'
				 });
			 },
			 //去订单
			 toOrder(id){
				 if(!this.selfInfo)return this.$tips.toast("请先登陆");
				 console.log("eee",id)
				 uni.navigateTo({
					 url: './order/order?tabs='+id
				 });
			 },
			//去团队
			toTeam(id){
				if(!this.selfInfo)return this.$tips.toast("请先登陆");
				 uni.navigateTo({
					 url: './team/team',
				 });
				},
			showShare(){
				let __that = this;
				if(!this.selfInfo)return this.$tips.toast("请先登陆");
				this.showMask=true;
				this.$nextTick(function(){
					__that.drawShareImg();
				})
			},
			//绘制个人分享图片
			drawShareImg(){
				let __that = this;
				const share_qr = uni.createSelectorQuery().select('#share_qr');
				console.log(share_qr)
				share_qr.boundingClientRect((data)=>{
					console.log(data)
				//uni.getSystemInfo({success:function(data){	
					const defWidth = 580;
					const defHeight = 800; 
					// const win_height = data.windowHeight;
					// const win_width = data.windowWidth;
					const win_height = data.height;
					const win_width = data.width;
					const ctx = uni.createCanvasContext('share_qr_code');
					//填充白色背景
					ctx.setFillStyle('#FFFFFF');
					ctx.fillRect(0, 0, win_width, win_height)
					//设置圆角
					//const x=0,y=0,w=win_width,h=win_height,r=5;
					// ctx.save()
					//ctx.beginPath();
					//ctx.setFillStyle("#FFFFFF"); 
					//ctx.setStrokeStyle('#FFFFFF')
					//ctx.setLineJoin('round');  //交点设置成圆角
					//ctx.setLineWidth(r);
					//ctx.strokeRect(x + r/2, y + r/2, w - r , h - r );
					//ctx.fillRect(x + r, y + r, w - r * 2, h - r * 2);
					// ctx.stroke()
				    //ctx.closePath();
					//画头像
					const m_head_weight = Math.floor(100*win_width/defWidth);
					const m_head_left = Math.floor(238*win_width/defWidth);
					const m_head_top = Math.floor(34*win_height/defHeight);
					ctx.save()
					ctx.beginPath()
					ctx.arc(m_head_left+(m_head_weight/2), m_head_top+(m_head_weight/2), m_head_weight/2, 0, 2 * Math.PI)
					ctx.clip()
					ctx.drawImage(__that.drawHeadImg,m_head_left,m_head_top,m_head_weight,m_head_weight);
					ctx.restore()
					//画文字 
					const font1_left = Math.floor(win_width/2); 
					const font1_top = Math.floor(161*win_height/defWidth); 
					ctx.setFontSize(15)
					ctx.setFillStyle('#333333')
					ctx.setTextAlign('center')
					ctx.fillText('扫码免费获得优惠券',font1_left,font1_top);
					//画二维码
					const qr_weight = Math.floor(500*win_width/defWidth);
					const qr_left = Math.floor(38*win_width/defWidth);
					const qr_top = Math.floor(251*win_height/defHeight); 
					// const fsm = uni.getFileSystemManager();
					
					ctx.drawImage(__that.qrImg,qr_left,qr_top,qr_weight,qr_weight)
					// ctx.drawImage('../../static/image/mine/qr_code.png',qr_left,qr_top,qr_weight,qr_weight)
					//保存图片到相册
					// ctx.draw(false,function(){
					// 	uni.canvasToTempFilePath({canvasId:'share_qr_code',success(res){
					// 		__that.shareQrImg = res.tempFilePath  //h5平台中是base64图片 
					// 		uni.saveImageToPhotosAlbum({
					// 			filePath:res.tempFilePath,
					// 			success() {
					// 				console.log("success");
					// 			}
					// 		})
					// 	}}); 
					// })
					ctx.draw()
				//}})
				}).exec();
			},
			// 分享彈窗的保存图片
			saveImg(){
				console.log('保存圖片');
				let __that = this;
				uni.canvasToTempFilePath({canvasId:'share_qr_code',success(res){
					console.log(res.tempFilePath)
					__that.shareQrImg = res.tempFilePath  //h5平台中是base64图片 
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success() {
							__that.$tips.toast("保存成功")
							console.log("success");
						},
						fail(rej){
							//如果拒绝,让保存图片按钮变成打开设置的
							// __that.canSave = false
							console.log("fail",rej);
						}
					})
				}}); 
			}
		},
		onLoad(){
			let that = this
			let token = uni.getStorageSync("token"); 
			if (token) {
				this.selfInfo=true
				this.authToken =token;
			}
		},
		onShow(){ 
			console.log("this.selfInfo",this.selfInfo)
			if(!this.selfInfo){
				 this.$tips.modal("请先登录")
			}
		   this.getData()
		   //获取用户是否有保存图片的权限，
		   let that = this
		   uni.getSetting({
		      success(res) {
		         // console.log("获取用户权限",res.authSetting['scope.address']== false)
				 if(res.authSetting['scope.writePhotosAlbum'] == false){
					 //为false就是点击过授权按钮并拒绝的。让保存图片按钮变成打开设置的
				      that.canSave = false
				 }else{
					 that.canSave = true
				 }
		      }
		   })
		},
		onShareAppMessage (res) {
			console.log(res)
		    if (res.from === 'button') {
		      // 来自页面内转发按钮
		      console.log('转发按钮')
		      console.log(res.target)
		    }
			let __that = this;
			uni.canvasToTempFilePath({canvasId:'share_qr_code',success(res){
				console.log(res.tempFilePath)
				__that.shareQrImg = res.tempFilePath  //h5平台中是base64图片 
			}}); 
		    return {
		      title: '嗨~快來找我呀，等你哦~',
		      path: 'pages/index/index?fromUserId='+this.datas.id,
			  imageUrl: __that.shareQrImg
		    }
		}
	}
</script>

<style lang="scss">
	.mTop {
		width: 100%;
		height: 320rpx;
		// background: rgba(242,43,43,1);
		background: linear-gradient(180deg,rgba(242,43,43,1) 20%,rgba(233,67,47,1) 65%,rgba(253,102,29,1) 100%);;
		// background: linear-gradient(90deg,rgba(255,175,51,1) 0%,rgba(233,67,47,1) 0%,rgba(253,102,29,1) 100%);;
		padding:20rpx 32rpx 0;
	}

	.mTop_info {
		padding-left: 30rpx;
		align-items: center;
		margin-bottom: 60rpx;
	}
	.phone_btn{
		background: none;
		border: none;
		padding: 0;
		line-height: inherit;
		font-size: 48rpx;
		color: #fff;
	}
	.phone_btn:after{
		border: none;
	}
   
	.mImg {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;
		open-data{
			width: 100%;
			height: 100%;
		}

	}

	.mTop_tit {
		font-size: 32rpx;
		color: #F5F5F5;
		font-weight: bold;
		margin-left: 20rpx;
		.mTop_nickName{
			font-size: 32rpx;
		}
		.mTop_level {
			display: inline-block;
			padding: 0 20rpx;
			font-size: 24rpx;
			background: rgba(0, 0, 0, .25);
			border-radius: 16rpx;
			font-weight: 100;
			margin-top: 10rpx;
		}
	}

	.mTop_mon {
		width: 100%;
		padding: 20rpx 20rpx 24rpx;
		background: #fff;
		border-radius: 20rpx;
		box-shadow:0px 0px 5px 0px rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
	}

	.mTop_monTop {
		align-items: center;
		margin-bottom: 46rpx;
	}

	.mTop_monTopL {
		font-size: 28rpx;
		color: #333;
	}

	.mTop_monTopR {
		font-size: 24rpx;
		color: #999;
	}

	.mTop_monBot {
		align-items: center;
		color: #333;
	}

	.mTop_monBot_item {
		text-align: center;
		font-size: 24rpx;
	}

	.mTop_monBot_itemT {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.mTop_ordBot_item{
		flex-direction: column;
		align-items: center;
		text-align: center;
		font-size: 24rpx;
	}	
	.mTop_ordBot_itemT{
		width: 50rpx;
		height: 50rpx;
		position: relative;
	}
	.mTop_ordBot_itemT_dot{
		padding:0rpx 6rpx;
		border: 1rpx solid #F22B2B;
		border-radius: 40%;
		font-size: 16rpx;
		color: #F22B2B;
		position: absolute;
		top: -8rpx;
		right: -10rpx;
	}
	.mBot{
		width: 100%;
		padding:0rpx 32rpx 80rpx;
		margin-top:-100rpx ;
	}
	.mBot_ad{
		width: 100%;
		height: 195rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	.mBot_other{
		width: 100%;
		background: #FFFFFF;
		box-shadow:0px 0px 5px 0px rgba(0, 0, 0, 0.1);
		border-radius:20rpx;
		padding:0 19rpx 90rpx;
		font-size: 28rpx;
		color: #333;
	}
	.mBot_otherItem{
		width: 100%;
		padding:29rpx 0 20rpx;
		border-bottom:1rpx solid #E6E6E6;
		align-items: center;
	}
	.mBot_otherItem_right{
		padding: 5rpx 35rpx;
		background: #FFA92F;
		border-radius: 25rpx;
	}
	.shareMask{
		width: 100%;
		height: 100vh;
		background: rgba($color: #000, $alpha: 0.5);
		position: fixed;
		top: 0;
		left: 0;
		.s_box{
			width: 580rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			.s_boxTop{
				padding: 30rpx 40rpx 40rpx;
				background: #fff;
				border-radius:32rpx;
				font-size: 30rpx;
				.s_boxTopSub{
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					overflow: hidden;
					margin: 0 auto;
				}
				
				.s_boxTopCon{
					margin: 30rpx 0 60rpx;
					text-align: center;
				}
				.s_boxTopCode{
					width: 500rpx;
					height: 500rpx;
				}
			}
			.btn_box {
				margin-top: 58rpx;
				button {
					background: $ly-bg-trans;
					color: $ly-text-color-inverse;
					font-size: $ly-font-size;
					image {
						width: 80rpx;
						height: 80rpx;
						margin-bottom: 22rpx;
					}
					text {
						line-height: 24rpx;
					}
				}
				button::after{
					border: none;
				}
				
			}
		}
	}
</style>
