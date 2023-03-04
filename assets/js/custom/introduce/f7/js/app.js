// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'mukiApp', // App bundle ID
  name: '', // App name alert上面的名稱
  theme: 'auto', // Automatic theme detection
  //滑動開啟左側選單
  panel: {
      swipe: 'left',
  },
  // IOS 左滑回上頁功能關閉
  iosSwipeBack: false,
  // 暫存設定
  view: {
      xhrCache: true, // 頁面暫存
      xhrcacheDuration: 1000 * 60 * 0, // 頁面暫存時間
  },
  // App root data
  data: function () {
  },
  // App root methods
  methods: {
  },
  // App routes
  routes: routes,
  // 解決TAB換頁卷軸不正常問題
  on: {
      pageAfterIn: function(page){
          page.$el.css('overflow', 'hidden');
          setTimeout(function(){
              page.$el.css('overflow', 'auto');
          },0)
      }
  },
  //android 選取區塊開放菜單的設定
  touch: {
    tapHold:true,
    fastClicks:true,
    materialRipple:true,
    activeState:true,
    disableContextMenu:false
    }
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
    url: '/'
});

$$(document).on('page:afterin', function (e, page) {
  //在PAGE裡面使用 SCRIPT
  $$(".page-current").find("script").each(function (el) {
    if ($$(this).attr('src')) {
      var s = document.createElement('script');
      s.src = $$(this).attr('src');
      $$('head').append(s);
    } else {
      eval($$(this).text());
    }
  });

});



