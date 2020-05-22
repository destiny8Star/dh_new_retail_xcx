<template>
	<view class="classify_box">
		<!-- 搜索框 start -->
		<view class="search_box">
			<view class="search_small" @click="goSearch">
				<icon type="search" size="14"/>
				<input class="search_input" disabled placeholder="搜索"/>
			</view>
		</view>
		<!-- 搜索框 end -->
		<!-- 分类 start -->
		<view class="content">
			<!-- 一级 start -->
			<scroll-view scroll-y class="left-aside">
				<view v-for="item in flist" :key="item.id" class="f-item ly-flex-center-center" :class="{active: item.id == currentId}" @click="tabtap(item)">
					{{item.sys_category_name}}
				</view>
			</scroll-view>
			<!-- 一级 end -->
			
			<!-- 二、三级 start -->
			<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
				<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
					<text class="s-item">{{item.sys_category_name}}</text>
					<view class="t-list ly-flex-center-warp">
						<view @click="navToList(item.id, titem.id,titem.sys_category_name)" v-if="titem.parent_id === item.id" class="t-item ly_flex_center_column" v-for="titem in tlist" :key="titem.id">
							<image :src="titem.category_img"></image>
							<text>{{titem.sys_category_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 二、三级 end -->
		</view>
		<!-- 分类 end -->
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				searchType: 2,//跳转至商品列表页面所需类型【0：默认列表，1：搜索商品，2：选择分类】
				sizeCalcState: false, //是否计算右侧各个二级所在高度
				tabScrollTop: 0, // 右侧现二级距二级list顶部距离
				currentId: 0,//当前id
				flist: [],//一级分类
				slist: [],//二级分类
				tlist: [],//三级分类
			}
		},
		onLoad(){
			this.loadData();
		},
		// onReady(){
		// 	if(!this.sizeCalcState){
		// 		let that = this
		// 		setTimeout(function(){
		// 			that.calcSize()
		// 		},0)
		// 	}
		// },
		methods: {
			// 跳搜索页面
			goSearch(){
				uni.navigateTo({url: '../index/search/search?pageType=2'});
			},
			//  获取分类列表
			loadData(){
				let that = this;
				//请求数据
				this.$http.post("app/sysCategoryFront/public/getSysCategoryFront")
					.then(res=>{
						console.log("获取搜索商品结果",res)
						if (res.code==200) {
							let list = res.data;
							list.forEach(item=>{
								if(item.parent_id==0){
									this.flist.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
									this.flist.sort(function(a, b){
										return a.id - b.id
										}); 
									this.currentId = this.flist[0].id
								}else if(item.parent_id&&!item.category_img){
									this.slist.push(item); //没有图的是2级分类
									this.slist.sort(function(a, b){
										return a.parent_id - b.parent_id
										}); 
								}else{
									this.tlist.push(item); //3级分类
								}
							}) 
							console.log(this.flist,this.slist,this.tlist)
							setTimeout(function(){
								that.calcSize()
							},0)
							this.loading = false;
						} else {
							this.loading = false;
						}
					})
					.catch(rej=>{
						console.log("获取搜索商品结果",rej)
						this.$tips.toast(rej.message)
					})
				
			},
			//一级分类点击
			tabtap(item){
				console.log(item,this.sizeCalcState)
				if(!this.sizeCalcState){
					this.calcSize();
				}
				this.currentId = item.id;
				//findIndex 获取数组中父id等于一级分类id 的第一个元素索引位置
				let index = this.slist.findIndex(sitem=>sitem.parent_id === item.id);
				this.tabScrollTop = this.slist[index].top;
				console.log(this.tabScrollTop);
			},
			//右侧栏滚动
			asideScroll(e){
				console.log(this.sizeCalcState)
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].parent_id;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						this.$set(item,'top',h)
						h += data.height;
						this.$set(item,'bottom',h)
						item.bottom = h;
					}).exec();
				})
				console.log(this.slist)
				this.sizeCalcState = true;
			},
			// 选择三级分类 跳转结果页面
			navToList(sid, tid, tText){
				uni.navigateTo({
					url: `../index/search/searchResult?tid=${tid}&type=${this.searchType}&tText=${tText}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.classify_box {
		height: 100%;
	}

	.content {
		display: flex;
		height: calc(100% - 90rpx);
	}		
	.search_box {
		width: 100%;
		padding: 10rpx 32rpx;
		border-top: 1rpx solid rgba(0,0,0,0.1);
		background: #fff;
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
		
	.left-aside {
		flex-shrink: 0;
		width: 160rpx;
		height: 100%;
	}
	.f-item {
		line-height: 96rpx;
		font-size: 28rpx;
		position: relative;
		&.active{
			font-weight: bold;
			background: #fff;
			color: $ly-text-color-red;
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding: 32rpx;
		background: #fff;
	}
	.s-item{
		padding-top: 8rpx;
		font-weight: 600;
		line-height: 44rpx;
		font-size: 28rpx;
	}
	.t-list{
		width: 100%;
		padding-top: 24rpx;
		/* &:after{
			content: '';
			flex: 99;
			height: 0;
		} */
	}
	.t-item{
		flex-shrink: 0;
		width: 33%;
		padding-bottom: 32rpx;
		image{
			width: 144rpx;
			height: 144rpx;
		}
	}
</style>
