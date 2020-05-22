<template>
	<view class="car">
		<view class="car_top flex">
			<icon :type="status" size="120rpx"></icon>
			<view class="c_topWoc">{{status=='success'?"订单支付成功":"订单支付失败"}}</view> 
			<view class="c_topWoc2">实付金额：<text style="color:#F22B2B">￥{{money}}</text></view>
			<view class="c_topBot flex">
				<view class="c_topBot_btn" @click="toOrder">查看订单</view>
				<view class="c_topBot_btn" v-if="status=='success'" @click="toIndex">返回首页</view>
				<view class="c_topBot_btn2" v-if="status=='info'" @click="rePay">重新支付</view>
			</view>
		</view>
		<view class="car_min flex">
			—— <view class="car_tit"><image src="../../../static/image/car/c_tj.png" mode=""></image></view> ——
		</view>
		<!-- 商品列表 -->
		<view class="car_list">
			<goodsList :list="list" :loading="loading" @click="choose"></goodsList>
		</view>
	</view>
</template>

<script>
	// 模拟 JSON 数据
	// const data = require('@/common/json/data.json');
	export default {
		data() {
			return {
				page: 1,
				start: 0,
				end: 0,
				list: [], // 列表
				loading: true,
				status:"info",//支付结果success成功 info失败
				money:"0",//从前面带过来的money
			}
		},
		methods: {
			//重新支付
			rePay(){
				let order_nos = uni.getStorageSync("order_nos")
				let open_id = uni.getStorageSync("open_id")
				console.log("order",order_nos)
				this.$tips.loading()
				this.$http.post("app/order/pay",{
					order_info_ids:order_nos,
					pay_method:1,
					openid:open_id
				})
				.then(res=>{
					console.log("冲洗支付",res)
					this.$tips.loaded()
					if(res.data.code == "SUCCESS"){//预下单成功
					    let datas = res.data
					   return  this.$cObj.payMent(datas.time_stamp,datas.nonce_str,datas.wx_package,datas.pay_sign)
					}else{
					   return Promise.reject(res)
					}
				})
				.then(res=>{
					console.log("支付结果",res,this.money)
					uni.reLaunch({
						url:"/pages/car/payRes/payRes?money="+this.money+"&&status=success"
					})
				})
				.catch(rej=>{
					if(rej.data){
						this.$tips.toast(rej.data.message||rej.data.msg)
					}
					console.log("冲洗支付失败",rej)
				})
			},
			//查看订单
			toOrder(){
				uni.redirectTo({
					url:"../../mine/order/order"
				})
			},
			//返回首页
			toIndex(){
				uni.switchTab({
					url:"../../index/index"
				})
			},
			// 选中
			choose(item) {
				// item 返回选中 JSON 对象
				console.log(item)
			},
			// 模拟加载数据
			getList() {
				this.loading = true;
				this.$http.post('app/mall/search/goods/public/recommended/randomGoods',{
				  "limit": 10
				})
				.then(res=>{
					this.loading = false
					console.log("获取商品",res)
					this.list = res.data
				})
				.catch(rej=>{
					this.loading = false
					this.$tips.toast(rej.data.message||'网络异常')
					console.log("shibai",rej)
				})
			}
		},
		onLoad(option) {
			this.money = option.money
			this.status = option.status
			this.getList();
		},
	}
</script>

<style lang="scss">
.car_top{
	width: 100%;
	padding:32rpx 0 48rpx;
	background: #fff;
	flex-direction: column;
	font-size: 32rpx;
	color: #2D2320;
	align-items: center;
	.c_topWoc{
	  margin: 32rpx 0 8rpx;
	}
	.c_topWoc2{
		font-size: 24rpx;
		margin-bottom: 32rpx;
	}
	.c_topBot_btn,.c_topBot_btn2{
		padding: 16rpx 32rpx;
		border: 1rpx solid #969799;
		font-size: 28rpx;
		border-radius: 16rpx;
		margin: 0 16rpx;
	}
	.c_topBot_btn2{
		background: #F22B2B;
		color:#fff;
		border: none;
	}
}

.car_min{
	width: 100%;
	padding: 32rpx 0 ;
	align-items: center;
	justify-content: center;
	color: #E4E4E4;
	.car_tit{
		width: 172rpx;
		height: 32rpx;
		margin: 0 24rpx;
	}
	
}
.car_list{
	padding:0 32rpx 30rpx
}

</style>
