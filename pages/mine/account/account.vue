<template>
	<view class="acc">
		<view class="a_tbox">
			<view class="a_tboxTit">总金额(元)</view>
			<view class="a_tboxMon">{{total_money}}</view>
			<view class="a_tboxBot flex_arr">
				<view class="a_tboxBot_item" v-for="(item,index) in topItem" :key="index">
					<view class="a_tboxBot_itemM">{{item.mon}}</view>
					<view class="a_tboxBot_itemT">{{item.name}}</view>
				</view>
			</view>
		</view>
		<!-- //中间按钮 -->
		<view class="a_tx" @click="toTX">提现</view>
		<!-- 底部 -->
		<view class="mBot_other">
			<view class="mBot_otherItem"  @click="toFY">分佣明细</view>
			<view class="mBot_otherItem" @click="toTD">提现明细</view>
		<!-- 	<view class="mBot_otherItem flex_be" @click="toAli">
				支付宝账号
			    <view>{{alipay_account?alipay_account:"去添加"}} > </view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				total_money:"0",//总金额
				balance:"0",//可用金额  传递给提现用
				alipay_account:"",//支付宝账号
				topItem:[
					{
						name:"可用金额(元)",
						mon:"0"
					},
					{
						name:"待入账(元)",
						mon:"0"
					},
					{
						name:"累计分佣(元)",
						mon:"0"
					}
				]
			}
		},
		methods: {
			//提现
			toTX(){
				uni.navigateTo({
					url:"../withdrawal/withdrawal?mon="+this.balance
				})
			},
			//提现明细
			toTD(){
				uni.navigateTo({
					url:"../txDetail/txDetail"
				})
			},
			//分佣明细
			toFY(){
				uni.navigateTo({
					url:"../fyDetail/fyDetail"
				})
			},
			//去添加支付宝账号
			toAli(){
				uni.navigateTo({
					url:"../addZfb/addZfb"
				})
			}
		},
		onShow(){
			this.$tips.loading()
			this.$http.post("app/terminal/user/my/money")
			.then(res=>{
				this.$tips.loaded()
				this.total_money = res.data.total_money
				this.topItem[0].mon = res.data.balance
				this.balance = res.data.balance
				this.topItem[1].mon = res.data.wait_in_balance
				this.topItem[2].mon = res.data.total_balance
				this.alipay_account = res.data.alipay_account
				console.log("获取金额",res)
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(rej.data.message||"网络异常")
				console.log("失败",rej)
			})
		},
	}
</script>

<style lang="scss">
.acc{
	padding:20rpx 32rpx;
	.a_tbox{
		width:100%;
		padding:25rpx 0 ;
		background: #FFFFFF;
		box-shadow:0rpx 0rpx 5rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius:20rpx;
		text-align: center;
		
		.a_tboxTit{
			font-size: 24rpx;
			margin-bottom: 10rpx;
		}
		.a_tboxMon{
			font-size: 48rpx;
			margin-bottom: 30rpx;
			font-weight: bold;
		}
		.a_tboxBot{
			width: 100%;
			.a_tboxBot_itemM{
				font-size: 36rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}
			.a_tboxBot_itemT{
				font-size: 24rpx;
			}
		}
	}
	.a_tx{
		width: 100%;
		height: 80rpx;
		background-color: #F22B2B;
		font-size: 24rpx;
		color: #fff;
		box-shadow:0rpx 0rpx 5rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius:16rpx;
		margin: 30rpx auto;
		text-align: center;
		line-height: 80rpx;
	}
	.mBot_other{
		width: 100%;
		background: #FFFFFF;
		box-shadow:0px 0px 5px 0px rgba(0, 0, 0, 0.1);
		border-radius:20rpx;
		padding:0 19rpx 50rpx;
		font-size: 28rpx;
		color: #333;
	}
	.mBot_otherItem{
		width: 100%;
		padding:29rpx 0 20rpx;
		border-bottom:1rpx solid #E6E6E6;
		align-items: center;
	}
}
</style>
