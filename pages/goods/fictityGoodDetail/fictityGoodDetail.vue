<template>
	<view class="gDetail">
		<view class="gd_video">
			<video id="myVideo" :src="itemInfo.media_url" 
			 controls :poster="itemInfo.media_cover"></video>
			 <cover-view class="gd_video_cover" v-if="info.is_free==0&&info.is_buy==0">{{info.class_hour_name}}</cover-view>
		</view>
		<view class="gd_title">{{itemInfo.media_name}}</view>
		<view class="gd_shop flex">
			<view class="gd_shopL">
				<image :src="info.goods_url" mode=""></image>
			</view>
			<view class="gd_shopR">
				<view>{{info.goods_sup_name}}</view>
				<view style="color:#969799;margin-top: 12rpx;">全部{{count}}期课程</view>
			</view>
		</view>
		<view class="gd_lesson">
			<view class="gd_lessonTit">课程列表</view>
			<view class="gd_lessonTit2">{{info.class_hour_name}}</view>
			<view class="gd_lessonBox flex">
				<view :class="['gd_lessonBox_item',ind==selItem?'sel_gd_lessonBox_item':'']" v-for="(item,ind) in info.media_sources"
				:key="ind" @click="selLesson(ind)">
					<view class="gd_lessonBox_itemTit " v-if="info.is_free==1">免费试学</view>
					<view class="gd_lessonBox_itemLock" v-if="info.is_free==0&&info.is_buy==0"><image src="../../../static/image/goods/f_lock.png" mode=""></image></view>
					<view class="gd_lessonBox_itemCon">{{item.media_name}}</view>
					
				</view>
			<!-- 	<view class="gd_lessonBox_item">
					<view class="gd_lessonBox_itemLock"><image src="../../../static/image/goods/f_lock.png" mode=""></image></view>
					<view class="gd_lessonBox_itemCon">1.如何对接服务2商如何对接服务1.如何对接服务2商如何对接服务</view>
					
				</view>
				<view class="gd_lessonBox_item" v-for="item in [1,2,4,5,6]">
					<view class="gd_lessonBox_itemTit">免费试学</view>
					<view class="gd_lessonBox_itemCon">1.如何对接服务2商如何对接服务1.如何对接服务2商如何对接服务</view>
				</view> -->
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				count:'0',//课程数量
				info:'',//获取的详情
				selItem:null,//默认选择第一个视频
				itemInfo:{},//选中的item
			};
		},
		methods:{
			selLesson(ind){//
				if(this.info.is_free==0&&this.info.is_buy==0) return this.$tips.toast("请购买后观看")
				this.selItem = ind
				this.itemInfo = this.info.media_sources[ind]
			},
		},
		onLoad(opt){
			
			let id = opt.id
			this.count = opt.count
			this.$tips.loading()
			this.$http.get("app/goods/getGoodsFictitySpuMedia?id="+id)
			.then(res=>{
				console.log("获取商品详情",res)
				this.$tips.loaded()
				this.info = res.data;
				if(res.data.is_free==0&&res.data.is_buy==0){
					this.selItem = null
				}else{
					this.selItem = 0
				}
				this.itemInfo = res.data.media_sources[0]
				
			})
			.catch(rej=>{
				this.$tips.loaded()
				console.log("获取商品详情失败",rej)
				this.$tips.toast(rej.data.message)
			})
		}
	}
</script>

<style lang="scss">
.gDetail{
	.gd_video{
		width: 100%;
		height: 420rpx;
		position: relative;
		#myVideo{
			width: 100%;
			height: 100%;
		}
		.gd_video_cover{
			width: 100%;
			height: 100%;
			background: #000;
			position: absolute;
			top: 0;
			left: 0;
			font-size: 32rpx;
			color: #fff;
			text-align: center;
			line-height: 300rpx;
		}
	}
	.gd_title{
		width: 100%;
		padding:32rpx;
		background: #fff;
		font-size: 32rpx;
		font-weight: bold;
	}
	.gd_shop{
		width: 100%;
		background: #fff;
		margin: 16rpx 0 ;
		padding: 32rpx;
		align-items: center;
		.gd_shopL{
			width: 96rpx;
			height: 96rpx;
			margin-right: 24rpx;
		}
		.gd_shopR{
			flex:1;
		}
	}
	.gd_lesson{
		width: 100%;
		padding: 28rpx 32rpx;
		background: #fff;
		.gd_lessonTit{
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 16rpx;
		}
		.gd_lessonTit2{
			margin-bottom: 32rpx;
		}
		.gd_lessonBox{
			
			.gd_lessonBox_item{
				width: 218rpx;
				height: 176rpx;
				padding:8rpx 8rpx 8rpx 16rpx;
				background: #F7F8FA;
				border-radius: 8rpx;
				margin: 0 10rpx 32rpx 0;
				.gd_lessonBox_itemTit{
					font-size:18rpx ;
					text-align: right;
					margin-bottom: 20rpx;
					color: #969799;
				}
				.gd_lessonBox_itemLock{
					width: 32rpx;
					height: 32rpx;
					margin-bottom: 20rpx;
					float: right;
				}
				.gd_lessonBox_itemCon{
					width: 100%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					overflow: hidden;
				}
			}
			.sel_gd_lessonBox_item{
				border: 1rpx solid #F22B2B;
				background: #fff;
				color: #F22B2B;
				.gd_lessonBox_itemTit{
					color:#F22B2B;
				}
			}
		}
	}
}
</style>
