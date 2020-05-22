<template>
	<view class="goods">
		<!-- 商品图banner start -->
		<view>
			<view class="banner_box">
				<swiper class="swiper" circular indicator-dots autoplay :interval="interval" :duration="duration" indicator-active-color="#F22B2B" indicator-color="#F7F8FA">
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
			<view class="price_box ly-flex-center-between">
				<view class="price ly-flex-baseline">
					<text>￥</text>
					<text class="sellPrice">{{price}}</text>
					<text class="oldPrice">{{oldPrice}}</text>
				</view>
				<view>
					<!-- <button class="share_box ly_flex_center_column" open-type="share" v-if="isLogin"> -->
					<view class="share_box ly_flex_center_column" @click="shareClick" v-if="isLogin">
						<image class="icon_img" src="../../static/image/goods/fenxiang_icon@2x.png" mode=""></image>
						<text>分享</text>
					</view>
					<!-- </button> -->
					<button v-else class="share_box ly_flex_center_column" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">
					<!-- <view class="share_box ly_flex_center_column" @click="shareClick"> -->
						<image class="icon_img" src="../../static/image/goods/fenxiang_icon@2x.png" mode=""></image>
						<text>分享</text>
					<!-- </view> -->
					</button>
				</view>
			</view>
			<!-- 标题 -->
			<view class="title_box">
				<view class="title">
					<text class="tag" :style="{'background': ele.tag_color}" v-for="(ele,i) in tagText" :key="i" v-if="tagText">{{ele.tag_name}}</text>
					<text>{{title}}</text>
				</view>
				<view class="synopsis">{{synopsis}}</view>
			</view>
		</view>
		<!-- 商品价格、标题等内容 end -->
		
		<!-- 商品sku、优惠券等内容 start -->
		<view class="formContent">
			<view class="form_item" @click="choSku">
				<view class="item ly-flex-center">
					<view class="screen_title">选择：</view>
					<view class="screen_content">
						<view class="content">
							<text class="sku_item" v-for="(ele,i) in selectArrText" :key="i">{{ele}}</text>
							<!-- <text class="sku_item" v-for="(ele,i) in selectshop.goods_spec_list_resp" :key="i">{{ele.goods_spec_value}}</text> -->
							<text v-if="!allSkuState" style="color: #999;">请选择</text>
							<text v-if="isSku" style="color: #999;">默认规格</text>
						</view>
					</view>
					<image class="icon_img" src="../../static/image/home/Home_jiantou_right@2x.png" mode=""></image>
				</view>
			</view>
			
			<view class="form_item">
				<view class="item ly-flex-center">
					<view class="screen_title">运费：</view>
					<view class="screen_content">
						<view class="content">
							<text>{{freight!=0 ? freight + '元' : "免运费"}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="form_item" @click="choDis">
				<view class="item ly-flex-baseline">
					<view class="screen_title">优惠：</view>
					<view class="screen_content">
						<view class="content" v-if="discountsList.length">
							<view class="dis_item" v-for="(ele,i) in discountsList" :key="i">
								<!-- <text class="tag" :class="ele.tag==1?'sub_tag':ele.tag==2?'dis_tag':''">{{ele.tag==1?"满减":ele.tag==2?"折扣":"超值"}}</text>
								<text v-if="ele.tag==1">每满{{ele.full}}元减{{ele.sub}}元</text>
								<text v-else-if="ele.tag==2">每满{{ele.full}}元享{{ele.dis}}折</text> -->
								<text class="tag" :class="ele.id=='满减'?'sub_tag':ele.id=='折扣'?'dis_tag':''">{{ele.id=="满减"?"满减":ele.id=="折扣"?"折扣":"超值"}}</text>
								<text>{{ele.value}}</text>
							</view>
						</view>
						<view v-else>
							<text style="color: #999">请选择</text>
						</view>
					</view>
					<image class="icon_img" src="../../static/image/home/Home_jiantou_right@2x.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 商品sku、优惠券等内容 end -->
		
		<!-- 店铺相关 start -->
		<view class="shop_box ly-flex-center-between">
			<view class="shop ly-flex-center">
				<image :src="shopLogo" mode=""></image>
				<text>{{shopName}}</text>
			</view>
			<view class="btn_box ly-flex-center">
				<view @click="goShop">进入店铺</view>
				<image class="icon_img" src="../../static/image/home/Home_jiantou_right@2x.png" mode=""></image>
			</view>
		</view>
		<!-- 店铺相关 end -->
		
		<!-- 商品详情 start -->
		<view class="detail_box">
			<view class="title ly-flex-center-center">
				<view class="line"></view>
				<text>商品详情</text>
				<view class="line"></view>
			</view>
			
			<view class="richText_box">
				<rich-text :nodes="detailContent"></rich-text>
			</view>
		</view>
		<!-- 商品详情 end -->
		
		<!-- 购物车立即购买等 start -->
		<view class="fixed-box">
			<view class="nav_box ly-flex-center-between">
				<view class="tab_box ly-flex-center-around">
					<view class="item ly_flex_center_column" v-for="(ele,i) in tabList" :key="i" @click="jumpPage(ele)">
						<image class="icon_img" :src="ele.icon" mode=""></image>
						<text>{{ele.text}}</text>
						<view class="carNum" v-if="i==1&&carNum">{{carNum}}</view>
					</view>
				</view>
				<view class="nav_box ly-flex-center" v-if="isLogin">
					<view class="item" @click="addCar(0)">加入购物车</view>
					<view class="item buy" @click="goBuy(0)">立即购买</view>
				</view>
				<view class="nav_box ly-flex-center" v-else>
					<button class="item" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">加入购物车</button>
					<button class="item buy" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">立即购买</button>
				</view>
			</view>
			
		</view>
		<!-- 购物车立即购买等 end -->
		
		<!-- 分享按钮弹窗 start -->
		<uni-popup ref="shareBtnPopup" type="bottom" @touchmove.prevent>
			<view class="share_btn_box">
				<view class="title">
					<text>分享</text>
					<image class="icon_img" src="../../static/image/public/guanbi_icon@2x.png" mode="" @click="closeShareBtn"></image>
				</view>
				<view class="btn_box ly-flex-center-between">
					<button class="share_box ly_flex_center_column" open-type="share">
						<image class="icon_img" src="../../static/image/goods/wx@2x.png" mode=""></image>
						<text>分享到微信</text>
					</button>
					<view class="share_box ly_flex_center_column" @click="openPoster">
						<image class="icon_img" src="../../static/image/goods/pyq@2x.png" mode=""></image>
						<text>生成分享海报</text>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 分享按钮弹窗 end -->
		
		<!-- 分享海报弹窗 start -->
		<view v-if="showShare" class="share_poster_box" @touchmove.stop.prevent>
			<view class="share_poster_con" :class="{closeShare:closeShare}">
				<view class="title">
					<text>保存到相册</text>
					<image class="icon_img" src="../../static/image/public/guanbi_icon@2x.png" mode="" @click="closeSharePoster"></image>
				</view>
				<view class="poster_box">
					<view class="img_box">
						<canvas disable-scroll="true" canvas-id="share_qr_code" id="share_qr"></canvas>
						<image :src="shareQrImg" mode=""></image>
					</view>
					<view class="save_btn" @click="saveImg" v-if="canSave">保存图片</view>
					<button class="save_btn" open-type="openSetting" v-if="!canSave">保存图片</button>
					<view class="hint">保存图片到手机相册后，将图片分享到您的圈子</view>
				</view>
			</view>
		</view>
		<!-- 分享海报弹窗 end -->
		
		<!-- 优惠券弹窗 start -->
		<uni-popup ref="popup" type="bottom" @touchmove.prevent>
			<view class="cho_discount">
				<view class="title">
					<text>优惠券</text>
					<image class="icon_img" src="../../static/image/public/guanbi_icon@2x.png" mode="" @click="closeDis"></image>
				</view>
				<text>领券</text>
				<view class="dis_box">
					<scroll-view style="max-height: 568rpx;" scroll-y="true">
						<view class="dis_item ly-flex-center" v-for="(ele,i) in disList" :key="i" :class="ele.flag?'':'act'">
							<view class="price_box ly_flex_center_around_column" v-if="ele.coupon_type==1">
								<view v-if="ele.coupon_type==1" class="price">￥<text>{{ele.coupon_amount}}</text></view>
								<view>满{{ele.order_amount}}减{{ele.coupon_amount}}元</view>
							</view>
							<view class="price_box ly_flex_center_around_column" v-if="ele.coupon_type==2">
								<view class="price"><text>{{ele.coupon_discount}}</text>折</view>
								<view>{{ele.coupon_name}}</view>
							</view>
							<view class="condition ly-flex-center-between">
								<view class="desc ly_flex_between_column">
									<view class="content">
										<text>{{ele.shop_info_name}}</text>
										<text>{{ele.apply_to_goods}}</text>
									</view>
									<view class="time">{{ele.validity_time}}</view>
								</view>
								<view class="btn" :class="ele.is_receive==2?'':'act'" @click="getDis(ele,i)">{{ele.is_receive==2?'领取':'已领取'}}</view>
							</view>
						</view>
						<view class="noMore">没有更多了~</view>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
		<!-- 优惠券弹窗 end -->
		
		<!-- sku start -->
		<uni-popup ref="skuPopup" type="bottom" :maskClick="false">
			<!-- <sku :specifications="specifications" :choSkuInfo="choSkuInfo" @closeHandler="closeSku" ref="sku" @getSkuCho="getSkuCho"></sku> -->
			<view class="sku_box">
				<view class="content" @touchmove.stop.prevent="moveHandle">
					<image class="icon_img close" @click="closeSku" src="../../static/image/public/guanbi_icon@2x.png" mode=""></image>
					<view class="show ly-flex-start">
						<image :src="mainImg" mode=""></image>
						<view class="price_box">
							<view class="price">￥
								<text v-if="allSkuState">{{selectshop.goods_price}}</text>
								<text v-else>{{price}}</text>
							</view>
							<view class="inventory" v-if="allSkuState">剩余库存{{selectshop.goods_stock}}件</view>
							<view class="inventory" v-else>剩余库存{{stockTatol}}件</view>
						</view>
					</view>
					
					<!-- 规格内容 start -->
					<scroll-view style="max-height: 568rpx;" scroll-y="true">
						<view class="sku_content">
							<view class="item" v-for="(ele,i) in specifications" :key="i">
								<text>{{ele.spec_name}}</text>
								<view class="attr_box ly-flex-center-warp">
									<view class="attr_item" 
										v-for="(val,v) in ele.goods_spec_value_dto" 
										:key="v" 
										@tap="skuClick(val, i, $event, v)"
										:class="[val.ishow ? '' : 'noactived', subIndex[i] == v ? 'act' : '']"
										>{{val.goods_spec_value}}
									</view>
									<!-- <view class="attr_item" v-for="(val,v) in ele.goods_spec_value_dto" :key="v" @click="choAttr(ele,i,val,v)">{{val.goods_spec_value}}</view> -->
								</view>
							</view>
						</view>
						<view class="buy_box ly-flex-center-between">
							<text>购买数量</text>
							<view class="num_box ly-flex-center">
								<image @click="updateNum(0)" class="icon_img" src="../../static/image/goods/jianshao_icon@2x.png" mode=""></image>
								<view>{{selectNum}}</view>
								<image @click="updateNum(1)" class="icon_img" src="../../static/image/goods/tianjia_icon@2x.png" mode=""></image>
							</view>
						</view>
					</scroll-view>
					<!-- 规格内容 end -->
					
				</view>
				<view class="btn_box ly-flex-center" v-if="isLogin">
					<view class="btn" @click="addCar(1)">加入购物车</view>
					<view class="btn" @click="goBuy(1)">立即购买</view>
				</view>
				<view class="btn_box ly-flex-center" v-else>
					<button class="btn" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">加入购物车</button>
					<button class="btn" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">立即购买</button>
				</view>
			</view>
		</uni-popup>
		<!-- sku end -->
		
		<!-- 分享图片 start -->
		<!-- <view :hidden="showShare" class="share_canvas_box">
			<canvas canvas-id="share_canvas" style="width: 300px; height: 200px">
				
			</canvas>
		</view> -->
		
		<!-- 分享图片 end -->
		
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	
	export default {
		components: {uniPopup},
		data() {
			return {
				authToken:null,
				shareUserId: 0,//分享人id
				mineInfo:{},//个人信息
				canSave:true,//是否可以保存图片
				mineName: '游客',//画布昵称
				drawHeadImg: '../../static/image/mine/m_head.png',//画布头像
				shareQrImg:'',//个人分享的图片
				qrImg:"../../static/image/mine/m_head.png",//base64图片，从后台获取二维码
				showShare: false,
				closeShare: false,//关闭海报弹窗动画
				
				// isLogin: true,//是否登录,有个人头像信息
				goodsId: '',//商品id
				interval: 3000,//自动切换时间间隔
				duration: 500,//滑动动画时长
				bannerList: [],
				
				mainImg: '',//商品主图
				mainImgs: '',//商品主图【同域名】
				mainImgLocal: '',//商品主图【本地暂存，绘图用】
				price: "0",
				oldPrice: "0",
				tag: 1,
				tagText: "",
				stockTatol: "0",//库存总数
				title:　"",//商品标题
				synopsis:　"",//商品概要（小标题）
				freight: '0',//运费
				
				shopId: '',//店铺id
				shopName: '',//店铺名称
				shopLogo: '../../static/image/home/Home_jiantou_right@2x.png',//店铺logo
				detailContent: '',
				
				discountsList: [],//优惠券渲染列表
				
				disList: [],//已领优惠券
				
				tabList: [
					{id: 1, text: '首页', icon: '../../static/image/tabBar/home@2x.png', link: '/pages/index/index'},
					{id: 2, text: '购物车', icon: '../../static/image/tabBar/car@2x.png', link: '/pages/car/car'},
				],
				carNum: 0,
				
				//  sku === start
				specifications: [], //spu规格列表
				difference: [], //sku组合列表
				shopItemInfo: {}, //存放要和选中的值进行匹配的数据
				selectArr: [], //存放被选中的值id
				selectArrText: [], //存放被选中的值文案
				subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
				selectshop: {}, //存放最后选中的商品
				selectNum: 1, //选中数量
				allSkuState: false, //选中sku 是否全选，可进行购买
				isSku: 0,//1-不用选择规格，0-需要选择规格
				//  sku === end
			}
		},
		computed: {
			canCount() {
				return this.subIndex.some(item => item === -1);
			},
			isLogin(){
				console.log(this.$store.state.token)
				if(this.$store.state.token){
					let tokens = uni.getStorageSync("token")
					this.authToken = tokens;
					this.getInfo();
					return true
				}else{
					return false
				}
			}
		},
		methods: {
			// 选择优惠
			choDis() {
				this.$http.get("app/coupon/public/getCouponListByGoodsSpuId?goods_spu_id="+this.goodsId)
				.then(res=>{
					console.log("获取优惠券list",res)
					this.disList = res.data;
					// 打开弹窗
					this.$refs.popup.open()
				})
				.catch(rej=>{
					console.log("获取优惠券list",rej)
					this.$tips.toast(rej.data.message)
				})
			},
			// 关闭优惠弹窗
			closeDis() {
				// 关闭弹窗
				this.$refs.popup.close()
			},
			// 领取优惠券
			getDis(data,i) {
				console.log(data,i,this.$cObj.successStatus);
				this.$http.get("app/coupon/getCoupon?coupon_id="+data.id)
				.then(res=>{
					console.log("领取优惠券",res)
					data.is_receive = 1;
				})
				.catch(rej=>{
					console.log("领取优惠券",rej)
					this.$tips.toast(rej.data.message)
				})
			},
			
			// sku ================= start
			
			// 选择sku
			choSku() {
				console.log('选择sku',this.specifications)
				
				let postData = {
					"goods_id": this.goodsId
				}
				this.$http.post("app/goods/public/getGoodsSkuInfo",postData)
				.then(res=>{
					console.log("获取sku组合list",res)
					this.difference = res.data;
					this.checkItem(); //计算sku里面规格形成路径
					this.checkInpath(-1); //传-1是为了不跳过循环
					// 打开弹窗
					this.$refs.skuPopup.open()
				})
				.catch(rej=>{
					console.log("获取sku组合list",rej)
					this.$tips.toast(rej.message)
				})
			},
			// 关闭sku弹窗
			closeSku() {
				// 关闭弹窗
				this.$refs.skuPopup.close()
			},
			// 购买数量
			updateNum(f) {
				// f:0-减；1-加
				console.log(f,'购买数量');
				// if (f && this.selectNum == this.selectshop.goods_stock) {
				// 	this.popUpTip = '超出范围~'
				// }
				// if(this.isSku){
				// 	// 有默认规格
				// 	if (f && this.selectNum < this.stockTatol) {
				// 		this.selectNum ++
				// 	} else if (!f && this.selectNum > 1){
				// 		this.selectNum --
				// 	}
				// }else {
					if (f && this.selectNum < this.selectshop.goods_stock) {
						this.selectNum ++
					} else if (!f && this.selectNum > 1){
						this.selectNum --
					}
				// }
				
			},
			moveHandle() {
				//禁止父元素滑动
			},
			skuClick(value, index1, event, index2) {
				console.log(value, index1, event, index2,this.selectshop)
				if (value.ishow) {
					if (this.selectArr[index1] != value.goods_spec_value_id) {
						this.$set(this.selectArr, index1, value.goods_spec_value_id);
						this.$set(this.selectArrText, index1, value.goods_spec_value);
						this.$set(this.subIndex, index1, index2);
					} else {
						this.$set(this.selectArr, index1, '');
						this.$set(this.selectArrText, index1, '');
						this.$set(this.subIndex, index1, -1);
					}
					console.log(this.selectArr)
					console.log(this.selectArrText)
					console.log(this.subIndex)
					this.checkInpath(index1);
					//如果全部选完
					if (this.selectArr.every(item => item != '')) {
						this.selectshop = this.shopItemInfo[this.selectArr];
						this.selectNum = 1;
					}
					if (this.selectArr.every(item => item == '')) {
						this.selectshop = {};
						this.selectNum = 1;
					}
				}
				
				console.log(this.selectshop,this.specifications);
				let len = this.specifications.length,num=0;
				console.log(len);
				for(let i = 0;i < len; i++){
					console.log(this.selectArr[i])
					if(!this.selectArr[i]){
						num ++;
					}
				}
				if(num>0){
					this.allSkuState = false
				}else{
					this.allSkuState = true
				}
				console.log(this.allSkuState,num)
			},
			checkInpath(clickIndex) {
				// console.time('筛选可选路径需要的时间是');
				//循环所有属性判断哪些属性可选
				//当前选中的兄弟节点和已选中属性不需要循环
			
				for (let i = 0, len = this.specifications.length; i < len; i++) {
					if (i == clickIndex) {
						continue;
					}
					let len2 = this.specifications[i].goods_spec_value_dto.length;
					for (let j = 0; j < len2; j++) {
						if (this.subIndex[i] != -1 && j == this.subIndex[i]) {
							continue;
						}
						let choosed_copy = [...this.selectArr];
						// console.log(choosed_copy)
						this.$set(choosed_copy, i, this.specifications[i].goods_spec_value_dto[j].goods_spec_value_id);
						// console.log(choosed_copy)
						let choosed_copy2 = choosed_copy.filter(item => item !== '' && typeof item !== 'undefined');
						if (this.shopItemInfo.hasOwnProperty(choosed_copy2)) {
							this.$set(this.specifications[i].goods_spec_value_dto[j], 'ishow', true);
						} else {
							this.$set(this.specifications[i].goods_spec_value_dto[j], 'ishow', false);
						}
					}
				}
				console.log(this.specifications)
				// console.timeEnd('筛选可选路径需要的时间是');
			},
			checkItem() {
				// console.time('计算有多小种可选路径需要的时间是');
				//计算有多小种可选路径
				// this.difference sku组合列表
				console.log(this.difference)
				let result = this.difference.reduce(
				// items 每一组合对象数组数据
					(arrs, items) => {
						console.log(arrs,items)
						return arrs.concat(
						// reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
							items.goods_spec_list_resp.reduce(
							//item 每一组合对象数据中的difference每一属性字符串数据
							//arr 每一组合对象数据中的difference每一属性字符串数据总和
								(arr, item) => {
									return arr.concat(
										arr.map(item2 => {
											//利用对象属性的唯一性实现二维数组去重
											//【hasOwnProperty() 方法返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。】
											if (!this.shopItemInfo.hasOwnProperty([...item2, item.goods_spec_value_id])) {
												this.shopItemInfo[[...item2, item.goods_spec_value_id]] = items;
											}
											return [...item2, item.goods_spec_value_id];
										})
									);
								},
								[[]]
							)
						);
					},
					[[]],
					console.log(this.shopItemInfo)
				);
				// console.timeEnd('计算有多小种可选路径需要的时间是');
			},
			
			// sku =================== end
			
			// 进入店铺
			goShop(){
				console.log('进入店铺');
				uni.navigateTo({url: '/pages/shop/shop?id='+this.shopId});
			},
			// 跳转首页、购物车
			jumpPage(data){
				console.log('跳转首页、购物车',data);
				uni.switchTab({url: data.link});
			},
			// 加入购物车
			addCar(flag){
				console.log('加入购物车',this.selectshop,this.allSkuState,this.authToken);
				if(!flag){
					this.choSku();
				}else {
					if(this.allSkuState){
						let str = "";
						if(!this.isSku){
							this.selectArrText.forEach((ele,i)=>{
								str += ele+";"
							})
						}
						
						let postData = {
							"goods_count": this.selectNum,
							"goods_sku": str,
							"goods_sku_id": this.selectshop.sku_id,
							"goods_sku_pic": this.mainImg,
							"share_user_id": this.shareUserId || 0,
						}
						console.log(postData)
						this.$http.post("app/mall/cart/add",postData)
						.then(res=>{
							console.log("加入购物车",res)
							if(res.code == this.$cObj.successStatus) {
								this.$tips.toast('加入成功')
								// 获取购物车数量
								this.getCarNum();
								uni.$emit('refreshCar');//刷新购物车
								// 关闭弹窗
								this.$refs.skuPopup.close()
							}
						})
						.catch(rej=>{
							console.log("加入购物车",rej)
							this.$tips.toast(rej.data.message)
						})
					}else{
						this.$tips.toast('请选择规格，数量~');
					}
				}
			},
			// 立即购买
			goBuy(flag){
				console.log('立即购买',flag);
				if(this.allSkuState){
					let carGoods = [{"goods_sku_id":this.selectshop.sku_id,"goods_count": this.selectNum,"share_user_id":this.shareUserId||0}]
					uni.setStorageSync('carGoods', carGoods);
					uni.navigateTo({url: '/pages/car/commitOrder/commitOrder'});
				}else{
					if(flag){
						this.$tips.toast('请选择规格~');
					}
					this.choSku();
				}
			},
			// 分享商品按钮弹窗
			shareClick(){
				console.log("分享");
				// 打开弹窗
				this.$refs.shareBtnPopup.open()
			},
			// 关闭分享商品按钮弹窗
			closeShareBtn(){
				console.log("分享");
				// 关闭弹窗
				this.$refs.shareBtnPopup.close()
			},
			// 获取商品详情
			getDetail(){
				console.log();
				this.$tips.loading()
				let postData = {
					"goods_id": this.goodsId
				}
				this.$http.post("app/goods/public/getGoodsInfo",postData)
				.then(res=>{
					console.log("获取商品详情",res)
					this.$tips.loaded()
					let info = res.data;
					let that = this;
					JSON.parse(info.goods_imgs).forEach((ele,i)=>{
						this.bannerList.push(ele);
					})
					this.mainImg = info.goods_url;
					this.price = info.goods_price;
					this.oldPrice = info.goods_marking_price;
					
					this.stockTatol = info.goods_spu_stock;
					this.title = info.goods_title;
					this.tagText = JSON.parse(info.goods_tag);
					this.synopsis = info.goods_description;
					this.freight = info.freight_expense_price;
					
					this.shopId = info.shop_info_id;
					this.shopName = info.shop_info_name;
					this.shopLogo = info.shop_info_logo;
					this.specifications = info.goods_specs
					this.discountsList = info.coupon_infos
					//  因富文本各类情况不同，需做一下调整
					this.detailContent = info.goods_content.replace(/\<img/gi, `<img class="rich_img"`)
					this.detailContent = this.detailContent.replace(/\<image/gi, `<image class="rich_img"`)
					
					let str = this.detailContent.replace(/<img[^>]*>/gi, function (match, capture) {
					   return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="width:100%;max-width:100%;height:auto;width: 100vw !important;max-width: 100vw !important;vertical-align: middle;"') // 替换style
					})
					str = this.detailContent.replace(/<img[^>]*>/gi, function (match, capture) {
					   return match.replace(/class\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'class="rich_img"') // 替换class
					})
					this.detailContent = str;
					this.isSku = info.is_sku;
					return info;
				}).then(info=>{
					console.log(info)
					if(info.is_sku){
						this.allSkuState = true;
						let postData = {
							"goods_id": this.goodsId
						}
						return this.$http.post("app/goods/public/getGoodsSkuInfo",postData)
					}
				})
				.then(res=>{
					if(res){
						console.log("获取sku组合list",res.data,this.isSku,this.allSkuState)
						this.selectshop = res.data[0];
					}
				})
				.catch(rej=>{
					this.$tips.loaded()
					console.log("获取商品详情",rej)
					this.$tips.toast(rej.data.message)
				})
			},
			// 获取购物车数量
			getCarNum(){
				console.log('获取购物车数量');
				this.$http.post("app/mall/cart/num")
				.then(res=>{
					console.log("获取购物车数量",res)
					this.carNum = res.data
				})
				.catch(rej=>{
					console.log("获取购物车数量",rej)
					if(rej.data.code == "200104")return;//游客状态
					this.$tips.toast(rej.data.message)
				})
			},
		
		    //获取手机号
		    getPhoneNum(resP){
		    	console.log("获取手机号",resP)
				let open_id = uni.getStorageSync("open_id")
				this.$http.post("app/user/public/register",{
						open_id:open_id,
						iv:resP.detail.iv,
						unique_type:1,
						encrypted_data:resP.detail.encryptedData
					})
					.then(res=>{
						 console.log("登录结果",res);
						 uni.setStorageSync("token",res.data)
						 this.$store.commit("setToken",res.data)
						 // uni.removeStorageSync("is_new") //去除新人标记
						 // this.isLogin = true;
						 this.getInfo()
					})
					.catch(rej=>{
						console.log("注册失败",rej)
						this.$tips.toast("登陆失败，请稍后再试~")
					})
			},
			/**
			* canvas绘图相关，把文字转化成只能行数，多余显示省略号
			* ctx: 当前的canvas
			* text: 文本
			* contentWidth: 文本最大宽度
			* lineNumber: 显示几行
			*/
			canvasMultiLineText(ctx, text, contentWidth, lineNumber) {
				var textArray = text.split(""); // 分割成字符串数组
				var temp = "";
				var row = [];
				for (let i = 0; i < textArray.length; i++) {
					if (ctx.measureText(temp).width < contentWidth) {
					temp += textArray[i];
					} else {
					i--; // 这里添加i--是为了防止字符丢失
					row.push(temp);
					temp = "";
					}
				}
				row.push(temp);
			
				// 如果数组长度大于2，则截取前两个
				if (row.length > lineNumber) {
					var rowCut = row.slice(0, lineNumber);
					var rowPart = rowCut[rowCut.length-1];
					var test = "";
					var empty = [];
					for (var a = 0; a < rowPart.length; a++) {
					if (ctx.measureText(test).width < contentWidth) {
						test += rowPart[a];
					} else {
						break;
					}
					}
					empty.push(test); // 处理后面加省略号
					var group = empty[0] + '...'
					rowCut.splice(lineNumber - 1, 1, group);
					row = rowCut;
				}
				console.log(row)
				return row;
			},
			// 获取绘制海报所需图片【头像，商品主图，二维码】
			getPosterNeed(){
				let __that = this;
				let arr = [];
				let posterNeed = [
					{
						url: `${this.$configs.RequestUrl+'app/public/goods/img?goods_spu_id='+this.goodsId}`,
						name: 'mainImgLocal',
						cnName: '商品主图',
					},
					{
						url: `${this.$configs.RequestUrl+"app/terminal/user/my/shire?goods_spu_id="+this.goodsId+"&page=pages/goods/goods"}`,
						name: 'qrImg',
						cnName: '二维码',
					},
					{
						url: `${this.$configs.RequestUrl+'app/wx/get/user/pic/byte'}`, name: 'drawHeadImg', cnName: '头像',
					}
				];
				
				if(__that.drawHeadImg == '../../static/image/mine/m_head.png'){
					posterNeed.pop();
				}
				posterNeed.forEach((ele,i)=>{
					arr.push(__that.getImgLocal(ele))
				})
				return  Promise.all(arr)
			},
			// 获取网络图片本地路径
			getImgLocal(ele){
				console.log(ele.url)
				let __that = this;
				return new Promise((resolve,reject)=>{
					uni.downloadFile({
						url: ele.url,
						header:{'app-auth':this.authToken,'content-type': 'application/json;charset=UTF-8'},
						success:(res)=>{
							console.log("获取"+ele.cnName,res)
							// __that[ele.name] = res.tempFilePath
							res.name= ele.name;
							resolve(res)
						},
						fail:(rej)=>{
							 console.log("获取img失败",rej)
							 reject(rej)
						}
					})
				})
			
			},
			// 关闭生成海报弹窗
			closeSharePoster(){
				console.log('关闭生成海报弹窗',this.showShare);
				this.closeShare = true;
				let __that = this;
				setTimeout(function(){
					__that.showShare = false;
					// 关闭分享按钮弹窗
					__that.$refs.shareBtnPopup.close()
				},400)
			},
			// 打开生成海报弹窗
			openPoster(){
				console.log('打开生成海报弹窗',this.showShare);
				this.closeShare = false;
				let __that = this;
				this.showShare = true;
				if(!this.isLogin)return this.$tips.toast("请先登陆");
				__that.getPosterNeed()
				.then(res=>{
					console.log("获取参数",res)
					res.forEach(item=>{
						__that[item.name] = item.tempFilePath
					})
					console.log("this.name",__that.mainImgLocal,__that.drawHeadImg,__that.qrImg)
					setTimeout(function(){
						__that.$nextTick(function(){
							__that.drawShareImg();
						})
					},400)
				})
				.catch(rej=>{
					console.log("事变",rej)
					this.$tips.toast(rej.data.message||"网络异常")
				})
				// setTimeout(function(){
				// 	__that.$nextTick(function(){
				// 		__that.drawShareImg();
				// 	})
				// },400)
				
			},
			//绘制个人分享图片
			drawShareImg(){
				let __that = this;
				const share_qr = uni.createSelectorQuery().select('#share_qr');
				
				share_qr.boundingClientRect((data)=>{
					console.log(data)
				//uni.getSystemInfo({success:function(data){	
					const defWidth = 750;
					const defHeight = 1334; 
					// const win_height = data.windowHeight;
					// const win_width = data.windowWidth;
					const win_height = data.height;
					const win_width = data.width;
					const ctx = uni.createCanvasContext('share_qr_code');
					
					
					//填充白色背景
					ctx.setFillStyle('#FFFFFF');
					ctx.fillRect(0, 0, win_width, win_height)
					//画文字 【商品价格 会员价】
					const price_left = Math.floor(86*win_width/defWidth); 
					const price_top = Math.floor(988*win_height/defHeight); 
					ctx.setFontSize(48);
					ctx.setFillStyle('#E83C46');
					ctx.setTextAlign('left');
					ctx.fillText(__that.price,price_left,price_top);
					let priceW = ctx.measureText(__that.price).width;//获取会员价的宽度
					
					
					//画头像
					const m_head_weight = Math.floor(60*win_width/defWidth);
					const m_head_left = Math.floor(32*win_width/defWidth);
					const m_head_top = Math.floor(30*win_height/defHeight);
					ctx.save()
					ctx.beginPath()
					ctx.arc(m_head_left+(m_head_weight/2), m_head_top+(m_head_weight/2), m_head_weight/2, 0, 2 * Math.PI)
					ctx.clip()
					ctx.drawImage(__that.drawHeadImg,m_head_left,m_head_top,m_head_weight,m_head_weight);
					ctx.restore()
					//画文字 【推荐人name】
					const name_left = Math.floor(112*win_width/defWidth); 
					const name_top = Math.floor(40*win_height/defWidth); 
					ctx.setFontSize(26)
					ctx.setFillStyle('#999999')
					ctx.setTextAlign('left')
					ctx.fillText(__that.mineName,name_left,name_top);
					//画文字 【推荐语】
					const font1_left = Math.floor(32*win_width/defWidth); 
					const font1_top = Math.floor(138*win_height/defHeight); 
					ctx.setFontSize(28)
					ctx.setFillStyle('#333333')
					ctx.setTextAlign('left')
					ctx.fillText('发现一个好物，推荐给你呀',font1_left,font1_top);
					// //画商品图
					const goods_weight = Math.floor(670*win_width/defWidth);
					const goods_left = Math.floor(40*win_width/defWidth);
					const goods_top = Math.floor(191*win_height/defHeight); 
					// const fsm = uni.getFileSystemManager();
					// ctx.drawImage('../../static/image/goods/endline@2x.png',goods_left,goods_top,goods_weight,goods_weight);
					ctx.drawImage(__that.mainImgLocal,goods_left,goods_top,goods_weight,goods_weight);
					
					//画文字 【商品标题】
					const title_con = Math.floor(670*win_width/defWidth);
					const title_left = Math.floor(30*win_width/defWidth);
					const title_top = Math.floor(914*win_height/defHeight);
					ctx.setFontSize(36)
					ctx.setFillStyle('#333333')
					ctx.setTextAlign('left')
					let row = __that.canvasMultiLineText(ctx,__that.title,title_con,1);//计算绘制的2行文本
					console.log(row);
					// for (let b = 0; b < row.length; b++) {//一行一行绘制文本
					// 	ctx.fillText(row[b], title_left, (title_top+ 18 * b-15)*defHeight, (defWidth-130));
					// }
					ctx.fillText(row[0], title_left, title_top, title_con);
					// ctx.fillText(__that.title,title_left,title_top);
					
					//画文字 【商品价格单位 ￥】
					const RMB_left = Math.floor(46*win_width/defWidth); 
					const RMB_top = Math.floor(988*win_height/defHeight); 
					ctx.setFontSize(30);
					ctx.setFillStyle('#E83C46');
					ctx.setTextAlign('left');
					ctx.fillText('￥',RMB_left,RMB_top);
					
					
					
					const oldPrice_left = Math.ceil(priceW) + Math.floor(86*win_width/defWidth);
					const oldPrice_top = Math.floor(988*win_height/defHeight);
					// // //画文字 【商品价格 原价】
					// ctx.setFontSize(24);
					// ctx.setFillStyle('#999999');
					// ctx.setTextAlign('left');
					// ctx.fillText('￥'+__that.oldPrice,oldPrice_left,oldPrice_top);
					
					// let oldPriceW = ctx.measureText(__that.oldPrice).width;//获取原价的宽度
					// const oldPrice_end = Math.ceil(oldPriceW) + oldPrice_left + Math.floor(24*win_width/defWidth);
					
					
					// //画文字 【提示语】
					const hint_left = Math.floor(346*win_width/defWidth); 
					const hint_top = Math.floor(1122*win_height/defHeight); 
					ctx.setFontSize(36);
					ctx.setFillStyle('#333333');
					ctx.setTextAlign('left');
					ctx.fillText('长按识别小程序码',hint_left,hint_top);
					
					// //画文字 【吸引语】
					const attract_left = Math.floor(346*win_width/defWidth); 
					const attract_top = Math.floor(1180*win_height/defHeight); 
					ctx.setFontSize(28);
					ctx.setFillStyle('#999999');
					ctx.setTextAlign('left');
					ctx.fillText('超值好货一起购',attract_left,attract_top);
					
					//画二维码
					const qr_weight = Math.floor(180*win_width/defWidth);
					const qr_left = Math.floor(108*win_width/defWidth);
					const qr_top = Math.floor(1041*win_height/defHeight); 
					// const fsm = uni.getFileSystemManager();
					ctx.drawImage(__that.qrImg,qr_left,qr_top,qr_weight,qr_weight)
					
					//画底部汇拾货logo
					const foot_weight = Math.floor(750*win_width/defWidth);
					const foot_height = Math.floor(70*win_height/defHeight);
					const foot_bottom = Math.floor(1264*win_height/defHeight); 
					// const fsm = uni.getFileSystemManager();
					ctx.drawImage('../../static/image/goods/endline@2x.png',0,foot_bottom,foot_weight,foot_height)
					// 绘制原价的线
					// ctx.moveTo(oldPrice_left,(oldPrice_top - Math.floor(10*win_height/defHeight)));//设置线条的起始路径坐标
					// ctx.lineTo(oldPrice_end,(oldPrice_top - Math.floor(10*win_height/defHeight)));//设置线条的终点路径坐标
					ctx.setStrokeStyle('#999')
					ctx.stroke();//对当前路径进行描边
					ctx.closePath();//关闭当前路径
					// ctx.draw();
					ctx.draw(false,()=>{
						uni.canvasToTempFilePath({canvasId:'share_qr_code',success(res){
							console.log(res,'cghsth')
							__that.shareQrImg = res.tempFilePath  //h5平台中是base64图片 
						}}); 
						console.log(__that.shareQrImg)
					});
				//}})
				}).exec();
			},
			// 分享彈窗的保存图片
			saveImg(){
				console.log('保存圖片');
				let __that = this;
				// uni.canvasToTempFilePath({canvasId:'share_qr_code',success(res){
					// console.log(res.tempFilePath)
					// __that.shareQrImg = res.tempFilePath  //h5平台中是base64图片 
					uni.saveImageToPhotosAlbum({
						filePath: __that.shareQrImg,
						success() {
							__that.$tips.toast("保存成功")
							console.log("success");
						},
						fail(rej){
							//如果拒绝,让保存图片按钮变成打开设置的
							// __that.canSave = false
							console.log("fail",rej);
						}
					})
				// }}); 
			},
			getInfo(){
				//请求个人数据
				this.$tips.loading()
				this.$http.post("app/terminal/user/my/center")
				.then(res=>{
					console.log("获取个人数据",res)
					this.$tips.loaded()
					this.mineInfo = res.data;
					this.mineName = res.data.nickname || '游客';
					this.drawHeadImg = res.data.pic || '../../static/image/mine/m_head.png';
				})
				.catch(rej=>{console.log("失败",rej)
					this.$tips.loaded()
					if(rej.data.code == "200104")return;//游客
					this.$tips.toast(rej.data.message||"网络异常")
				})
			}
		},
		onReady() {
			// var context = uni.createCanvasContext('share_canvas')
			// console.log(context);
			
		},
		
		onLoad(option){
			console.log('进入场景带参-----',option);
			// 通过 点击商品 进入详情页
			if(option.id){
				console.log('点击商品========进入商品详情')
				this.goodsId = option.id;
				// 获取商品详情【包含sku渲染列表】
				this.getDetail();
				// 获取购物车数量
				this.getCarNum();
			}
			// 通过 微信原生分享链接 进入详情页
			if(option.fromUserId){
				console.log('微信原生分享链接========进入商品详情')
				this.shareUserId = option.fromUserId;
			}
			// 通过 扫描海报二维码 进入详情页
			if(option.scene){
				console.log('扫描海报二维码========进入商品详情')
				console.log('获取商品id+分享人id');
				let idCon = option.scene.substring(2)
				console.log(idCon)
				this.$http.get("app/terminal/user/my/shire/info/public?id=" + idCon)
				.then(res=>{
					console.log("获取商品id+分享人id",res)
					this.goodsId = res.data.goods_spu_id;
					this.shareUserId = res.data.terminal_user_id
					return res.data
				})
				.then(res=>{
					// 获取商品详情【包含sku渲染列表】
					this.getDetail();
					// 获取购物车数量
					this.getCarNum();
				})
				.catch(rej=>{
					console.log("获取商品id+分享人id",rej)
					if(rej.data.code == "200104")return;//游客状态
					this.$tips.toast(rej.data.message)
				})
			}
		
			
			
			this.specifications.map(item => {
				// console.log(item);
				this.selectArr.push('');
				this.selectArrText.push('');
				this.subIndex.push(-1);
				
				// console.log(this.selectArr);
				// console.log(this.subIndex);
			});
			
			console.log(this.selectArr);
			console.log(this.subIndex);
			this.checkItem(); //计算sku里面规格形成路径
			this.checkInpath(-1); //传-1是为了不跳过循环
	
	         //判断登录
			 // let tokens = uni.getStorageSync("token")
			 // if (tokens) {
				// this.isLogin=true 
				// this.getInfo();
			 // }else{
				//  this.isLogin = false
				//  this.authToken = token;
			 // }
			// this.getData(1);
		},
		onShow(){
		   //获取用户是否有保存图片的权限，
		   let that = this
		   that.$refs.shareBtnPopup.close()
		   uni.getSetting({
		      success(res) {
		         // console.log("获取用户权限",res.authSetting['scope.address']== false)
				 if(res.authSetting['scope.writePhotosAlbum'] == false){
					 //为false就是点击过授权按钮并拒绝的。让保存图片按钮变成打开设置的
				      that.canSave = false
				 }else{
					 that.canSave = true
				 }
		      }
		   })
		},
		onShareAppMessage(res) {
			console.log(res,this.isLogin);
			let __that = this;
		    if (res.from === 'button') {
		      // 来自页面内转发按钮
		      console.log('转发按钮')
		      console.log(res.target)
		    }
			
			uni.canvasToTempFilePath({canvasId:'share_qr_code',success(res){
				console.log(res.tempFilePath)
				__that.shareQrImg = res.tempFilePath  //h5平台中是base64图片 
			}}); 
			return {
			  title: this.title,
			  path: 'pages/goods/goods?id=' + this.goodsId + '&fromUserId=' + this.mineInfo.id,
			  imageUrl: __that.shareQrImg,
			  success: function(){
				  __that.showShare = false;
				  __that.$refs.shareBtnPopup.close()
				  console.log('分享成功，show状态',__that.showShare)
			  }
			}
		}
	}
</script>

<style lang="scss">
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
			.share_box {
				background: $ly-bg-trans;
				padding: 0;
				image {
					width: 36rpx;
					height: 36rpx;
					margin-bottom: 4rpx;
				}
				text {
					font-family: PingFangSC-Medium,PingFang SC;
					font-weight: 500;
					color: rgba(150,151,153,1);
					font-size: $ly-font-size;
					line-height: 24rpx;
				}
			}
			.share_box:after {
				border: 0;
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
	.formContent {
		padding-left:32rpx;
		background: #fff;
		margin: 16rpx 0;
		.item {
			line-height: 44rpx;
			position: relative;
			.screen_title {
				font-weight: 500;
				color: rgba(150,151,153,1);
				line-height: 32rpx;
				margin-right: 8rpx;
			}
			.icon_img {
				position: absolute;
				top: 16rpx;
				right: 32rpx;
			}
			.screen_content {
				min-height: 78rpx;
				padding: 16rpx 0;
				border-bottom: 1rpx solid #F7F8FA;
				flex-grow: 1;
				.content {
					max-width: 560rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					.sku_item {
						margin-right: 8rpx;
					}
					.dis_item {
						.tag {
							padding: 0 6rpx;
							line-height: 36rpx;
							margin-right: 12rpx;
							font-size: 18rpx;
							font-weight: 500;
							border-radius: 8rpx;
						}
						.dis_tag {
							color: #BE2BF2;
							border: 2rpx solid #BE2BF2;
						}
						.sub_tag {
							color: #F22B2B;
							border: 2rpx solid #F22B2B;
						}
					}
				}
			}
			.screen_content :last-child{
				border: none;
			}
		}
	}
	.shop_box {
		padding: 32rpx;
		background-color: #FFFFFF;
		font-size: 28rpx;
		.shop {
			font-weight: 600;
			image {
				width: 96rpx;
				height: 96rpx;
				background: rgba(216,216,216,1);
				border-radius: 16rpx;
				margin-right: 32rpx;
			}
			text {
				max-width: 290rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
		.btn_box {
			view {
				width: 176rpx;
				line-height: 48rpx;
				background: linear-gradient(90deg,rgba(255,110,27,1) 0%,rgba(242,43,43,1) 100%);
				border-radius: 24rpx;
				color: #fff;
				text-align: center;
				margin-right: 8rpx;
			}
		}
	}
	.detail_box {
		padding: 10rpx 0 98rpx;
		.title {
			font-size: 18rpx;
			font-weight: 500;
			line-height: 48rpx;
			margin-bottom: 10rpx;
			.line {
				width: 32rpx;
				height: 2rpx;
				background: rgba(229,229,229,1);
				border-radius: 1rpx;
				margin: 0 8rpx;
			}
		}
		.richText_box {
			width: 100vw;
			overflow: hidden;
			/deep/ .rich_img {
				width: 100vw !important;
				max-width: 100vw !important;
				height: auto;
				vertical-align: middle;
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
			.tab_box {
				margin: 0 40rpx 0 20rpx;
				font-size: 18rpx;
				flex-grow: 1;
				.item {
					position: relative;
					.carNum {
						line-height: 20rpx;
						background: rgba(242,43,43,1);
						border-radius: 10rpx;
						position: absolute;
						right: -12rpx;
						font-size: 18rpx;
						color: #fff;
						padding: 4rpx 8rpx;
					}
				}
			}
			.nav_box {
				.item {
					width: 232rpx;
					line-height: 88rpx;
					font-size: 28rpx;
					color: #fff;
					background: #F4B335;
					border-radius: 0;
				}
				.buy {
					background: #F22B2B;
				}
			}
		}
	}
	.share_btn_box {
		background: #fff;
		padding: 32rpx;
		.title {
			font-size: 32rpx;
			font-weight: 500;
			line-height: 48rpx;
			text-align: center;
			position: relative;
			image {
				position: absolute;
				right: 0;
				top: 0;
			}
		}
		.btn_box {
			width: 100%;
			padding: 77rpx 0 66rpx;
			.share_box {
				width: 50%;
				background: $ly-bg-trans;
				padding: 0;
				image {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 22rpx;
				}
				text {
					font-weight: 500;
					font-size: $ly-font-size;
					line-height: 24rpx;
				}
			}
			.share_box:after {
				border: 0;
			}
		}
	}
	.share_poster_box {
		position: fixed;
		top: 0;
		right: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.4);
		z-index: 999;
		// @keyframes transformBox
		// {
		// from {bottom: -100%;}
		// to {bottom: 0;}
		// }
		.share_poster_con {
			position: absolute;
			left: 0;
			bottom: 0;
			background: #fff;
			width: 100%;
			padding: 32rpx;
			animation: transformBox 0.4s linear;
			@keyframes transformBox
			{
			from {bottom: -100%;}
			to {bottom: 0;}
			}
			&.closeShare {
				animation: transformBox 0.4s linear 0 1 alternate;
			}
			.title {
				font-size: 32rpx;
				font-weight: 500;
				line-height: 48rpx;
				text-align: center;
				position: relative;
				image {
					position: absolute;
					right: 0;
					top: 0;
				}
			}
			.poster_box {
				padding: 29rpx 32rpx 12rpx;
				.img_box {
					width: 375rpx;
					height: 667rpx;
					// background:rgba(255,255,255,1);
					box-shadow:0 0 10rpx 0 rgba(0, 0, 0, 0.2);
					margin: 0 auto 41rpx;
					#share_qr {
						position: fixed;
						top: 0;
						left: -300%;
						width: 750px;
						height: 1334px;
						opacity: 0;
						z-index: -1;
					}
				}
				.save_btn {
					width: 100%;
					line-height: 80rpx;
					background: $ly-bg-red;
					border-radius: 16rpx;
					color: $ly-text-color-inverse;
					font-size: 30rpx;
					text-align: center;
					margin-bottom: 46rpx;
				}
				.hint {
					color: #666;
					text-align: center;
				}
			}
		}
	}
	.cho_discount {
		background: #fff;
		border-radius: 32px 32px 0px 0px;
		padding: 32rpx;
		.title {
			font-size: 32rpx;
			font-weight: 500;
			line-height: 48rpx;
			text-align: center;
			position: relative;
			image {
				position: absolute;
				right: 0;
				top: 0;
			}
		}
		.dis_box {
			padding-top: 16rpx;
			.dis_item {
				height: 172rpx;
				color: #F22B2B;
				background: url(../../static/image/goods/dis_bg@2x.png);
				background-size: 100% 100%;
				margin-bottom: 16rpx;
				.price_box {
					width: 232rpx;
					height: 100%;
					font-size: 32rpx;
					font-weight: bold;
					padding: 16rpx 0;
					text {
						font-size: 60rpx;
					}
				}
				.condition {
					height: 100%;
					flex-grow: 1;
					padding: 22rpx 16rpx 16rpx 32rpx;
					font-weight: 500;
					.desc {
						height: 100%;
						.content {
							font-size: 24rpx;
							text {
								display: block;
							}
						}
						.time {
							font-size: 18rpx;
							font-weight: 500;
							line-height: 28rpx;
						}
					}
					.btn {
						width: 112rpx;
						line-height: 44rpx;
						background: rgba(242,43,43,1);
						border-radius: 24rpx;
						text-align: center;
						color: #fff
					}
					.btn.act {
						color: rgba(242,43,43,1);
						background: rgba(242,43,43,0);
					}
				}
			}
			.dis_item.act {
				background: url(../../static/image/goods/dis_bg_act@2x.png);
				background-size: 100% 100%;
			}
		}
	}
	.share_canvas_box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(3,3,3,0.6);
		z-index: 10;
	}
	.sku_box {
		font-size: $ly-font-size-medium;
		.content {
			background: #FFFFFF;
			padding: 32rpx;
			position: relative;
			.show {
				margin-bottom: 32rpx;
				image {
					width: 144rpx;
					height: 144rpx;
					margin-right: 32rpx;
				}
				.price_box {
					padding-top: 16rpx;
					.price {
						font-size: 32rpx;
						color: $ly-text-color-red;
						font-weight: 600;
						line-height: 72rpx;
						text {
							font-size: $ly-font-size-est;
						}
					}
					.inventory {
						margin-top: 12rpx;
						color: $ly-text-color-gery;
					}
				}
			}
			.icon_img {
				&.close {
					position: absolute;
				right: 32rpx;
				top: 32rpx
				}
			}
			.sku_content {
				.item {
					border-top: 2rpx solid $ly_border-color;
					padding: 12rpx 0 40rpx;
					.attr_box {
						margin: 8rpx -16rpx 0;
						text {
							line-height: 44rpx;
						}
						.attr_item {
							margin: 8rpx 16rpx;
							line-height: 60rpx;
							padding: 0 16rpx;
							background: rgba(247,248,250,1);
							border-radius: 16rpx;
							&.act {
								background: rgba(242,43,43,0.07);
								color: $ly-bg-red;
							}
							&.noactived {
								color: #999;
							}
						}
					}
				}
			}
			.buy_box {
				padding: 30rpx 0;
				border-top: 2rpx solid $ly_border-color;
				border-bottom: 2rpx solid $ly_border-color;
				.num_box {
					view {
						padding: 0 16rpx;
						line-height: 48rpx;
						background: rgba(247,248,250,1);
						border-radius: 4rpx;
						margin: 0 8rpx;
					}
				}
			}
		}
		.btn_box {
			color: $ly-text-color-inverse;
			font-weight: 500;
			line-height: 88rpx;
			text-align: center;
			.btn {
				width: 50%;
				border-radius: 0;
				border: 0;
				background: $ly-bg-yellow;
			}
			.btn:last-child {
				background: $ly-bg-red;
			}
		}
		.tipPop {
			color: #fff;
		}
		uni-button:after {
			border-radius: 0;
		}
	}
</style>
