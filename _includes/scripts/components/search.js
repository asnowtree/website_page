
(function () {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    // search panel
    var search = (window.search || (window.search = {}));
    var useDefaultSearchBox = window.useDefaultSearchBox === undefined ?
      true : window.useDefaultSearchBox ;

    var $searchModal = $('.js-page-search-modal');
    var $searchToggle = $('.js-search-toggle');
    var $faBarToggle = $('.fa-bars-toggle');
    var navigationUl = document.getElementsByName('.navigation ul');
    var $navigationUl = $('.navigation ul')[0];
    var searchModal = $searchModal.modal({ onChange: handleModalChange, hideWhenWindowScroll: true });
    var modalVisible = false;
    search.searchModal = searchModal;

    var $searchBox = null;
    var $searchInput = null;
    var $searchClear = null;

    function getModalVisible() {
      return modalVisible;
    }
    search.getModalVisible = getModalVisible;

    function handleModalChange(visible) {
      modalVisible = visible;
      if (visible) {
        search.onShow && search.onShow();
        useDefaultSearchBox && $searchInput[0] && $searchInput[0].focus();
      } else {
        search.onShow && search.onHide();
        useDefaultSearchBox && $searchInput[0] && $searchInput[0].blur();
        setTimeout(function() {
          useDefaultSearchBox && ($searchInput.val(''), $searchBox.removeClass('not-empty'));
          search.clear && search.clear();
          window.pageAsideAffix && window.pageAsideAffix.refresh();
        }, 400);
      }
    }

    $searchToggle.on('click', function() {
      modalVisible ? searchModal.hide() : searchModal.show();
    });
    $faBarToggle.on('click', function() {
      // if(navigationUl.style.display == 'none'){
      //   navigationUl.style.display = 'contents';
      // }else{
      //   navigationUl.style.display = 'none';
      // }

      if($navigationUl.style.display != 'contents'){
        $navigationUl.style.display = 'contents';
      }else{
        $navigationUl.style.display = 'none';
      }
    });
    // Char Code: 83  S, 191 /
    $(window).on('keyup', function(e) {
      if (!modalVisible && !window.isFormElement(e.target || e.srcElement) && (e.which === 191)) {
        modalVisible || searchModal.show();
      }
    });

    if (useDefaultSearchBox) {
      $searchBox = $('.js-search-box');
      $searchInput = $searchBox.children('input');
      $searchClear = $searchBox.children('.js-icon-clear');
      search.getSearchInput = function() {
        return $searchInput.get(0);
      };
      search.getVal = function() {
        return $searchInput.val();
      };
      search.setVal = function(val) {
        $searchInput.val(val);
      };

      $searchInput.on('focus', function() {
        $(this).addClass('focus');
      });
      $searchInput.on('blur', function() {
        $(this).removeClass('focus');
      });
      $searchInput.on('input', window.throttle(function() {
        var val = $(this).val();
        if (val === '' || typeof val !== 'string') {
          search.clear && search.clear();
        } else {
          $searchBox.addClass('not-empty');
          search.onInputNotEmpty && search.onInputNotEmpty(val);
        }
      }, 400));
      $searchClear.on('click', function() {
        $searchInput.val(''); $searchBox.removeClass('not-empty');
        search.clear && search.clear();
      });
    }

    var h_With,h_Height;
    window.onresize = function () {

      h_With = window.innerWidth//浏览器窗口的内部宽度（包括滚动条）
   
      || document.documentElement.clientWidth
      
      || document.body.clientWidth;
      
      h_Height = window.innerHeight//浏览器窗口的内部高度（包括滚动条）
   
      || document.documentElement.clientWidth
      
      || document.body.clientHeight;
  
      // h_With = document.body.clientWidth
       
      // || window.innerWidth//浏览器窗口的内部宽度（包括滚动条）会出现滚动条不优先考虑
       
      // || document.documentElement.clientWidth;
       
      // h_Height = document.body.clientHeight
       
      // || window.innerHeight//浏览器窗口的内部高度（包括滚动条）
       
      // || document.documentElement.clientWidth;
  
      
      // console.log(h_With, h_Height);
     
      if(h_With > 687){
        if($navigationUl.style.display != 'flex'){
          $navigationUl.style.display = 'flex';
        }
      }

      if(h_With <= 678){
        if($navigationUl.style.display != 'none' && $navigationUl.style.display != 'contents'){
          $navigationUl.style.display = 'none';
        }
      }
  
  }
  });
})();
