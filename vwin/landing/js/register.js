$(function(){
	var ip;
	var BRANDID = 2;
	var lang = "zh-cn";
	var vwinUrl = "http://www.yvwin.com/#/";
	var vwinMobileUrl = "http://m.yvwin.com/Account/Login";
	var domain = "666vwin.com";
	var server = "http://service.yvwin.com/Api"
	var affiliateInfo = {};
	var autoAff = false;
	var errMsg = "";
	var openWnd = null;
	var registerData = {
		token: "",
		inputdata: {
			strCookie: "",
			strMainAccountID: "",
			strMainAccountPassword: "",
			intMainAccountType: 1,
			intPasswordStength: 0,
			strLanguageCode: 0,
			intCurrencyID: 2,
			strAreaCode: "86",
			strContactNumber: "",
			intNewsLetter: 0,
			strIPAddress: "",
			strMemo: "",
			strCreator: "Landing Page",
			intPromotionType: 0,
			strPromotionCode: "",
			strDomain: domain
		}
	};
	var errMsgList = {
		accountChar: "用户名需为大小写字母和数字组成",
		accountLength: "用户名需为8~16个字符",
		accountExist: "用户名已被使用",
		passwordChar: "密码需为大小写字母和数字组成",
		passwordLength: "密码需为6~20个字符",
		mobileErr: "非正确的手机格式",
		agentErr: "非可填用之代理人",
		age18Err: "如果您同意我们的条件和条款，且年满18岁，请勾选"
	};

	init();

	function init() {
		// disabled agent input field
		$(".suit").attr("disabled", "true");

		bindEvent();
		bindEventMobile();

		// get IP
		$.ajax({
			type: "POST",
	    	url: server + "/Utility/GetClientIPAddress",
	    	data: {inputdata:{}, token: ""},
	    	complete: function(response) {
	    		var result = response.responseJSON;
	    		if (result.Success === true) {
	    			ip = response.responseJSON.Result;
	    		} else {
	    			setErrMsg(result.Message, true);
	    			setErrMsg(result.Message, false);
	    		}
	    	},
	    	error: function(e) {
	    		console.log("Get IP Error!!");
	    	}
		});

		// affiliate related
		affiliateInfo = {
			advertisementID: "",
			Code: "",
			channelID: 0,
			intADSeqNo: -1
		};
		getPromotionCode();
		initAffiliate();
	}

	function bindEvent() {
		$("#username").focus(function(){
			$("#user_errs").show()
		});
		$("#username").blur(function(){
			$("#user_errs").hide()
		});
		$("#username").keyup(function(){
			checkAccountValid(this.value, false);
		});

		$("#password").focus(function(){
			$("#pw_errs").show()
		});
		$("#password").blur(function(){
			$("#pw_errs").hide()
		});
		$("#password").keyup(function(){
			checkPasswordValid(this.value, false);
		});

		$("#mobile").focus(function(){
			$("#mobile_errs").show()
		});
		$("#mobile").blur(function(){
			$("#mobile_errs").hide()
		});
		$("#mobile").keyup(function(){
			checkMobileValid(this.value, false);
		});

		$("#reg-btn").bind("click", function(){
			var user = $("#username").val();
			var password = $("#password").val();
			var mobile = $("#mobile").val();
			var code = getPromotionCode();

			register(user, password, mobile, code, false);
		});
	}

	function bindEventMobile() {
		$("#m_username").focus(function(){
			$("#m_user_errs").show()
		});
		$("#m_username").blur(function(){
			$("#m_user_errs").hide()
		});
		$("#m_username").keyup(function(){
			checkAccountValid(this.value, true);
		});

		$("#m_password").focus(function(){
			$("#m_pw_errs").show()
		});
		$("#m_password").blur(function(){
			$("#m_pw_errs").hide()
		});
		$("#m_password").keyup(function(){
			checkPasswordValid(this.value, true);
		});

		$("#m_mobile").focus(function(){
			$("#m_mobile_errs").show()
		});
		$("#m_mobile").blur(function(){
			$("#m_mobile_errs").hide()
		});
		$("#m_mobile").keyup(function(){
			checkMobileValid(this.value, true);
		});

		$("#m_reg-btn").bind("click", function(){
			var user = $("#m_username").val();
			var password = $("#m_password").val();
			var mobile = $("#m_mobile").val();
			var code = getPromotionCode();

			register(user, password, mobile, code, true);
		});
	}

	function checkAccountValid(value, isMobile) {
		var charVerify = /^\d*[a-zA-Z][a-zA-Z0-9]*$/;
		var valid = true;

		if (value.length < 8 || value.length > 16) {
			valid = false;
			isMobile? $("#m_user_err1").attr("class", "error") : $("#user_err1").attr("class", "error");
		} else {
			isMobile? $("#m_user_err1").attr("class", "correct") : $("#user_err1").attr("class", "correct");
		}

		if (!charVerify.test(value)) {
			valid = false;
			isMobile? $("#m_user_err2").attr("class", "error") : $("#user_err2").attr("class", "error");
		} else {
			isMobile? $("#m_user_err2").attr("class", "correct") : $("#user_err2").attr("class", "correct");
		}

		if (!valid){
			isMobile? $("#m_user_err3").attr("class", "error") : $("#user_err3").attr("class", "error");
			return;
		}

		$.ajax({
			type: "POST",
	    	url: server + "/SP/" + lang + "/MainAccountExists_Check",
	    	data: {
	    		inputdata:{
	    			strMainAccountID: value
	    		}, 
	    		token: ""
	    	},
	    	complete: function(response) {
	    		var result = response.responseJSON;
	    		if (result.Success === true) {
	    			isMobile? $("#m_user_err3").attr("class", "correct") : $("#user_err3").attr("class", "correct");
	    		} else {
	    			isMobile? $("#m_user_err3").attr("class", "error") : $("#user_err3").attr("class", "error");
	    		}
	    	},
	    	error: function(e) {
	    		console.log("Call API: MainAccountExists_Check Fail!!");
	    	}
		});
	}

	function checkPasswordValid(value, isMobile) {
		var charVerify = /^[a-zA-Z0-9]+$/;

		if (value.length < 6 || value.length > 20) {
			isMobile? $("#m_pw_err1").attr("class", "error") : $("#pw_err1").attr("class", "error");
		} else {
			isMobile? $("#m_pw_err1").attr("class", "correct") : $("#pw_err1").attr("class", "correct");
		}

		if (!charVerify.test(value)) {
			isMobile? $("#m_pw_err2").attr("class", "error") : $("#pw_err2").attr("class", "error");
		} else {
			isMobile? $("#m_pw_err2").attr("class", "correct") : $("#pw_err2").attr("class", "correct");
		}
	}

	function checkMobileValid(value, isMobile) {
		var charVerify;
		if (lang === "vi-vn") {
			charVerify = /^[9]{1}[0-9]{8}$|^[1]{1}[0-9]{9}$/;
		} else if (lang === "th-th") {
			charVerify = /^[13689]{1}[0-9]{8}$/;
		} else {
			charVerify = /^[1]{1}[34578]{1}[0-9]{9}$/;
		}
		
		if (!charVerify.test(value)) {
			isMobile? $("#m_mobile_err1").attr("class", "error") : $("#mobile_err1").attr("class", "error");
		} else {
			isMobile? $("#m_mobile_err1").attr("class", "correct") : $("#mobile_err1").attr("class", "correct");
		}
	}

	function checkAge18Option(isMobile) {
		if (isMobile) {
			if (!$("#m_check1").prop("checked")) {
				setErrMsg(errMsgList.age18Err, isMobile);
				return false;
			}
		} else {
			if (!$("#check1").prop("checked")) {
				setErrMsg(errMsgList.age18Err, isMobile);
				return false;
			}
		}
		return true;
	}
	
	function register(user, password, mobile, code, isMobile) {
		setErrMsg("", isMobile);

		registerData.inputdata.strMainAccountID = user;
		registerData.inputdata.strMainAccountPassword = password;
		registerData.inputdata.strContactNumber = mobile;
		registerData.inputdata.intPromotionType = affiliateInfo['typeID'] || 0;
		registerData.inputdata.strPromotionCode = affiliateInfo['DisplayID'] || "";

		if (!checkAge18Option(isMobile)) {
			return;
		}

		if (isMobile) {
			if ($("#regMobile .error").length > 0) {
				setTimeout(function() { $($("#regMobile .error")[0].parentElement).prev().find("input").focus() }, 1);
				return;
			}
		} else {
			if ($("#regPC .error").length > 0) {
				setTimeout(function() { $($("#regPC .error")[0].parentElement).prev().find("input").focus() }, 1);
				return;
			}
		}

		// if (!autoAff && $(".suit").val() !== "") {
		// 	// check affiliate
		// }

		switch(lang) {
			case 'vi-vn':
				registerData.inputdata.intCurrencyID = 16;
				registerData.inputdata.strAreaCode = "84";
				break;
			case 'th-th':
				registerData.inputdata.intCurrencyID = 18;
				registerData.inputdata.strAreaCode = "66";
				break;
			case 'zh-cn':
			default:
				registerData.inputdata.intCurrencyID = 2;
				registerData.inputdata.strAreaCode = "86";
				break;
		}
		
		openWnd = window.open("", "_blank");
		// create account
		$.ajax({
			type: "POST",
        	url: server + "/SP/" + lang + "/MainAccount_Create",
        	data: registerData,
        	complete: function(response) {
        		var result = response.responseJSON;
        		if (result.Success === true) {
        			createRegisterLog(registerData.inputdata.strMainAccountID);
        			// Login
        			login(isMobile);
        		} else {
        			setErrMsg(result.Message, isMobile);
        			openWnd.close();
        		}
        	},
        	error: function(e) {
        		var ret = "Error!!";
        		ret += e;
        		console.log(ret);
        	}
    	});
	}

	function login(isMobile) {
		var parser = new UAParser();
        var _browser = parser.getBrowser();

		var loginData = {
            intLoginType: isMobile? 2: 1, //1:帳號 2:手機 3:Email
            strLoginItem: registerData.inputdata.strMainAccountID,
            strPassword: registerData.inputdata.strMainAccountPassword,
            IovationBlackBox: document.getElementById('blackBox').value,
            RuleSet: "login",
            strDomain: domain,
            strBrowserType: _browser.name + " " + _browser.major,
            strBrowserResolution: window.outerWidth + "*" + window.outerHeight
        };

        // login
		$.ajax({
			type: "POST",
        	url: server + "/SP/" + lang + "/MainAccount_Login",
        	data: {
        		inputdata: loginData, 
        		token: ""
			},
        	complete: function(response) {
        		var result = response.responseJSON;
        		if (result.Success === true) {
        			// redirect to vwin with login status
        			var url;
        			if (isMobile) {
        				url = vwinMobileUrl;
        			} else {
        				url = vwinUrl + "affiliate/loginlp?user=" + registerData.inputdata.strMainAccountID + "&token=" + result.Result[0].Token;
        			}
        			openWnd.location.href = url;
        		} else {
        			setErrMsg(result.Message, isMobile);
        			openWnd.close();
        		}
        	},
        	error: function(e) {
        		var ret = "Error!!";
        		ret += e;
        		console.log(ret);
        	}
    	});
	}

	function initAffiliate() {
		if (affiliateInfo['type'] && affiliateInfo['id']) {
			autoAff = true;
			$(".suit").attr("disabled", true);
			affiliateInfo['typeID'] = getType(affiliateInfo['type'].toLowerCase());

			var idNumber = parseInt(affiliateInfo['id'], 10);

			switch(affiliateInfo['typeID']) {
				case 1:
					// advertisement
					affiliateInfo['DisplayID'] = affiliateInfo['id'];

					$.ajax({
						type: "POST",
			        	url: server + "/SP/" + lang + "/Advertisement_GetParameterByID",
			        	data: {
			        		inputdata: {
			        			intBrandID: BRANDID,
			        			intUrlID: idNumber
			        		}, 
			        		token: ""
			        	},
			        	complete: function(response) {
			        		var result = response.responseJSON;
			        		if (result.Success === true) {
			        			for (var i = 0; i < result.Result.length; i++) {
			        				if (result.Result[i].Key === "AdvertisementID") {
			        					affiliateInfo['advertisementID'] = result.Result[i].Value;
                                    }
                                    if (result.Result[i].Key === "ChannelID") {
                                        affiliateInfo['channelID'] = parseInt(result.Result[i].Value, 10);
                                    }
			        			}
			        			$(".suit").val(affiliateInfo['DisplayID']);
			        			createLinkLog();
			        		} else {
			        			console.log("Advertisement_GetParameterByID: " + result.Message);
			        		}
			        	},
			        	error: function(e) {
			        		var ret = "Error!!";
			        		ret += e;
			        		console.log(ret);
			        	}
			    	});
					break;
				case 3:
					// agent
					$.ajax({
						type: "POST",
			        	url: server + "/SP/" + lang + "/AffAccount_GetUrlParameter",
			        	data: {
			        		inputdata: {
			        			intBrandID: BRANDID,
			        			UrlParameterID: idNumber
			        		}, 
			        		token: ""
			        	},
			        	complete: function(response) {
			        		var result = response.responseJSON;
			        		if (result.Success === true) {
			        			for (var i = 0; i < result.Result.length; i++) {
			        				if (result.Result[i].Key === "AF") {
			        					affiliateInfo['Code'] = result.Result[i].Value;
			        					affiliateInfo['DisplayID'] = result.Result[i].Value;
                                    }
                                    if (result.Result[i].Key === "AD") {
                                        affiliateInfo['intADSeqNo'] = parseInt(result.Result[i].Value, 10);
                                    }
                                    if (result.Result[i].Key === "CH") {
                                        affiliateInfo['channelID'] = parseInt(result.Result[i].Value, 10);
                                    }
			        			}
			        			$(".suit").val(affiliateInfo['DisplayID']);
			        			createLinkLog();
			        		} else {
			        			console.log("AffAccount_GetUrlParameter: " + result.Message);
			        		}
			        	},
			        	error: function(e) {
			        		var ret = "Error!!";
			        		ret += e;
			        		console.log(ret);
			        	}
			    	});
					break;
				case 4: 
					// friend
					$.ajax({
						type: "POST",
			        	url: server + "/SP/" + lang + "/MainAccountReferralParameter_Get",
			        	data: {
			        		inputdata: {
			        			intBrandID: BRANDID,
			        			intPromotionID: idNumber
			        		}, 
			        		token: ""
			        	},
			        	complete: function(response) {
			        		var result = response.responseJSON;
			        		if (result.Success === true) {
			        			for (var i = 0; i < result.Result.length; i++) {
			        				if (result.Result[i].Key === "MainAccountID") {
			        					affiliateInfo['DisplayID'] = result.Result[i].Value;
			        					break;
                                    }
			        			}
			        			$(".suit").val(affiliateInfo['DisplayID']);
			        		} else {
			        			console.log("MainAccountReferralParameter_Get: " + result.Message);
			        		}
			        	},
			        	error: function(e) {
			        		var ret = "Error!!";
			        		ret += e;
			        		console.log(ret);
			        	}
			    	});
					break;
				default:
					break;
			}
		}
	}

	function createLinkLog() {
		var data = {};
		data.intIDType = getType(affiliateInfo['type'].toLowerCase());
		data.strAdvertisementID = affiliateInfo.advertisementID;
        data.strAffiliateCode = affiliateInfo.Code;
        data.intChannelID = affiliateInfo.channelID;
        data.strMemo = "";
        data.strCreator = "Landing Page";
        data.strIPAddress = ip;
        data.intADSeqNo = affiliateInfo.intADSeqNo;
        data.strChannelType = "W";

		$.ajax({
			type: "POST",
        	url: server + "/SP/" + lang + "/History_AdvertisementLog_Create",
        	data: {
        		inputdata: data, 
        		token: ""
        	},
        	complete: function(response) {
        		var result = response.responseJSON;
        		if (result.Success === true) {
        			affiliateInfo.GUID = result.Result[0].GUID;
        		} else {
        			console.log(result.Message);
        		}
        	},
        	error: function(e) {
        		var ret = "Error!!";
        		ret += e;
        		console.log(ret);
        	}
    	});
	}

	function createRegisterLog(user) {
		if (affiliateInfo['type'] && affiliateInfo['id'] && affiliateInfo['GUID']) {
			var data = {};
			data.intBrandID = BRANDID;
			data.intGUID = affiliateInfo['GUID'];
			data.strMainAccountID = user;
			data.intLinkType = getType(affiliateInfo['type'].toLowerCase());

			$.ajax({
				type: "POST",
	        	url: server + "/SP/" + lang + "/History_advertisementlog_update",
	        	data: {
	        		inputdata: data, 
	        		token: ""
	        	},
	        	complete: function(response) {
	        		var result = response.responseJSON;
	        		if (result.Success === true) {
	        			affiliateInfo = {};
	        		} else {
	        			console.log(result.Message);
	        		}
	        	},
	        	error: function(e) {
	        		var ret = "Error!!";
	        		ret += e;
	        		console.log(ret);
	        	}
    		});
		}	
	}

	function getPromotionCode() {
		// default value of promotion code
		var defaultCode = "";
		var href = window.location.search.substring(1);
		if (href !== "") {
			parseArgs(href);
		}
	}

	function parseArgs(str) {
		var tmp = str.split("&");
		for (var i = 0; i < tmp.length; i++) {
			var tmp2 = tmp[i].split("=");
			if (tmp2.length === 2) {
				affiliateInfo[tmp2[0].toLowerCase()] = tmp2[1];
			}
		}
	}

	function getType(type) {
		switch (type) {
			case 'a':
				// agent
				return 3;
				break;
			case 'b':
				// advertisement
				return 1;
				break;
			case 'c':
				// friend
				return 4;
				break;
			default:
				alert("Wrong type: " + type);
				return -1;
				break;
		}
	}

	function setErrMsg(msg, isMobile) {
		if (msg === "") {
			if (isMobile) {
				$("#m_errMsg").hide();
				$("#m_errMsg span").attr("class", "");
				$("#m_errMsg p").text("");
			} else {
				$("#errMsg").hide();
				$("#errMsg span").attr("class", "");
				$("#errMsg p").text("");
			}
		} else {
			if (isMobile) {
				$("#m_errMsg p").text(msg);
				$("#m_errMsg span").attr("class", "error");
				$("#m_errMsg").show();
			} else {
				$("#errMsg p").text(msg);
				$("#errMsg span").attr("class", "error");
				$("#errMsg").show();
			}
			
		}
	}
})