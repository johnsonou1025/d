(function () {
    $.fn.PushMenu = function (options) {
        var args = arguments, returnValue;
        this.each(function () {
            var instance = this, $this = $(this),
                    clickEventType,
                    dragEventType;

            var settings = $.extend({
                M_IconWidth: 40,                //icon寬度
                M_MenuWidth: 161,               //menu寬度
                M_MemberWidth: 227,             //會員投注單寬度
                M_Speed: 500,                   //動畫速度
                M_ResizeSpeed: 0,
                M_WindowSize: 0,             //menu 右邊content寬度
                M_Width: 1680,                  //要放大/縮小的width
                IsUseElasticity: false,
                IsExpand: true,
                RightContent: $("html"),
                MainContent: 'main-content-wrapper',
                RightMenuName: 'aside-title-right',
                M_Member: null,
             //   ExpandClass: "mm-opened",
               // CollapseClass: "mm-close",
                LeftMenuName: "left-aside",
                IsOpenedRightMenu: true,
                Elasticity: 16,
                $M_MainWrapper: undefined,
                $M_MenuItem: undefined,
                onCollapse: function () { },
                onExpand: function () { },
                onTitleItemClick: function () { },
                onMenuClick: function () { },
                onSubMenuClick: function () { }
            }, options || {});

            // Store a settings reference withint the element's data
            if (!$.data(instance, 'pushmenu')) {
                $.data(instance, 'pushmenu', settings);
                instance.settings = $.data(instance, 'pushmenu');
            }

            var methods = {
                //Initialize menu
                init: function () {
                    return initialize.apply(this, Array.prototype.slice.call(arguments));
                },
                // Collapse menu
                collapse: function () {
                    return collapseMenu.apply(this, Array.prototype.slice.call(arguments));
                },
                // Expand menu
                expand: function () {
                    return expandMenu.apply(this, Array.prototype.slice.call(arguments));
                },
                // Collapse item
                collapseItem: function () {
                    return collapseItem.apply(this, Array.prototype.slice.call(arguments));
                },
                // expand item
                expandItem: function () {
                    return expandItem.apply(this, Array.prototype.slice.call(arguments));
                },
                //window resize
                updateSize: function () {
                    return updateSize.apply(this, Array.prototype.slice.call(arguments));
                },
                //collapse rightmenu
                collapseRight: function () {
                    return collapseRight.apply(this, Array.prototype.slice.call(arguments));
                },
                //expand rightmenu
                expandRight: function () {
                    return expandRight.apply(this, Array.prototype.slice.call(arguments));
                }
            };

            // IE 8 and modern browsers, prevent event propagation
            function stopEventPropagation(e) {
                if (e.stopPropagation && e.preventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                else {
                    e.cancelBubble = true;
                    e.returnValue = false;
                }
            }

            // propagate event to underneath layer
            // http://jsfiddle.net/E9zTs/2/
            function propagateEvent($element, event) {
                if ($element == undefined || event == undefined) return false;
                $element.on(event, function (e, ee) {
                    $element.hide();
                    try {
                        ee = ee || {
                            pageX: e.pageX,
                            pageY: e.pageY
                        };
                        var next = document.elementFromPoint(ee.pageX, ee.pageY);
                        next = (next.nodeType == 3) ? next.parentNode : next //Opera
                        $(next).trigger(event, ee);
                    }
                    catch (err) {
                        $.error('Error while propagating event: ' + err.message);
                    }
                    finally {
                        $element.show();
                    }
                });
            }

            // Initialize menu level push menu
            function initialize() {
                var m_settings = instance.settings;
                //                $this.bind(clickEventType, function (e) {
                //                    instance.settings.$M_MainWrapper = $("." + instance.settings.MainContent);
                //                    titleIconClick(e);
                //                });

                m_settings.$M_MenuItem = $("." + instance.settings.LeftMenuName);
                m_settings.$M_MenuItem.off(clickEventType, "a.title").on(clickEventType, "a.title", function (e) {
                    //為了判斷是否為滾球，要另外處理
                    var flag = m_settings.onMenuClick.apply(this, Array.prototype.slice.call([e, $this, m_settings]));
                    if (flag == false) {
                        return;
                    }

                    var $this = $(this).next(); //.parent("li").find("ul");
                    var veachmenutypesubFunc = function (i, item) {
                        item = $(item);
                        if (item.attr('id') == $this.attr("id")) {
                            if (item.is(':hidden')) {
                                item.slideDown(m_settings.M_Speed).parent().addClass("open-drop");
                            } else {
                                item.slideUp(m_settings.M_Speed).parent().removeClass("open-drop");
                            }

                        } else {
                            item.slideUp(m_settings.M_Speed).parent().removeClass("open-drop");
                        }
                    };
                    $('ul[rel=ul_subleftmenu] , #ul_SportsLiveSubMenu').each(veachmenutypesubFunc);
                    $("#li_live_btn").removeClass("open-drop");
                    veachmenutypesubFunc = null;
                });
                return $this;
            }

            function SetsidemenuWidth() {
                if (instance.settings.IsUseElasticity) {
                    instance.settings.M_WindowSize = $(window).width() + Elasticity;
                }
                else {
                    var windowWitdh = $("body").width();
                    var mdevice = false; //測試時設定為true，如正常取得device時，須改為false
                    //MOBILEDEVICE = 'false@@apple@@iphone';
                    if (typeof MOBILEDEVICE != "undefined") {
                        var mdevicearr = MOBILEDEVICE.split('@@');
                        if (mdevicearr[0].toLowerCase() == "true") {
                            mdevice = true;
                        }
                    }

                    if (windowWitdh < 1024) {
                        if (mdevice == false) {//不是PAD時，固定寬度1024
                            instance.settings.M_WindowSize = 1024;
                        }
                        else if (mdevice == true && windowWitdh < 768) {//是PAD時，隨固定寬度
                            instance.settings.M_WindowSize = 768;
                        }
                        else {
                            instance.settings.M_WindowSize = windowWitdh;
                        }
                    }
                    else {
                        instance.settings.M_WindowSize = windowWitdh;
                    }

                    if (instance.settings.M_WindowSize <= 1279) {
                        instance.settings.M_MenuWidth = 161;
                        instance.settings.M_MemberWidth = 227;
                    }
                    else if (instance.settings.M_WindowSize >= 1280) {
                        instance.settings.M_MenuWidth = 161;
                        instance.settings.M_MemberWidth = 227;
                    }
                    else {
                        instance.settings.M_MenuWidth = 161;
                        instance.settings.M_MemberWidth = 227;
                    }
                }
                var mdevice = false; //測試時設定為true，如正常取得device時，須改為false
                //MOBILEDEVICE = 'false@@apple@@iphone';
                if (typeof MOBILEDEVICE != "undefined") {
                    var mdevicearr = MOBILEDEVICE.split('@@');
                    if (mdevicearr[0].toLowerCase() == "true") {
                        mdevice = true;
                    }
                }
                //                if (mdevice) {
                //                    instance.settings.IconWidth = 48;
                //                    if (instance.settings.M_WindowSize == 1024) {
                //                        instance.settings.MemberWidth = 220;
                //                        instance.settings.MenuWidth = 170;
                //                    }
                //                    else if (instance.settings.M_WindowSize == 768) {
                //                        instance.settings.MemberWidth = 0;
                //                        instance.settings.MenuWidth = 170;
                //                    }
                //                    else {
                //                        instance.settings.MemberWidth = 220;
                //                        instance.settings.MenuWidth = 170;
                //                    }
                //                }
                //                else {
                //                    instance.settings.IconWidth = 40;
                //                    instance.settings.MemberWidth = 220;
                //                    instance.settings.MenuWidth = 170;
                //                }
                //報表頁不顯示投注單
                //if ($("#div_OrderRecent").is(":visible") || $("#div_QueryHistory").is(":visible") || $("#div_QueryOrder").is(":visible")) {
            }

            function titleIconClick(e) {
                stopEventPropagation(e);
                if (instance.settings.$M_MainWrapper.is(":animated")) return false;

                if (!instance.settings.IsExpand) {
                    instance.settings.onExpand.apply(this, Array.prototype.slice.call([e, $this, instance.settings]));
                    expandMenu();
                }
                else {
                    collapseItem();
                    instance.settings.onCollapse.apply(this, Array.prototype.slice.call([e, $this, instance.settings]));
                    collapseMenu();
                }
            };
            // Expand menu
            function expandMenu() {
                SetsidemenuWidth();
                var m_settings = instance.settings;
                m_settings.M_Width = m_settings.M_WindowSize - m_settings.M_MenuWidth - m_settings.M_MemberWidth;
                m_settings.$M_MainWrapper.stop().animate({ width: m_settings.M_Width, left: m_settings.M_MenuWidth }, m_settings.M_ResizeSpeed, function () {
                    m_settings.RightContent.removeClass(m_settings.CollapseClass).addClass(m_settings.ExpandClass);
                });
                m_settings.IsExpand = true
            }

            // Collapse menu
            function collapseMenu() {
                SetsidemenuWidth();
                var m_settings = instance.settings;
                m_settings.M_Width = m_settings.M_WindowSize - m_settings.M_IconWidth - m_settings.M_MemberWidth;
                m_settings.$M_MainWrapper.stop().animate({ width: m_settings.M_Width, left: m_settings.M_IconWidth }, m_settings.M_ResizeSpeed, function () {
                    m_settings.RightContent.removeClass(m_settings.ExpandClass).addClass(m_settings.CollapseClass);
                });
                m_settings.IsExpand = false;
            }

            // Collapse item
            function collapseItem() {
                var $arg = arguments[0];
                var m_settings = instance.settings;
                $(".open-drop").removeClass("open-drop");
                if ($arg == undefined) {
                    m_settings.$M_MenuItem.find("li>ul").each(function () {
                        var item = $(this)
                        item.slideUp(m_settings.M_Speed);
                    });
                }
                else {
                    m_settings.$M_MenuItem.find("li>ul").eq($arg).stop().slideUp(m_settings.M_Speed);
                }
            }

            // expand item
            function expandItem() {
                var $arg = arguments[0], returnValue = false, m_settings = instance.settings;
                if ($arg == undefined) {
                    return returnValue;
                }
                $(".open-drop").removeClass("open-drop");
                m_settings.$M_MenuItem.find("li>ul").eq($arg).stop().slideDown(m_settings.M_Speed).parent().addClass("open-drop");
            }

            // Collapse Right
            function collapseRight() {
                var m_settings = instance.settings;
                if (m_settings.$M_MainWrapper == undefined) {
                    m_settings.$M_MainWrapper = $("." + m_settings.MainContent);
                }
                m_settings.IsOpenedRightMenu = false;
                SetsidemenuWidth();
                $("." + m_settings.RightMenuName).hide();
                m_settings.M_Width = m_settings.M_WindowSize - m_settings.M_MenuWidth;
                m_settings.$M_MainWrapper.stop().animate({ width: m_settings.M_Width, left: m_settings.M_MenuWidth }, m_settings.M_ResizeSpeed);
            }

            // expand Right
            function expandRight() {
                var m_settings = instance.settings;
                if (m_settings.$M_MainWrapper == undefined) {
                    m_settings.$M_MainWrapper = $("." + m_settings.MainContent);
                }
                m_settings.IsOpenedRightMenu = true;
                SetsidemenuWidth();
                $("." + m_settings.RightMenuName).show();
                m_settings.M_Width = m_settings.M_WindowSize - m_settings.M_MenuWidth - m_settings.M_MemberWidth;
                m_settings.$M_MainWrapper.stop().animate({ width: m_settings.M_Width, left: m_settings.M_MenuWidth }, m_settings.M_ResizeSpeed);
            }

            function titleClick() {
                return $this;
            }

            function updateSize() {
                var m_settings = instance.settings;
                if (m_settings.$M_MainWrapper == undefined) {
                    m_settings.$M_MainWrapper = $("." + m_settings.MainContent);
                }
                SetsidemenuWidth();
                m_settings.IsExpand = true;
                m_settings.M_Width = m_settings.M_WindowSize - m_settings.M_MenuWidth;
                if (m_settings.IsOpenedRightMenu) {
                    m_settings.M_Width -= m_settings.M_MemberWidth;
                }
                m_settings.$M_MainWrapper.css("width", m_settings.M_Width).css("left", m_settings.M_MenuWidth);
                m_settings.RightContent.removeClass(m_settings.CollapseClass).addClass(m_settings.ExpandClass);
                //m_settings.$M_MainWrapper.css("min-height", window.innerHeight).css("max-height", window.innerHeight);
                //$("." + m_settings.LeftMenuName + " , ." + m_settings.RightMenuName).css("min-height", window.innerHeight).css("max-height", window.innerHeight);
                $("." + m_settings.LeftMenuName).width(m_settings.M_MenuWidth);
                $("." + m_settings.RightMenuName).width(m_settings.M_MemberWidth);
            }

            // Mobile check
            // http://coveroverflow.com/a/11381730/989439
            function mobileCheck() {
                var check = false;
                (function (a) { if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            }

            if (mobileCheck()) {
                clickEventType = 'touchend';
                dragEventType = 'touchmove';
            }
            else {
                clickEventType = 'click';
                dragEventType = 'mousedown';
            }

            // Invoke called method or init
            if (methods[options]) {
                returnValue = methods[options].apply(this, Array.prototype.slice.call(args, 1));
                return returnValue;
            } else if (typeof options === 'object' || !options) {
                returnValue = methods.init.apply(this, arguments);
                return returnValue;
            } else {
                $.error('No ' + options + ' method found in jQuery.pushmenu');
            }

            // Return object instance or option value
            if (!returnValue) {
                returnValue = this;
            }
        });
        return returnValue;
    };
})();