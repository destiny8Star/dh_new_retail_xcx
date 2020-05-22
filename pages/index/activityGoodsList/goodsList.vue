<template>
	<view>
		<image style="height: 192rpx;" :src="headImg" mode=""></image>
		<view class="content">
			<goodsList :list="list" :loading="loading" @click="choose"></goodsList>
		</view>
	</view>
</template>

<script>
	// 模拟 JSON 数据
	// const data = require('@/common/json/data.json');
	export default {
		data() {
			return {
				specialId: '',
				headImg: '',
				page: 1,
				start: 0,
				end: 0,
				list: [], // 列表
				loading: true,
			};
		},
		onLoad(option) {
			console.log(option)
			if(option.id!= "undefined") {
				this.specialId = option.id;
			}
			// this.getList();
			this.getDataList();
			this.getImg();
		}, 
		onReachBottom() {
			this.page++;
			this.loading = true;
			// this.getList();
			this.getDataList();
		},
		methods:{
			// 模拟加载数据
			getList() {
				if (this.list.length < data.list.length) {
					setTimeout(() => {
						this.end = this.page * 10;
						this.list = this.list.concat(data.list.slice(this.start, this.end));
						this.start = this.end;
						// 延迟 120 毫秒隐藏加载动画，为了跟组件里面的 100 毫秒定位有个平缓过度
						setTimeout(() => {
							this.loading = false;
						}, 120);
					}, 1000)
				} else {
					this.loading = false;
				}
			},
			getDataList(){
				//请求数据
				let postData = {
					"cursor": this.page,
					"goods_special_id": this.specialId,
					"size": 10
				}
				this.$http.post("app/goods/special/public/listItem",postData)
				.then(res=>{
					console.log("获取列表数据",res)
					let resList = res.data.data;
					if (this.list.length < res.data.count) {
						setTimeout(() => {
							this.end = this.page * 10;
							this.list = this.list.concat(resList);
							this.list.slice(this.start, this.end).forEach((ele,i)=>{
								ele.goods_tag = JSON.parse(ele.goods_tag)
							})
							this.start = this.end;
							// 延迟 120 毫秒隐藏加载动画，为了跟组件里面的 100 毫秒定位有个平缓过度
							setTimeout(() => {
								this.loading = false;
							}, 120);
						}, 1000)
					} else {
						this.loading = false;
					}
				})
				.catch(rej=>{
					console.log("获取列表数据",rej)
					this.$tips.toast(rej.data.message)
				})
			},
			getImg(){
				let postData = {
					"id": this.specialId
				}
				this.$http.post("app/goods/special/public/getSpecial",postData)
				.then(res=>{
					console.log("获取头部图片",res)
					this.headImg = res.data.img_url
				})
				.catch(rej=>{
					console.log("获取头部图片",rej)
					this.$tips.toast(rej.data.message)
				})
			}
		}
	}
</script>

<style lang="scss">
.content {
	padding: 32rpx;
}
</style>
