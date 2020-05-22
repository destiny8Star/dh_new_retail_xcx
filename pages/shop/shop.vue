<template>
	<view class="shop_box">
		<view class="shop_bg_box" :style="{'backgroundImage': 'url(' + shopBgImg + ')'}">
			<view class="mask"></view>
		</view>
		<view class="content">
			<view class="header_box">
				<view class="ly-flex-center">
					<image :src="shopImg" mode=""></image>
					<text>{{shopName}}</text>
				</view>
				<view class="shop_desc">{{shopDesc}}</view>
			</view>
			<view class="nav_box ly-flex-center-around">
				<view class="item" v-for="(ele,i) in navList" :key="i" @click="choNav(ele)">
					<text>{{ele.text}}</text>
					<view class="line" :class="{act:navIndex==ele.flag}"></view>
				</view>
			</view>
			<view class="goodsList">
				<goodsList :list="list" :loading="loading" @click="choose"></goodsList>
			</view>
		</view>
	</view>
</template>

<script>
	// 模拟 JSON 数据
	// const data = require('@/common/json/data.json');
	
	export default {
		data() {
			return {
				shopId: '',
				shopName: 'SONY官方自营店',
				shopBgImg: 'https://img-blog.csdnimg.cn/20191205171447712.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BpaXNhYnV0Y2hlcg==,size_16,color_FFFFFF,t_70',
				shopImg: 'https://img-blog.csdnimg.cn/20191205171447712.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3BpaXNhYnV0Y2hlcg==,size_16,color_FFFFFF,t_70',
				shopDesc: '索尼是日本一家全球知名的大型综合性跨国企业集团。总部设于日本东京都港区港南1-7-1。索尼是世界视听、电子游戏、通讯产品和信息技术等领域的先导者。',
				navList: [
					{id: 1, text: '全部商品',flag:1},
					{id: 2, text: '上新',flag:2}
				],
				navIndex: 1,
				
				page: 1,
				start: 0,
				end: 0,
				list: [], // 列表
				loading: true,
			};
		},
		methods:{
			// 选择模块
			choNav(data){ 
				console.log(data);
				this.navIndex = data.flag;
				this.page = 1;
				this.list = [];
				this.listAll = [];//暂存全部商品数组
				this.listNew = [];//暂存上新商品数组
				this.loading = true;
				this.getInfo();
				console.log(this.navList);
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
			getInfo(){
				console.log('获取商铺信息');
				let postData = {
					  "cursor": this.page,
					  "shop_info_id": this.shopId,
					  "size": 10,
					  "type": this.navIndex
				}
				this.$http.post("app/shop/public/getShopInfo",postData)
				.then(res=>{
					console.log("获取商铺信息",res);
					let info = res.data;
					this.shopBgImg = info.shop_bg_img;
					this.shopImg = info.shop_logo;
					this.shopName = info.shop_name;
					this.shopDesc = info.shop_introduce;
					
					let resList = res.data.shop_goods_infos.data;
					let len = res.data.shop_goods_infos.count;
					if (this.list.length < len) {
						setTimeout(() => {
							this.end = this.page * 10;
							this.list = this.list.concat(resList);
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
					}
					console.log(this.list)
				})
				.catch(rej=>{
					console.log("获取搜索商品结果",rej)
					this.$tips.toast(rej.message)
				})
			}
		},
		onLoad(option) {
			console.log(option);
			this.shopId = option.id;
			this.getInfo();
			// this.getList();
		}, 
		onReachBottom() {
			this.page++;
			this.loading = true;
			// this.getList();
			this.getInfo();
		},
	}
</script>

<style lang="scss">
.shop_box {
	position: relative;
	.shop_bg_box {
		width: 100vw;
		height: 384rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background-size: 100% 100%;
		 -webkit-filter: blur(2rpx);
		-moz-filter: blur(2rpx);
		-o-filter: blur(2rpx);
		-ms-filter: blur(2rpx);
		filter: blur(2rpx);
		.mask {
			width: 100%;
			height: 100%;
			background: rgba(45,35,32,1);
			opacity: 0.55;
		}
	}
	.content {
		position: relative;
		top: 0;
		left: 0;
		z-index: 2;
		color: #fff;
		.header_box {
			padding: 32rpx;
			image {
				width: 96rpx;
				height: 96rpx;
				margin-right: 32rpx;
				border-radius: 16rpx;
			}
			.shop_desc {
				margin: 32rpx auto 0;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 3;
				-webkit-box-orient: vertical;
			}
		}
		.nav_box {
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
			line-height: 48rpx;
			// padding: 0 42rpx;
			.item {
				width: 50%;
				text-align: center;
				.line {
					width: 64rpx;
					height: 4rpx;
					background: transparent;
					border-radius: 2rpx;
					margin: 0 auto;
				}
				.line.act {
					background: #fff;
				}
			}
		}
		.goodsList {
			margin-top: 16rpx;
			padding: 32rpx;
			background: rgba(247,248,250,1);
			border-radius: 32rpx 32rpx 0 0;
		}
	}
}
</style>
