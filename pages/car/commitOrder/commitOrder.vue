<template>
	<view style="padding-bottom: 120rpx;">
		<view class="co_topBox" v-if="!has_virtual">
			<view class="co_top flex" @click="toAdd(infos.address_info&&infos.address_info.id)">
				<view class="co_topL" v-if="infos.address_info">
					<view class="co_topL_top">
						{{infos.address_info.name}} &nbsp;{{infos.address_info.phone}}
					</view>
					<view class="co_topL_bot">{{infos.address_info.province_code_desc}}
						{{infos.address_info.city_code_desc}} {{infos.address_info.area_code_desc}}
						{{infos.address_info.address}}
					</view>
				</view>
				<view class="co_topL2 flex" v-else>
					<view class="co_topL2_add">+</view>
					添加收货地址
				</view>
				<view class="co_topR">></view>
			</view>
			<view class="con_line"></view>
		</view>
		<!-- 内容 -->
		<view class="co_goods" v-for="(item,ind) in infos.order_payment_infos" :key="ind">
			<view class="co_goTit flex">
				<view class="co_goTit_logo"><image :src="item.shop_info_logo" mode=""></image></view>
				{{item.shop_info_name}}
			</view>
			<view class="co_goGood">
				<!-- //商品 -->
				<view class="co_goGood_Item flex" v-for="(itemG,indG) in item.payment_goods_infos" :key="indG">
					<view class="co_goGood_ItemL"><image :src="itemG.goods_sku_pic" mode=""></image></view>
					<view class="co_goGood_ItemR">
						<view class="co_goGood_ItemRtit">{{itemG.goods_spu_name}}</view>
						<view class="co_goGood_ItemRsku">{{itemG.goods_sku||"默认规格"}}</view>
						<view class="co_goGood_ItemRnum flex_be">
							<view style="color: #F22B2B;">￥{{itemG.sku_price}}</view>
							<view>x{{itemG.goods_count}}</view>
						</view>
					</view>
				</view>
				<!-- //下面各项 -->
				<view class="co_goType_Item flex_be co_goType_Item1" @click="selCou(item.order_confirm_coupon_resps,ind)">
					<view class="co_goType_ItemL">优惠券</view>
					<view class="co_goType_ItemR">
						<text>-¥{{item.discount_price}}</text>
					   <text style="color: #969799;font-weight: boldr;font-size: 36rpx;margin-left: 10rpx;">></text>
					</view>
				</view>
				<view class="co_goType_Item flex_be">
					<view class="co_goType_ItemL">运费</view>
					<view class="co_goType_ItemL" v-if="item.send_price==0">免运费</view>
					<view class="co_goType_ItemL" style="color:#F22B2B" v-if="item.send_price!=0">￥{{item.send_price}}</view>
				</view>
				<view class="co_goType_Item flex_be">
					<view class="co_goType_ItemL">留言</view>
					<view class="co_goType_ItemLInp"><input type="text" v-model="buyer_messages[item.shop_info_id]" @blur="blurMessage" placeholder="请输入留言" maxlength="20"/></view>
				</view>
				<view class="co_goType_Item flex_be co_goType_Item2">
					<view class="co_goType_ItemL">合计</view>
					<view class="co_goType_ItemR">￥{{item.real_price}}</view>
				</view>
			</view>
		</view>
		
		<!-- 底部结算 -->
		<view class="co_bot flex">
			<view class="co_bot_tit">总计：</view>
			<view class="co_bot_mon">￥{{infos.bill_info&&infos.bill_info.real_price}}</view>
			<view class="co_bot_btn" @click="toCommit">提交订单</view>
		</view>
		<!-- 优惠券 -->
		<view class="orgMask" v-show="visible" @click="visible=false">
		    <view class="orgBox"  @click.stop="">
				<scroll-view class="seBotbox" scroll-y='true'>
					<block v-for="(itemC,indC) in coupons" :key="indC">
						<view class="c_botBox flex" @click="choseCou(indC)">
							<view class="c_botBoxL">
								<view class="c_botBoxL_mon" v-if="itemC.coupon_type == 1">
									<text style="font-size: 30rpx;">￥</text>{{itemC.coupon_amount}}
								</view>
								<view class="c_botBoxL_mon" v-if="itemC.coupon_type == 2">
									{{itemC.coupon_discount*10}}<text style="font-size: 30rpx;">折</text>
								</view>
								<view class="c_btBoxL_name">满{{itemC.order_amount}}可用</view>
							</view>
							<view class="c_botBoxR flex_be">
								<view class="c_botBoxR_left">
									<view class="">{{itemC.coupon_name}}</view>
									<view class="c_botBoxR_tip">{{itemC.coupon_scope_desc}}</view>
									<view class="c_botBoxR_botTime">{{itemC.coupon_use_start_time}} ~ {{itemC.coupon_use_end_time}}</view>
								</view>
								<view class="c_botBoxR_right" v-show="!itemC.is_select"></view>
								<icon type="success" size="16" color="#F22B2B" v-show="itemC.is_select" />
							</view>
						</view>
					</block>
				    <view style="text-align: center;">
				    	没有更多了~
				    </view>
				</scroll-view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import md5 from "@/utils/md5.js"
	export default {
		data() {
			return {
				phoneType:"android",//手机类型，，默认android
				has_virtual:true,//是否是虚拟商品
				infos:{},//所有订单信息
				visible:false,
				coupons:[],//卡券数组,渲染用
				selCoupons:"",//选择哪个店铺的优惠券
				carGoods:[],//从前一个页面获取的商品列表
				arrCoup:[],//选中的卡券数组,后台用
				address_id:{},//选中的地址id
				buyer_messages:{},//买家留言
			};
		},
		methods:{
			//订单结算校验 计算订单金额
			computOrd(goods,addId={},arrC=[],buyer_messages={}){
				this.$tips.loading()
				this.$http.post("app/mall/goods/order/orderConfirm",{
					payment_goods_infos:goods,
					address_info:addId,
					user_coupon_ids:arrC,
					buyer_messages:buyer_messages
				})
				.then(res=>{
					console.log("订单信息",res,this.address_id,this.buyer_messages)
					this.$tips.loaded()
					this.infos = res.data
					this.has_virtual = res.data.order_check.has_virtual
					this.address_id = res.data.address_info&&res.data.address_info.id
					//当有失效商品时,弹框提示并返回
					if(res.data.unavailable_goods){
					    this.$tips.modal("有商品已失效，请确认")
						.then(res=>{
							uni.navigateBack({
								delta:1
							})
						})
					}
					// if(res.data.order_payment_infos){
					// 	res.data.order_payment_infos.forEach(item=>{
					// 		//注意在这里把留言都清空了，所以获取地址，选择卡券都要从缓存中获取留言
					// 		this.buyer_messages[item.shop_info_id]=""
					// 	})
					// }
					
				})
				.catch(rej=>{
					console.log("失败",rej)
					this.$tips.loaded()
					this.$tips.toast(rej.data.msg||rej.data.message||"网络异常")
				})
			},
			//提交订单
			toCommit(){
				console.log("this.buyer_messages",this.buyer_messages)
				if(!this.infos.order_check.has_address){
					return this.$tips.toast("请先添加收货地址")
					console.log("添加收货地址")
				}
				if(this.infos.order_check.can_submit){
					let money = this.infos.bill_info.real_price
					let buyer_messages = uni.getStorageSync( 'buyer_messages')||{}
					console.log("money1",money,buyer_messages)
					this.$tips.loading()
					let open_id = uni.getStorageSync("open_id")
					this.$http.post("app/mall/goods/order/orderSubmit",{
						payment_goods_infos:this.carGoods,
						address_info:{id:this.address_id},
						user_coupon_ids:this.arrCoup,
						pay_method:1,
						buyer_messages:buyer_messages,
						openid:open_id
					})
					.then(res=>{
						console.log("提交订单信息",res)
						this.$tips.loaded()
						if(res.data.create_order_resp && res.data.create_order_resp.code == "SUCCESS"){//预下单成功
						    let datas = res.data.create_order_resp
							let order_nos = res.data.order_nos
							uni.setStorageSync("order_nos",order_nos)
						   
						   //如果是虚拟商品，并且是ios手机,就跳公众号支付
						   if(this.has_virtual&&this.phoneType=="ios"){//&&this.phoneType=="ios"
							   let  order_info_ids = res.data.order_nos
							   console.log("跳转")
							   uni.redirectTo({
									url:"/pages/car/commitOrder/commitOrderSel/commitOrderSel?order_info_ids="+order_info_ids
								})
							    return 		
						   }else{
							 return  this.$cObj.payMent(datas.time_stamp,datas.nonce_str,datas.wx_package,datas.pay_sign)
						   }
						}else{
						   return Promise.reject(res)
						   // this.$tips.toast(res.data.create_order_resp.msg)
						}
					})
					.then(res=>{
						console.log("支付结果",res,money)
						if(res){
							uni.reLaunch({
								url:"/pages/car/payRes/payRes?money="+money+"&&status=success"
							})
						}
					
					})
					.catch(rej=>{
						console.log("支付结果失败",rej,money)
						this.$tips.loaded()
						if(rej.data){
							this.$tips.toast(rej.data.message||"下单失败")
						}else{
							uni.reLaunch({
								url:"/pages/car/payRes/payRes?money="+money+"&&status=info"
							})
						}
						console.log("失败",rej)
					})
				}
			},
			//去地址
			toAdd(id){
				console.log("id",id)
				uni.navigateTo({
					url:"../selAdd/selAdd?id="+id
				})
			},
			//留言失去焦点
			blurMessage(id,ind){
				console.log("id",this.buyer_messages)
				uni.setStorageSync( 'buyer_messages',this.buyer_messages);
			},
			//卡券列表
			selCou(arr,ind){
				this.visible = true
				this.coupons = arr
				this.selCoupons = ind
				console.log("卡券数组",arr,)
			},
			//选择卡券
			choseCou(ind){
				let is_select = this.coupons[ind].is_select
				if(is_select){ //点击的是true，就给这个取反，也就是取消选择
					this.coupons[ind].is_select = !is_select
				}else{//点击的是false，，也就是选择当前，将其他都取消
					this.coupons.forEach(item=>{
						item.is_select = false
					})
					this.coupons[ind].is_select = true
				}
				this.infos.order_payment_infos[this.selCoupons].order_confirm_coupon_resps = this.coupons
				let arr = this.filterCou()
				this.arrCoup = arr
				let buyer_messages = uni.getStorageSync( 'buyer_messages')||{}
				uni.setStorageSync( 'arrCoup',arr);
				this.computOrd(this.carGoods,{id:this.address_id},arr,buyer_messages)
				console.log("this.infos.order_payment_infos[this.ind]",this.infos,arr)
				console.log("id",this.buyer_messages,buyer_messages)
			},
			//筛选出选择的卡券，将其放进数组
			filterCou(){
				let arr = []
				this.infos.order_payment_infos.forEach(item=>{
					item.order_confirm_coupon_resps.forEach(itemC=>{
						if(itemC.is_select){
							arr.push(itemC.id)
						}
					})
				})
				return arr
			}
		},
		onLoad(){
			this.phoneType=uni.getSystemInfoSync().platform
			console.log("phoneType",this.phoneType)
			let that = this
			uni.$on('address',function(data){
				this.address_id = data.address_id
				let arrCoup = uni.getStorageSync( 'arrCoup')||[];
				let buyer_messages = uni.getStorageSync( 'buyer_messages')||{};
				console.log('address',data.address_id,arrCoup,buyer_messages);
				that.computOrd(carGoods,{id:data.address_id},arrCoup,buyer_messages)
			})
				// let md5str = md5("a")
				// let str = this.$cObj.getString()
				// console.log("生成随机字符串",md5str)
			let carGoods = uni.getStorageSync( 'carGoods');
			this.carGoods = carGoods
			console.log("goods",carGoods)
			this.computOrd(carGoods)
		},
		onUnload() {  
		    // 移除监听事件  
		    uni.$off('address');  
			//页面卸载清除卡券，留言缓存
			uni.removeStorageSync( 'arrCoup');
			uni.removeStorageSync( 'buyer_messages');
		},
	}
</script>

<style lang="scss">
.co_topBox{
		background: #fff;
		.co_top{
			width: 100%;
			padding: 16rpx 50rpx 16rpx 32rpx;
			background: #fff;
			align-items: center;
			font-size: 24rpx;
			.co_topL{
				flex:1;
				.co_topL_top{
					font-weight: bold;
					font-size: 28rpx;
					margin-bottom: 12rpx;
				}
			}
			.co_topL2{
				flex:1;
				text-align: center;
				font-weight: bold;
				justify-content: center;
				.co_topL2_add{
					width: 32rpx;
					height: 32rpx;
					background: #F22B2B;
					color: #fff;
					border-radius: 4rpx;
					margin-right: 20rpx;
					text-align: center;
					line-height: 32rpx;
				}
			}
			
			.co_topR{
				font-size: 42rpx;
				color: #969799;
				font-weight: bolder;
			}
		}
		
		.con_line{
			width: 100%;
			height: 8rpx;
			background-image:url(../../../static/image/car/c_line.png) ;
			background-size: cover;
		}
	}

.co_goods{
	width: 100%;
	background: #fff;
	margin-top: 32rpx;
	.co_goTit{
		padding:8rpx 0 ;
		font-size: 24rpx;
		font-weight: bold;
		align-items: center;
		border-bottom: 2rpx solid #D8D8D8;
		.co_goTit_logo{
			width: 48rpx;
			height: 48rpx;
			margin: 0 16rpx 0 32rpx;
		}
	}
	.co_goGood{
		padding-left:32rpx ;
		.co_goGood_Item{
			border-bottom: 1rpx solid #D8D8D8;
			padding: 32rpx 32rpx 32rpx 0 ;
			.co_goGood_ItemL{
				width: 128rpx;
				height: 128rpx;
				margin-right: 32rpx;
			}
			.co_goGood_ItemR{
				flex: 1;
				.co_goGood_ItemRtit{
					width: 100%;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					font-weight: bold;
				}
				.co_goGood_ItemRsku{
					display: inline-block;
					background: #F7F8FA;
					border-radius: 8rpx;
					padding:6rpx 16rpx;
					font-size: 18rpx;
					margin: 8rpx 0;
				}
			}
		}
		.co_goType_Item{
			align-items: center;
			font-size: 28rpx;
			padding: 22rpx 32rpx 22rpx 0 ;
			border-bottom: 1rpx solid #D8D8D8;
			.co_goType_ItemLInp{
				flex: 1;
				input{
					padding-left: 40rpx;
				}
			}
			.co_goType_ItemR{
				color: #F22B2B;
			}
		}
		.co_goType_Item1{
			padding-top: 40rpx;
		}
		.co_goType_Item2{
			border-bottom: none;
		}
	}
}
.co_bot{
	width: 100%;
	height: 88rpx;
	align-items: center;
	justify-content: flex-end;
	padding:0 32rpx;
	font-size: 28rpx;
	background: #fff;
	position: fixed;
	bottom: 0;
	left: 0;
	.co_bot_tit{
		font-weight: bold;
	}
	.co_bot_mon{
		font-weight: bold;
		color: #F22B2B;
	}
	.co_bot_btn{
		padding: 14rpx 32rpx;
		background: #F22B2B;
		color: #fff;
		border-radius: 16rpx;
		margin-left: 16rpx;
	}
	
}

.orgMask {
		width: 100%;
		position: fixed;
		height: 100vh;
		background: rgba(0, 0, 0, .3);
		left: 0;
		bottom: 0;
		animation: showM 0.5s;
		z-index: 9;
		.orgBox {
			width: 100%;
			height: 45vh;
			position: absolute;
			bottom: 0;
			left: 0;
			background: #F7F8FA;
			font-size: 28rpx;
			color: #3E3E4D;
			padding: 30rpx ;
			.seBotbox{
				height: 100%;
			}
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
		}
	}
	@keyframes showM{
		from{
			bottom: -100vh;
		}
		to{
			bottom: 0;
		}
	}

</style>
