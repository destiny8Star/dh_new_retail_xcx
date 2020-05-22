<template>
	<view class="team">
		<view class="t_box ly-flex-center" v-for="(item,ind) in classList" :key="ind" @click="goDetail(item)">
           <view class="t_boxImg">
			   <image :src="item.goods_url" mode=""></image>
		   </view>
		   <view class="t_boxNic ly_flex_between_column">
				<view>{{item.name}}</view>
				<text>{{item.buy_time_str}}</text>
		   </view>
		</view>
		<!-- 正在加载 -->
		<view style="text-align: center;">
			{{pageBottomText}}
		</view>
	<!-- 	<view class="t_none" v-if="classList.length!=0">
			没有更多了~
		</view> -->
		<view class="t_none" v-if="classList.length==0">
			没有课程信息~
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cursor:1,
				size:10,
				classList:[
					// {buy_time_str: '2015-12-12 13:45',name: 'fhufg浮云浮云夫人屠夫托夫宇桐非拖过货突发图尀功夫开发规划富可预防',goods_url: ''}
				],
				pageBottomText: "", //底部文字
			};
		},
		methods:{
			goDetail(data){
				console.log(data);
				uni.navigateTo({url: '/pages/goods/fictityGood/fictityGood?id=' + data.id});
			}
		},
		onShow(){
			this.$tips.loading()
			this.$http.post("app/terminal/user/my/course",{
				cursor:1,
				size:10,
			})
			.then(res=>{
				this.$tips.loaded()
				this.classList = res.data.data
				console.log("数据",res)
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
			this.$http.post("app/terminal/user/my/invite/list", {
					cursor: page,
					size: this.size,
				})
				.then(res => {
					this.$tips.loaded()
					if(res.data.length==0){
						this.pageBottomText = " - 我也是有底线的 -"
					}else{
						let newList = this.classList.concat(res.data)
						this.classList = newList
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
	.team {
		padding: 20rpx 32rpx;
        .t_none{
			font-size: 30rpx;
			text-align: center;
			margin-top: 70rpx;
			color: #999999;
		}
		.t_box {
			width: 100%;
			padding: 20rpx;
			background: rgba(254, 254, 254, 1);
			box-shadow: 0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			align-items: center;
			font-size: 24rpx;
			.t_boxImg{
				min-width: 140rpx;
				height: 140rpx;
				margin-right: 20rpx;
			}
			.t_boxNic{
				flex: 1;
				height: 140rpx;
				view {
					text-overflow: ellipsis;
					-webkit-line-clamp: 2;
					display: box;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			}
			.t_boxTime{
				width: 140rpx;
				text-align: center;
				margin-left: 20rpx;
			}
		}
	}
</style>
