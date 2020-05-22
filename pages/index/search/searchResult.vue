<template>
	<view>
		<!-- 搜索框 start -->
		<view class="search_box">
			<view class="search_small ly-flex-center" @click="goSearch">
				<icon type="search" size="14"/>
				<view class="search_val_box">
					<text>{{searchVal}}</text>
					<image class="icon_img" @click.stop="goSearch" src="../../../static/image/home/sea_shanchu_icon@2x.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 搜索框 end -->
		
		<!-- 筛选条件 start -->
		<view class="screen_box ly-flex-start-around">
			<view class="screen_item ly-flex-center" :class="{act:ele.flag}" v-for="(ele,i) in screenList" :key="i" @click="chooseScreen(ele,i)">
				<text>{{ele.text}}</text>
				<image class="icon_img" :class="{'rotateUp':ele.flag==1}" v-if="ele.flag&&i==1" src="../../../static/image/home/screen_icon_red_up@2x.png" mode=""></image>
				<image class="icon_img" v-else-if="!ele.flag&&i==1" src="../../../static/image/home/screen_icon_down@2x.png" mode=""></image>
			</view>
		</view>
		<!-- 筛选条件 end -->
		
		<!-- 商品列表 start -->
		<view class="content">
			<goodsList :list="list" :loading="loading" @click="choose"></goodsList>
		</view>
		<!-- 商品列表 end -->
	</view>
</template>

<script>
	// 模拟 JSON 数据
	// const data = require('@/common/json/data.json');
	
	export default {
		data() {
			return {
				searchType: 0,//不同的搜索方式 【0：默认列表，1：搜索商品，2：选择分类】
				searchVal: '',//搜索内容，通过直接搜索
				classifyTId: '',//三级分类id，通过分类选择进入本页面
				classifyTText: '',//三级分类文案，通过分类选择进入本页面
				
				page: 1,
				start: 0,
				end: 0,
				list: [], // 列表
				loading: true,
				
				screenList: [
					{id: 1, text: '销量', flag: 0},
					{id: 2, text: '价格', flag: 0},
					{id: 3, text: '新品', flag: 0},
				]
			};
		},
		onLoad(option) {
			console.log(option)
			if(option.type){
				this.searchType = option.type;
				if(option.type==1){
					if(option.searchVal!= "undefined") {
						this.searchVal = option.searchVal;
						this.getListBySearchVal();
					}
				}else if(option.type==2){
					if(option.tid!= "undefined") {
						this.classifyTId = option.tid;
						this.classifyTText = option.tText;
						this.getListByClassify();
						uni.setNavigationBarTitle({
						    title: this.classifyTText
						});
					}
				}
			}else{
				this.getListBySearchVal();
			}
		}, 
		onReachBottom() {
			this.page++;
			this.loading = true;
			// this.getList();
			this.judgeWay();
		},
		methods:{
			// 判断搜索商品方式，调用不同接口
			judgeWay(){
				console.log('判断搜索方式');
				if(this.searchType==1){
					this.getListBySearchVal();
				}else if(this.searchType==2){
					this.getListByClassify();
				}
			},
			// 选中
			choose(item) {
				// item 返回选中 JSON 对象
				console.log(item)
			},
			// 获取搜索商品结果
			getListBySearchVal() {
				//请求数据
				let postData = {
					"cursor": this.page,
					"goods_plus_price": this.screenList[1].flag,
					"goods_sold_num": this.screenList[0].flag,
					"is_new": this.screenList[2].flag,
					"name": this.searchVal,
					"size": 10
				}
				this.$http.post("app/mall/search/goods/public/by/condition",postData)
				.then(res=>{
					console.log("获取搜索商品结果",res)
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
					}
				})
				.catch(rej=>{
					console.log("获取搜索商品结果",rej)
					this.$tips.toast(rej.data.message)
				})
				
			},
			// 获取搜索商品结果【通过分类选择】
			getListByClassify() {
				//请求数据
				let postData = {
					"cursor": this.page,
					"goods_category_front_id": this.classifyTId,
					"goods_plus_price": this.screenList[1].flag,
					"goods_sold_num": this.screenList[0].flag,
					"is_new": this.screenList[2].flag,
					"name": '',
					"size": 10
				}
				this.$http.post("app/mall/search/goods/public/by/categoryFrontId",postData)
				.then(res=>{
					console.log("获取搜索商品结果",res);
					let resList = res.data.data;
					if (this.list.length < res.data.count) {
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
					this.$tips.toast(rej.data.message)
				})
				
			},
			// 筛选条件
			chooseScreen(data,i){
				console.log(data,i);
				if(data.flag){
					if(i==0){
						data.flag=0
					}
					if(i==1){
						if(data.flag==1){
							data.flag = 2
						}else {
							data.flag = 0
						}
					}
					if(i==2){
						data.flag=0
					}
				}else {
					if(i==0){
						data.flag=2
					}
					if(i==1){
						data.flag=1
					}
					if(i==2){
						data.flag=2
					}
				}
				this.loading = true;
				this.page = 1;
				this.list = [];
				this.judgeWay();
			},
			// 跳搜索页面
			goSearch(){
				if(this.searchType==2) {
					uni.navigateTo({url: 'search'});
				}else if(this.searchType==1){
					uni.navigateBack({delta: 1});
				}
			},
		}
	}
</script>

<style lang="scss">
		.search_box {
			width: 100%;
			background: #fff;
			padding: 10rpx 32rpx;
			border-top: 1rpx solid rgba(0,0,0,0.1);
			.search_small {
				height: 68rpx;
				padding: 10rpx 0 10rpx 42rpx;
				background: #F7F8FA;
				border-radius: 34rpx;
				.search_val_box {
					line-height: 48rpx;
					background: rgba(150,151,153,1);
					border-radius: 25rpx;
					padding: 0 52rpx 0 32rpx;
					margin-left: 26rpx;
					max-width: 580rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #fff;
					position: relative;
					image {
						position: absolute;
						top: 0;
						right: 0;
					}
				}
			}
		}
		.screen_box {
			background: #fff;
			padding: 20rpx 0;
			.screen_item {
				margin: 0 64rpx;
				line-height: 48rpx;
				&.act {
					color: $ly-text-color-red;
				}
				image {
					transform: rotateZ(0deg);
					transition: all .2s ease-in;
					&.rotateUp {
						transform: rotateZ(180deg)
					}
				}
			}
			image {
				margin-left: 2rpx;
			}
		}
		.content {
			padding: 16rpx 32rpx;
		}
</style>
