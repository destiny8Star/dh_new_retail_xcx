<template>
	<view class="live">
		<!-- 顶部tab -->
		<view class="lTop">
			<scroll-view class="scroll-view_H" scroll-x="true" show-scrollbar="false">
			    <view :class="['lTop_item',selTab==ind?'selTab':'']" v-for="(item,ind) in tabs" 
				:key="ind" @click="selTabHand(ind)">
					{{item.live_type}}
				</view>
			</scroll-view>
			
		</view>
		 <!-- 直播列表 -->
		 <view class="lPer flex" v-for="(item,ind) in perList" :key="ind" @click="toLive(item.roomid)">
		 	 <view class="lPer_left">
				 <image :src="item.list_img" mode=""></image>
				 <view class="lPer_leftZB flex" v-if="item.live_status==101">
					 <view class="lPer_leftZB_gif">
					 	<image src="../../static/image/public/zb.gif" mode=""></image>
					 </view>
				 	直播中
				 </view>
				 <view class="lPer_leftZB lPer_leftZB2 flex" v-if="item.live_status==102">
				 	<view class="lPer_leftZB_wks"><image src="../../static/image/public/zb102.png" mode=""></image></view>
				 	{{item.short_start_time}} 开播
				 </view>
				 <view class="lPer_leftZB lPer_leftZB4 flex" v-if="item.live_status==104">
				 	<view class="lPer_leftZB_wks"><image src="../../static/image/public/zb104.png" mode=""></image></view>
				 	禁播
				 </view>
				 <view class="lPer_leftZB lPer_leftZB5 flex" v-if="item.live_status==105">
				 	<view class="lPer_leftZB_wks"><image src="../../static/image/public/zb105.png" mode=""></image></view>
				 	暂停中
				 </view>
				 <view class="lPer_leftZB lPer_leftZB3 flex" v-if="item.live_status==103||item.live_status==106||item.live_status==107">
					 <view class="lPer_leftZB_wks"><image src="../../static/image/public/zb103.png" mode=""></image></view>
				 	回放
				 </view>
		<!-- 		 <view class="lPer_leftPer flex">
				 	<view class="lPer_leftPerImg">
						<image :src="item.share_img" mode=""></image>
					</view>
					{{item.anchor_name}}
				 </view> -->
		 	 </view>
			 <view class="lper_right flex">
				 <!-- 直播间名称 -->
			 	<view class="lper_right_tit">{{item.name}}</view>
				<!-- 主播信息 -->
				<view class="lPer_leftPer flex">
					<view class="lPer_leftPerImg">
						<image :src="item.anchor_img" mode=""></image>
					</view>
					<view class="lPer_leftInfos">
						<view>{{item.anchor_name}}</view>
						<view>{{item.live_sentiment}}人气值 | {{item.live_address}}</view>
					</view>
					
				 </view>
				 <!-- 商品信息 -->
				 <block v-if="item.live_goods_resps.length>0">
					 <view class="lper_right_goods flex">
					 	<block v-for="(itemG,indG) in item.live_goods_resps" :key="indG">
					 		<view class="lper_right_goodsBox" v-if="indG<3">
					 			<image :src="itemG.cover_img" mode=""></image>
					 		</view>
					 	</block>
						<view class="lper_right_goodsLast">
							{{item.live_goods_resps.length}}件产品
						</view>
					 </view>
				 </block>
			 	 <block v-else>
					 <view class="lper_right_bot">
					 	{{item.live_intro}}
					 </view>
				 </block>
			 </view>
		 </view>

	 
	     <!-- 正在加载 -->
	    <view style="text-align: center;">
	     	{{pageBottomText}}
	     </view>
		 <view class="t_none" v-if="perList.length==0">
		 	暂时没有直播~
		 </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customParams:"",// 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取
				perList:[],//主播列表
				tabs:[
					{
						id:1,
						live_type:"热门"
					}
				],//顶部tabs
				selTab:0,//默认选择0
				pageBottomText:"",
				cursor:1,//当前页码
				size:10,
			};
		},
		methods:{
			//选中tab
			selTabHand(ind){
				this.selTab = ind
				this.pageBottomText = ''
				this.$tips.loading()
				this.getData()
				.then(res=>{
					console.log("获取列表",res)
					this.$tips.loaded()
					this.perList =res.data
				})
				.catch(rej=>{
					console.log("获取列表",rej)
					this.$tips.loaded()
					this.$tips.toast(rej.data.message||"网络异常")
				})
			},
			//初始化数据
			init(){
				this.$tips.loading()
				this.$http.get("app/public/live/type")
				.then(res=>{
					console.log("获取分类",res)
					this.tabs = res.data
					return this.$http.post("app/public/live/room/list",{
						"cursor": 1,
						"size": 10,
						"live_type_id" :res.data[0].id
					   })
				})
				.then(res=>{
					this.$tips.loaded()
					console.log("获取直播列表",res)
					this.perList =res.data
				})
				.catch(rej=>{
					this.$tips.loaded()
					console.log("失败",rej)
					this.$tips.toast(rej.data.message||"网络异常")
				})
			},
			//获取列表
			getData(){
				this.cursor = 1
				return this.$http.post("app/public/live/room/list",{
					"cursor": 1,
					"size": 10,
					"live_type_id" :this.tabs[this.selTab].id
				})
			},
			//去看直播
			toLive(id){
				console.log("di",id)
				uni.navigateTo({
					url:"plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id="+id
				})
			}
		},
		onLoad(){
			this.init()
		},
		onShow(){
		},
		onPullDownRefresh() {
			this.getData()
			.then(res=>{
				console.log("获取列表",res)
				this.perList =res.data
				uni.stopPullDownRefresh();
			})
			.catch(rej=>{
				console.log("获取列表",rej)
				this.$tips.toast(rej.data.message||"网络异常")
				uni.stopPullDownRefresh();
			})
		},
		//上拉加载
		onReachBottom() {
			let page = this.cursor+1;
			this.pageBottomText = " - 拼命加载中 -"
			this.$tips.loading()
			this.$http.post("app/public/live/room/list", {
					cursor: page,
					size: this.size,
				})
				.then(res => {
					console.log("结果",res)
					this.$tips.loaded()
					if(res.data.length==0){
						this.pageBottomText = " - 我也是有底线的 -"
					}else{
						let newList = this.perList.concat(res.data)
						this.perList = newList
						this.cursor++
					}
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
.live{
	width: 100%;
	padding: 110rpx 20rpx 50rpx;
	.lTop{
		width: 100%;
		height: 90rpx;
		background: #F22B2B;
		position: fixed;
		top: 80rpx;
		/*  #ifdef  MP-WEIXIN  */
		top: 0;
		/*  #endif  */
		left: 0;
		z-index: 999;
		font-size: 28rpx;
		color: #fff;
		.scroll-view_H{
			width: 100%;
			height: 90rpx;
			padding-bottom: 5rpx;
			white-space: nowrap;
			box-sizing: border-box;
			.lTop_item{
				display: inline-block;
				height: 100%;
				line-height: 90rpx;
				margin: 0 35rpx;
			}
			.selTab{
				border-bottom: 6rpx solid #fff;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		::-webkit-scrollbar
		{
			width: 0;
			height: 0;
			color: transparent;
		}
		
	}
	.t_none{
		font-size: 30rpx;
		text-align: center;
		margin-top: 70rpx;
		color: #999999;
	}
	.lPer{
	   width: 100%;	
	   height: 250rpx;
	   background: #fff;
	   border-radius: 8rpx;
	   align-items: center;
	   margin-bottom: 20rpx;
	   .lPer_left{
		   width: 250rpx;
		   height: 250rpx;
		   border-radius: 8rpx;
		   overflow: hidden;
		   position: relative;
		   color: #FFFFFF;
		   .lPer_leftZB{
			   padding: 5rpx 10rpx;
			   background: #FF0000;
			   border-radius: 8rpx 8rpx 8rpx 0 ;
			   position: absolute;
			   top: 0;
			   left: 0;
			   font-size: 20rpx;
			   align-items: center;
			   .lPer_leftZB_gif{
				   width: 25rpx;
				   height: 20rpx;
			   }
		   }
		   .lPer_leftZB2,.lPer_leftZB4,.lPer_leftZB5,.lPer_leftZB3{
			   background:#FF7836;
			   .lPer_leftZB_wks{
				   width: 24rpx;
				   height: 24rpx;
				   margin-right: 10rpx;
			   }
		   }
		   .lPer_leftZB3{
			   background: #C5191A;
			   // .lPer_leftZB_hf{
				  //  width: 16rpx;
				  //  height: 16rpx;
				  //  background: #fff;
				  //  margin-right: 10rpx;
			   // }
		   }
		   .lPer_leftZB4{
			   background: #808080;
		   }
		   .lPer_leftZB5{
		   	   background: #FF9C00;
		   }
		   // .lPer_leftPer{
			  //  align-items: center;
			  //  font-size: 24rpx;
			  //  position: absolute;
			  //  bottom: 20rpx;
			  //  left: 20rpx;
			  //  background:rgba($color: #000000, $alpha: 0.3);
			  //  padding:8rpx 12rpx;
			  //  border-radius:8rpx;
			  //  .lPer_leftPerImg{
				 //   width: 40rpx;
				 //   height: 40rpx;
				 //   border-radius: 50%;
				 //   overflow: hidden;
				 //   margin-right: 10rpx;
				 //   background: #F1F1F1;
			  //  }
		   // }
	   }
	   .lper_right{
		   flex: 1;
		   padding: 20rpx;
		   padding-right: 0;
		   height: 100%;
		   font-size: 30rpx;
		   color: #333;
		   justify-content: space-between;
		   flex-direction: column;
		   .lper_right_tit{
			   width: 410rpx;
			   overflow: hidden;
			   text-overflow: ellipsis;
			   white-space: nowrap;
			   font-weight: bold;
		   }
		   .lPer_leftPer{
			   align-items: center;
			   font-size: 18rpx;
			   color: #999;
			   .lPer_leftPerImg{
				   width: 40rpx;
				   height: 40rpx;
				   border-radius: 50%;
				   overflow: hidden;
				   margin-right: 10rpx;
				   background: #F1F1F1;
			   }
			   .lPer_leftInfos{
				   flex: 1;
			   }
		   }
		   .lper_right_goodsBox{
			   width: 100rpx;
			   height: 100rpx;
			   border-radius: 8rpx;
			   margin-right: 10rpx;
			   overflow: hidden;
		   }
		   .lper_right_goodsLast{
			   background: rgba(242,43,43,.6);
			   width: 100rpx;
			   height:100rpx;
			   border-radius: 8rpx;
			   text-align: center;
			   font-size: 24rpx;
			   color: #fff;
			   padding: 20rpx;
		   }
		   .lper_right_bot{
			   width: 430rpx;
			   height: 100rpx;
			   padding: 20rpx;
			   color: #999999;
			   font-size: 24rpx;
			   background: #F7F7F7;
			   border-radius:8rpx;
			   display: -webkit-box;
			   -webkit-box-orient: vertical;
			   -webkit-line-clamp:2;
			   overflow: hidden;
		   }
		  
	   }
	}
}	
</style>
