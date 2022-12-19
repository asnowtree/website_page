/*(function () {

})();*/

var userLogin = 0;

var h2Text = "分析 输出~ 解决你的需求...";
var i = 0;
var j = h2Text.length;
function typing() {
    var pringDiv = document.getElementById("pringDiv");
    pringDiv.innerHTML += h2Text.charAt(i);
    i++;
    var id = setTimeout(typing, 200);
    if (i == h2Text.length) {
        clearTimeout(id);
        j = h2Text.length;
        setTimeout(tPrint, 20000);
    }
}
function tPrint() {

    var pringDiv = document.getElementById("pringDiv");
    var tContent = pringDiv.innerHTML;
    j = 0;
    if (j >= 0) {
        pringDiv.innerHTML = pringDiv.innerHTML.substring(0, 7);
    }
    var id = setTimeout(tPrint, 200);
    if (j == 0) {
        clearTimeout(id);
        // typing();
        i = 0;
        setTimeout(typing, 2000);
    }
}
window.onload = function () {
    typing();
}