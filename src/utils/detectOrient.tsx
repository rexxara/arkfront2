// 利用 CSS3 旋转 对根容器逆时针旋转 90 度
var detectOrient = function () {
    var width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight,
        $wrapper = document.body,
        style = "";

    if (width >= height) { // 横屏
        style += "width:" + width + "px;";  // 注意旋转后的宽高切换
        style += "height:" + height + "px;";
        style += "-webkit-transform: rotate(0); transform: rotate(0);";
        style += "-webkit-transform-origin: 0 0;";
        style += "transform-origin: 0 0;";
    }
    else { // 竖屏
        style += "width:" + height + "px;";
        style += "height:" + width + "px;";
        style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
        // 注意旋转中点的处理
        style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
        style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
        style += "transform:scale (2,2);"
    }
    $wrapper.style.cssText = style;
}
window.onresize = detectOrient;
export default detectOrient
