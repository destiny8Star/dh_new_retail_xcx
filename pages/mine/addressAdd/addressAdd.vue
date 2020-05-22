<template>
	<view>
		<view class="addrAdd">
			<view class="add_box">
				<view class="add_boxItem flex_be">
					<view class="add_boxItem_lab">收货人</view>
					<input type="text"  placeholder="请填写收货人" maxlength="10" v-model="name"/>
				</view>
				<view class="add_boxItem flex_be">
					<view class="add_boxItem_lab">手机号</view>
					<input type="number"  placeholder="请填写收货人手机号" maxlength="11" v-model="phone" />
				</view>
				<view class="add_boxItem flex_be">
					<view class="add_boxItem_lab">所在地区</view>
					<view class="reginBtn" @click="choseCity">{{discountT=='请选择'?'请选择省市区（县）':proT+cityT+discountT}} </view>
				</view>
				<view class="add_boxItem flex_be">
					<view class="add_boxItem_lab">详细地址</view>
					<input type="text"  placeholder="乡  镇、街道、楼牌号等" v-model="address"/>
				</view>
				<view class="add_boxItem flex_be  add_boxDef">
					<view class="add_boxItem_lab">设置默认地址</view>
					<switch @change="switch1Change" :checked="is_default=='1'" style="transform: scale(1,0.8)" color="#F22B2B" />
				</view>
			<!-- 	<view class="add_boxDef flex">
					<switch @change="switch1Change" :checked="is_default=='1'" style="transform: scale(0.5,0.5);margin-right: -20rpx;" />设为默认地址
				</view> -->
			</view>
			<button class="add_btn add_btnC" @click="toSave">保存</button>
			<button class="add_btn add_btnD" v-if="status==2" @click="toDel">删除</button>

		</view>


		<!-- //省市区选择器 -->
		<!-- 蒙层 -->
		<view class="orgMask" v-show="visible" @click="visible=false">
			<view class="orgBox"  @click.stop="">
				<!-- 省市区样式 -->
				<!-- 顶部bar -->
				<view class="seTop flex">
					<view :class="['seTop-item',curTar==1?'selBar':''] " @click="selTar(1)">{{proT}}</view>
					<view :class="['seTop-item',curTar==2?'selBar':''] " @click="selTar(2)" v-show='cityT!="请选择"'>{{cityT}}</view>
					<view :class="['seTop-item',curTar==3?'selBar':''] " @click="selTar(3)" v-show='discountT!="请选择"'>{{discountT}}</view>
				</view>
				<!-- 底部 -->
				<view class="seBot">
					<scroll-view class="seBotbox" scroll-y='true'>
						<!-- //省 -->
						<block v-if='curTar==1'>
							<view v-for='item in province' :key="item.id" :class="['seBot-item','flex',spid==item.id?'selItem':'']"
							 @click="selP(item.id,item.value)">
								{{item.value}}
								<icon type="success_no_circle" v-show="spid==item.id" size="14" color="#FC2C54" style='margin-left:50rpx'></icon>
							</view>
						</block>
						<!-- 市 -->
						<block v-if='curTar==2'>
							<view v-for='item in city' :key="item.id" :class="['seBot-item','flex',scid==item.id?'selItem':'']" @click="selC(item.id,item.value)">
								{{item.value}}
								<icon type="success_no_circle" v-show="scid==item.id" size="14" color="#FC2C54" style='margin-left:50rpx'></icon>
							</view>
						</block>
						<!-- 区 -->
						<block v-if='curTar==3'>
							<view v-for='item in discount' :key="item.id" :class="['seBot-item','flex',sdid==item.id?'selItem':'']"
							 @click="selD(item.id,item.value)">
								{{item.value}}
								<icon type="success_no_circle" v-show="sdid==item.id" size="14" color="#FC2C54" style='margin-left:50rpx'></icon>
							</view>
						</block>
					</scroll-view>
				</view>
			</view>
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				id:"",//修改时候用
				name:"",//收件人姓名
				phone:"",//手机号
				status:"",//1为新增，2为修改
				address:"",//详细地址
				is_default:0,//是否默认地址 1默认 0普通
				visible: false, //选择器蒙层
				proT: "请选择",
				cityT: "请选择",
				discountT: "请选择",
				spid: "", //选中的省id
				scid: "", //选中的市id
				sdid: "", //选中的区id
				curTar: '1', //选中上方的tab
				province: [],
				city: [],
				discount: [],

			};
		},
		methods: {
			//设置默认
			switch1Change: function(e) {
				console.log('switch1 发生 change 事件，携带值为', e.target.value)
				if(e.target.value){
					this.is_default = 1
				}else{
					this.is_default = 0
				}
			},

			//保存
			toSave(){
				if(!this.name)return this.$tips.toast("请填写姓名")
				if(!this.phone)return this.$tips.toast("请填写手机号")
				if(this.discountT == "请选择")return this.$tips.toast("请选择地址")
				if(!this.address)return this.$tips.toast("请填写详细地址")
				let reg=/^1\d{10}/
				if(!reg.test(this.phone))return  this.$tips.toast("请填写正确手机号")
				console.log("aaa")
				let data = {
					address:this.address,
					area_code:this.sdid,
					city_code:this.scid,
					province_code:this.spid,
					is_default:this.is_default,
					name:this.name,
					phone:this.phone
				}
				//如果status为2就是修改
				if(this.status==2){
					data.id = this.id
				}
				this.$tips.loading()
				this.$http.post("/app/terminalUser/addres/saveAddres",data)
				.then(res=>{
					this.$tips.loaded()
					this.$tips.toast("保存成功",function(){
						uni.navigateBack({
							delta:1
						})
					},"success")
					console.log("获取结果",res)
				})
				.catch(rej=>{
					this.$tips.loaded()
					this.$tips.toast(rej.data.message)
					console.log("失败",rej)
				})
			},
			
			//删除
			toDel(){
				console.log(this.id)
				this.$tips.confirm("您将删除此收货地址")
				.then(res=>{
					console.log("确定")
					this.$tips.loading()
					return this.$http.post("app/terminalUser/addres/delAddres",{id:this.id})
				})
				.then(res=>{
					this.$tips.loaded()
					this.$tips.toast("删除成功",function(){
						uni.navigateBack({
							delta:1
						})
					},"success")
				})
				.catch(rej=>{
					this.$tips.loaded()
					this.$tips.toast(rej.data.message)
					console.log("失败",rej)
				})
				
			},
			//显示弹框
			choseCity() {
				this.visible = true
				//获取省份
				this.$tips.loading()
				this.getData(1)
					.then(res => {
						this.$tips.loaded()
						console.log("获取地址", res)
						this.province = res.data
					})
					.catch(rej => {
						this.$tips.loaded()
						this.$tips.toast(rej.data.message || '网络异常')
						console.log("异常", rej)
					})
			},

			//获取省市区函数
			getData(id) {
				return this.$http.get("app/city/province?areaParentId=" + id)
			},

			//选择顶部tab
			selTar(id) {
				console.log("ee", id)
				this.curTar = id
			},
			//选择省份
			selP(id, name) {
				//获取城市
				this.$tips.loading()
				this.getData(id)
					.then(res => {
						this.$tips.loaded()
						console.log("获取地址", res)
						this.city = res.data
						this.curTar = 2
						this.spid = id
						this.proT = name
						this.cityT = "请选择"
						this.discountT = "请选择"
					})
					.catch(rej => {
						this.$tips.loaded()
						this.$tips.toast(rej.data.message || '网络异常')
						console.log("异常", rej)
					})
			},
			//选择城市
			selC(id, name) {
				this.$tips.loading()
				this.getData(id)
					.then(res => {
						this.$tips.loaded()
						console.log("获取地址", res)
						this.discount = res.data
						this.curTar = 3
						this.scid = id
						this.cityT = name
						this.discountT = "请选择"
					})
					.catch(rej => {
						this.$tips.loaded()
						this.$tips.toast(rej.data.message || '网络异常')
						console.log("异常", rej)
					})
			},
			selD(id, name) {
				this.sdid = id;
				this.discountT = name
			},

		},
		onLoad(option){
			let status = option.status||1
			this.status = status
			if(status==1){
				uni.setNavigationBarTitle({
					title: "新增收货地址"
				});
			}else{
				let id = option.id
				uni.setNavigationBarTitle({
					title: "修改收货地址"
				});
				//获取收货地址
				this.$tips.loading()
				this.$http.post("app/terminalUser/addres/getAddres",{id:id})
				.then(res=>{
					this.$tips.loaded()
					this.id = res.data.id
					this.address = res.data.address
					this.sdid = res.data.area_code
					this.discountT =  res.data.area_code_desc
					this.scid = res.data.city_code
					this.cityT = res.data.city_code_desc
					this.spid = res.data.province_code
					this.proT = res.data.province_code_desc
					this.is_default = res.data.is_default
					this.name = res.data.name
					this.phone = res.data.phone
					console.log("获取信息",res)
				})
				.catch(rej=>{
					this.$tips.loaded()
					this.$tips.toast(rej.data.message||"网络异常")
					console.log("失败",rej)
				})
			}
		},
		onShow() {

		}
	}
</script>

<style lang="scss">
	.addrAdd {
		padding: 20rpx 32rpx;

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

			.add_boxDef {
				font-size: 24rpx;
				padding: 10rpx 0 ;
				// margin-top: 20rpx;
				// align-items: center;
				// justify-content: center;
				border-bottom: none;
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

		.add_btnD {
			background: #fff;
			color: #333
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
	}
	@keyframes showM{
		from{
			bottom: -100vh;
		}
		to{
			bottom: 0;
		}
	}

	.orgBox {
		width: 100%;
		height: 65vh;
		position: absolute;
		bottom: 0;
		left: 0;
		background: #fff;
	}

	.seTop {
		width: 100%;
		border-bottom: 2rpx solid #EDEDED;
		height: 104rpx;
		padding: 0 26rpx;
		font-size: 32rpx;
		color: #3E3E4D
	}

	.seTop-item {
		height: 100%;
		max-width: 180rpx;
		margin-right: 40rpx;
		line-height: 102rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap
	}

	.selBar {
		border-bottom: 2rpx solid #FC2C54
	}

	.seBot {
		width: 100%;
		font-size: 28rpx;
		color: #3E3E4D;
		height: 58vh;
		padding: 30rpx;
		// padding: 30rpx 0rpx 30rpx 45rpx;
	}

	.seBot-item {
		margin-bottom: 32rpx;
		align-items: center
	}

	.seBotbox {
		height: 100%;
	}

	.selItem {
		color: #FC2C54;
	}

	.seBtn {
		width: 100%;
		height: 92rpx;
		background: #FC2C54;
		text-align: center;
		line-height: 92rpx;
		font-size: 34rpx;
		color: #fff;
		position: fixed;
		bottom: 0;
		left: 0
	}
</style>
