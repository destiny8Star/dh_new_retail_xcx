<template>
	<view class="goods">
		<!-- 商品图banner start -->
		<view>
			<view class="banner_box">
				<swiper class="swiper" circular autoplay :interval="interval" :duration="duration" >
					<swiper-item v-for="(ele,i) in bannerList" :key="i">
						<view class="swiper-item">
							<image :src="ele" mode=""></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 商品图banner end -->
		
		<!-- 商品价格、标题等内容 start -->
		<view class="basicContent">
			<!-- 价格 -->
			<view class="price_box">
				<view class="price ly-flex-baseline">
					<text>￥</text>
					<text class="sellPrice">{{price}}</text>
					<text class="oldPrice">{{oldPrice}}</text>
				</view>
			</view>
			<!-- 标题 -->
			<view class="title_box">
				<view class="title">
					<text class="tag" :style="{'background': ele.tag_color}" v-for="(ele,i) in tagText" :key="i" v-if="tagText">{{ele.tag_name}}</text>
					<text>{{title}}</text>
				</view>
				<!-- <view class="synopsis">{{synopsis}}</view> -->
			</view>
		</view>
		<!-- 商品价格、标题等内容 end -->
		
		<!-- 课程tab  start-->
		<view class="shop_tabs">课程介绍</view>
		<!-- 课程tab end -->
		
	    <!-- 课程介绍start -->
		<view class="classDetail">
			<view class="cd_tit">
				{{name}}
			</view>
			<!-- 课程亮点 -->
			<view class="cd_dd">
				<view class="cd_ddTop">
					{{title}}
				</view>
				<view class="cd_ddTit">课程亮点</view>
				<view class="cd_ddCont" v-for="(item,ind) in goods_content_resp.course_highlights" :key="ind">
					<view class="cd_ddCont_tit flex">
						<view style="width: 12rpx;height: 12rpx;background: #F22B2B;border-radius: 50%;margin-right: 15rpx;"></view>
						{{item.course_highlight_title}}
					</view>
					<view class="cd_ddCont_bot">
						{{item.course_highlight_description}}
					</view>
				</view>
			</view>
			<!-- 讲师介绍 -->
			<view class="cd_teacher">
				<view class="cd_ddTit">讲师介绍</view>
				<view class="cd_tInfo flex_be">
					<view class="cd_tInfo_tit">
						<view class="cd_tInfo_titT">{{goods_content_resp.teacher_name}}</view>
						<view class="cd_tInfo_titC">{{goods_content_resp.teacher_details}}</view>
					</view>
					<view class="cd_tInfo_img">
						<image :src="goods_content_resp.teacher_icon" mode=""></image>
					</view>
				</view>
				<view class="cd_tInfo2" >
						<view class="cd_tInfo_titT">个人成绩</view>
						<view class="cd_tInfo_titC">{{goods_content_resp.teacher_achievement}}
						</view>
				</view>
				<view class="cd_tInfo2" >
						<view class="cd_tInfo_titT">执教理念</view>
						<view class="cd_tInfo_titC">{{goods_content_resp.teaching_idea}}
						</view>
				</view>
			</view>
			<!-- 目标 -->
			<view class="cd_stu">
				<view class="cd_ddTit">目标学员</view>
				<view class="cd_stuCon">{{goods_content_resp.target_trainees}}</view>
			</view>
			<!-- 授课形式 -->
			<view class="cd_type">
				<view class="cd_ddTit">授课形式</view>
				<view class="cd_tyC1">{{goods_content_resp.teaching_form}}</view>
				<view class="cd_ddTit">联系客服</view>
				<view class="cd_tyImg">
					<image :src="goods_content_resp.service_wxqrcode" mode=""></image>
				</view>
				<view class="cd_tyC2">扫描二维码添加客服微信</view>
				<view class="cd_tyC2">客服微信：<span style="font-weight: bold;">{{goods_content_resp.service_wx}}</span></view>
				<view class="cd_tyC2">联系电话：<span style="font-weight: bold;">{{goods_content_resp.service_tel}}</span></view>
			</view>
		</view>
	    <!-- 课程介绍end -->
		
		<!-- 购物车立即购买等 start -->
		<view class="fixed-box">
			<view class="nav_box">
				<view class="item" @click="goBuy()">立即购买</view>
			</view>
		</view>
		
		<!-- 购物车立即购买等 end -->
		
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				authToken:null,
				shareUserId: 0,//分享人id
				mineInfo:{},//个人信息
				mineName: '游客',//画布昵称
				drawHeadImg: '../../../static/image/mine/m_head.png',//画布头像
				qrImg:"../../../static/image/mine/m_head.png",//base64图片，从后台获取二维码
				
				postData: {},//支付接口所需参数对象
				goodsId: '',//商品id
				interval: 3000,//自动切换时间间隔
				duration: 500,//滑动动画时长
				bannerList: [],
				
				price: "",
				oldPrice: "",
				tag: 1,
				tagText: "",
				title:　"",//商品标题
				name:"",//课程name
				count:"0",//全部课程
				is_buy:0,//是否购买：0 否；1：是
				// synopsis:　"商品概要（小标题）",//商品概要（小标题）
				
				goods_content_resp:{},//课程详情
				lessons:[],//课程列表
				
 			}
		},
		methods: {
			// 立即购买
			goBuy(){ 
				let __that = this;
				this.$http.post("app/order/wx/mp/public/pay",__that.postData)
				.then(res=>{
					console.log("支付接口",res)
					this.$tips.loaded()
					if(res.data.code=="SUCCESS"){
						__that.wxPay(res.data);
					}else{
						this.$tips.toast(res.data.msg)
					}
				})
				.catch(rej=>{
					this.$tips.loaded()
					console.log("支付接口",rej);
					this.$tips.toast(rej.data.message)
					
				})
			},
			wxPay(datas){
				this.$tips.loading();
				let that = this
			    //微信支付
			     WeixinJSBridge.invoke(
			        "getBrandWCPayRequest",
			          {
			            appId: datas.app_id, //公众号名称，由商户传入
			            timeStamp: datas.time_stamp+"", //时间戳，自1970年以来的秒数
			            nonceStr:datas.nonce_str, //随机串
			            package: datas.wx_package,
			            signType: datas.sign_type, //微信签名方式：
			            paySign:datas.pay_sign //微信签名
			          },
			          res => {
			            if (res.err_msg == "get_brand_wcpay_request:ok") {
			              	WeixinJSBridge.call('closeWindow');//微信 
			            }else{
							this.$tips.toast('支付失败')
			            }
			          }
			        );
			    },
			// 获取商品详情
			getDetail(){
				this.$tips.loading()
				let postData = {
					"goods_id": this.goodsId
				}
				this.$http.post("app/goods/getGoodsFictityInfo",postData)
				.then(res=>{
					console.log("获取商品详情",res)
					this.$tips.loaded()
					let info = res.data;
					let that = this;
					JSON.parse(info.goods_imgs).forEach((ele,i)=>{
						this.bannerList.push(ele);
					})
					this.price = info.goods_price;
					this.oldPrice = info.goods_marking_price;
					
					this.title = info.goods_title;
					this.name = info.name
					this.count = info.count
					this.tagText = JSON.parse(info.goods_tag);
					// this.synopsis = info.goods_description;
					this.goods_content_resp = info.virtual_goods_content_resp
					this.lessons = info.goods_fictity_spu_catalog_resps
					
				})
				.catch(rej=>{
					this.$tips.loaded()
					console.log("获取商品详情",rej)
					this.$tips.toast(rej.data.message)
				})
			}
		},
		onLoad(option){
			console.log('进入场景带参-----',option);
			// option.model={"coupon_id":"","order_info_ids":["1260469954076086272"],"goods_spu_id":"1259772087099330561","pay_method":"5","openid":"osbAnwX-r4HKtF24qSWleFlA-GLY"}
			// this.getDetail();
			if(option.model){
				this.goodsId = option.model.goods_spu_id;
				this.postData = option.model;
				this.getDetail();
			}
	
		},
		onShow(){
		   
		}
	}
</script>

<style lang="scss">
	.goods{
		padding-bottom: 100rpx;
		border-bottom: 30rpx solid #fff;
	}
	.banner_box {
		.swiper {
			height: 750rpx;
			.swiper-item {
				height: 100%;
			}
		}
	}
	.basicContent {
		padding: 0 32rpx 32rpx;
		background: #fff;
		margin-bottom: 16rpx;
		.price_box {
			height: 104rpx;
			.price {
				font-size: 32rpx;
				color: rgba(242,43,43,1);
				font-weight: 600;
				.sellPrice {
					font-size: 48rpx;
				}
				.oldPrice {
					text-decoration: line-through;
					font-size: 28rpx;
					margin-left: 16rpx;
					font-weight: 400;
					color: rgba(150,151,153,1);
				}
			}
		}
		.title_box {
			.title {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				margin-bottom: 8rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Semibold,PingFang SC;
				font-weight: 600;
				.tag {
					border-radius: 8rpx;
					color: #fff;
					font-weight: 500;
					font-size: 18rpx;
					margin-right: 12rpx;
					padding: 0 6rpx;
					line-height: 36rpx;
				}
			}
			.synopsis {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				color: #969799;
				line-height: 36rpx;
			}
		}
	}
	.shop_tabs{
		background-color: #FFFFFF;
		font-size: 24rpx;
		color:#2D2320;
		margin-bottom: 16rpx;
		font-weight: bold;
		line-height: 88rpx;
		text-align: center;
	}
    .classDetail{
		.cd_tit{
			width: 100%;
			height: 400rpx;
			background-image: url('../../../static/image/goods/f_bg.png');
			background-position: center;
			background-size: cover;
			font-size: 40rpx;
			color: #fff;
			padding: 80rpx 85rpx 0;
			text-align: center;
			font-weight: bold;
		}
		.cd_ddTit{
			margin-bottom: 32rpx;
			text-align: center;
			font-weight: bold;
			font-size: 40rpx;
			color:#F22B2B;
		}
		.cd_dd{
			background: #fff;
			font-size: 24rpx;
			padding: 1rpx 0 16rpx;
			.cd_ddTop{
				width:686rpx;
				padding: 32rpx;
				background:rgba(255,255,255,1);
				box-shadow:0px 16rpx 32rpx 0px rgba(45,35,32,0.16);
				border-radius:16rpx;
				margin: -140rpx auto 48rpx ;
				min-height: 200rpx;
			}
		
			.cd_ddCont{
				margin-bottom: 32rpx;
				.cd_ddCont_tit{
					padding-left: 62rpx;
					align-items: center;
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 16rpx;
				}
				.cd_ddCont_bot{
					padding: 0 64rpx 0 92rpx;
					font-size: 24rpx;
					color:#969799;
				}
			}
		}
		.cd_teacher{
			width: 100%;
			padding: 48rpx 64rpx 16rpx;
			background: #FFF6F3;
			.cd_tInfo{
				width: 100%;
				margin-bottom: 32rpx;
				.cd_tInfo_tit{
					flex:1;
					padding-right: 32rpx;
					.cd_tInfo_titT{
						font-size: 40rpx;
						color: #E54B4B;
						font-weight: bold;
						margin-bottom: 12rpx;
					}
				}
				.cd_tInfo_img{
					width: 220rpx;
					height: 220rpx;
					border-radius: 50%;
					overflow: hidden;
					background: #e2e3e6;
				}
			}
			.cd_tInfo2{
				width: 100%;
				margin-bottom: 32rpx;
				.cd_tInfo_titT{
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 12rpx;
				}
			}
		}
		.cd_stu{
			width: 100%;
			padding: 48rpx 64rpx 16rpx;
			background: #fff;
			.cd_stuCon{
				font-size: 32rpx;
				text-align: center;
				margin-bottom: 32rpx;
			}
		}
		.cd_type{
			width: 100%;
			padding: 48rpx 64rpx 16rpx;
			background: #FFF6F3;
			text-align: center;
			.cd_tyC1{
				font-size: 32rpx;
				margin-bottom: 32rpx;
			}
			.cd_tyImg{
				width: 240rpx;
				height: 240rpx;
				margin: 0 auto 16rpx;
				background:#e2e3e6 ;
			}
			.cd_tyC2{
				font-size: 28rpx;
				margin-bottom: 32rpx;
			}
		}
	}
	.fixed-box {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100vw;
		height: 88rpx;
		z-index: 9;
		background: #fff;
		font-weight:500;
		text-align: center;
		.nav_box {
			.item {
				line-height: 88rpx;
				font-size: 28rpx;
				color: #fff;
				background: #F22B2B;
				border-radius: 0;
			}
		}
	}

</style>
