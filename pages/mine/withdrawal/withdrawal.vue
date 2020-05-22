<template>
	<view class="wd">
		<view class="w_tbox">
			<view class="w_tboxI  flex_be">
				<view class="w_tboxY">￥</view>
				<input type="digit" :placeholder=allmonP placeholder-style="font-size:30rpx" v-model="txMon">
				<view class="w_tboxAll" @click="showAll">全部提现</view>
			</view>
		</view>
		<!-- //提现说明 -->
		<view class="w_txTip">
			<view>提现说明：<br/>
			<text>
				{{info}}
			</text>
		    </view>
		</view>
		<!-- //中间按钮 -->
		<button type="default" :class='["a_tx",txMon!=""&&txMon>0?"":"a_not"]'  @click="tx"  :disabled="txMon==''||txMon<=0">提现</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allmonP:"最多可提现0元",
				info:"",//提现说明
				txMon:"",
				mon:"",//全部提现用
			}
		},
		methods: {
			tx(){
				console.log("aa")
				// if(this.txMon>this.mon){
				// 	// this.$tips.toast("")
				// }
				
				this.$tips.loading()
				this.$http.post("app/terminal/user/my/withdrawal",{
					amount:this.txMon
				})
				.then(res=>{
					this.$tips.loaded()
					this.$tips.toast("提现成功",function(){
						uni.navigateBack({
							delta:1
						})
					})
					console.log("提现结果",res)
				})
				.catch(rej=>{
					this.$tips.loaded()
					this.$tips.toast(rej.data.message||"网络异常")
					console.log("失败",rej)
				})
				
			},
			//点击全部提现
			showAll(){
				this.txMon = this.mon
			}
		},
		onLoad(option){
			let mon = option.mon
			this.mon = option.mon
			this.allmonP = "最多可提现"+(mon||"0")+"元"
			this.$tips.loading()
			this.$http.get("app/terminal/user/my/withdrawal/rule")
			.then(res=>{
				this.$tips.loaded()
				this.info = res.data
			})
			.catch(rej=>{
				this.$tips.loaded()
				this.$tips.toast(rej.data.message||"网络异常")
				console.log("失败",rej)
			})
		}
	}
</script>

<style lang="scss">
.wd{
	width: 100%;
	padding:20rpx 32rpx;
	.w_tbox{
		width:100%;
		padding:30rpx 19rpx;
		background:#fff;
		box-shadow:0px 0px 5rpx 0px rgba(0, 0, 0, 0.1);
		border-radius:20rpx;
		margin-bottom: 35rpx;
		.w_tboxI{
			align-items: center;
			width: 100%;
			border-bottom: 1rpx solid #E6E6E6;
			padding:15rpx 0;
			.w_tboxAll{
				font-size: 24rpx;
				color:#108EE9;
			}
			.w_tboxY{
				font-size: 36rpx;
				font-weight: bold;
			}
			input{
				flex:1;
				font-size: 48rpx;
				padding:0 30rpx;
			}
			
		}
	}
	.w_txTip{
		width: 100%;
		padding:20rpx 40rpx 40rpx 18rpx;
		font-size: 20rpx;
		color: #666;
		line-height:40rpx;
	}
	.a_tx{
		width: 100%;
		height: 80rpx;
		background-color: #F22B2B;
		font-size: 24rpx;
		color: #fff;
		border-radius:16rpx;
		line-height: 80rpx;
	}
	.a_not{
		background-color: #999999;
	}
}
</style>
