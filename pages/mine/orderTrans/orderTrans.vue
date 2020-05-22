<template>
	<view class="ot">
		<view class="or_box">
			<view class="ord_other_item flex">
				<view class="ord_other_itemLab">物流公司</view>
				<view class="ord_other_itemCon">{{data.sys_logistics_name}}</view>
			</view>
			<view class="ord_other_item flex">
				<view class="ord_other_itemLab">物流单号</view>
				<view class="ord_other_itemCon">{{data.logistics_no}}</view>
			</view>
			<view class="ord_other_item2">
				<view class="ord_other_item2_tit">物流跟踪</view>
				<view class="ord_other_item2_con" v-for="(item,ind) in data.order_logistics_flow_context_resp
" :key="ind">
					{{item.context}}<br/>
					{{item.time}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:"",
			};
		},
		onLoad(option){
			let id = option.id
			this.$tips.loading()
			this.$http.post("app/orderLogistics/getLogisticsInfo",{
				logistics_no:id
			})
			.then(res=>{
				this.$tips.loaded()
				this.data = res.data
				// console.log("物流详情",res)
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(rej.data.message||"网络异常")
				console.log("失败",rej)
			})
		}
	}
</script>

<style lang="scss">
.ot{
	padding:20rpx 32rpx;
	
	.or_box{
		width: 100%;
		padding: 10rpx 20rpx 20rpx;
		background: rgba(254, 254, 254, 1);
		box-shadow: 0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
		border-radius: 20rpx;
		font-size: 28rpx;
		.ord_other_item{
			width: 100%;
			border-bottom: 1rpx solid #E6E6E6;
			padding: 20rpx 0;
			.ord_other_itemLab{
				width: 170rpx;
				color: #666;
			}
		}
		
		.ord_other_item2{
			padding: 20rpx 0;
			.ord_other_item2_tit{
				color: #666;
				margin-bottom: 30rpx;
			}
			.ord_other_item2_con{
				font-size: 24rpx;
				margin-bottom: 20rpx;
			}
		}
	}
	
}
</style>
