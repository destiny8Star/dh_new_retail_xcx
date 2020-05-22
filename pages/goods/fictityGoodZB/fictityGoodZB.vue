<template>
	<view class="gd_zb">
		<view class="gd_zbIcon">
			<icon type="warn" size="120rpx" />
		</view>
		<view class="gd_zbTit">
			该课程含有直播课程，需与客服联系获取
			直播地址观看学习
		</view>
		<view class="gd_qr">
			<image :src="goods_content_resp.service_wxqrcode" mode=""></image>
		</view>
		<view class="gd_qrTit">
			扫描二维码添加客服微信
		</view>
		<view class="gd_bot">
			<text style="color:#969799">客服微信： </text> {{goods_content_resp.service_wx}}
		</view>
		<view class="gd_bot">
			<text style="color:#969799">客服电话： </text> {{goods_content_resp.service_tel}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods_content_resp:{},//详情信息
			};
		},
		methods:{
			// 获取商品详情
			getDetail(id){
				this.$tips.loading()
				let postData = {
					"goods_id": "1259772087099330561"
				}
				this.$http.post("app/goods/public/getGoodsFictityInfo",postData)
				.then(res=>{
					console.log("获取商品详情",res)
					this.$tips.loaded()
					let info = res.data;
					this.goods_content_resp = info.virtual_goods_content_resp
				})
				.catch(rej=>{
					this.$tips.loaded()
					console.log("获取商品详情",rej)
					this.$tips.toast(rej.data.message)
				})
			},
		},
		onLoad(opt){
			let id = opt.id
			this.getDetail(id)
		},
		
	}
</script>

<style lang="scss">
page{
	background: #fff;
	.gd_zb{
		padding-top: 60rpx;
		.gd_zbIcon{
			width: 120rpx;
			height: 120rpx;
			margin: 0 auto;
		}
		.gd_zbTit{
			font-size: 32rpx;
			width: 570rpx;
			margin: 32rpx auto 96rpx;
			text-align: center;
		}
		.gd_qr{
			width: 240rpx;
			height: 240rpx;
			margin: 0 auto;
		}
		.gd_qrTit{
			font-size: 28rpx;
			text-align: center;
			margin: 32rpx 0 48rpx;
			font-weight: bold;
		}
		.gd_bot{
			text-align: center;
			margin-bottom: 16rpx;
			font-size: 28rpx;
		}
	}
}

</style>
