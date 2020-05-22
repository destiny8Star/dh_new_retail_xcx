<template>
	<view class="car">
		<!-- //空购物车 -->
		<block v-if="carList.length==0">
			<view class="car_top flex">
				<view class="car_top_img"><image src="../../static/image/car/c_none.png" mode=""></image></view>
				购物车是空的
				<view class="car_top_woc" @click="toIndex">去首页逛逛</view>
			</view>
			<view class="car_min flex">
				—— <view class="car_tit"><image src="../../static/image/car/c_tj.png" mode=""></image></view> ——
			</view>
			<!-- 商品列表 -->
			<view class="car_list">
				<goodsList :list="list" :loading="loading" @click="choose"></goodsList>
			</view>
		</block>
		<!-- //非空 -->
	    <block v-else>
			<view style="padding-bottom:120rpx;" >
				<view class="car_item" v-for="(item,ind) in carList" :key="ind">
					<view class="c_itemTop flex">
						<block v-if="!item.canChose">
							<view class="c_botBoxR_right c_botBoxR_rightEnt"></view>
						</block>
						<block v-if="item.canChose">
							<view class="c_botBoxR_right" v-show="!item.selS" @click="selShop(ind)"></view>
							<icon type="success" size="17" color="#F22B2B"	v-show="item.selS" @click="selShop(ind)"/>
						</block>
						
						<text style="margin-left: 16rpx ;" @click="toMall(item.shop_info_id)">{{item.shop_name}}</text>
					</view>
					<!-- 按组使用 -->
					<uni-swipe-action>
						<block v-for="(itemG,indG) in item.cart_goods_resps" :key="indG">
							<uni-swipe-action-item :options="options" @click="delHand(ind,indG,itemG.id)" @change="change">
							    <view class='car_itemCont flex'>
									  <block v-if="!itemG.canChose">
										  <view class="c_botBoxR_right2 c_botBoxR_right2Ent"></view>
									  </block>
									  <block v-if="itemG.canChose">
										  <view class="c_botBoxR_right2"  v-show="!itemG.selG" @click="selGood(ind,indG)"></view>
										  <icon type="success" size="17" color="#F22B2B" style="margin: 0 40rpx;" v-show="itemG.selG" @click="selGood(ind,indG)"/>	
									  </block>
									  
									  <view class="car_itemCont_right flex" @click="toGoods(itemG.goods_spu_id)">
									  	 <view class="car_itemCont_rightImg">
									  	 	<image :src="itemG.goods_sku_pic" mode=""></image>
											<view class="car_itemCont_rightImg_mask" v-if="itemG.status!=2">{{itemG.status==0?"已失效":"已售罄"}}</view>
									  	 </view>
										 <view class="car_itemCont_rightBox">
											 <view class="car_itemCont_rightBox_cont">
											 	<!-- <text class="car_itemCont_rightBox_contText">新品</text> -->
												 {{itemG.goods_spu_name}}
											 </view>
											 <view class="car_itemCont_rightBox_sku" v-if="itemG.status!=0">{{itemG.goods_sku||"默认规格"}}</view>
											 <view class="car_itemCont_rightBox_bot flex_be" >
											 	<view class="car_itemCont_rightBox_botM" v-if="itemG.status!=0">￥{{itemG.sku_price}}</view>
											 	<view class="car_itemCont_rightBox_botR flex" v-if="itemG.status==2">
													<view class="car_itemCont_rightBox_botRd" @click.stop="toDel(ind,indG,itemG.goods_count)">-</view>
													<view class="car_itemCont_rightBox_botRn">{{itemG.goods_count}}</view>
													<view class="car_itemCont_rightBox_botRd" @click.stop="toAdd(ind,indG)">+</view>
												</view>
												<view class="car_itemCont_rightBox_botR" v-if="itemG.status==1">
													已售罄
												</view>
												<view style="margin-top: 60rpx;" v-if="itemG.status==0">
													已失效
												</view>
											 </view>
										 </view>
									  </view>
									  
								</view>
							</uni-swipe-action-item>
						</block>
					    
					</uni-swipe-action>
				</view>
			</view>
			
			
			<!-- //底部结算 -->
			<view class="car_mount flex_be">
				<view class="car_mountL flex">
					<view class="c_botBoxR_right" v-show="!selAll" @click="selAllHand"></view>
					<icon type="success" size="17" color="#F22B2B"	style="margin-right: 24rpx;" v-show="selAll" @click="selAllHand"/>
					全选
				</view>
				<view class="car_mountR flex">
					<view>
						总计：<text style="color:#F22B2B ;">￥{{total}}</text><br/>
						<text style="font-size: 18rpx;font-weight: 200;"  v-show="amount!=0">(不含运费和优惠)</text>
					</view>
					<button class="car_mountR_btn" :disabled="amount==0" @click="toSettlement">去结算 <text v-show="amount!=0">({{amount}})</text></button>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	//引入滑动组件
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				// page: 1,
				// start: 0,
				// end: 0,
				list: [], // 商品列表
				loading: false,
				selAll:false,//全选按钮
				total:0,//总价
				amount:0,//结算数量
				carList:[
				 //  {
					//   "cart_goods_resps": [
					// 	{
					// 	  "goods_count":1,
					// 	  "goods_sku": "string",
					// 	  "goods_sku_id": 0,
					// 	  "goods_sku_pic": "1.3",
					// 	  "goods_spu_id": 0,
					// 	  "goods_spu_name": "商品名称",
					// 	  "id": 0,
					// 	   "sku_price": 1.3,
					// 	  "status": 2  //商品状态:0失效1已售罄2正常
					// 	},
					//   ],
					//   "shop_info_id": 0,
					//   "shop_name": "自营店铺名称"
					// },
					
				],//购物车列表
				options:[
					{
						text: '删除',
						style: {
							backgroundColor: '#F22B2B'
						}
					}
				]
			}
		},
		watch:{
		  'carList.length': {
			    deep: true,//深度监听
				handler(newValue) {
					if(newValue == 0){
						this.getList()
					}
					console.log("newvalue",newValue)
				}
			},
		},
		methods: {
			//返回首页
			toIndex(){
				uni.switchTab({
					url:"../index/index"
				})
			},
			// 选择商品进入商品详情
			//点击选中店铺
			selShop(ind){
				// console.log("ind",ind,this.carList[ind].selS)
				this.carList[ind].selS=!this.carList[ind].selS
				//如果为true，将所有地下的商品设置为true，判断其他商店是否为true，为true就将全选设置为true
				if(this.carList[ind].selS){
					this.carList[ind].cart_goods_resps.forEach(item=>{
						item.selG=true
					})
					let isTrue=this.carList.every(item=>{
						return item.selS==true
					})
					if(isTrue){
						this.selAll=true
					}
					console.log("是否全部额为true",isTrue)
					
				}else{
					this.carList[ind].cart_goods_resps.forEach(item=>{
						if(item.canChose){
							item.selG=false
						}
					})
					this.selAll=false
				}
				//计算
				this.computHand()
				this.$forceUpdate()//加上它，就可以强制刷新视图
			
			},
			//点击选择good
			selGood(ind,indG){
				console.log("ind",ind,indG)
				this.carList[ind].cart_goods_resps[indG].selG=!this.carList[ind].cart_goods_resps[indG].selG
				//如果为true，看当前商店商品是否都为true，为true，给当前商店设置为true，再看所有店铺是否都为true，
				//是的话给全选设置为true
				if(this.carList[ind].cart_goods_resps[indG].selG){
					let isTrue=this.carList[ind].cart_goods_resps.every(item=>{
						return item.selG==true
					})
					if(isTrue){
						this.carList[ind].selS=true
					}
					
					let isTrueAll=this.carList.every(item=>{
						return item.selS==true
					})
					if(isTrueAll){
						this.selAll=true
					}
					console.log("是否全部额为true",isTrue)
				}else{
					this.carList[ind].selS=false
					this.selAll=false
				}
				//计算
				this.computHand()
				this.$forceUpdate()//加上它，就可以强制刷新视图
			},
			//全选
			selAllHand(){
				this.selAll=!this.selAll
				console.log("selAll",this.selAll)
				if(this.selAll){
					//如果为true，将所有状态改为true
					let total = 0;
					this.carList.forEach(item=>{
						item.selS=true
						item.cart_goods_resps.forEach(itemG=>{
							itemG.selG=true
						})
					})
					// this.total=total/1000
				}else{
					//否则，将所有canChose为true的设置sel为false
					// this.total=0
					this.carList.forEach(item=>{
						if(item.canChose){
							item.selS=false
							item.cart_goods_resps.forEach(itemG=>{
								if(itemG.canChose){
									itemG.selG=false
								}
								// console.log("itemG",itemG)
							})
						}
						
					})
				}
				
				//计算
				this.computHand()
				this.$forceUpdate()//加上它，就可以强制刷新视图
			},
			//增加
			toAdd(ind,indG){
				let num = this.carList[ind].cart_goods_resps[indG].goods_count+1
				let id = this.carList[ind].cart_goods_resps[indG].id

				this.$http.post("app/mall/cart/goods/mum/update",{
					goods_count:num,
					id:id
				})
				.then(res=>{
					console.log("结果",res)
					this.carList[ind].cart_goods_resps[indG].goods_count++
					//计算
					this.computHand()
				})
				.catch(rej=>{
					// console.log("失败",rej)
					this.$tips.toast(rej.data.message)
				})
				
				
			},
			//减少
			toDel(ind,indG,number){
				if(number == 1)return
				
				let num = this.carList[ind].cart_goods_resps[indG].goods_count-1
				let id = this.carList[ind].cart_goods_resps[indG].id
				
				this.$http.post("app/mall/cart/goods/mum/update",{
					goods_count:num,
					id:id
				})
				.then(res=>{
					console.log("结果",res)
					this.carList[ind].cart_goods_resps[indG].goods_count--
					//计算
					this.computHand()
				})
				.catch(rej=>{
					// console.log("失败",rej)
					this.$tips.toast(rej.data.message)
				})
			
			},
			
			//计算结算价格和数量
			computHand(){
				let total = 0;
				let num = 0
				this.carList.forEach( item => {
					item.cart_goods_resps.forEach( itemG => {
						if(itemG.canChose&&itemG.selG){
							total += itemG.sku_price*1000*itemG.goods_count
							num++
						}
					})
				})
				this.total = total/1000
				this.amount = num
				console.log("total,num",total,num)
			},
			//去结算界面
			toSettlement(){
				let carGoods = [] //后台要用,存缓存，下个页面获取,提交订单后清除缓存
				this.carList.forEach(item=>{
					item.cart_goods_resps.forEach(itemG=>{
						if(itemG.canChose&&itemG.selG){
						     let data = {
								 goods_cart_id:itemG.id,
								 goods_sku_id:itemG.goods_sku_id,
								 goods_count:itemG.goods_count,
							 }
							 carGoods.push(data)
						}
					})
					
				})
				console.log("去结算",this.carList,carGoods)
				 uni.setStorageSync('carGoods', carGoods);
				uni.navigateTo({
					url:"commitOrder/commitOrder"
				})
			},
			//删除
			delHand(ind,indG,id){
			      console.log('当前点击的是第个按钮，点击内容是',ind,indG,id)
				  
				  this.$http.post("/app/mall/cart/goods/del",{
					  ids:[id]
				  })
				  .then(res=>{
					  // console.log("删除结果",res)
					  this.carList[ind].cart_goods_resps.splice(indG,1)
					  // console.log("this.this.carList",this.carList)
					  //1 如果商品为0，就将这个店铺删除,并判断其他店铺选中状态
					  if(this.carList[ind].cart_goods_resps.length==0){
					  		 this.carList.splice(ind,1)
							 
							 let isTrueAll=this.carList.every(item=>{
							 	return item.selS==true
							 })
							 if(isTrueAll){
							 	this.selAll=true
							 }
							 
					  }else{
					    //2 否则就判断	  商店里的商品是否都失效，
						let resStat = this.carList[ind].cart_goods_resps.every(item=>{
							return item.status != 2
						})
						if(resStat){//所有商品都失效
							this.carList[ind].selS = true
							this.carList[ind].canChose = false
						}else{
							// this.carList[ind].canChose = true
						   //3 判断商店是否有全选中的	
							
							let isTrue=this.carList[ind].cart_goods_resps.every(item=>{
								return item.selG==true
							})
							if(isTrue){
								this.carList[ind].selS=true
							}
							
							let isTrueAll=this.carList.every(item=>{
								return item.selS==true
							})
							if(isTrueAll){
								this.selAll=true
							}
							
						}
					  }
					  //判断全选的状态
					  let isTrueAll=this.carList.every(item=>{
					  	return item.canChose != true
					  })
					  if(isTrueAll){//店铺全部失效
					  	this.selAll = false
					  }
					  this.computHand()//重新计算
				  })
				  .catch(rej=>{
					  console.log("删除失败",rej)
					  this.$tips.toast(rej.data.message)
				  })
				  
				  // this.$forceUpdate()//加上它，就可以强制刷新视图
			},
			change(open){
			  // console.log('当前开启状态：'+ open)
			},
			//去商品详情
			toGoods(id){
				console.log("id",id)
				uni.navigateTo({
					url:"/pages/goods/goods?id="+id
				})
			},
			//去店铺
			toMall(id){
				console.log("id",id)
				uni.navigateTo({
					url: '/pages/shop/shop?id='+id,
				});
				
			},
			// 加载数据
			getList() {
				this.loading = true;
				this.$http.post('app/mall/search/goods/public/recommended/randomGoods',{
				  "limit": 10
				})
				.then(res=>{
					this.loading = false
					console.log("获取商品",res)
					this.list = res.data
				})
				.catch(rej=>{
					this.loading = false
					this.$tips.toast(rej.data.message||'网络异常')
					console.log("shibai",rej)
				})
			},
			//获取购物车数据
			initCart(){
				this.selAll=false
				this.total=0,//总价
				this.amount=0,//结算数量
				//请求数据
				this.$http.post("app/mall/cart/goods/list")
				.then(res=>{
					console.log("获取购物车",res)
					//加一个canChose属性是否可以选择，      再加一个sel属性是否选中
					//遍历商品，如果status！=2，设置canChose=false，selG=true，否则取反
					//遍历商品，看是否所有都  不是2，就给商店属性canChose=false，selS=true,否则就是canChose=true，selS=false,
					res.data.forEach(item=>{
					item.cart_goods_resps.forEach(itemG=>{
						if(itemG.status != 2){
							itemG.selG = true
							itemG.canChose = false
						}else{
							itemG.selG = false
							itemG.canChose = true
						}
					})
					let resStat = item.cart_goods_resps.every(item=>{
						return item.status != 2
					})
					if(resStat){//所有商品都失效
						item.selS = true
						item.canChose = false
					}else{
						item.selS = false
						item.canChose = true
					}
					
					// console.log("每个店铺",resStat)
				  })
				  this.carList = res.data
				})
				.catch(rej=>{
					console.log("获取购物车222",rej)
					if(rej.data.code == 200104){
						return this.carList = []
					}
					this.$tips.toast(rej.data.message)
				})
				// console.log("this",this.carList)
				// this.$forceUpdate()//加上它，就可以强制刷新视图
			},
		}, 
		onLoad(option) {
			console.log("aa")
			this.initCart()
			uni.$on('refreshCar',this.initCart)
			// uni.$emit('refreshCar')
		},
		onUnload() {
		    // 移除监听事件  
		    uni.$off('refreshCar');  
		},
		onPullDownRefresh() {
			this.initCart()
			setTimeout(function(){//1秒后清除
				uni.stopPullDownRefresh();
			},1000)
		},
		
	}
</script>

<style lang="scss">
	//空
.car_top{
	width: 100%;
	padding:32rpx 0 48rpx;
	background: #fff;
	flex-direction: column;
	font-size: 32rpx;
	color: #2D2320;
	align-items: center;
	.car_top_img{
		width: 166rpx;
		height: 180rpx;
		margin-bottom: 16rpx;
	}
	.car_top_woc{
		padding: 16rpx 32rpx;
		border: 1rpx solid #F22B2B;
		color: #F22B2B;
		border-radius: 16rpx;
		margin-top: 48rpx;
	}
}

.car_min{
	width: 100%;
	padding: 32rpx 0 ;
	align-items: center;
	justify-content: center;
	color: #E4E4E4;
	.car_tit{
		width: 172rpx;
		height: 32rpx;
		margin: 0 24rpx;
	}
}
.car_list{
	padding:0 32rpx 30rpx
}
// 非空
.c_itemTop{
	width: 100%;
	height: 88rpx;
	align-items: center;
	padding:0 32rpx;
	font-size: 24rpx;
	.c_botBoxR_right{
		border: 1rpx solid #969799;
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
	}
	.c_botBoxR_rightEnt{
		background: #E5E5E5;
		border: none;
	}
}

.car_itemCont{
	width: 100%;
	align-items: center;
	.c_botBoxR_right2{
		border: 1rpx solid #969799;
		width: 32rpx;
		height: 32rpx;
		border-radius: 50%;
		margin: 0 40rpx;
	}
	.c_botBoxR_right2Ent{
		background: #E5E5E5;
		border: none;
	}
	.car_itemCont_right{
		flex:1;
		padding: 32rpx 0;
		border-bottom: 1rpx solid #F7F8FA;
		.car_itemCont_rightImg{
			width: 192rpx;
			height: 192rpx;
			border-radius: 16rpx;
			position: relative;
			overflow: hidden;
			.car_itemCont_rightImg_mask{
				width: 100%;
				background: rgba(0,0,0,0.5);;
				position: absolute;
				bottom: 0;
				left: 0;
				font-size: 24rpx;
				color: #fff;
				text-align: center;
				padding: 8rpx 0 ;
			}
		}
		.car_itemCont_rightBox{
			flex: 1;
			padding:0 32rpx;
			.car_itemCont_rightBox_cont{
				overflow: hidden;
				font-size: 24rpx;
				display: -webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;
				line-height: 50rpx;
				.car_itemCont_rightBox_contText{
					color: #F22B2B;
					border: 2rpx solid #F22B2B;
					border-radius:8px;
					padding:3rpx 6rpx;
					margin-right: 10rpx;
					font-size: 18rpx;
				}
			}
			
			.car_itemCont_rightBox_sku{
				display: inline-block;
				background: #F7F8FA;
				border-radius: 8rpx;
				padding:6rpx 16rpx;
				font-size: 18rpx;
				margin: 8rpx 0;
			}
			
			.car_itemCont_rightBox_bot{
				width: 100%;
				align-items: center;
				.car_itemCont_rightBox_botM{
					font-size: 32rpx;
					color: #F22B2B;
				}
				.car_itemCont_rightBox_botR{
					font-size: 24rpx;
					align-items: center;
					.car_itemCont_rightBox_botRd{
						font-size: 34rpx;
						padding: 0rpx 16rpx;
					}
					.car_itemCont_rightBox_botRn{
						padding: 8rpx 16rpx;
						background: #F7F8FA;
					}
				}
			}
		}
	}
}

.car_mount{
	width: 100%;
	height: 88rpx;
	align-items: center;
	padding: 0 32rpx;
	background: #fff;
	position: fixed;
	bottom: 90rpx;
	/*  #ifdef  MP-WEIXIN  */
	bottom: 0rpx;
	/*  #endif  */
	left: 0;
	font-size: 28rpx;
	font-weight: bold;
	.car_mountL{
		align-items: center;
		.c_botBoxR_right{
			border: 1rpx solid #969799;
			width: 32rpx;
			height: 32rpx;
			border-radius: 50%;
			margin-right:24rpx;
		}
		
	}
	.car_mountR{
		align-items: center;
		.car_mountR_btn{
			font-size: 28rpx;
			background: #F22B2B;
			color: #fff;
			font-weight: 300;
			min-width: 184rpx;
			margin-left: 20rpx;
		}
	}
}
</style>
