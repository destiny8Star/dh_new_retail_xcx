<template>
	<view class="order">
		<view class="c_top flex_arr">
			<view :class="['c_item',selTab==item.id?' selItem':'']" v-for="(item,idx) in tabs" :key="idx" @click="selTabHand(item.id)">{{item.tit}}</view>
		</view>
		<view class="o_bot">
			<view class="o_botBox" v-for="item in list" :key="item.id">
				<view class="o_botTop flex_be">
					<view class="o_botTop_sname">
						{{item.shop_name}}
					</view>
					<view class="flex">
						<view class="o_botTop_status2" v-if="item.order_status==1">等待付款</view>
						<view class="o_botTop_status" v-if="item.order_status==2">等待商家发货</view>
						<view class="o_botTop_status" v-if="item.order_status==3">商家已发货</view>
						<view class="o_botTop_status" v-if="item.order_status==4">已完成</view>
						<view class="o_botTop_status2" v-if="item.order_status==5">已关闭</view>
						<view class="o_botTop_status" v-if="item.order_status==6">已取消</view>
						<view class="o_botTop_status2" v-if="item.order_status==7">已退款</view>
						<!-- <view class="o_botTop_status2" v-if="item.trade_memo"> | {{item.trade_memo}}</view> -->
					</view>
	
				</view>

				<view @click="toDetail(item.id,item.order_status)">
					<view class="o_botMin flex_be" v-for="(itemIn,ind) in item.mall_goods_order_detail_resps" :key="ind">
						<view class="o_botMin_img">
							<image :src="itemIn.pic_path" mode=""></image>
						</view>
						<view class="o_botMinR">
							<view class="o_botMinR_name">{{itemIn.goods_spu_name}}</view>
							 <view class="car_itemCont_rightBox_sku" >{{itemIn.goods_sku||"默认规格"}}</view>
							<view class="o_botMinR_bot flex_be">
								<view>￥{{itemIn.goods_sku_price}}</view>
								<view>x{{itemIn.goods_sku_count}}</view>
							</view>
						</view>
					</view>

				</view>

				<!-- 总计 -->
				<view class="o_botConBox flex_be">
					<view class="o_botTips">{{item.order_status==7?'退款将在24小时内原路返回':''}}</view>
					<view class="o_botCon">
						共{{item.goods_count}}件商品 实付¥{{item.real_price}}
					</view>
				</view>
				
				<!-- //底部按钮 -->
				<view class="o_botBtn flex">
					<view class="o_botBtns" v-if="item.order_status==4||item.order_status==5||item.order_status==6" @click="toDel(item.id)">
						删除订单
					</view>
					<view class="o_botBtns" v-if="item.order_status==1" @click="toCancel(item.id)">取消订单</view>
					<view class="o_botBtns o_botBtn_zf" v-if="item.order_status==1" @click="rePay(item.id,item.real_price)">去支付</view>
					<view class="o_botBtns" v-if="item.order_status==2" @click="toWarn">提醒发货</view>
					<view class="o_botBtns" v-if="item.order_status==3||item.order_status==4" @click="toTrans(item.id)">物流信息</view>
					<view class="o_botBtns" v-if="item.order_status==3" @click="toConfirm(item.id)">确认收货</view>
				</view>
			</view>

			<!-- 正在加载 -->
			<view style="text-align: center;">
				{{pageBottomText}}
			</view>
		</view>

		<view class="t_none" v-if="list.length==0">
			没有任何订单~
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				cursor: 1,
				size:10,
				tabs: [{
						id: 0,
						tit: "全部"
					},
					{
						id: 1,
						tit: "待付款"
					},

					{
						id: 2,
						tit: "待发货"
					},
					{
						id: 3,
						tit: "待收货"
					},

					{
						id: 4,
						tit: "已完成"
					},
				],
				selTab: 0, //当前选中0
				list: [], //数据列表
				pageBottomText: "", //底部文字
			};
		},
		onLoad(opt) {
			// console.log("op",opt)
			this.selTab = opt.tabs || 0
			this.initData()
			//注册事件
			uni.$on('refresh', this.initData)
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('refresh');
		},
		methods: {
			//重新支付
			rePay(id,real_price){
				let order_nos = [id]
				let open_id = uni.getStorageSync("open_id")
				console.log("order",order_nos)
				this.$tips.loading()
				this.$http.post("app/order/pay",{
					order_info_ids:order_nos,
					pay_method:1,
					openid:open_id
				})
				.then(res=>{
					console.log("冲洗支付",res)
					this.$tips.loaded()
					if(res.data.code == "SUCCESS"){//预下单成功
					    let datas = res.data
					   return  this.$cObj.payMent(datas.time_stamp,datas.nonce_str,datas.wx_package,datas.pay_sign)
					}else{
					   return Promise.reject(res)
					}
				})
				.then(res=>{
					console.log("支付结果",res,real_price)
					uni.reLaunch({
						url:"/pages/car/payRes/payRes?money="+real_price+"&&status=success"
					})
				})
				.catch(rej=>{
					if(rej.data){
						this.$tips.toast(rej.data.message||rej.data.msg)
					}else{
						uni.reLaunch({
							url:"/pages/car/payRes/payRes?money="+real_price+"&&status=info"
						})
					}
					console.log("冲洗支付失败",rej)
				})
			},
			//initData初始化数据
			initData() {
				this.$tips.loading()
				this.$http.post("app/mall/goods/order/list", {
						cursor: 1,
						size: this.size,
						order_status: this.selTab
					})
					.then(res => {
						this.$tips.loaded()
						this.list = res.data
						console.log("获取数据", res)
					})
					.catch(rej => {
						this.$tips.loaded()
						this.$tips.toast(rej.data.message || "网络异常")
						console.log("失败", rej)
					})
			},
			//选择tab
			selTabHand(id) {
				this.selTab = id
				this.pageBottomText = ""
				this.cursor = 1
				this.initData()
			},
			//取消订单
			toCancel(id) {
				this.$tips.loading()
				this.$http.post("app/mall/goods/order/cancelOrderByUser", {
						order_info_id: id,
					})
					.then(res => {
						this.$tips.loaded()
						let that = this
						this.$tips.toast("取消成功", function() {
							that.initData()
						}, "success")
						console.log("取消结果", res)
					})
					.catch(rej => {
						this.$tips.loaded()
						this.$tips.toast(rej.data.message || "网络异常")
						console.log("失败", rej)
					})
			},
			//删除
			toDel(id) {
				// let page = getCurrentPages()
				this.$tips.confirm("确定删除此订单吗")
					.then(res => {
						console.log("去人", this)
						this.$tips.loading()
						this.$http.post("app/mall/goods/order/delByUser", {
								order_info_id: id,
							})
							.then(res => {
								this.$tips.loaded()
								let that = this
								this.$tips.toast("删除成功", function() {
									that.initData()
								}, "success")
								console.log("删除结果", res)
							})
							.catch(rej => {
								this.$tips.loaded()
								this.$tips.toast(rej.data.message || "网络异常")
								console.log("失败", rej)
							})
					})
					.catch(res => {
						console.log("取消", res)
					})
			},
			//确认收货
			toConfirm(id) {
				this.$tips.confirm("确定已经收到货了吗")
					.then(res => {
						this.$tips.loading()
						this.$http.get("app/orderLogistics/confirmReceipt?order_info_id=" + id)
							.then(res => {
								this.$tips.loaded()
								let that = this
								this.$tips.toast("操作成功", function() {
									that.initData()
								}, "success")
								console.log("确认结果", res)
							})
							.catch(rej => {
								this.$tips.loaded()
								this.$tips.toast(rej.data.message || "网络异常")
								console.log("失败", rej)
							})
					})
					.catch(res => {
						console.log("取消", res)
					})

			},
			//提醒
			toWarn() {
				let that = this
				this.$tips.loading()
				setTimeout(function() {
					that.$tips.loaded()
					that.$tips.toast("已提醒商家发货", '', "success")
				}, 1000)
			},
			onReachBottom() {
				let page = this.cursor+1;
				this.pageBottomText = " - 拼命加载中 -"
				this.$tips.loading()
				this.$http.post("app/mall/goods/order/list", {
						cursor: page,
						size: this.size,
						order_status: this.selTab
					})
					.then(res => {
						this.$tips.loaded()
						// this.list = res.data
						if(res.data.length==0){
							this.pageBottomText = " - 我也是有底线的 -"
						}else{
							let newList = this.list.concat(res.data)
							this.list = newList
							this.cursor++
						}
						console.log("获取数据", res)
					})
					.catch(rej => {
						this.$tips.loaded()
						this.$tips.toast(rej.data.message || "网络异常")
						console.log("失败", rej)
					})
			},
			//去详情
			toDetail(id, status) {
				if (status == 5) return
				uni.navigateTo({
					url: "../orderDetail/orderDetail?id=" + id
				})
			},
			//物流
			toTrans(id) {
				uni.navigateTo({
					url: "../transport/transport?id=" + id
				})
			},

		},
	}
</script>

<style lang="scss">
	.order {
		border-top: 1rpx solid #CBCBCB;

		.c_top {
			width: 100%;
			height: 100rpx;
			background: #fff;
			box-shadow: 0px 1rpx 0px 0px rgba(203, 203, 203, 1);
			font-size: 30rpx;
			line-height: 100rpx;
			color: #666666;
			margin-bottom: 20rpx;
			position: fixed;
			top: 80rpx;
			left: 0;
			z-index: 9;
			/*  #ifdef  MP-WEIXIN  */
			position: fixed;
			top: 0;
			left: 0;
			/*  #endif  */

			.c_item {
				height: 100%;
			}

			.selItem {
				border-bottom: 6rpx solid #F22B2B;
			}
		}

		.t_none {
			font-size: 30rpx;
			text-align: center;
			margin-top: 70rpx;
			color: #999999;
		}

		.o_bot {
			width: 100%;
			padding: 120rpx 32rpx 20rpx;

			.o_botBox {
				width: 100%;
				padding: 20rpx;
				background: rgba(254, 254, 254, 1);
				box-shadow: 0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
				border-radius: 20rpx;
				margin-bottom: 20rpx;
				font-size: 24rpx;

				.o_botTop {
					align-items: center;
					padding-bottom: 20rpx;


					.o_botTop_sname {
						font-size: 28rpx;
						max-width: 400rpx;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}

					.o_botTop_status {
						color: #666
					}

					.o_botTop_status2 {
						color: #F22B2B;
						padding-left: 8rpx;
					}
				}

				.o_botMin {
					width: 100%;
					align-items: center;
					border-top: 1rpx solid #E6E6E6;
					padding: 10rpx 0;

					.o_botMin_img {
						width: 150rpx;
						height: 150rpx;
						margin-right: 20rpx;
					}

					.o_botMinR {
						flex: 1;

						.o_botMinR_name {
							width: 100%;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							// margin-bottom:15rpx;
						}
						.car_itemCont_rightBox_sku{
							display: inline-block;
							background: #F7F8FA;
							border-radius: 8rpx;
							padding:6rpx 16rpx;
							font-size: 18rpx;
							margin: 8rpx 0;
						}
						.o_botMinR_bot {
							align-items: center;
						}
					}
				}
				.o_botConBox{
					align-items: center;
					margin: 10rpx 0 20rpx;
					.o_botTips{
						color: #F22B2B; 
					 }
					.o_botCon {
						text-align: end;
					}
				}
				

				.o_botBtn {
					width: 100%;
					align-items: center;
					justify-content: flex-end;

					.o_botBtns {
						border: 1rpx solid #666666;
						color: #666666;
						min-width: 120rpx;
						text-align: center;
						padding: 10rpx;
						border-radius: 16rpx;
						margin-left: 10rpx;
					}

					.o_botBtn_zf {
						border: 1rpx solid #F22B2B;
						color: #F22B2B;
					}
				}
			}

		}

	}
</style>
