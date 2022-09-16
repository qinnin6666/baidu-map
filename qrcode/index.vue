<template>
	<view class="container">
		<button type="default" @click="scanCode">扫码</button>
		<view>
			扫码结果：{{qrCodeRes}}
		</view>
	</view>
</template>

<script>
	let Qrcode = require('../../utils/reqrcode.js')
	export default {
		data() {
			return {
				qrCodeRes: ''
			}
		},
		methods: {
			// 扫码
			scanCode() {
				// #ifdef APP-PLUS
				this.scanCodeAPP()
				// #endif
				
				// #ifdef H5
				this.scanCodeH5()
				// #endif
			},
			// APP直接调用 uni.scanCode 接口
			scanCodeAPP() {
				uni.scanCode({
					scanType: ['qrCode'],
					success: (res) => {
						this.qrCodeRes = res.result
					}
				})
			},
			// H5通过拉起相机拍照来识别二维码
			scanCodeH5() {
				uni.chooseImage({
					count: 1,
					success: imgRes => {
						Qrcode.qrcode.decode(this.getObjectURL(imgRes.tempFiles[0]))
						Qrcode.qrcode.callback = (codeRes) => {
							if (codeRes.indexOf('error') >= 0) {
								// 二维码识别失败
								this.qrCodeRes = '不合法二维码：' + codeRes
							} else {
								// 二维码识别成功
								let r = this.decodeStr(codeRes)
								this.qrCodeRes = r
							}
						}
					}
				})
			},
			// 获取文件地址函数
			getObjectURL(file) {
				var url = null
				if (window.createObjectURL !== undefined) { // basic
					url = window.createObjectURL(file)
				} else if (window.URL !== undefined) { // mozilla(firefox)
					url = window.URL.createObjectURL(file)
				} else if (window.webkitURL !== undefined) { // webkit or chrome
					url = window.webkitURL.createObjectURL(file)
				}
				return url
			},
			// 解码，输出：中文
			decodeStr(str) {
				var out, i, len, c;
				var char2, char3;
				out = "";
				len = str.length;
				i = 0;
				while (i < len) {
					c = str.charCodeAt(i++);
					switch (c >> 4) {
						case 0:
						case 1:
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
							// 0xxxxxxx
							out += str.charAt(i - 1);
							break;
						case 12:
						case 13:
							// 110x xxxx 10xx xxxx
							char2 = str.charCodeAt(i++);
							out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
							break;
						case 14:
							// 1110 xxxx 10xx xxxx 10xx xxxx
							char2 = str.charCodeAt(i++);
							char3 = str.charCodeAt(i++);
							out += String.fromCharCode(((c & 0x0F) << 12) |
								((char2 & 0x3F) << 6) |
								((char3 & 0x3F) << 0));
							break;
					}
				}
				return out;
			},
		}
	}
</script>

<style>
	.container{
		padding: 10px;
	}
</style>
