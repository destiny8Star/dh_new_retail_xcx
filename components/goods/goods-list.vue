<template>
	<view class="goods_list ly-flex-between-warp">
		<view class="item"
			v-for="(item, index) in newList" :key="index"
			:data-index="index"
			 @click="choose(item)">
			<view class="pic">
				<image mode="widthFix" :src="item.goods_url" ></image>
			</view>
			<view class="content">
				<view class="item_title">
					<!-- <text class=" item_tag">新品</text> -->
					<view class="item_tag" :style="{'borderColor': tag.tag_color}" v-for="(tag,t) in item.goods_tag" :key="t" v-if="t == 0"><text>{{tag.tag_name}}</text></view>
					<text>{{item.name}}</text>
				</view>
				<view class="item_price ly-flex-baseline">
					<text>￥{{item.goods_price}}</text>
					<text class="oldPrice">{{item.goods_marking_price}}</text>
				</view>
			</view>
		</view>
		<view class="loading" v-show="loading">
			<image src="/static/nairenk-waterfall-flow/loading.gif" style="width: 80rpx; height: 80rpx;"></image>
		</view>
		<view v-show="!loading" class="noMore">没有更多了~</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 数据列表
			list: {
				type: Array,
				default() {
					return []
				}
			},
			// 加载动画
			loading: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showMore: true,//是否展示"没有更多了"
				mark: 0,
				newList: [],
				boxHeight: [],
				top: [], 
				left: [],
				loadingTop: 0
			}
		},
		watch: {
			// 数据
			list: function (newVal, oldVal) {
				console.log(oldVal,newVal)
				this.mark = oldVal.length;
				if (newVal != oldVal) {
					this.newList = this.list;
					// this.$nextTick(function () {
					// 	setTimeout(() => {
					// 		// this.waterFall();
					// 	}, 120)
					// })
				}else{
					this.showMore = false;
				}
			}
		},
		methods: {
			// 瀑布流定位
			waterFall() {
				const query = uni.createSelectorQuery().in(this);
				query.selectAll('.goods_list .item').boundingClientRect(res => {
					console.log(res);
					let len = this.newList.length;
					let height = 0;
					for (let i = this.mark; i < len; i++) {
						height = res[i].height;
						if (i < 2) {
							this.$set(this.newList[i], 'top', 0);
							this.$set(this.newList[i], 'left', i);
							this.boxHeight.push(height);
							this.top.push(0);
							this.left.push(i);
						} else {
							let minHeight = this.boxHeight[0];
							let index = 0;
							if (minHeight > this.boxHeight[1]) {
								minHeight = this.boxHeight[1];
								index = 1;
							}
							this.boxHeight[index] = minHeight + height + 5;
							this.top.push(minHeight + 5);
							this.left.push(index);
							this.$set(this.newList[i], 'top', minHeight + 5);
							this.$set(this.newList[i], 'left', index);
							this.loadingTop = this.boxHeight[index];
						}
					}
				}).exec();
			},
			// 选中  跳转商品详情页
			choose(data) {
				console.log(data);
				uni.navigateTo({url: '/pages/goods/goods?id=' + data.id});
				// let index = e.currentTarget.dataset.index;
				// this.$emit('click', this.newList[index]);
			},
		}
	}
</script>

<style scoped lang="scss">
	.goods_list {
		width: 100%;
		// padding-bottom: var(--window-bottom);
		.item {
			min-height: 472rpx;
			width: calc(50% - 8rpx);
			background: #fff;
			border-radius: 16rpx;
			overflow: hidden;
			margin-bottom: 16rpx;
			.pic {
				height: 336rpx;
				image {
					height: 100%!important;
				}
			}
			.content {
				padding: 8rpx 16rpx 12rpx;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.item_title {
					min-height: 68rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					margin: 8rpx 0 4rpx;
					color: #1a1a1a;
					.item_tag {
						display: inline-block;
						padding: 0 6rpx;
						line-height: 36rpx;
						margin-right: 12rpx;
						font-size: 18rpx;
						font-family: PingFangSC-Medium,PingFang SC;
						font-weight: 500;
						border-radius: 8rpx;
						color: #fff;
						background: #BE2BF2;
					}
				}
				.item_price {
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:500;
					font-size: 28rpx;
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
		.loading {
			width: 100%;
			text-align: center;
			padding: 20rpx 0;
		}
	}
	
</style>
