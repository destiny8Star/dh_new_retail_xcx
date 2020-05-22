<template>
	<view class="coupon">
		<view class="c_top flex_arr">
			<view :class="['c_item',selTab==item.id?' selItem':'']" v-for="(item,idx) in tabs" :key="idx" @click="selTabHand(item.id)">{{item.tit}}({{item.count}})</view>
		</view>
		<view class="c_bot">
			<view class="c_botBox flex" v-for="item in couponList" :key="item.id">
				<view class="c_botBoxL">
					<!-- 1：满减卷，2折扣卷 -->
					<view class="c_botBoxL_mon" v-show="item.coupon_type==1">
						<text style="font-size: 30rpx;">￥</text>{{item.coupon_amount}}
					</view>
					<view class="c_botBoxL_mon" v-show="item.coupon_type==2">
						{{item.coupon_discount*10}}<text style="font-size: 30rpx;">折</text>
					</view>
					<view class="c_btBoxL_name">满{{item.order_amount}}可用</view>
				</view>
				<view class="c_botBoxR">
					<view class="c_botBoxR_tip">{{item.coupon_scope_desc}}</view>
					<view class="c_botBoxR_bot flex_be">
						<view class="c_botBoxR_botTime">{{item.coupon_use_start_time}} ~ {{item.coupon_use_end_time}}</view>
						<view class="c_botBoxR_botStatus" v-show="selTab==0" @click="toGoods(item.coupon_id)">立即使用</view>
						<view class="c_botBoxR_botStatus c_botBoxR_botStatus2" v-show="selTab==1">已使用</view>
						<view class="c_botBoxR_botStatus c_botBoxR_botStatus2" v-show="selTab==3">已失效</view>
					</view>
				</view>
			</view>
		   <!-- //空页面 -->
		   <view class="c_botNone" v-if="couponList.length==0">没有可用优惠券~</view>
			<!-- 正在加载 -->
			<view style="text-align: center;">
				{{pageBottomText}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [{
						id: 0,
						tit: "未使用",
						count:0,
					},
					{
						id:1,
						tit: "已使用",
						count:0,
					},

					{
						id: 3,
						tit: "已失效",
						count:0,
					},

				],
				selTab: 0, //当前选中
				couponList:[],//列表
				cursor:1,//游标
				size:10,
				pageBottomText: "", //底部文字
			};
		},
		methods: {
			//选择tab
			selTabHand(id) {
				this.selTab = id
				this.pageBottomText = ""
				this.cursor = 1
				this.$tips.loading()
				this.$http.post("app/coupon/terminalUser/listCoupon",{
					coupon_status_flag:id,
					cursor:1,
					size:this.size,
				})
				.then(res=>{
					this.$tips.loaded()
					this.couponList = res.data.data
					console.log("户籍去数据",res)
				})
				.catch(rej=>{
					this.$tips.loaded()
					this.$tips.toast(res.data.message||"网络异常")
					console.log("失败",rej)
				})
			},
			//获取数据
			getData(){
				return  Promise.all([this.$http.post("app/coupon/terminalUser/listCoupon",{
					coupon_status_flag:0,
					cursor:1,
					size:this.size,
				}),
				this.$http.post("app/coupon/terminalUser/couponStatistics")])
			},
			//去使用
			toGoods(id){
				console.log("id",id)
				uni.navigateTo({
					url:"../useCoupon/useCoupon?id="+id
				})
			}
		},
		onLoad(){
			this.$tips.loading()
			this.getData()
			.then(res=>{
				this.$tips.loaded()
				this.couponList = res[0].data.data
				this.tabs[0].count = res[1].data.valid_count
				this.tabs[1].count = res[1].data.used_count
				this.tabs[2].count = res[1].data.expiry_count
				console.log("户籍去数据",res)
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(res.data.message||"网络异常")
				console.log("失败",rej)
			})
		},
		onReachBottom() {
			let page = this.cursor+1;
			this.pageBottomText = " - 拼命加载中 -"
			this.$tips.loading()
			this.$http.post("app/coupon/terminalUser/listCoupon", {
					cursor: page,
					size: this.size,
					coupon_status_flag:this.selTab,
				})
				.then(res => {
					console.log("获取数据", res)
					this.$tips.loaded()
					if(res.data.data.length==0){
						this.pageBottomText = " - 我也是有底线的 -"
					}else{
						let newList = this.couponList.concat(res.data.data)
						this.couponList = newList
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
	.coupon {
		border-top: 1rpx solid #CBCBCB;

		.c_top {
			width: 100%;
			height: 100rpx;
			box-shadow: 0px 1rpx 0px 0px rgba(203, 203, 203, 1);
			font-size: 30rpx;
			line-height: 100rpx;
			color: #666666;
			background:#F8F8F8 ;
            position: fixed;
			left: 0;
			top: 80rpx;
			/*  #ifdef  MP-WEIXIN  */
			top: 0;
			/*  #endif  */
			.c_item {
				height: 100%;
			}

			.selItem {
				border-bottom: 6rpx solid #F22B2B;
			}
		}

		.c_bot {
			width: 100%;
			padding: 120rpx 32rpx;
			/*  #ifdef  MP-WEIXIN  */
			padding: 120rpx 32rpx;
			/*  #endif  */
             .c_botNone{
				 font-size: 30rpx;
				 text-align: center;
				 margin-top: 70rpx;
				 color: #999999;
			 }
			.c_botBox {
				width: 100%;
				background: rgba(254, 254, 254, 1);
				box-shadow: 0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
				border-radius: 20rpx;
				overflow: hidden;
                margin-bottom: 20rpx;
				.c_botBoxL {
					width: 200rpx;
					// height:130rpx;
					text-align: center;
					background: rgba(242, 43, 43, 1);
					padding: 10rpx 0 24rpx;
					color: #fff;
					.c_botBoxL_mon {
						font-size: 60rpx;
						font-weight: bold;
					}
					
					.c_btBoxL_name{
						font-size: 24rpx;
					}
				}
				
				.c_botBoxR{
					flex:1;
					padding: 30rpx 20rpx 10rpx;
					font-size: 24rpx;
					
					.c_botBoxR_bot{
						align-items: center;
						margin-top: 10rpx;
						.c_botBoxR_botTime{
							font-size: 20rpx;
							max-width: 300rpx;
						}
						.c_botBoxR_botStatus{
							border: 1rpx solid #F22B2B;
							color: #F22B2B;
							padding:10rpx;
							border-radius: 16rpx;
							min-width: 120rpx;
							text-align: center;
						}
						.c_botBoxR_botStatus2{
							border: 1rpx solid #666666;
							color: #666666;
						}
					}
				}
			}
		}
	}
</style>
