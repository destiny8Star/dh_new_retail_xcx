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
			<view class="price_box ly-flex-center-between">
				<view class="price ly-flex-baseline">
					<text>￥</text>
					<text class="sellPrice">{{price}}</text>
					<text class="oldPrice">{{oldPrice}}</text>
				</view>
				<view>
					<!-- <button class="share_box ly_flex_center_column" open-type="share" v-if="isLogin"> -->
					<view class="share_box ly_flex_center_column" @click="shareClick" v-if="isLogin">
						<image class="icon_img" src="../../../static/image/goods/fenxiang_icon@2x.png" mode=""></image>
						<text>分享</text>
					</view>
					<!-- </button> -->
					<button v-else class="share_box ly_flex_center_column" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">
					<!-- <view class="share_box ly_flex_center_column" @click="shareClick"> -->
						<image class="icon_img" src="../../../static/image/goods/fenxiang_icon@2x.png" mode=""></image>
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
				<!-- <view class="synopsis">{{synopsis}}</view> -->
			</view>
		</view>
		<!-- 商品价格、标题等内容 end -->
		
		<!-- 店铺相关 start -->
		<view class="shop_box ly-flex-center-between">
			<view class="shop ly-flex-center">
				<image :src="shopLogo" mode=""></image>
				<text>{{shopName}}</text>
			</view>
			<view class="btn_box ly-flex-center">
				<view @click="goShop">进入店铺</view>
				<image class="icon_img" src="../../../static/image/home/Home_jiantou_right@2x.png" mode=""></image>
			</view>
		</view>
		<!-- 店铺相关 end -->
		
		<!-- 课程tab  start-->
		<view class="shop_tabs flex_arr">
			<view :class="['shop_tabs_item', item.id==selTabs?'selTab':''] " v-for="(item,ind) in tabs" 
			:key="ind" @click="selTabHand(item.id)">
				{{item.tit}}
			</view>
		</view>
		<!-- 课程tab end -->
		
	    <!-- 课程介绍start -->
		<view class="classDetail" v-show="selTabs==1">
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
		<!-- 课程目录start -->
		<view class="classList" v-show="selTabs==2">
			<view class="cl_top">
				全部课程({{count}})
			</view>
			<!-- 手风琴组件 -->
			<uni-collapse >
			    <uni-collapse-item :title="item.name" style="background-color: #F7F8FA;"
				 v-for="(item,ind) in lessons" :key="ind">
			        <view class="uni-collapse-itemChild flex_be" @click="toClassDetail(itemIn.type,itemIn.id)"
					v-for="(itemIn,indIn) in item.goods_fictity_spu_catalog_resps" :key="indIn" > 
					   <view class="uni-collapse-itemChild-left">
							{{itemIn.name}}
							<view class="uni-collapse-itemChild-leftBot" v-if="itemIn.type==2">直播时间：{{itemIn.start_time_str}}</view>
					   </view>
						<view class="uni-collapse-itemChild-rightMF" v-if="itemIn.is_free==1">免费试学</view>
						<view class="uni-collapse-itemChild-rightLock" v-if="itemIn.is_free==0&&is_buy==0"><image src="../../../static/image/goods/f_lock.png" mode=""></image></view>
					</view>
			    </uni-collapse-item>
				<!-- <uni-collapse-item title="章节2"  style="background-color: #F7F8FA">
				    <view class="uni-collapse-itemChild flex_be" @click="toGoodZB">
						<view class="uni-collapse-itemChild-left">
							课时1：这是一个非常好的课程，非常好的课程可以增加读者的xx
							<view class="uni-collapse-itemChild-leftBot">直播时间：36565</view>
						</view>
						<view class="uni-collapse-itemChild-rightLock"><image src="../../../static/image/goods/f_lock.png" mode=""></image></view>
					</view>
				    <view class="uni-collapse-itemChild flex_be" >
						<view class="uni-collapse-itemChild-left">
							课时2：这是一个非常好的课程，非常好的课程可以增加读者的xx
						</view>
						<view class="uni-collapse-itemChild-rightMF">免费试学</view>
					</view>
				</uni-collapse-item> -->
			</uni-collapse>
		</view>
		<!-- 课程目录end -->
		<!-- 购物车立即购买等 start -->
		<view class="fixed-box" v-if="is_buy==0">
			<view class="nav_box ly-flex-center-between" >
				<view class="tab_box ly-flex-center-around">
					<view class="item ly_flex_center_column" v-for="(ele,i) in tabList" :key="i" @click="jumpPage(ele)">
						<image class="icon_img" :src="ele.icon" mode=""></image>
						<text>{{ele.text}}</text>
					</view>
				</view>
				<view class="nav_box ly-flex-center" v-if="isLogin">
					<view class="item buy" @click="goBuy()">立即购买</view>
				</view>
				<view class="nav_box ly-flex-center" v-else>
					<button class="item buy" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNum">立即购买</button>
				</view>
			</view>
		</view>
		<view class="fixed-box" v-if="is_buy==1&&selTabs==1">
			<view class="nav_boxHas" @click="selTabs=2">
				进入课程
			</view>
		</view>
		
		<!-- 购物车立即购买等 end -->
		
		<!-- 分享按钮弹窗 start -->
		<uni-popup ref="shareBtnPopup" type="bottom" @touchmove.prevent>
			<view class="share_btn_box">
				<view class="title">
					<text>分享</text>
					<image class="icon_img" src="../../../static/image/public/guanbi_icon@2x.png" mode="" @click="closeShareBtn"></image>
				</view>
				<view class="btn_box ly-flex-center-between">
					<button class="share_box ly_flex_center_column" open-type="share">
						<image class="icon_img" src="../../../static/image/goods/wx@2x.png" mode=""></image>
						<text>分享到微信</text>
					</button>
					<view class="share_box ly_flex_center_column" @click="openPoster">
						<image class="icon_img" src="../../../static/image/goods/pyq@2x.png" mode=""></image>
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
					<image class="icon_img" src="../../../static/image/public/guanbi_icon@2x.png" mode="" @click="closeSharePoster"></image>
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
		
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	
	export default {
		components: {
			uniPopup,
			uniCollapse,
			uniCollapseItem
			},
		data() {
			return {
				phoneType:"android",//手机类型，，默认android
				authToken:null,
				shareUserId: 0,//分享人id
				mineInfo:{},//个人信息
				canSave:true,//是否可以保存图片
				mineName: '游客',//画布昵称
				drawHeadImg: '../../../static/image/mine/m_head.png',//画布头像
				shareQrImg:'',//个人分享的图片
				qrImg:"../../../static/image/mine/m_head.png",//base64图片，从后台获取二维码
				showShare: false,
				closeShare: false,//关闭海报弹窗动画
				
				goodsId: '',//商品id
				interval: 3000,//自动切换时间间隔
				duration: 500,//滑动动画时长
				bannerList: [],
				
				mainImg: '',//商品主图
				mainImgs: '',//商品主图【同域名】
				mainImgLocal: '',//商品主图【本地暂存，绘图用】
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
				
				shopId: '',//店铺id
				shopName: '',//店铺名称
				shopLogo: '',//店铺logo
				detailContent: '',//商品详情
				
				tabList: [
					{id: 1, text: '首页', icon: '../../../static/image/tabBar/home@2x.png', link: '/pages/index/index'},
				],
				
				tabs:[
					{
						id:1,
						tit:"课程介绍"
					},
					{
						id:2,
						tit:"课程目录"
					}
				],
				selTabs:1,//选中的tab			
 			}
		},
		computed: {
			isLogin(){
				console.log("this.$store.state.token",this.$store.state.token)
				if(this.$store.state.token){
					let tokens = uni.getStorageSync("token")
					this.authToken = tokens;
					this.getInfo();
					if(this.goodsId){
						this.getDetail()
					}
					return true
				}else{
					return false
				}
			}
		},
		methods: {
			
			//去课程详情
			toClassDetail(type,id){
				// is_free是否免费：默认：0 否；1：是
				// type 0：未知；1：视频；2：直播
				console.log("type,id",type,id,this.count)
				if(type==1){
					uni.navigateTo({
						url: '/pages/goods/fictityGoodDetail/fictityGoodDetail?id='+id+'&count='+this.count,
					});
				}else if(type == 2){
					uni.navigateTo({url: '/pages/goods/fictityGoodZB/fictityGoodZB?id='+id});
				}
				
			},
			//选择tabs
			selTabHand(id){
				 this.selTabs = id
			},
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
			// 立即购买
			goBuy(){
				this.$tips.loading()
				let postData = {
					"goods_id": this.goodsId
				}
				this.$http.post("app/goods/public/getGoodsSkuInfo",postData)
				.then(res=>{
					this.$tips.loaded()
					console.log("获取sku组合list",res)
					let carGoods = [{"goods_sku_id":res.data[0].sku_id,"goods_count": 1,"share_user_id":this.shareUserId||0}]
					uni.setStorageSync('carGoods', carGoods);
					uni.navigateTo({url: '/pages/car/commitOrder/commitOrder'});
				})
				.catch(rej=>{
					this.$tips.loaded()
					console.log("获取sku组合list失败",rej)
					this.$tips.toast(rej.data.message||"网络异常")
				})
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
					this.mainImg = info.goods_url;
					this.price = info.goods_price;
					this.oldPrice = info.goods_marking_price;
					
					this.title = info.goods_title;
					this.name = info.name
					this.count = info.count
					this.tagText = JSON.parse(info.goods_tag);
					// this.synopsis = info.goods_description;
					this.goods_content_resp = info.virtual_goods_content_resp
					this.lessons = info.goods_fictity_spu_catalog_resps
					this.is_buy = info.is_buy
					
					this.shopId = info.shop_info_id;
					this.shopName = info.shop_info_name;
					this.shopLogo = info.shop_info_logo;
				})
				.catch(rej=>{
					this.$tips.loaded()
					console.log("获取商品详情",rej)
					this.$tips.toast(rej.data.message)
				})
			},
			// 获取购物车数量
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
						url: `${this.$configs.RequestUrl+"app/terminal/user/my/shire?goods_spu_id="+this.goodsId+"&page=pages/goods/fictityGood/fictityGood"}`,
						name: 'qrImg',
						cnName: '二维码',
					},
					{
						url: `${this.$configs.RequestUrl+'app/wx/get/user/pic/byte'}`, name: 'drawHeadImg', cnName: '头像',
					}
				];
				
				if(__that.drawHeadImg == '../../../static/image/mine/m_head.png'){
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
					// ctx.drawImage('../../../static/image/goods/endline@2x.png',goods_left,goods_top,goods_weight,goods_weight);
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
					ctx.drawImage('../../../static/image/goods/endline@2x.png',0,foot_bottom,foot_weight,foot_height)
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
					this.drawHeadImg = res.data.pic || '../../../static/image/mine/m_head.png';
				})
				.catch(rej=>{console.log("失败",rej)
					this.$tips.loaded()
					if(rej.data.code == "200104")return;//游客
					this.$tips.toast(rej.data.message||"网络异常")
				})
			}
		},
		onLoad(option){
			this.phoneType=uni.getSystemInfoSync().platform
			console.log("phoneType",this.phoneType)
			console.log('进入场景带参-----',option);
			// this.getDetail();
			// 通过 点击商品 进入详情页
			if(option.id){
				console.log('点击商品========进入商品详情')
				this.goodsId = option.id;
				// 获取商品详情【包含sku渲染列表】
				this.getDetail();
			
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
				})
				.catch(rej=>{
					console.log("获取商品id+分享人id",rej)
					if(rej.data.code == "200104")return;//游客状态
					this.$tips.toast(rej.data.message)
				})
			}
	
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
			  path: 'pages/goods/fictityGood/fictityGood?id=' + this.goodsId + '&fromUserId=' + this.mineInfo.id,
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
	
	.shop_box {
		padding: 32rpx;
		background-color: #FFFFFF;
		font-size: 28rpx;
		margin-bottom: 16rpx;
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
	.shop_tabs{
		padding: 0 27rpx;
		background-color: #FFFFFF;
		font-size: 24rpx;
		color:#969799;
		margin-bottom: 16rpx;
		.shop_tabs_item{
			height: 88rpx;
			line-height: 88rpx;
		}
		.selTab{
			color:#2D2320;
			font-weight: bold;
			border-bottom: 4rpx solid #F22B2B;
		}
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
	.classList{
		.cl_top{
			width: 100%;
			padding: 16rpx 30rpx;
			background: #fff;
			font-size: 24rpx;
			color:#969799;
		}
		.uni-collapse-itemChild{
			align-items: center;
			background: #fff;
			padding: 30rpx 32rpx 30rpx 48rpx;
			border-bottom: 1rpx solid #F7F8FA;
			.uni-collapse-itemChild-left{
				max-width: 510rpx;
				.uni-collapse-itemChild-leftBot{
					font-size: 18rpx;
					color: #969799;
					margin-top: 8rpx;
				}
			}
			.uni-collapse-itemChild-rightMF{
				padding: 6rpx 16rpx;
				border: 1rpx solid #F22B2B;
				color: #F22B2B;
				
			}
			.uni-collapse-itemChild-rightLock{
				width: 32rpx;
				height: 32rpx;
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
		.nav_boxHas{
			width: 100%;
			height: 100%;
			text-align: center;
			line-height: 88rpx;
			background: #F22B2B;
			color: #fff;
			font-size: 28rpx;
		}
		.nav_box {
			.tab_box {
				margin: 0 40rpx 0 20rpx;
				font-size: 18rpx;
				flex-grow: 1;
				.item {
					position: relative;
				}
			}
			.nav_box {
				.item {
					width:466rpx;
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

</style>
