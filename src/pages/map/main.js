/*
* @Author: fanger
* @Date:   2018-04-16 12:34:35
 * @Last Modified by: Teaism
 * @Last Modified time: 2018-06-22 17:39:30
*/

import './style.scss';
// const addressDate from  = require('./addressData.js');
import addressDate from './addressData.js'

//          第三方InfoBox时保存上次打开的窗口
var infoBoxTemp = null;
//客户信息
var customerAddresses = null;
//地图对象
var map = null;

var markerClusterer = null;
/**
 * 绑定页面回车事件，以及初始化页面时的光标定位
 * @formId
 *          表单ID
 * @elementName
 *          光标定位在指点表单元素的name属性的值
 * @submitFun
 *          表单提交需执行的任务
 */
$(function () {
    // ============================  地图相关js  ============================
    //哈尔滨
    //var lat =45.766474;//126.608858;
    //var lng =126.641694;//45.709509;

    //所有客户地址信息
    // customerAddresses = ${customerAddress};
    customerAddresses = addressDate
    viewCustomerMap();
});

function initMap() {
    map = new BMap.Map("mapDiv");
    map.centerAndZoom(new BMap.Point(126.563976, 45.799739), 5);
    map.enableScrollWheelZoom();
}

function viewCustomerMap() {
    initMap();
    var markers = [];
    var pt, marker, label;
    for (var i = 0; i < customerAddresses.length; i++) {
        var customerAddress = customerAddresses[i];
        // if ((null == customerAddress.type && $.inArray("other", chk_value) >=0) || $.inArray(customerAddress.type, chk_value) >=0 ){
        // if ((null == customerAddress.type){
        pt = new BMap.Point(customerAddress.operatingLng, customerAddress.operatingLat);
        marker = new BMap.Marker(pt, {
            icon: new BMap.Icon("http://118.190.235.31/template/default/_resources/images/mapShop.png", new BMap.Size(29, 23), {
                anchor: new BMap.Size(7, 20)
            })
        });
        //绑定自定义属性
        marker.meta = {
            id: customerAddress.id,
            name: customerAddress.name,
            address: customerAddress.address
        };
        //   map.addOverlay(marker);
        //标签显示在图标下方
        label = new window.BMap.Label(customerAddress.name, {
            offset: new window.BMap.Size(-36, 25)
        });
        label.setStyle({
            width: '100px',
            textAlign: 'center',
            border: '0px',
            background: "transparent none repeat"
        });
        marker.setLabel(label);
        //鼠标悬停时显示
        marker.setTitle(marker.meta.name);
        marker.addEventListener("click", function (e) {
            //第三方InfoBox
            if (infoBoxTemp) {
                infoBoxTemp.close();
            }
            var content = [this.meta.address];
            var opts = {
                "boxStyle": {
                    width: "300px",
                    height: "50px",
                    background: "#fff",
                    border: "1px solid #118bde"
                },
                "closeIconUrl": "https://findicons.com/files/icons/131/software/16/cancel.png"
            }
            var infoBox = new BMapLib.InfoBox(map, content, opts);
            infoBoxTemp = infoBox;
            infoBox.open(this);
        });
        markers.push(marker);
        // }
    }
    //  alert(markers.length);
    //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
    markerClusterer = new BMapLib.MarkerClusterer(map, {
        markers: markers
    });
    // }

}

// 搜索
function G(id) {
    return document.getElementById(id);
}
var ac = new BMap.Autocomplete( //建立一个自动完成的对象
    {
        "input": "suggestId",
        "location": map
    });

ac.addEventListener("onhighlight", function (e) { //鼠标放在下拉列表上的事件
    var str = "";
    var _value = e.fromitem.value;
    var value = "";
    if (e.fromitem.index > -1) {
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

    value = "";
    if (e.toitem.index > -1) {
        _value = e.toitem.value;
        value = _value.province + _value.city + _value.district + _value.street + _value.business;
    }
    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
    G("searchResultPanel").innerHTML = str;
});

var myValue;
ac.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
    var _value = e.item.value;
    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

    setPlace();
});

function setPlace() {
    map.clearOverlays(); //清除地图上所有覆盖物
    function myFun() {
        var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        map.centerAndZoom(pp, 18);
        map.addOverlay(new BMap.Marker(pp)); //添加标注
    }
    var local = new BMap.LocalSearch(map, { //智能搜索
        onSearchComplete: myFun
    });
    local.search(myValue);
}