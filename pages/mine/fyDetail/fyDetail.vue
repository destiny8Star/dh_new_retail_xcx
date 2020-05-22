<template>
	<view class="fy">
		<view class="fy_top flex_arr">
			<view :class="['fy_item',selTab==item.id?' selItem':'']" v-for="(item,idx) in tabs" :key="idx"
			@click="selTabHand(item.id)">{{item.tit}}</view>
		</view>
		<view class="fy_bot">
			<!-- //已入账信息 -->
			<view class="fy_botItem flex_be" v-for="(item,ind) in list" :key="ind">
				<view class="fy_botItemL" >
					<view class="fy_botItemL_tit">{{item.title}}</view>
					<view class="fy_botItemL_ord">订单编号：{{item.order_item_no}}</view>
					<view class="fy_botItemL_time">{{item.time}}</view>
				</view>
				<view>+{{item.commission_price}}</view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
                list:[],//数据列表
				cursor:1,//游标
				size:10,
				tabs:[
					{
						id:2,
						tit:"已入账"
					},
					{
						id:1,
						tit:"待入账"
					},
				],
				selTab:2,//当前选中2    1、待入账；2、已入账
				pageBottomText: "", //底部文字
			};
		},
		methods:{
			//选择tab
			selTabHand(id){
				this.selTab = id
				this.pageBottomText = ""
				this.cursor = 1
				this.initData(id)
			},
			//初始化数据
			initData(id){
				this.$tips.loading()
				this.$http.post("app/terminal/user/my/commission",{
					size:this.size,
					cursor:1,
					status:id,
				})
				.then(res=>{
					this.$tips.loaded()
					this.list = res.data
					console.log("获取分佣",res)
				})
				.catch(rej=>{
					this.$tips.loaded()
					this.$tips.toast(rej.data.message||"网络异常")
					console.log("失败",rej)
				})
			},
		},
		onLoad(){
			this.initData(this.selTab)
		},
		onReachBottom() {
			let page = this.cursor+1;
			this.pageBottomText = " - 拼命加载中 -"
			this.$tips.loading()
			this.$http.post("app/terminal/user/my/commission", {
					cursor: page,
					size: this.size,
					status: this.selTab
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
.fy{
	border-top: 1rpx solid #CBCBCB;
	
	.fy_top{
		width: 100%;
		background: #FFFFFF;
		box-shadow:0px 1rpx 0px 0px rgba(203,203,203,1);
		height: 90rpx;
		font-size: 28rpx;
		line-height: 90rpx;
		position: fixed;
		left: 0;
		top: 80rpx;
		/*  #ifdef  MP-WEIXIN  */
		top: 0;
		/*  #endif  */
		.fy_item{
			height: 100%;
		}
		.selItem{
			border-bottom: 6rpx solid #F22B2B;
		}
	}
	.fy_bot{
		width: 100%;
		
		padding:120rpx 32rpx 20rpx;
		
		.t_none{
			font-size: 30rpx;
			text-align: center;
			margin-top: 70rpx;
			color: #999999;
		}
		
		.fy_botItem{
			width: 100%;
			background: #FFFFFF;
			padding:30rpx 20rpx 15rpx 30rpx;
			box-shadow:0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
			border-radius:20rpx;
			align-items: center;
			font-size: 24rpx;
			margin-bottom: 20rpx;
			.fy_botItemL_tit{
				font-size: 36rpx;
			}
			.fy_botItemL_ord{
				margin: 15rpx 0 10rpx;
			}
		}
	}
}
</style>
