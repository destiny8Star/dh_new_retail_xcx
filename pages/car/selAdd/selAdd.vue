<template>
	<view class="addr">
		<view class="ad_box flex_be" v-for="(item,ind) in addList" :key="ind" @click="choseAdd(item.id)">
			<view class="ad_boxL">
				<view class="ad_boxL_top flex">
					<view class="ad_boxL_topName">{{item.name}}</view>
					<view>{{item.phone}}</view>
					<view class="ad_mr" v-if="item.is_default==1">默认</view>
				</view>
				<view class="ad_boxL_bot">{{item.province_code_desc}}{{item.city_code_desc}}{{item.area_code_desc}}{{item.address}}</view>
			</view>
			<view class="c_botBoxR_right" v-show="item.id!=sel"></view>
			<icon type="success" size="16" color="#F22B2B"	v-show="item.id==sel"/>
		</view>
		<!-- 新增 -->
		<view class="a_tx" @click="toAdd">+新增收货地址</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sel:"",
				addList:[],
			};
		},
		methods:{
			toAdd(){
				uni.navigateTo({
					url:"../../mine/addressAdd/addressAdd?status=1"
				})
			},
			//选择地址
			choseAdd(id){
				console.log("id",id)
				this.sel = id
				//传递给上一个页面
				uni.$emit('address', {
					address_id:id
				})
				uni.navigateBack({
					delta:1
				})
			}
		
		},
		onLoad(option){
          console.log("获取id",option.id)
		  this.sel = option.id
		},
		onShow(){
			this.$tips.loading()
			this.$http.post('app/terminalUser/addres/listAddres')
			.then(res=>{
				this.$tips.loaded()
				console.log("获取收货地址",res)
				this.addList = res.data
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(rej.data.message||'网络异常')
				console.log("shibai",rej)
			})
		
		},
	
	}
</script>

<style lang="scss">
.addr{
	padding: 20rpx 32rpx;
	.ad_box{
		width: 100%;
		padding:30rpx 20rpx 20rpx 30rpx;
		font-size: 32rpx;
		align-items: center;
		margin-bottom: 20rpx;
		background: #fff;
		box-shadow:0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
		border-radius:20rpx;
		.c_botBoxR_right{
			border: 1rpx solid #969799;
			width: 32rpx;
			height: 32rpx;
			border-radius: 50%;
		}
		.ad_boxL{
			max-width: 560rpx;
			.ad_boxL_top{
				align-items: center;
				margin-bottom: 25rpx;
				.ad_boxL_topName{
					margin-right: 50rpx;
				}
				.ad_mr{
					border:1rpx solid rgba(242,43,43,1);
					border-radius:10rpx;
					font-size: 18rpx;
					color:#F22B2B;
					padding:0 10rpx;
					margin-left: 10rpx;
				}
			}
			.ad_boxL_bot{
				font-size: 24rpx;
			}
		}
	}
	.a_tx{
		width: 100%;
		height: 80rpx;
		margin-top: 40rpx;
		background-color: #F22B2B;
		font-size: 24rpx;
		color: #fff;
		box-shadow:0rpx 0rpx 5rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius:16rpx;
		margin: 30rpx auto;
		text-align: center;
		line-height: 80rpx;
	}
}
</style>
