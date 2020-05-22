<template>
	<view>
		<view class="content">
			<goodsList :list="list" :loading="loading" @click="choose"></goodsList>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				coupon_id: '',
				list: [], // 列表
				loading: true,
			};
		},
		onLoad(option) {
			console.log(option)
		    this.coupon_id = option.id
			this.getDataList();
			
		}, 
		methods:{
			getDataList(){
				//请求数据
				this.$http.get("app/coupon/useCouponListByGoodsSpuId?coupon_id="+this.coupon_id)
				.then(res=>{
					console.log("获取列表数据",res)
					this.list = res.data;
					this.loading = false;
				})
				.catch(rej=>{
					console.log("获取列表数据",rej)
					this.$tips.toast(rej.data.message)
				})
			},
		}
	}
</script>

<style lang="scss">
.content {
	padding: 32rpx;
}
</style>
