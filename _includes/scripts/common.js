(function () {
  var $root = document.getElementsByClassName('root')[0];
  if (window.hasEvent('touchstart')) {
    $root.dataset.isTouch = true;
    document.addEventListener('touchstart', function(){}, false);
  }

  function getUrlParams(url) {
    const _url = url || window.location.href;
    const _urlParams = _url.match(/([?&])(.+?=[^&]+)/igm);
    return _urlParams ? _urlParams.reduce((a, b) => {
        const value = b.slice(1).split('=');
        a[value[0]] = value[1]
        return a;
    }, {}) : {};
}
  var urlParams = getUrlParams();
  if(urlParams && urlParams.from && urlParams.from != "/"){
    setTimeout(toHistory,1200)
  }

  function toHistory (){
    window.location.href = window.location.origin + urlParams.from;
  }
    
  if($(".athcor_li")){
    $(".athcor_li").bind("click touch",function(){
      $('html,body').animate({scrollTop: ($($(this).attr('href')).offset().top -50 )},500);
    });
  }
  
})();



