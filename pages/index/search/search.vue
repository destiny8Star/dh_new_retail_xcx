<template>
	<view class="search">
		<!-- 搜索框 start -->
		<view class="search_box">
			<view class="search_small">
				<icon type="search" size="14"/>
				<input class="search_input" confirm-type="search" v-model="searchValue" placeholder="搜索" @confirm="search"/>
			</view>
		</view>
		<!-- 搜索框 end -->
		
		<!-- 最近搜索 start -->
		<view class="record" v-if="recentlyList.length>0">
			<view class="title ly-flex-center-between">
				<text>最近搜索</text>
				<image class="icon_img" src="../../../static/image/home/shanchu_icon@2x.png" mode="" @click="delRecord"></image>
			</view>
			<view class="record_list ly-flex-center-warp">
				<view class="record_item" v-for="(ele,i) in recentlyList" :key="i" @click="searchs(ele)">{{ele.search_name}}</view>
			</view>
		</view>
		<!-- 最近搜索 end -->
		
		<!-- 热门搜索 start -->
		<view class="record">
			<view class="title">
				<text>热门搜索</text>
			</view>
			<view class="record_list ly-flex-center-warp">
				<view class="record_item" :class="{hot:ele.the_hottest}" v-for="(ele,i) in hotList" :key="i" @click="searchs(ele)">{{ele.search_name}}</view>
			</view>
		</view>
		<!-- 热门搜索 end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchType: 1,//跳转至商品列表页面所需类型【0：默认列表，1：搜索商品，2：选择分类】
				searchValue: "",//搜索值
				// 最近搜索记录
				recentlyList: [],
				// 热搜记录
				hotList: [
					{id: 1,text: '洗衣机第四个为入围他哥wig扣押工资',tag: 1},
					{id: 2,text: 'sihgjk 旗舰店春款',tag: 1},
					{id: 3,text: '和规划局规划加班',tag: 0},
					{id: 4,text: '自加热饭盒 小熊家 包邮',tag: 0},
					{id: 5,text: '洗衣机',tag: 0},
				],
			}
		},
		methods: {
			// 删除 最近搜索 记录
			delRecord(){
				let that = this;
				uni.showModal({
				    title: '提示',
				    content: '确认删除 最近搜索 吗？',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							uni.showToast({
							    title: '删除成功',
							    duration: 1000
							});
							// let pages = getCurrentPages();
							// pages[0].recentlyList = [];
							// console.log(pages);
							uni.removeStorageSync('recentlyList');
							that.recentlyList = [];
							console.log(that.recentlyList,uni.getStorageSync('recentlyList'))
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			// 搜索
			search(){
				console.log("搜搜");
				console.log(this.searchValue,this.recentlyList);
				let len = this.recentlyList.length;
				let num = 0;
				this.recentlyList.forEach((ele,i)=>{
					if(this.searchValue==ele.search_name){
						num ++
					}
				})
				if(this.searchValue && num==0 && len<6){
					this.recentlyList.unshift({id:len,search_name:this.searchValue})
				}else if(this.searchValue && num==0 && len==6){
					this.recentlyList.pop();//删除数组最后一条
					this.recentlyList.unshift({id:len,search_name:this.searchValue})//添加新记录至数组第一条
				}
				// 存储 最近搜索记录 到本地
				uni.setStorageSync('recentlyList', this.recentlyList);
				uni.navigateTo({url: 'searchResult?searchVal=' + this.searchValue + '&type=' + this.searchType});
				// uni.redirectTo({url: 'searchResult?searchVal=' + this.searchValue + '&type=' + this.searchType});
			},
			searchs(data){
				console.log(data);
				if(data){
					this.searchValue = data.search_name
				}
				this.search();
			},
			// 获取热门搜索list
			getHotList(){
				//请求数据
				this.$http.get("app/mall/search/goods/public/hot/names")
				.then(res=>{
					console.log("获取热门搜索",res)
					this.hotList = res.data;
				})
				.catch(rej=>{
					console.log("获取热门搜索",rej)
					this.$tips.toast(rej.data.message)
				})
				// this.$forceUpdate()//加上它，就可以强制刷新视图
			}
		},
		onShow() {
			// 获取本地存储的最近搜索记录
			let list = uni.getStorageSync('recentlyList');
			if (list) {
				this.recentlyList = list
			}
			console.log(this.recentlyList)
			// 获取热门搜索list
			this.getHotList();
		}
	}
</script>

<style lang="scss">
	.search {
		width: 100vw;
		height: 100vh;
		background: #fff;
		position: fixed;
		.search_box {
			width: 100%;
			padding: 10rpx 32rpx;
			border-top: 1rpx solid rgba(0,0,0,0.1);
			.search_small {
				height: 68rpx;
				background: #F7F8FA;
				border-radius: 34rpx;
				position: relative;
				icon {
					position: absolute;
					left: 42rpx;
					top: 20rpx;
				}
				.search_input {
					height: 68rpx;
					font-size: 28rpx;
					color: #969799;
					padding-left: 88rpx;
				}
			}
		}
		.record {
			padding: 12rpx 32rpx 0;
			.title {
				font-size: 28rpx;
				font-family: PingFangSC-Semibold,PingFang SC;
				font-weight:600;
				line-height:44px;
			}
			.record_list {
				margin: 8rpx -8rpx;
				.record_item {
					max-width: 630rpx;
					padding: 0 32rpx;
					line-height: 48rpx;
					background: rgba(247,248,250,1);
					border-radius: 25rpx;
					margin: 8rpx 8rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.hot {
					color: #F22B2B;
					background: rgba(242,43,43,0.08);
				}
			}
		}
	}
	
</style>
