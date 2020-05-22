<template>
	<view class="coupon">
		<view class="c_top flex_arr">
			<view :class="['c_item',selTab==item.id?' selItem':'']" v-for="(item,idx) in tabs" :key="idx" @click="selTabHand(item.id)">{{item.tit}}</view>
		</view>
		<view class="c_bot">
			<block v-for="(item,ind) in coupons" :key="ind">
				<view class="c_botBox flex" v-show="selTab==1" @click="choseCou(item.id,ind)">
					<view class="c_botBoxL">
						<view class="c_botBoxL_mon">
							<text style="font-size: 30rpx;">￥</text>50
						</view>
						<view class="c_btBoxL_name">满398立减券</view>
					</view>
					<view class="c_botBoxR flex_be">
						<view class="c_botBoxR_left">
							<view class="">官方自营</view>
							<view class="c_botBoxR_tip">仅限参与活动的商品可用</view>
							<view class="c_botBoxR_botTime">2019.12.12 - 2019.12.12</view>
						</view>
						<view class="c_botBoxR_right" v-show="!item.sel"></view>
						<icon type="success" size="16" color="#F22B2B" v-show="item.sel" />
					</view>
				</view>
			</block>

			<!-- //已使用 -->
			<block>
				<view class="c_botBox flex c_botBoxno" v-show="selTab==2">
					<view class="c_botBoxL c_botBoxL2">
						<view class="c_botBoxL_mon">
							<text style="font-size: 30rpx;">￥</text>50
						</view>
						<view class="c_btBoxL_name c_btBoxL_name2">满398立减券</view>
					</view>
					<view class="c_botBoxR flex_be">
						<view class="c_botBoxR_left">
							<view class="">官方自营</view>
							<view class="c_botBoxR_tip">仅限参与活动的商品可用</view>
							<view class="c_botBoxR_botTime">2019.12.12 - 2019.12.12</view>
						</view>
					</view>
				</view>
			</block>



		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [{
						id: 1,
						tit: "可用"
					},
					{
						id: 2,
						tit: "不可用"
					},

				],
				selTab: 1, //当前选中tab1
				selCou: 2, //当前选中卡券
				coupons: [{
						id: 1,
						sel: false,
					},
					{
						id: 2,
						sel: true,
					},
					{
						id: 3,
						sel: false,
					},

				], //可用卡券组
			};
		},
		methods: {
			//选择tab
			selTabHand(id) {
				this.selTab = id
			},
			//选择卡券
			choseCou(id, ind) {
				// console.log("c",id,ind,this.selCou)
				if (id != this.selCou) {
					// 点击不同coupon
					this.selCou = id
					this.coupons.forEach(item => {
						item.sel = false
					})
					this.coupons[ind].sel = true
				} else {
					// 点击相同coupon
					this.coupons[ind].sel = !this.coupons[ind].sel
				}
				//传递给上一个页面
				uni.$emit('coupon', {
					coupon_id: '页面更新'
				})
			}
		}
	}
</script>

<style lang="scss">
	.coupon {
		border-top: 1rpx solid #CBCBCB;

		.c_top {
			width: 100%;
			height: 100rpx;
			box-shadow: 0px 1rpx 0px 0px rgba(203, 203, 203, 1);
			font-size: 30rpx;
			line-height: 100rpx;
			color: #666666;
			background: #fff;

			.c_item {
				height: 100%;
			}

			.selItem {
				border-bottom: 6rpx solid #F22B2B;
			}
		}

		.c_bot {
			width: 100%;
			padding: 20rpx 32rpx;

			.c_botBox {
				width: 100%;
				height: 172rpx;
				background-image: url(../../../static/image/car/c_yhbg.png);
				overflow: hidden;
				margin-bottom: 20rpx;
				background-position: center;
				background-size: cover;

				.c_botBoxL {
					width: 234rpx;
					text-align: center;
					padding: 16rpx 0;
					color: #F22B2B;
					border-radius: 16rpx;
					font-weight: bold;

					.c_botBoxL_mon {
						font-size: 60rpx;
						margin-bottom: 20rpx;
					}

					.c_btBoxL_name {
						font-size: 32rpx;
					}

					.c_btBoxL_name2 {
						font-weight: 200;
					}
				}

				.c_botBoxL2 {
					color: #2D2320;
				}

				.c_botBoxR {
					flex: 1;
					padding: 22rpx 32rpx 16rpx;
					font-size: 24rpx;
					align-items: center;
					color: #2D2320;

					.c_botBoxR_left {
						.c_botBoxR_tip {
							margin-bottom: 34rpx;
						}

						.c_botBoxR_botTimeP {
							font-size: 18rpx;
						}
					}

					.c_botBoxR_right {
						border: 1rpx solid #969799;
						width: 32rpx;
						height: 32rpx;
						border-radius: 50%;
					}

				}
			}

			.c_botBoxno {
				background-image: url("../../../static/image/car/c_yhno.png");
			}
		}
	}
</style>
