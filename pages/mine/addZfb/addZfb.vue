<template>
	<view class="addrAdd">
		<view class="zfb_top">
			绑定支付宝账户用于提现打款，请仔细核对您的帐号信息，以确
			保账户正确！
		</view>
		<view class="zfb_bot">
			<view class="add_box">
				<view class="add_boxItem flex_be">
					<view class="add_boxItem_lab">真实姓名</view>
					<input type="text"  placeholder="请填写姓名" v-model="name" />
				</view>
				<view class="add_boxItem flex_be">
					<view class="add_boxItem_lab">支付宝账号</view>
					<input type="text"  placeholder="请填写支付宝账号" v-model="account"/>
				</view>
			</view>
			<button class="add_btn add_btnC" @click="toSave">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:"",//姓名
				account:"",//账号
			};
		},
		methods: {
			//保存
			toSave(){
				if(!this.name)return this.$tips.toast("请填写姓名")
				if(!this.account)return this.$tips.toast("请填写支付宝账号")
				this.$tips.loading()
				this.$http.post("app/terminal/user/my/ali/pay/account",{
					alipay_account:this.account,
					real_name:this.name
				})
				.then(res=>{
					this.$tips.loaded()
					console.log("结果",res)
					this.$tips.toast("保存成功",function(){
						uni.navigateBack({
							delta:1
						})
					},"success")
				})
				.catch(rej=>{
					this.$tips.loaded()
					console.log("失败",rej)
					this.$tips.toast(rej.data.message||"网络异常")
				})
			}
		},
		onLoad(option){
			this.$tips.loading()
			this.$http.post("app/terminal/user/my/money")
			.then(res=>{
				this.$tips.loaded()
				// this.account = res.data.alipay_account
				this.name = res.data.real_name
				console.log("获取金额",res)
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(rej.data.message||"网络异常")
				console.log("失败",rej)
			})
		},
		onShow() {

		}
	}
</script>

<style lang="scss">
	.addrAdd {
		.zfb_top{
			width: 100%;
			padding: 15rpx 32rpx;
			background: #CBCBCB;
			font-size: 24rpx;
			color: #FF0000;
		}
		.zfb_bot{
			padding: 20rpx 32rpx;
		}
		.add_box {
			width: 100%;
			background: #fff;
			box-shadow: 0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
			border-radius: 20rpx;
			padding: 10rpx 19rpx 20rpx;
			font-size: 28rpx;

			.add_boxItem {
				width: 100%;
				border-bottom: 1rpx solid #E6E6E6;
				padding: 20rpx 0;
				align-items: center;

				.add_boxItem_lab {
					min-width: 170rpx;
					color: #666666;
				}

				input {
					flex: 1;
					font-size: 28rpx;
				}
              
				.reginBtn {
					flex: 1;
					font-size: 28rpx;
					color: #888;
				}
			}
		}

		.add_btn {
			width:100%;
			height:80rpx;
			border-radius:20rpx;
			margin-top: 40rpx;
			background-color: #F22B2B;
			font-size: 24rpx;
			color: #fff;
			box-shadow:0rpx 0rpx 5rpx 0rpx rgba(0, 0, 0, 0.1);
			margin: 30rpx auto;
			text-align: center;
			line-height: 80rpx;
		}

		.add_btnC {
			background: rgba(242, 43, 43, 1);
		}
	}

</style>
