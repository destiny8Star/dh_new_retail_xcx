<template>
	<view class="transport">
		<view class="tran_item" v-for="(item,ind) in data">
			<view class="tran_top flex_be">
				<!-- 0:待发货; 1:已发货 2:已签收 -->
				<text v-if="item.express_state==0">待发货</text>
				<text v-if="item.express_state==1">已发货</text>
				<text v-if="item.express_state==2">已签收</text>
				<text class="tran_topR" v-if="item.express_state!=0" @click="toOrderTrans(item.logistics_no)">查看物流></text>
			</view>
			<!-- <view class="tran_ord">订单编号：121241123</view> -->
			<view class="tran_goods">
				<scroll-view class="tran_scroll flex" scroll-x="true" >
					<view  class="tran_scroll_item" v-for="(itemG,indG) in item.pic_paths" :key="indG">
						<view class="tran_scroll_itemImg">
							<image :src="itemG" mode=""></image>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="tran_count">共{{item.pic_paths.length}}件商品</view>
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
		methods:{
			//去物流详情
			toOrderTrans(id){
			  // console.log("id",id)	
			  uni.navigateTo({
			  	url:"../orderTrans/orderTrans?id="+id
			  })
			}
		},
		onLoad(option){
			let id = option.id
			this.$tips.loading()
			this.$http.get("app/orderLogistics/getLogisticsPackages?order_info_id="+id)
			.then(res=>{
				this.$tips.loaded()
				this.data = res.data
				console.log("获取数据",res)
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
.transport{
	padding:20rpx 32rpx;
	.tran_item{
		width: 100%;
		background: #FFFFFF;
		box-shadow:0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
		border-radius:20rpx;
		padding-bottom: 20rpx;
		margin-bottom: 20rpx;
		.tran_top{
			height: 68rpx;
			align-items: center;
			margin: 0 20rpx;
			border-bottom: 1rpx solid #E6E6E6;
			.tran_topR{
				font-size: 24rpx;
				color: #F22B2B;
			}
		}
		
		// .tran_ord{
		// 	font-size: 24rpx;
		// 	padding: 12rpx 20rpx 20rpx;
		// }
		.tran_goods{
			width:100%;
			padding-left: 20rpx;
			padding-top: 20rpx;
		}
		
		.tran_count{
			font-size: 18rpx;
			padding: 20rpx 20rpx 0 ;
		}
		.tran_scroll{
			width: 100%;
			white-space: nowrap;
			.tran_scroll_item{
				width: 120rpx;
				display: inline-block;
				margin-right: 20rpx;
				.tran_scroll_itemImg{
					width: 120rpx;
					height: 120rpx;
				}
			}
			::-webkit-scrollbar {
					width: 0;
					height: 0;
					background-color: transparent;
				} 
		}
		
	}
}
</style>
