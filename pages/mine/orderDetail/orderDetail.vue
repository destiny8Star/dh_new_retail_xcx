<template>
	<view>
		<view class="ord_top">
			<view class="ord_topTit"v-if="data.order_status==1">等待买家付款</view>
			<view class="ord_topTit"v-if="data.order_status==2">等待商家发货</view>
			<view class="ord_topTit"v-if="data.order_status==3">商家已发货</view>
			<view class="ord_topTit"v-if="data.order_status==4">已完成</view>
			<!-- <view class="ord_topTit"v-if="data.order_status==5">已关闭</view> -->
			<view class="ord_topTit"v-if="data.order_status==6">已取消</view>
			<view class="ord_topCon" v-if="data.order_status==1">订单将在30分钟后结束或商品库存不足时自动关闭</view>
		</view>
		<view class="ord_bot">
			<!-- 地址 -->
			<view class="ad_box">
				<view class="ad_boxL_top flex">
					<view class="ad_boxL_topName">{{data.consignee}}</view>
					<view>{{data.consignee_tel}}</view>
				</view>
				<view class="ad_boxL_bot">{{data.consignee_address}}</view>
			</view>
			<!-- 商品信息 -->
			<view class="o_botBox">
				<view class="o_botTop flex_be" @click="toShop(data.shop_info_id)">
					<view class="o_botTop_sname">
						{{data.shop_name}}
					</view>
					<view class="o_botTop_status2" v-if="data.order_status==1">等待付款</view>
				</view>
				<view class="o_botMin flex_be" v-for="(item,ind) in data.mall_goods_child_order_info_resp" :key="ind"
				@click="toGoods(item.goods_spu_id)">
					<view class="o_botMin_img">
						<image :src="item.pic_path" mode=""></image>
					</view>
					<view class="o_botMinR">
						<view class="o_botMinR_name">{{item.goods_spu_name}}</view>
						<view class="car_itemCont_rightBox_sku" >{{item.goods_sku||"默认规格"}}</view>
						<view class="o_botMinR_bot flex_be">
							<view>￥{{item.goods_sku_price}}</view>
							<view>x{{item.goods_sku_count}}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="ord_other">
				<view class="ord_other_item flex">
					<view class="ord_other_itemLab">订单编号</view>
					<view class="ord_other_itemCon flex_be">
						<view>	{{data.order_info_no}}</view>
					    <view class="ord_other_itemClip" @click="clipHand(data.order_info_no)">复制</view>	
					</view>
				</view>
				<view class="ord_other_item flex">
					<view class="ord_other_itemLab">优惠</view>
					<view class="ord_other_itemCon">￥{{data.discount_price}}</view>
				</view>
				<view class="ord_other_item flex">
					<view class="ord_other_itemLab">运费</view>
					<view class="ord_other_itemCon">￥{{data.send_price}}</view>
				</view>
				<view class="ord_other_item flex">
					<view class="ord_other_itemLab">下单时间</view>
					<view class="ord_other_itemCon">{{data.order_time}}</view>
				</view>
				<view class="ord_other_item flex ord_other_itemCor" v-if="data.order_status==1">
					<view class="ord_other_itemLab ord_other_itemCor">待支付</view>
					<view class="ord_other_itemCon">￥{{data.real_price}}</view>
				</view>
				<view class="ord_other_item flex ord_other_itemCor" v-if="data.order_status==7">
					<view class="ord_other_itemLab ord_other_itemCor">已退款</view>
					<view class="ord_other_itemCon">￥{{data.real_price}}</view>
				</view>
				<view class="ord_other_item flex" v-if="data.order_status==2||data.order_status==3||data.order_status==4">
					<view class="ord_other_itemLab">已支付</view>
					<view class="ord_other_itemCon">￥{{data.real_price}}</view>
				</view>
				
				<view class="o_botBtn flex">
					<view class="o_botBtns" @click="toTrans(data.id)"  v-if="data.order_status==3||data.order_status==4">物流信息</view>
					<view class="o_botBtns" v-if="data.order_status==4||data.order_status==6" @click="toDel(data.id)">删除订单</view>
					<view class="o_botBtns"  v-if="data.order_status==1" @click="toCancel(data.id)">取消订单</view>
					<view class="o_botBtns o_botBtn_zf"  v-if="data.order_status==1" @click="rePay(data.id,data.real_price)">去支付</view>
					<view class="o_botBtns"  v-if="data.order_status==2" @click="toWarn">提醒发货</view>
					<view class="o_botBtns" v-if="data.order_status==3" @click="toConfirm(data.id)">确认收货</view>
				</view>
			</view>
			
		
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:"",
			};
		},
		onLoad(option){
			let id = option.id
			console.log("id",id)
			this.$tips.loading()
			this.$http.post("app/mall/goods/order/getMallGoodsOrderInfo",{
				id:id,
			})
			.then(res=>{
				this.$tips.loaded()
				this.data = res.data
				console.log("获取数据",res)
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(rej.data.message||"网络异常")
				console.log("失败",rej)
			})
		},
		methods:{
			//重新支付
			rePay(id,real_price){
				let order_nos = [id]
				console.log("order",order_nos)
				let open_id = uni.getStorageSync("open_id")
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
			//物流
			toTrans(id){
				uni.navigateTo({
					url:"../transport/transport?id="+id
				})
			},
			//取消订单
			toCancel(id){
				this.$tips.loading()
				this.$http.post("app/mall/goods/order/cancelOrderByUser",{
					order_info_id:id,
				})
				.then(res=>{
					this.$tips.loaded()
					this.$tips.toast("取消成功",function(){
						uni.$emit('refresh')
						uni.navigateBack({
							delta:1
						})
					},"success")
					console.log("取消结果",res)
				})
				.catch(rej=>{
					this.$tips.loaded()
					this.$tips.toast(rej.data.message||"网络异常")
					console.log("失败",rej)
				})
			},
			//删除
			toDel(id){
				this.$tips.confirm("确定删除此订单吗")
				.then(res=>{
					console.log("去人",this)
					this.$tips.loading()
					this.$http.post("app/mall/goods/order/delByUser",{
						order_info_id:id,
					})
					.then(res=>{
						this.$tips.loaded()
						this.$tips.toast("删除成功",function(){
							uni.$emit('refresh')
							uni.navigateBack({
								delta:1
							})
						},"success")
						console.log("删除结果",res)
					})
					.catch(rej=>{
						this.$tips.loaded()
						this.$tips.toast(rej.data.message||"网络异常")
						console.log("失败",rej)
					})
				})
				.catch(res=>{
					console.log("取消",res)
				})
			},
			//确认收货
			toConfirm(id){
				this.$tips.confirm("确定已经收到货了吗")
				.then(res=>{
					this.$tips.loading()
					this.$http.get("app/orderLogistics/confirmReceipt?order_info_id="+id)
					.then(res=>{
						this.$tips.loaded()
						this.$tips.toast("操作成功",function(){
							uni.$emit('refresh')
							uni.navigateBack({
								delta:1
							})
						},"success")
						console.log("确认结果",res)
					})
					.catch(rej=>{
						this.$tips.loaded()
						this.$tips.toast(rej.data.message||"网络异常")
						console.log("失败",rej)
					})
				})
				.catch(res=>{
					console.log("取消",res)
				})
				
			},
			//去商品详情
			toGoods(id){
				console.log("id",id)
				uni.navigateTo({
					url:"/pages/goods/goods?id="+id
				})
			},
			//去商店
			toShop(id){
				uni.navigateTo({
					url: '/pages/shop/shop?id='+id,
				});
			},
			//剪贴
			clipHand(e){
				console.log("ee",e)
				uni.setClipboardData({
				    data: e,
				    success: function () {
				        console.log('success');
				    }
				});
			},
			//提醒
			toWarn(){
				let that = this
				this.$tips.loading()
				setTimeout(function(){
					that.$tips.loaded()
					that.$tips.toast("已提醒商家发货",'',"success")
				},1000)
			},
		}
	}
</script>

<style lang="scss">
.ord_top{
	width: 100%;
	padding: 32rpx ;
	background:rgba(230,230,230,1);
	box-shadow:0px 1rpx 0px 0px rgba(203,203,203,1);
	.ord_topTit{
		font-size: 30rpx;
	}
	.ord_topCon{
		color: #666;
		margin-top: 20rpx;
	}
}
.ord_bot{
	padding: 20rpx 32rpx;
	
	.ad_box{
		width: 100%;
		padding:30rpx 20rpx 20rpx 30rpx;
		font-size: 32rpx;
		margin-bottom: 20rpx;
		background: #fff;
		box-shadow:0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
		border-radius:20rpx;
		
		.ad_boxL_top{
			align-items: center;
			margin-bottom: 25rpx;
			.ad_boxL_topName{
				margin-right: 50rpx;
			}
		}
		.ad_boxL_bot{
			font-size: 24rpx;
		}
	}
	
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
	
			.o_botTop_status2 {
				color: #F22B2B
			}
		}
		
		.o_botMin{
			width: 100%;
			align-items: center;
			border-top: 1rpx solid #E6E6E6;
			padding: 10rpx 0;
			.o_botMin_img{
				width: 150rpx;
				height: 150rpx;
				margin-right:20rpx ;
			}
			.o_botMinR{
				flex:1;
				.o_botMinR_name{
					width: 100%;
					overflow:hidden; 
					text-overflow:ellipsis;
					display:-webkit-box; 
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2;
					// margin-bottom: 30rpx;
				}
				.car_itemCont_rightBox_sku{
					display: inline-block;
					background: #F7F8FA;
					border-radius: 8rpx;
					padding:6rpx 16rpx;
					font-size: 18rpx;
					margin: 8rpx 0;
				}
				
				.o_botMinR_bot{
					align-items: center;
				}
			}
		}
	}
	
	.ord_other{
		width: 100%;
		padding: 10rpx 20rpx 20rpx;
		background: rgba(254, 254, 254, 1);
		box-shadow: 0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		font-size: 28rpx;
		
		.ord_other_item{
			width: 100%;
			border-bottom: 1rpx solid #E6E6E6;
			padding: 20rpx 0;
			align-items: center;
			
			.ord_other_itemLab{
				width: 170rpx;
				color: #666;
			}
			.ord_other_itemCor{				color: #F22B2B;			}
			.ord_other_itemCon{
				flex:1;
				align-items: center;
				.ord_other_itemClip{
					font-size: 24rpx;
				}
			}
		}
		.ord_other_itemCor{
			color: #F22B2B;
		}
		
		.o_botBtn{
			width: 100%;
			align-items: center;
			justify-content:flex-end;
			margin-top: 20rpx;
			.o_botBtns{
				border: 1rpx solid #666666;
				color:#666666;
				min-width: 120rpx;
				text-align: center;
				padding: 10rpx;
				border-radius: 16rpx;
				margin-left:20rpx;
			}
			.o_botBtn_zf{
				border: 1rpx solid #F22B2B;
				color:#F22B2B;
			}
		}
	}
}
</style>
