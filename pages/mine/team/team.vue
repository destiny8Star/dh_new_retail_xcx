<template>
	<view class="team">
		<view class="t_box flex_be" v-for="(item,ind) in teamList" :key="ind">
           <view class="t_boxImg">
			   <image :src="item.pic" mode="" v-if="item.pic"></image>
			   <image src="../../../static/image/mine/m_head.png" mode="" v-if="!item.pic"></image>
		   </view>
		   <view class="t_boxNic">
		   	{{item.nickname||"游客"}}
		   </view>
		   <view class="t_boxTime">
		   	{{item.time}}
		   </view>
		</view>
		<!-- 正在加载 -->
		<view style="text-align: center;">
			{{pageBottomText}}
		</view>
	<!-- 	<view class="t_none" v-if="teamList.length!=0">
			没有更多了~
		</view> -->
		<view class="t_none" v-if="teamList.length==0">
			没有团队成员~
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cursor:1,
				size:10,
				teamList:[],
				pageBottomText: "", //底部文字
			};
		},
		onShow(){
			this.$tips.loading()
			this.$http.post("app/terminal/user/my/invite/list",{
				cursor:1,
				size:10,
			})
			.then(res=>{
				this.$tips.loaded()
				this.teamList = res.data
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
						let newList = this.teamList.concat(res.data)
						this.teamList = newList
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
			padding: 25rpx 42rpx 25rpx 20rpx;
			background: rgba(254, 254, 254, 1);
			box-shadow: 0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			align-items: center;
			font-size: 24rpx;
			.t_boxImg{
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 20rpx;
			}
			.t_boxNic{
				flex: 1;
			}
			.t_boxTime{
				width: 140rpx;
				text-align: center;
				margin-left: 20rpx;
			}
		}
	}
</style>
