<template>
	<view class="cos">
		<view class="cos_top">
			应付金额：<text style="color: #D70000;font-size: 40rpx;">￥{{price}}</text>
			<view style="font-size: 26rpx;margin-top: 20rpx;">
				好东西很容易被人买走哦，支付剩余时间：<text style="color: #D70000;">{{time}}</text>
			</view>
		</view>
		<view class="cos_min">
			<view class="cos_minItem flex_be">
				<view class="cos_minItem_tit">支付宝支付</view>
				 <icon type="success" size="18" class="cos_minItem_tit2"/>
			</view>
			<view class="cos_minItem flex_be">
				<view class="cos_minItem_tit">微信支付</view>
				<view class="cos_minItem_tit2">(升级维护中)</view>
			</view>
			<view class="cos_minBtn" @click="refresh">如果已支付，请点击刷新</view>
		</view>
		<view class="cos_bot">
			<button open-type="contact" bindcontact="handleContact" :send-message-title="title"
			:send-message-path='path'
			:send-message-img="comImg" show-message-card="true" class="cos_botBtn">支付宝支付￥{{price}}</button>
		</view>
		 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				path:"",
				title:"收银台",
				comImg:"../../../../static/image/public/rowBot.png",
				price:"0",
				time:"0分0秒",//倒计时
				tf:function(){},//倒计时函数,清除用
				order_info_ids:"",//订单id
			};
		},
		methods:{
			toTrans(time){
				let seconds = time/1000
				let minute = Math.floor(seconds/60) 
				let endSeconds = Math.floor(seconds%60)
				if(endSeconds<10){
					endSeconds="0"+endSeconds
				}
				let str = minute+"分"+endSeconds+"秒"
				return str
			},
			refresh(){
				this.$tips.loading()
				this.$http.post("app/mall/goods/order/getMallGetOrderInfosPaymentData",{
					order_info_ids:[this.order_info_ids]
				})
				.then(res=>{
					this.$tips.loaded()
					let order_status = res.data.order_status
					console.log("获取结果",res)
					if(order_status != 1){
						uni.reLaunch({
							url:"/pages/mine/order/order"
						})
					}else{
						this.$tips.toast("请点击支付")
					}
				})
				.catch(rej=>{
					this.$tips.loaded()
					this.$tips.toast(rej.data.message||"网络异常")
				})
			}
		},
		onLoad(opt){
			let order_info_ids = opt.order_info_ids
			this.order_info_ids = order_info_ids
			this.path = "/pages/index/index?order_info_ids="+order_info_ids+"&pay_method=6"
			console.log("name,id,thods",this.path,order_info_ids)
		},
		onShow(){
			let that = this
			this.$tips.loading()
			this.$http.post("app/mall/goods/order/getMallGetOrderInfosPaymentData",{
				order_info_ids:[this.order_info_ids]
			})
			.then(res=>{
				this.$tips.loaded()
				this.price = res.data.real_price
				let time = res.data.time_remaining
				let order_status = res.data.order_status
				let t = setInterval(function(){
					time -= 1000
					that.time = that.toTrans(time)
					if(time == 0){
						clearInterval(t)
					}
					// console.log("time",that.time,time)
				},1000)
				this.tF = t
				console.log("获取结果",res)
				if(order_status != 1){
					uni.reLaunch({
						url:"/pages/mine/order/order"
					})
				}
				// 单状态1：待付款2：待发货3：待收货,4已完成 ,
				//5:已关闭 6:已取消 7:已退款(系统出库失败 自动退款),
				//8已退款(用户主动退款),9退款中(等待供应链完成退款)
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(rej.data.message||"网络异常")
			})
			
		
			
		},
		onHide(){
			clearInterval(this.tF)
		},
		onUnload(){
			clearInterval(this.tF)
		}
		
	}
</script>

<style lang="scss">
.cos{
	width: 100%;
	.cos_top{
		width: 100%;
		background: #fff;
		padding: 70rpx 0 50rpx;
		font-size: 28rpx;
		color: #333;
		text-align: center;
		margin-bottom: 20rpx;
	}
	.cos_min{
		background: #fff;
		width: 100%;
		padding: 10rpx 0 150rpx;
		.cos_minItem{
			align-items: center;
			font-size: 30rpx;
			color: #666666;
			padding: 38rpx 0;
			border-bottom: 1rpx solid #CCCCCC;
			.cos_minItem_tit{
				margin-left: 80rpx;
			}
			.cos_minItem_tit2{
				margin-right: 30rpx;
				font-size: 26rpx;
				color: #999999;
			}
		}
		.cos_minBtn{
			width: 690rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			background: #FFA917;
			font-size: 28rpx;
			color: #fff;
			margin: 50rpx auto;
			border-radius: 40rpx;
		}
	}
	.cos_bot{
		width: 100%;
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 10rpx 30rpx;
		.cos_botBtn{
			height: 80rpx;
			background: #D70000;
			color: #fff;
			border-radius: 40rpx;
			font-size: 28rpx;
		}
	}
}
</style>
