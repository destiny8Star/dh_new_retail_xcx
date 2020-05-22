<template>
	<view class="content">
		<!-- 弹窗 start -->
		<view class="mask_box" @touchmove.prevent v-if="maskState">
			<view class="mask"></view>
			<view class="content">
				<view v-if="couponType==1">￥<text>{{couponNum}}</text></view>
				<view v-else-if="couponType==2"><text>{{couponNum}}</text>折</view>
				<image src="../../static/image/home/mask_bg@2x.png" mode="" @click="toMine"></image>
				<image class="close" src="../../static/image/home/mask_close@2x.png" mode="" @click="maskState = !maskState"></image>
			</view>
		</view>
		<!-- 弹窗 end -->
		
		<!-- 搜索 start -->
		<view class="search_box">
			<view class="search_input ly-flex-center-center" @click="goSearch">
				<icon type="search" size="14"/>
				<text>搜索</text>
			</view>
		</view>
		<!-- 搜索 end -->
		
		<!-- banner start -->
		<view class="banner_bg">
			<view class="banner_box">
				<swiper class="swiper" circular indicator-dots autoplay :interval="interval" :duration="duration" indicator-active-color="#F22B2B" indicator-color="#F7F8FA">
					<swiper-item class="swiper-item-box " v-for="(ele,i) in bannerList" :key="i" @click="bannerClick(ele)">
						<view class="swiper-item uni-bg-red">
							<image :src="ele.url" mode=""></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- banner end -->
		
		<!-- news start -->
		<view class="news_box ly-flex-center">
			<image class="icon_img" src="../../static/image/home/Home_tongzhi@2x.png" mode=""></image>
			<swiper class="swiper" autoplay vertical :interval="2000" :duration="duration">
				<swiper-item v-for="(ele,i) in newsList" :key="i">
					<view class="swiper-item uni-bg-red">{{ele.title}}：{{ele.content}}</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- news end -->
		
		<!-- 推荐分类 start -->
		<view class="classify_box ly-flex-between-warp">
			<view class="item ly_flex_center_column" v-for="(ele,i) in classifyList" :key="i" @click="goGoodsList(ele)">
				<image :src="ele.category_img" mode=""></image>
				<text>{{ele.sys_category_name}}</text>
			</view>
		</view>
		<!-- 推荐分类 end -->
		
		<!-- 各个推荐模块 start -->
		
		<!-- 每日上新 start -->
		<view class="day_new" v-for="(ele,i) in subjectList" :key="i">
			<view class="title ly-flex-center-between">
				<text>{{ele.name}}</text>
				<image class="icon_img" src="../../static/image/home/Home_jiantou_right@2x.png" mode="" @click="jumpPage(ele.id)"></image>
			</view>
			<image @click="jumpPage(ele.id)" class="showImg" :src="ele.img_url" mode=""></image>
			<view class="inner_box ly-flex-start-between">
				<view class="new_item" v-for="(val,v) in ele.goods_spu_list" :key="v" @click="goDetail(val)">
					<image :src="val.goods_url" mode=""></image>
					<view class="item_title">
						<view class="item_tag" :style="{'color': tag.tag_color,
							'borderColor': tag.tag_color}" v-for="(tag,t) in val.goods_tag" :key="t" v-if="t == 0"><text>{{tag.tag_name}}</text></view>
						<text>{{val.name}}</text>
					</view>
					<view class="item_price ly-flex-baseline">
						<text>￥{{val.goods_price}}</text>
						<text class="oldPrice">{{val.goods_marking_price}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 每日上新 end -->
		
		<!-- 为你推荐 start -->
		<view class="day_new">
			<view class="title ly-flex-center-between">
				<text>为你推荐</text>
			</view>
			<view class="content">
				<goodsList :list="list" :loading="loading" @click="choose"></goodsList>
			</view>
		</view>
		<!-- 为你推荐 end -->
		
		<!-- 各个推荐模块 end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchType: 2,//跳转至商品列表页面所需类型【0：默认列表，1：搜索商品，2：选择分类】
				couponNum: '618',
				couponType: 1,//1：满减卷，2折扣卷
				
				page: 1,
				start: 0,
				end: 0,
				list: [], // 列表
				loading: true,
				
				maskState: false,//弹窗是否展示
				interval: 4000,//自动切换时间间隔
				duration: 500,//滑动动画时长
				bannerList: [],
				newsList: [],
				classifyList: [],//推荐分类list
				subjectList: [],//专题list
				popularGoodsList: [],
			}
		},
		onLoad(option) {		
			console.log("onload获取",option,)
			this.getRecommend();
			uni.$on("is_new", data => { 
				this.maskState = true
				console.log('是否是新用户',data);  
			}); 
		}, 
		onShow(){
			console.log("onShow")
			//请求数据
			this.$http.get("app/mall/home/page/public/banner/notice/new/top")
			.then(res=>{
				console.log("获取首页",res)
				this.subjectList = res.data.goods_special_simply_list_resps;
				this.classifyList = res.data.recommend_category_resps;
				this.bannerList = res.data.mall_hom_banner_resps;
				this.newsList = res.data.mall_notice_resps;
				this.subjectList.forEach((ele,i)=>{
					ele.goods_spu_list.forEach((val,v)=>{
						val.goods_tag = JSON.parse(val.goods_tag);
					})
				})
			})
			.catch(rej=>{
				console.log("获取首页",rej)
				this.$tips.toast(rej.data.message)
			})
			// this.$forceUpdate()//加上它，就可以强制刷新视图
		},
		onReachBottom() {
			this.page++;
			this.loading = true;
			// this.getList();
			this.getRecommend();
		},
		methods: {
			// 跳搜索页面
			goSearch(){
				uni.navigateTo({url: 'search/search'});
				console.log("this.$store.state.token",this.$store.state.token)
			},
			//去我的模块
			toMine(){
				this.maskState = false
				uni.switchTab({
					url:"../mine/mine"
				})
			},
			// 跳搜索页面
			goGoodsList(data){
				console.log(data)
				uni.navigateTo({
					url: `../index/search/searchResult?tid=${data.id}&type=${this.searchType}&tText=${data.sys_category_name}`
				})
			},
			// 跳搜索页面
			jumpPage(num){
				console.log(num);
				uni.navigateTo({url: '/pages/index/activityGoodsList/goodsList?id=' + num});
			},
			/**
			 * banner 点击跳转
			 * @param {Object} data -- 每张banner图
			 */
			bannerClick(data){
				console.log('banner点击事件',data);
				let type = data.go_to_type;//0无跳转，1跳转商品2跳转商铺3跳转到指定页面4跳转到某个三级分类
				if(type == 1){
					uni.navigateTo({url: '/pages/goods/goods?id=' + data.go_to_details});
				}else if(type==2){
					uni.navigateTo({url: '/pages/shop/shop?id=' + data.go_to_details});
				}else if(type==3){
					uni.navigateTo({url: data.go_to_details});
				}else if(type==4){
					uni.navigateTo({url: '/pages/index/search/searchResult?tid=' + data.go_to_details + '&type=2'});
				}
			},
			// 跳转商品详情页
			goDetail(data) {
				console.log(data);
				uni.navigateTo({url: '/pages/goods/goods?id=' + data.id});
			},
			// 选中
			choose(item) {
				// item 返回选中 JSON 对象
				console.log(item)
			},
			// 模拟加载数据
			getList() {
				if (this.list.length < data.list.length) {
					setTimeout(() => {
						this.end = this.page * 10;
						this.list = this.list.concat(data.list.slice(this.start, this.end));
						this.start = this.end;
						// 延迟 120 毫秒隐藏加载动画，为了跟组件里面的 100 毫秒定位有个平缓过度
						setTimeout(() => {
							this.loading = false;
						}, 120);
					}, 1000)
				} else {
					this.loading = false;
				}
			},
			// 获取新人券
			getCoupon() {
				// if (this.list.length < data.list.length) {
					this.$http.get("app/coupon/public/getCouponList")
					.then(res=>{
						console.log("获取首页新人券",res)
					})
					.catch(rej=>{
						console.log("获取首页新人券",rej)
					})
				// } 
			},
			// 获取为你推荐
			getRecommend() {
				// if(this.page>5){
				// 	this.loading = false;
				// 	return false
				// }
				let postData = {
					"cursor": this.page,
					"size": 10,
					"type": 1
				}
				// this.$http.post("app/mall/search/goods/public/recommended/randomGoods",postData)
				this.$http.post("app/goods/recommend/public/listGoods",postData)
				.then(res=>{
					console.log("获取为你推荐",res)
					// let resList = res.data;
					// if(this.page==1){
					// 	this.list = resList;
					// 	this.list.forEach((ele,i)=>{
					// 		ele.goods_tag = JSON.parse(ele.goods_tag)
					// 	})
					// }else {
					// 	setTimeout(() => {
					// 		this.end = this.page * 10;
					// 		this.list = this.list.concat(resList);
					// 		this.start = this.end;
					// 		// 延迟 120 毫秒隐藏加载动画，为了跟组件里面的 100 毫秒定位有个平缓过度
					// 		setTimeout(() => {
					// 			this.loading = false;
					// 		}, 120);
					// 	}, 1000)
					// }
					let resList = res.data.data;
					if (this.list.length < res.data.count) {
						setTimeout(() => {
							this.end = this.page * 10;
							if(this.page!=1){
								this.list = this.list.concat(resList);
							}else{
								this.list = resList;
							}
							this.list.slice(this.start, this.end).forEach((ele,i)=>{
								ele.goods_tag = JSON.parse(ele.goods_tag)
							})
							this.start = this.end;
							// 延迟 120 毫秒隐藏加载动画，为了跟组件里面的 100 毫秒定位有个平缓过度
							setTimeout(() => {
								this.loading = false;
							}, 120);
						}, 1000)
					} else {
						this.loading = false;
						this.$tips.toast(rej.data.message)
					}
				})
				.catch(rej=>{
					console.log("获取为你推荐",rej);
					this.loading = false;
				})
			}
		},
		onUnload() {
		    // 移除监听事件  
		    uni.$off('is_new');  
		},
	}
</script>

<style lang="scss">
	.content {
		font-size: 24rpx;
		.mask_box {
			z-index: 999;
			position: fixed;
			.mask {
				width: 100vw;
				height: 100vh;
				background: #000;
				opacity: 0.6;
			}
			.content {
				position: absolute;
				margin: 0 auto;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				padding: 224rpx .58rpx;
				view {
					position: absolute;
					top: 442rpx;
					left: 50%;
					font-size: 48rpx;
					font-weight: bold;
					color: rgba(251,219,155,1);
					line-height: 150rpx;
					letter-spacing: 2rpx;
					z-index: 2;
					transform: translateX(-60%);
					text-shadow: 8rpx 6rpx 2rpx #EF3F27;
					text {
						font-size: 100rpx;
					}
				}
				image {
					width: 636rpx;
					height: 722rpx;
					display: block;
					margin: 0 auto;
				}
				.close {
					width: 68rpx;
					height: 68rpx;
					margin: 46rpx auto 0;
				}
			}
		}
		.search_box {
			width: 100vw;
			height: 100rpx;
			padding: 10rpx 32rpx 10rpx;
			position: absolute;
			top: 0;
			left: 0;
			// position: fixed;
			// z-index: 9;
			// background: #F12B2E;
			.search_input {
				height: 100%;
				background: #fff;
				border-radius: 34rpx;
				icon {
					margin: 2rpx 8rpx 0;
				}
				text {
					font-size: 28rpx;
					color: #969799;
				}
			}
		}
		.banner_bg {
			width: 100vw;
			height: 344rpx;
			padding: 106rpx 32rpx 0;
			background-image: url(../../static/image/home/home_bg_benner@2x.png);
			background-size: 100% 100%;
			.banner_box {
				border-radius: 16rpx;
				overflow: hidden;
				.swiper {
					height: 240rpx;
					border-radius: 16rpx;
					overflow: hidden;
					transform: translateY(0);
					.swiper-item-box {
						width: 100%;
						height: 100%;
						border-radius: 16rpx;
						overflow: hidden;
						.swiper-item {
							height: 100%;
							border-radius: 16rpx;
							overflow: hidden;
							image {
								border-radius: 16rpx;
								overflow: hidden;
							}
						}
					}
				}
			}
		}
		.news_box {
			padding: 18rpx 32rpx 10rpx;
			image {
				margin-right: 8rpx;
			}
			.swiper {
				width: 100%;
				height: 48rpx;
				line-height: 48rpx;
				.swiper-item {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
		.classify_box {
			padding: 8rpx 32rpx;
			.item {
				width: calc(25% - 41rpx);
				margin-bottom: 16rpx;
				image {
					width: 102rpx;
					height: 102rpx;
					margin-bottom: 4rpx;
					border-radius: 50%;
				}
			}
		}
		.day_new {
			padding: 0 32rpx 32rpx;
			.title {
				line-height: 56rpx;
				font-size: 36rpx;
				font-family: PingFangSC-Semibold,PingFang SC;
				font-weight: 600;
				margin: 16rpx 0;
			}
			.showImg {
				height: 176rpx;
				border-radius: 16rpx;
				overflow: hidden;
			}
			.inner_box {
				margin-top: 8rpx;
				.new_item {
					min-height: 352rpx;
					max-width: 218rpx;
					background: #FFFFFF;
					border-radius: 16rpx;
					padding-bottom: 8rpx;
					image {
						width: 218rpx;
						height: 218rpx;
						border-radius: 16rpx;
					}
					.item_title {
						min-height: 68rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						margin: 8rpx 16rpx 4rpx;
						.item_tag {
							display: inline-block;
							padding: 0 6rpx;
							// color: #fff;
							line-height: 36rpx;
							margin-right: 12rpx;
							font-size: 18rpx;
							font-family: PingFangSC-Medium,PingFang SC;
							font-weight: 500;
							border-radius: 8rpx;
							border: 2rpx solid transparent;
						}
						.new_tag {
							color: #BE2BF2;
							border: 2rpx solid #BE2BF2;
						}
						.popular_tag {
							color: #F22B2B;
							border: 2rpx solid #F22B2B;
						}
					}
					.item_price {
						font-family:PingFangSC-Medium,PingFang SC;
						font-weight:500;
						font-size: 28rpx;
						padding: 0 16rpx;
						text {
							color: rgba(242,43,43,1);
							line-height: 36rpx;
						}
						.oldPrice {
							text-decoration: line-through;
							line-height: 28rpx;
							font-size: 18rpx;
							margin-left: 8rpx;
							color: rgba(150,151,153,1);
						}
					}
				}
			}
		}
	}

	
</style>
