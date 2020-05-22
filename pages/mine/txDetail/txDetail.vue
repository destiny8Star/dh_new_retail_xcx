<template>
	<view class="td">
		<view class="td_box" v-for="(item,index) in list" :key="index">
			<view class="td_boxT flex_be">
				<view class="td_boxTL">提现</view>
				<view >￥{{item.amount}}</view>
			</view>
			<view class="td_boxB flex_be">
				<view class="td_boxTL">{{item.time}}</view>
				<view v-if="item.status==0">提现中</view>
				<view v-if="item.status==1">提现成功</view>
				<view v-if="item.status==2">提现失败</view>
			</view>
		</view>
		<!-- //无数据 -->
		<view class="t_none" v-if="list.length==0">
			没有记录~
		</view>
		<!-- 正在加载 -->
		<view style="text-align: center;">
			{{pageBottomText}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				size:10,
				cursor:1,
				list:[],
				pageBottomText: "", //底部文字
			}
		},
		methods: {
			// 
		},
		onShow(){
			this.$tips.loading()
			this.$http.post("app/terminal/user/my/withdrawal/list",{
				size:this.size,
				cursor:1,
			})
			.then(res=>{
				this.$tips.loaded()
				this.list = res.data
				console.log("获取提现",res)
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(rej.data.message||"网络异常")
				console.log("失败",rej)
			})
		},
		onReachBottom() {
			let page = this.cursor+1;
			this.pageBottomText = " - 拼命加载中 -"
			this.$tips.loading()
			this.$http.post("app/terminal/user/my/withdrawal/list", {
					cursor: page,
					size: this.size,
				})
				.then(res => {
					this.$tips.loaded()
					if(res.data.length==0){
						this.pageBottomText = " - 我也是有底线的 -"
					}else{
						let newList = this.list.concat(res.data)
						this.list = newList
						this.cursor++
					}
					console.log("获取数据", res)
				})
				.catch(rej => {
					this.$tips.loaded()
					this.$tips.toast(rej.data.message || "网络异常")
					console.log("失败", rej)
				})
		},
	}
</script>

<style lang="scss">
.td{
	padding: 20rpx 32rpx;
	
	.t_none{
		font-size: 30rpx;
		text-align: center;
		margin-top: 70rpx;
		color: #999999;
	}
	
	.td_box{
		width: 100%;
		padding:30rpx 20rpx 24rpx 30rpx;
		background: #fff;
		box-shadow:0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
		border-radius:20rpx;
		font-size: 24rpx;
		margin-bottom: 20rpx;
		.td_boxT{
			width: 100%;
			align-items: center;
			margin-bottom: 22rpx;
			.td_boxTL{
				font-size: 32rpx;
			}
		}
		.td_boxB{
			width: 100%;
			align-items: center;
		}
	}
}
</style>
