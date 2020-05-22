<template>
	<view class="guide">
		<view class="g_arr">
			<image src="../../../static/image/public/toTop.png" mode=""></image>
		</view>
		<view class="g_cont">点击右上角菜单</view>
		<view class="g_cont">“在浏览器打开”或在“Safari中打开”</view>
		<view class="g_cont">来完成支付</view>
		<view class="g_cont2">如已支付，请点击左上关闭页面</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onLoad(opt){
			let link = opt.link
			let u = window.navigator.userAgent
			console.log("window",window.navigator.userAgent,opt)
			 if (u.match(/MicroMessenger/i) != "MicroMessenger") {
			    //在微信中打开
				window.location.href = link
			}
		}
	}
</script>

<style lang="scss">
page{
	background: #606266;
	.guide{
		width: 100%;
		padding-top: 100rpx;
		font-size: 32rpx;
		color: #fff;
		.g_arr{
			width: 140rpx;
			height: 140rpx;
			margin-right: 40rpx;
			float: right;
		}
		.g_cont{
			padding-right: 60rpx;
			text-align: end;
			float: right;
			width: 100%;
			margin-top: 5rpx;
			font-weight: bold;
		}
		.g_cont2{
			text-align: center;
			float: left;
			width: 100%;
			margin-top: 200rpx;
		}
	}
}

</style>
