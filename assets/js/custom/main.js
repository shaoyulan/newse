const Device = {
  is_ios: null,
  is_ie: null,
  is_andorid: null,
  is_agent_mobile: null,
  is_mobile_size: null,
  is_devtool_mode: null,
  init: function() {
      var that = this;

      this.test_is_agent_mobile();
      this.test_is_devtool_mode();
      this.test_is_ie();
      this.test_is_ios();
      this.test_is_mobile_size();

      $(window).on('resize', function(){
          that.test_is_agent_mobile();
          that.test_is_devtool_mode();
          that.test_is_ie();
          that.test_is_ios();
          that.test_is_mobile_size();
      })
      
  },
  test_is_devtool_mode: function(){
      var that = this;
      var devtools = function () { };
      devtools.toString = function () {
          if (!this.opened) {
              that.is_devtool_mode = true;
          }
          this.opened = true;
      }
      devtools.toString()
  },
  test_is_ios: function() {
      this.is_ios = [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod'
      ].includes(navigator.platform)
          // iPad on iOS 13 detection
          || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  },
  test_is_ie: function(){
      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");

      this.is_ie =  msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)
  },
  test_is_agent_mobile: function () {
      this.is_agent_mobile = /(Android|iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)
  },
  test_is_mobile_size: function() {
      this.is_mobile_size = window.innerWidth <= 768 ? true :false;
  }
}

const Backdrop = {
  el: $('.global-backdrop'),
  show: function(){
      this.el.addClass('is-show')
  },
  hide: function () {
      this.el.removeClass('is-show')
  },
}

const Boot = {
  init: function() {

    parallaxSwiper.init()

      if (Device.is_ios) {
          $('body').addClass('is-ios')
      }

      $(window).on('resize', function(){
          if (Device.is_ios) {
              $('body').addClass('is-ios')
          }else{
              $('body').removeClass('is-ios')
          }
      })

      if (Device.is_mobile_size) {
          $('body').addClass('is-mobile-size')
      }

      if (Device.is_mobile_size) {
          $('body').addClass('is-mobile-size')
      }

      if (Device.is_agent_mobile) {
          $('body').addClass('is-agent-mobile')
      } else {
          $('body').removeClass('is-agent-pc')
      }

      if (Device.is_ie) {
          $('body').addClass('is-ie')
      } else {
          $('body').removeClass('is-ie')
      }


      $(window).on('resize', function () {
          Device.init();

          if (Device.is_mobile_size) {
              $('body').addClass('is-mobile-size')
          }else{
              $('body').removeClass('is-mobile-size')
          }

          if (Device.is_agent_mobile) {
              $('body').addClass('is-agent-mobile')
              $('body').removeClass('is-agent-pc')
          }else{
              $('body').removeClass('is-agent-mobile')
              $('body').addClass('is-agent-pc')
          }
      })

      // inpage
      if ( $('.p-index').length == 0 ) {
          $('body').addClass('is-inpage')
      }

      this.scrollBar();

  },
  scrollBar: function() {

      function setVar(){
          var scrollBarWidth = getScrollbarWidth();
          document.documentElement.style.setProperty('--scrollbar-width', scrollBarWidth + 'px');
      }

      setVar()

      $(window).on('resize', function(){
          setVar()
      })
  }
}

const ToolBox = {
  getFontSize: function(domEl){
      var result ;
      result = window.getComputedStyle(domEl, null).getPropertyValue('font-size')
      if ( result ) {
          return parseInt(result)
      }
  }
}

// page scroller
const pageScroller = {
  init: function (setting, forceInit) {
      var html = document.documentElement;
      var body = document.body;

      var scroller = {
          target: setting.target,
          ease: 0.1, // <= scroll speed
          endY: 0,
          y: 0,
          resizeRequest: 1,
          scrollRequest: 0,
      };

      var requestId = null;

      this.scroller = scroller;

      if (forceInit) {
          onLoad()
      } else {
          window.addEventListener("load", onLoad);
      }

      function onLoad() {
          updateScroller();
          window.focus();
          window.addEventListener("resize", onResize);
          document.addEventListener("scroll", onScroll);

          // 自訂重新refresh
          $("#grid-container").on('pluginResize.cbp', function () {
              // your functionality
              onCallUpdate();
          });

          $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
              console.log('tab shown')
              onCallUpdate();
          })
          // 自訂重新refresh (end)
      }

      function updateScroller() {
          var resized = scroller.resizeRequest > 0;
          var currentHeight = scroller.target.clientHeight;
          var bodyHeight = document.body.clientHeight;

          if (resized || currentHeight !== bodyHeight) {
              var height = scroller.target.clientHeight;

              if (height < window.innerHeight + 10) {
                  height = window.innerHeight + 10
              }

              anime({
                  targets: body,
                  height: height,
                  easing: 'linear',
                  duration: 50
              })
              // body.style.height = height + "px";
              scroller.resizeRequest = 0;
          }

          var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

          scroller.endY = scrollY;
          scroller.y += (scrollY - scroller.y) * scroller.ease;

          if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
              scroller.y = scrollY;
              scroller.scrollRequest = 0;
          }

          // TweenLite.set(scroller.target, {
          //     y: -scroller.y
          // });

          anime.set(scroller.target, {
              translateY: -scroller.y,
              // easing: 'easeOutCirc',
          })

          requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
      }

      function onScroll() {
          scroller.scrollRequest++;
          if (!requestId) {
              requestId = requestAnimationFrame(updateScroller);
          }
      }

      function onResize() {
          scroller.resizeRequest++;
          if (!requestId) {
              requestId = requestAnimationFrame(updateScroller);
          }
      }

      function onCallUpdate(data) {
          scroller.resizeRequest++;

          if (!requestId) {
              setTimeout(function () {
                  requestId = requestAnimationFrame(updateScroller);
              }, 100);

          }
      }
  },
}

const websiteBg = {
  init: function() {
      // $('.website-bg').css('height', $(window).height())

      // $(window).on('resize', function() {
      //     $('.website-bg').css('height', $(window).height())
      // })
  }
}

const parallaxSwiper = {
  swiper: null,
  letterTranslateOffset: null,
  fixedMenWidthToCount: null,
  interleaveOffset: 0.7,
  swiperBazier: BezierEasing(0.86, 0, 0.07, 1),
  updateVars: function () {
      this.letterTranslateOffset = Device.is_mobile_size ? window.innerWidth : window.innerWidth - $('.fixed-page-menu').width();
      this.fixedMenWidthToCount = Device.is_mobile_size ? 0 : $('.fixed-page-menu').width();
  },
  onWindowResize: function () {
      var that = this;
      this.updateVars();

      this.setSliderSize();

      setTimeout(function () {
          that.swiper.update()
      }, 2000)
  },
  setSliderSize: function () {
      var that = this;

      // Fixed safari 高度太高 導致 bottom bar 擋住
      $('.s-topbanner').css('height', $(window).height())

      $('.landing-hero-carousel').css({
          'width': window.innerWidth - that.fixedMenWidthToCount - getScrollbarWidth(),
          'min-width': window.innerWidth - that.fixedMenWidthToCount - getScrollbarWidth()
      });
  },
  init: function () {
      var that = this;
      // Params
      var mainSliderSelector = '.main-slider',
          navSliderSelector = '.nav-slider';
      // img 跟著走速率 越高越慢

      if ( !$('.main-slider').length ) return

      this.updateVars();

      that.setSliderSize();

      function toArray(obj) {
          var array = [];
          // iterate backwards ensuring that length is an UInt32
          for (var i = obj.length >>> 0; i--;) {
              array[i] = obj[i];
          }
          return array;
      }

      function shuffle(array) {
          var currentIndex = array.length, temporaryValue, randomIndex;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;

              // And swap it with the current element.
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
          }

          return array;
      }


      $('.landing-hero-carousel .des-wrap').each(function (idx1, item) {
          // node 是動態更新的物件
          // 要 forEach 操作前先 改成 cloned arr
          // 避免參照的idx錯誤
          var node_arr = toArray(item.childNodes);

          node_arr.forEach(function (node, idx2) {
              if (node.nodeType == 3) {
                  var daq = document.createDocumentFragment();
                  var to_replace = $(node.textContent.replaceAll(/\S/g, "<div class='letter' style='display:inline-block; overflow:hidden; will-change: transform;'><span style='display:inline-block'>$&</span></div>"));

                  to_replace.each(function (idx3, nd) {
                      daq.appendChild(nd)
                  })
                  node.replaceWith(daq)
              }
          })
      });


      var slideDesFontSize = $('.des-wrap .letter').length > 0 ? parseInt(window.getComputedStyle($('.des-wrap .letter')[0], null).getPropertyValue('font-size')) : 16;

      // Main Slider
      var mainSliderOptions = {
          loop: true,
          speed: 1000,
          autoplay: {
              delay: 8000
          },
          autoplay: false,
          loopAdditionalSlides: 10,
          grabCursor: true,
          watchSlidesProgress: true,
          pagination: {
              el: '.swiper-pagination',
              type: 'bullets',
              clickable: true
          },
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
          on: {
              init: function () {
                  this.autoplay.stop();
                  this.update()
              },
              imagesReady: function () {
                  this.el.classList.remove('loading');
                  // this.autoplay.start();
              },
              slideChangeTransitionStart: function () {

                  anime.set($(this.el).find('.swiper-slide-active .letter').toArray(), {
                      translateX: that.letterTranslateOffset,
                      // translateY: slideDesFontSize,
                      opacity: 0,
                  })

                  var ani = anime({
                      targets: shuffle($(this.el).find('.swiper-slide-active .letter').toArray()),
                      translateX: 0,
                      // translateY: 0,
                      opacity: 1,
                      easing: 'easeOutQuint',
                      delay: anime.stagger(anime.random(20, 50), { start: 0 }),
                      autoplay: false,
                      duration: 2500
                  })

                  ani.play()
                  setTimeout(function () {
                  }, 100)
              },
              slideChangeTransitionEnd: function () {
                  let swiper = this,
                      captions = swiper.el.querySelectorAll('.hero-des');

                  // 處理標題
                  for (let i = 0; i < captions.length; ++i) {
                      captions[i].classList.remove('show');
                  }

                  if (swiper.slides.length) {
                      swiper.slides[swiper.activeIndex].querySelector('.hero-des').classList.add('show');
                  }
              },

              // 處裡效果相關 
              progress: function (a, b) {
                  let swiper = this;
                  for (let i = 0; i < swiper.slides.length; i++) {
                      let slideProgress = swiper.slides[i].progress,
                          innerOffset = swiper.width * that.interleaveOffset,
                          innerTranslate = slideProgress * innerOffset;

                      swiper.slides[i].querySelector(".slide-bgimg").style.transform =
                          "translateX(" + innerTranslate + "px)";
                  }
              },
              touchStart: function () {
                  let swiper = this;
                  for (let i = 0; i < swiper.slides.length; i++) {
                      swiper.slides[i].style.transition = "";
                  }
              },
              setTransition: function (speed) {
                  let swiper = this;
                  for (let i = 0; i < swiper.slides.length; i++) {
                      swiper.slides[i].style.transition = speed + "ms";
                      swiper.slides[i].querySelector(".slide-bgimg").style.transition =
                          speed + "ms";
                  }
              },
              update: function (a, b, c) {
              }
          }
      };


      this.swiper = new Swiper(mainSliderSelector, mainSliderOptions);

      setTimeout(function () {
          that.swiper.update();
      }, 1000)

      $(window).on('resize', function () {
          that.onWindowResize();
      })
  }
}

const parallaxPlugin = function () {
  /* store information about the device */
  var Device = {
      touch: false,
      screenWidth: 0,
      screenHeight: 0,
      pixelRes: 1,
      parallax: true,
      initScreenHeight: 0,
      salesforce: false,
      init: function init() {
          /* Detect touch device */
          if ('ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
              Device.touch = true;
              document.body.classList.add('state-touch');
          } else {
              document.body.classList.add('state-no-touch');
          }
          /* Get pixel res */


          Device.pixelRes = window.devicePixelRatio;
          Device.chrome = navigator.userAgent.indexOf('Chrome') > -1;
          Device.explorer = navigator.userAgent.indexOf('MSIE') > -1;
          Device.firefox = navigator.userAgent.indexOf('Firefox') > -1;
          Device.safari = navigator.userAgent.indexOf("Safari") > -1;
          Device.opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;

          if (Device.chrome && Device.safari) {
              Device.safari = false;
          }

          if (Device.chrome && Device.opera) {
              Device.chrome = false;
          }

          if (Device.safari === true || Device.touch === true || Device.salesforce === true) {
              Device.parallax = false;
              document.body.classList.add('state-no-parallax');
          } else {
              document.body.classList.add('state-parallax');

              if (Device.chrome) {
                  document.body.classList.add('state-parallax-full');
              }
          }

          Device.refresh();
      },

      /* called on resize to collect information about the viewport */
      refresh: function refresh() {
          if (Device.screenWidth !== window.innerWidth && Device.touch === true) {
              Device.screenHeight = window.innerHeight;
          } else if (Device.touch === false) {
              Device.screenHeight = window.innerHeight;
          }

          if (Device.screenHeight === 0) {
              Device.screenHeight = window.innerHeight;
          }

          Device.screenWidth = window.innerWidth;
          Device.realScreenHeight = window.innerHeight;

          var _vh = Device.screenHeight * 0.01;

          document.documentElement.style.setProperty('--vh', _vh + 'px');

          var _rvh = Device.realScreenHeight * 0.01;

          document.documentElement.style.setProperty('--rvh', _rvh + 'px');
      }
  };
  var Scroll = {
      heightForcer: null,
      siteWrap: null,
      wrapHeight: 0,
      lastScrollPos: -1,
      scrollPos: 0,
      adjustScrollPos: 0,
      posOffset: 0,
      maxScrollPos: 0,
      fixedEls: [],
      loadObs: [],
      circObs: [],
      resizing: false,
      scrollDown: true,
      headerEl: null,
      menuButtonEl: null,
      headerScrollUp: false,
      headerAtTop: true,
      headerTimer: null,
      hasSplash: false,
      shopButton: null,
      notificationEl: null,
      init: function init() {
          Scroll.heightForcer = document.getElementById('js-height-forcer');
          // Scroll.siteWrap = document.getElementsByClassName('c-site-wrapper')[0];
          Scroll.notificationEl = document.getElementsByClassName('c-cart-notification')[0];
          /* Call the resize event to set everything up */

          Scroll.doResize();
      },
      setupPage: function setupPage() {
          Scroll.fixedEls = document.getElementsByClassName('js-fixed-el');
          Scroll.heightForcer.style.display = 'none';

          if (Device.parallax === true) {
              Scroll.heightForcer.style.display = 'block';
              // Scroll.wrapHeight = Scroll.siteWrap.clientHeight;
              Scroll.heightForcer.style.height = Scroll.wrapHeight + 'px';
              // Scroll.siteWrap.classList.add('state-parallax-fixed');
              Scroll.maxScrollPos = Math.floor(Scroll.wrapHeight - Device.screenHeight);
          } else {
              // Scroll.siteWrap.classList.remove('state-parallax-fixed');
              // Scroll.siteWrap.removeAttribute('style');

              // for (var _i = 0; _i < Scroll.fixedEls.length; _i++) {
              //     Scroll.fixedEls[_i].removeAttribute('style');
              // }
          }

          if (document.getElementsByClassName('c-brand-pos').length !== 0) {
              Scroll.checkReverse = true;
              Scroll.doReverse();
          } else {
              Scroll.checkReverse = false;
              document.body.classList.remove('state-reverse-header');
          }
      },
      doPage: function doPage() {
          // if (Device.parallax === true && Menu.open === false) {
          // Scroll.siteWrap.style.transform = 'translate3d(0px,' + (0 - Scroll.scrollPos) + 'px,0px)';

          // for (var _i = 0; _i < Scroll.fixedEls.length; _i++) {
          //     Scroll.fixedEls[_i].style.transform = 'translate3d(0px,' + Scroll.scrollPos + 'px,0px)';
          // }

          // Scroll.notificationEl.style.transform = 'translate3d(0px,' + Scroll.scrollPos + 'px,0px)';
          // }
      },
      doScroll: function doScroll() {
          Scroll.lastScrollPos = Scroll.scrollPos;

          var _newPos = Math.floor(window.pageYOffset);


          if (Boot.pageLoaded === false) {
              _newPos = 0;
          }

          if (Scroll.lastScrollPos !== _newPos && Menu.open === false) {
              if (_newPos < Scroll.scrollPos) {
                  if (Scroll.scrollDown !== false) {
                      document.body.classList.add('state-scroll-up');
                  }

                  Scroll.scrollDown = false;
              } else {
                  if (Scroll.scrollDown !== true) {
                      document.body.classList.remove('state-scroll-up');
                  }

                  Scroll.scrollDown = true;
              }


              Scroll.scrollPos = _newPos;

              if (Device.portrait === false && Device.touch === false) {
                  Scroll.posOffset = Scroll.scrollPos;
              } else {
                  Scroll.posOffset = 0;
              }

              PopupForm.triggerPopup();
          }
      },
      doHeaderResize: function doHeaderResize() {
          // if (document.getElementsByClassName('c-site-header').length > 0) {
          // Scroll.menuButtonEl = document.getElementsByClassName('c-menu-button')[0];
          // Scroll.headerEl = document.getElementsByClassName('c-site-header')[0];
          // Scroll.hasSplash = false;
          // Scroll.shopButton = document.getElementsByClassName('c-shop-menu__button')[0];

          // if (document.getElementsByClassName('js-intro-splash').length > 0) {
          //     Scroll.hasSplash = Device.screenHeight - document.getElementsByClassName('c-site-header')[0].clientHeight;
          // }
          // }
      },
      doHeader: function doHeader() {
          if (Scroll.headerEl !== null) {
              var _offset = Scroll.scrollPos;

              if (_offset < 0) {
                  _offset = 0;
              }

              var _headerAtTop = false;

              if (Scroll.hasSplash === false) {
                  _headerAtTop = false;
              } else {
                  if (Scroll.scrollPos < Scroll.hasSplash) {
                      _headerAtTop = true;
                  }
              }

              if (Scroll.headerAtTop !== _headerAtTop) {
                  Scroll.headerAtTop = _headerAtTop;

                  if (Scroll.headerAtTop === false) {
                      document.body.classList.add('state-header-scrolled');
                  } else {
                      document.body.classList.remove('state-header-scrolled');
                  }
              }

              if (Device.parallax === true) {
                  Scroll.headerEl.style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
                  Scroll.menuButtonEl.style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
              }
          }
      },
      getLoadOffset: function getLoadOffset() {
          Scroll.loadObs = [];

          var _main = document.querySelector('main');

          var _loadEls = document.getElementsByClassName('js-scroll-load');

          if (_loadEls) {
              for (var _i = 0; _i < _loadEls.length; _i++) {
                  Scroll.loadObs[_i] = [];
                  Scroll.loadObs[_i]['el'] = _loadEls[_i];
                  Scroll.loadObs[_i]['offset'] = Helper.getOffsetTop(Scroll.loadObs[_i]['el']) - Device.screenHeight * 4;

                  if (Boot.pageLoaded === false && Helper.getOffsetTop(Scroll.loadObs[_i]['el']) < Device.screenHeight * 1.25 && _main.contains(Scroll.loadObs[_i]['el'])) {
                      Scroll.loadObs[_i]['el'].classList.add('js-state-load-first');
                  }

                  if (Scroll.loadObs[_i]['el'].classList.contains('js-state-load-media')) {
                      Scroll.loadObs[_i]['loaded'] = true;
                  } else {
                      Scroll.loadObs[_i]['loaded'] = false;
                  }
              }
          }
      },
      doLoad: function doLoad() {
          if (Scroll.loadObs) {
              for (var _i = 0; _i < Scroll.loadObs.length; _i++) {
                  if (Scroll.loadObs[_i]['offset'] < Scroll.scrollPos && Scroll.loadObs[_i]['loaded'] === false && Boot.pageLoaded === true) {
                      Scroll.loadObs[_i]['el'].classList.add('js-state-load-media');

                      Scroll.loadObs[_i]['loaded'] = true;
                      LoadMedia.doLoad(Scroll.loadObs[_i]['el']);
                  }
              }
          }
      },
      getCircs: function getCircs() {
          Scroll.circObs = [];

          var _els = document.getElementsByClassName('js-circle-parent');

          if (_els) {
              for (var _i = 0; _i < _els.length; _i++) {
                  Scroll.circObs[_i] = [];
                  Scroll.circObs[_i]['parent'] = _els[_i];
                  Scroll.circObs[_i]['el'] = _els[_i].getElementsByClassName('js-circle')[0];
                  Scroll.circObs[_i]['start'] = Math.floor(Helper.getOffsetTop(_els[_i]));
                  Scroll.circObs[_i]['end'] = Math.floor(Scroll.circObs[_i]['start'] + _els[_i].clientHeight - Device.screenHeight);
              }

              ;
          }
      },
      doCircs: function doCircs() {
          for (var _i = 0; _i < Scroll.circObs.length; _i++) {
              if (Device.parallax === true) {
                  var _pos = Scroll.scrollPos - Scroll.circObs[_i]['start'];

                  Scroll.circObs[_i]['el'].style.transform = 'translate3d(0px,' + _pos + 'px,0px)';
              }
          }
      },
      getParallax: function getParallax() {
          Scroll.parallaxObs = [];

          var _parents = document.getElementsByClassName('js-parallax-parent');

          if (_parents) {
              for (var _i = 0; _i < _parents.length; _i++) {
                  if (_parents[_i].classList.contains('js-setup') === false) {
                      _parents[_i].classList.add('js-setup');

                      var _children = _parents[_i].querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,hr, small, .c-button, .c-media__inner, .flag');

                      if (_children) {
                          for (var _j = 0; _j < _children.length; _j++) {
                              _children[_j].classList.add('js-parallax');
                          }
                      }
                  }
              }
          }

          var _els = document.getElementsByClassName('js-parallax');

          if (_els) {
              var _j2 = 0;

              for (var _i2 = 0; _i2 < _els.length; _i2++) {
                  if (Helper.getOffsetLeft(_els[_i2]) < Device.screenWidth) {
                      Scroll.parallaxObs[_j2] = [];
                      Scroll.parallaxObs[_j2]['el'] = _els[_i2];
                      Scroll.parallaxObs[_j2]['el'].style.transform = 'translate3d(0px,0px,0px)';
                      var _speed = 0.4;

                      var _speedAdjust = Helper.getOffsetLeft(Scroll.parallaxObs[_j2]['el']) / Device.screenWidth;

                      _speed = _speed * _speedAdjust + 0.1;
                      var _adjust = 0.6;
                      Scroll.parallaxObs[_j2]['end'] = Math.floor(Helper.getOffsetTop(Scroll.parallaxObs[_j2]['el']) - Device.screenHeight * _adjust);
                      Scroll.parallaxObs[_j2]['speed'] = _speed;
                      Scroll.parallaxObs[_j2]['start'] = Math.floor(Scroll.parallaxObs[_j2]['end'] - Device.screenHeight);
                      Scroll.parallaxObs[_j2]['finished'] = false;
                      Scroll.parallaxObs[_j2]['endless'] = Scroll.parallaxObs[_j2]['el'].classList.contains('js-parallax--endless');
                      Scroll.parallaxObs[_j2]['image'] = Scroll.parallaxObs[_j2]['el'].classList.contains('js-parallax--image');

                      if (Scroll.parallaxObs[_j2]['endless'] === true) {
                          Scroll.parallaxObs[_j2]['speed'] = 0.125;
                          Scroll.parallaxObs[_j2]['end'] = Math.floor(Helper.getOffsetTop(Scroll.parallaxObs[_j2]['el']) - Device.screenHeight * 0.5);
                          Scroll.parallaxObs[_j2]['start'] = Scroll.parallaxObs[_j2]['end'] - Device.screenHeight;
                      }

                      if (Scroll.parallaxObs[_j2]['image'] === true) {
                          Scroll.parallaxObs[_j2]['speed'] = 0.5;
                          Scroll.parallaxObs[_j2]['endless'] = true;
                          Scroll.parallaxObs[_j2]['end'] = Math.floor(Helper.getOffsetTop(Scroll.parallaxObs[_j2]['el']));
                          Scroll.parallaxObs[_j2]['start'] = Math.floor(Scroll.parallaxObs[_j2]['end'] - Device.screenHeight);
                      }

                      _j2 = _j2 + 1;
                  } else {
                      _els[_i2].style.transform = 'none';
                  }
              }

              ;
          }
      },
      doParallax: function doParallax() {
          for (var _i = 0; _i < Scroll.parallaxObs.length; _i++) {
              var _offset = 0;

              if (Scroll.scrollPos > Scroll.parallaxObs[_i]['end'] && Scroll.parallaxObs[_i]['finished'] === false) {
                  if (Scroll.parallaxObs[_i]['endless'] === true && Device.parallax === true) {
                      _offset = Math.floor((Scroll.scrollPos - Scroll.parallaxObs[_i]['end']) * Scroll.parallaxObs[_i]['speed']);
                      Scroll.parallaxObs[_i]['el'].style.willChange = 'transform';
                      Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
                  } else {
                      Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,0px,0px)';
                      Scroll.parallaxObs[_i]['finished'] = true;

                      Scroll.parallaxObs[_i]['el'].classList.add('state-parallax-done');
                  }
              } else if (Scroll.scrollPos >= Scroll.parallaxObs[_i]['start'] && Scroll.scrollPos <= Scroll.parallaxObs[_i]['end']) {
                  Scroll.parallaxObs[_i]['finished'] = false;
                  Scroll.parallaxObs[_i]['el'].classList.remove('state-parallax-done');

                  if (Device.parallax === true) {
                      if (Scroll.parallaxObs[_i]['endless'] === true) {
                          _offset = Math.floor((Scroll.scrollPos - Scroll.parallaxObs[_i]['end']) * Scroll.parallaxObs[_i]['speed']);
                      } else {
                          _offset = Math.abs(Math.floor((Scroll.scrollPos - Scroll.parallaxObs[_i]['end']) * Scroll.parallaxObs[_i]['speed']));
                      }

                      Scroll.parallaxObs[_i]['el'].style.willChange = 'transform';
                      Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
                  }
              } else if (Scroll.parallaxObs[_i]['finished'] === false) {
                  if (Scroll.parallaxObs[_i]['endless'] === true && Device.parallax === true) {
                      _offset = Math.floor((Scroll.scrollPos - Scroll.parallaxObs[_i]['end']) * Scroll.parallaxObs[_i]['speed']);
                      Scroll.parallaxObs[_i]['el'].style.willChange = 'transform';
                      Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
                  } else {
                      Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,0px,0px)';
                      Scroll.parallaxObs[_i]['finished'] = true;

                      Scroll.parallaxObs[_i]['el'].classList.add('state-parallax-done');
                  }
              }
          }
      },
      getParallaxImg: function getParallaxImg() {
          Scroll.pImgObs = [];

          if (Device.parallax === true) {
              var _pImgEls = document.getElementsByClassName('js-img-parallax');

              for (var _i = 0; _i < _pImgEls.length; _i++) {
                  Scroll.pImgObs[_i] = [];
                  Scroll.pImgObs[_i]['el'] = _pImgEls[_i];

                  var _height = Math.ceil(Scroll.pImgObs[_i]['el'].parentElement.clientHeight);

                  var _imgHeight = Math.ceil(_height * Scroll.pImgRatio);

                  var _offset = Helper.getOffsetTop(Scroll.pImgObs[_i]['el'].parentElement);

                  var _midPoint = _offset + _height * 0.5 - Device.screenHeight * 0.5;

                  Scroll.pImgObs[_i]['el'].style.position = 'absolute';
                  Scroll.pImgObs[_i]['el'].style.width = '100%';
                  Scroll.pImgObs[_i]['el'].style.height = _imgHeight + 'px';
                  Scroll.pImgObs[_i]['el'].style.top = '0';
                  Scroll.pImgObs[_i]['el'].style.left = '0';
                  Scroll.pImgObs[_i]['start'] = Math.floor(_midPoint - Device.screenHeight * 1 - 16);
                  Scroll.pImgObs[_i]['end'] = Math.ceil(_midPoint + Device.screenHeight * 1 + 16);
                  Scroll.pImgObs[_i]['height'] = _height;
                  Scroll.pImgObs[_i]['imgHeight'] = _imgHeight;
              }
          }
      },
      doParallaxImg: function doParallaxImg() {
          if (Device.parallax === true) {
              for (var _i = 0; _i < Scroll.pImgObs.length; _i++) {
                  if (Scroll.adjustScrollPos < Scroll.pImgObs[_i]['start']) {
                      Scroll.pImgObs[_i]['el'].style.transform = 'translate3d(0px,' + (Scroll.pImgObs[_i]['height'] - Scroll.pImgObs[_i]['imgHeight']) + 'px,0px)';
                  } else if (Scroll.adjustScrollPos > Scroll.pImgObs[_i]['end']) {
                      Scroll.pImgObs[_i]['el'].style.transform = 'translate3d(0px,0px,0px)';
                  } else {
                      var _ratio = (Scroll.pImgObs[_i]['end'] - Scroll.adjustScrollPos) / (Scroll.pImgObs[_i]['end'] - Scroll.pImgObs[_i]['start']);

                      var _offset = 0 - Math.round((Scroll.pImgObs[_i]['imgHeight'] - Scroll.pImgObs[_i]['height']) * _ratio);

                      Scroll.pImgObs[_i]['el'].style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
                  }
              }
          }
      },
      doResize: function doResize() {
          Scroll.resizing = true;
          Scroll.setupPage();
          Scroll.doScroll();
          Scroll.doHeaderResize();
          Scroll.getParallax();
          Scroll.getParallaxImg();
          Scroll.getLoadOffset();
          Scroll.getCircs();
          Scroll.lastScrollPos = -1;
          Scroll.resizing = false;
      }
  };
  /* Dynamically load media */

  var LoadMedia = {
      totalBrackets: 5,
      loadFirst: function loadFirst() {
          var _els = document.getElementsByClassName('js-state-load-first');

          Array.from(_els).forEach(function (_el) {
              LoadMedia.doLoad(_el);
          });
      },
      doResize: function doResize() {
          var _els = document.getElementsByClassName('state-media-loaded');

          if (_els) {
              for (var _i = 0; _i < _els.length; _i++) {
                  var _loadedSrc = _els[_i].getElementsByTagName('img')[0].getAttribute('src');

                  var _targetSrc = LoadMedia.findSrc(_els[_i]);

                  if (_loadedSrc !== _targetSrc) {
                      _els[_i].classList.remove('state-load-called');

                      _els[_i].classList.remove('js-state-load-media');

                      _els[_i].classList.remove('state-media-loaded');
                  }
              }
          }
      },
      doLoad: function doLoad(_el) {
          if (_el.classList.contains('state-load-called') === false) {
              _el.classList.add('state-load-called');

              var _doLoad = true;

              var _src = LoadMedia.findSrc(_el);

              if (_el.getElementsByTagName('img').length > 0) {
                  if (_el.getElementsByTagName('img')[0].getAttribute('src') == _src) {
                      _doLoad = false;
                  }
              }

              if (_doLoad === true) {
                  var _img = new Image();

                  _img.onload = function () {
                      setTimeout(function () {
                          _el.classList.add('state-media-loaded');

                          if (_el.getElementsByTagName('img').length > 1) {
                              _el.getElementsByTagName('img')[0].remove();
                          }

                          Boot.checkLoader();
                      }, 100);
                  };

                  _img.src = _src;

                  _el.appendChild(_img);
              } else {
                  _el.classList.add('state-media-loaded');
              }
          }
      },
      findSrc: function findSrc(_el) {
          var _src = '';

          var _width = _el.clientWidth * Device.pixelRes;

          var _height = _el.clientHeight * Device.pixelRes;

          var _bracket = -1;

          var _bracketCount = 0;

          for (var _i = 0; _i < LoadMedia.totalBrackets; _i++) {
              var _bracketWidth = _el.getAttribute('data-img-w-' + _i + '');

              var _bracketHeight = _el.getAttribute('data-img-h-' + _i + '');

              if (typeof _bracketWidth === 'undefined') {
                  break;
              } else {
                  if (_width < _bracketWidth) {
                      if (_height < _bracketHeight) {
                          _src = _el.getAttribute('data-img-s-' + (_i + 1) + '');

                          if (typeof _src === 'undefined') {
                              _bracket = _i;
                          } else {
                              _bracket = _i;
                          }

                          break;
                      }
                  }
              }

              _bracketCount = _bracketCount + 1;
          }

          if (_bracket === -1) {
              _bracket = _bracketCount;
          }

          _src = _el.getAttribute('data-img-s-' + _bracket + '');

          if (typeof _src === 'undefined') {
              _bracket = _bracket - 1;
              _src = _el.getAttribute('data-img-s-' + _bracket + '');
          }

          return _src;
      }
  };
  var Baseline = {
      size: 4,
      init: function init() {
          var _els = document.getElementsByClassName('js-snap-baseline');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  _els[_i].style.height = 'auto';
              }

              for (var _i3 = 0; _i3 < _els.length; _i3++) {
                  var _height = Math.floor(_els[_i3].clientHeight / Baseline.size) * Baseline.size;

                  if (_els[_i3].classList.contains('js-snap-baseline--round-down')) {
                      _height = _height - Baseline.size;
                  }

                  _els[_i3].style.height = _height + 'px';
              }
          }
      }
  };
  var EqualHeight = {
      size: 4,
      init: function init() {
          var _els = document.getElementsByClassName('js-equal-parent');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  var _children = _els[_i].getElementsByClassName('js-equal');

                  for (var _j = 0; _j < _children.length; _j++) {
                      _children[_j].style.height = 'auto';
                  }

                  var _height = 0;

                  for (var _j3 = 0; _j3 < _children.length; _j3++) {
                      if (_height < _children[_j3].parentElement.clientHeight) {
                          _height = _children[_j3].parentElement.clientHeight;
                      }
                  }

                  _height = Math.ceil(_height / EqualHeight.size) * EqualHeight.size;

                  for (var _j4 = 0; _j4 < _children.length; _j4++) {
                      _children[_j4].style.height = _height + 'px';
                  }
              }
          }
      }
  };
  var Galleries = {
      glide: null,
      swiper: [],
      init: function init() {
          Galleries.glide = [];

          var _els = document.getElementsByClassName('glide');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  if (_els[_i].classList.contains('js-fade-gallery')) {
                      Galleries.initFadeGallery(_els[_i]);
                  } else if (_els[_i].classList.contains('js-slide-gallery')) {
                      Galleries.initSlideGallery(_els[_i]);
                  } else if (_els[_i].classList.contains('js-scent-gallery')) {
                      Galleries.initScentGallery(_els[_i]);
                  }
              }
          }

          _els = document.getElementsByClassName('js-swiper');

          if (_els.length > 0) {
              for (var _i4 = 0; _i4 < _els.length; _i4++) {
                  if (_els[_i4].classList.contains('product-recommendations-wrapper') === false || _els[_i4].classList.contains('js-swiper--instagram') === false) {
                      Galleries.initSwiperSlider(_els[_i4]);
                  }
              }
          }

          _els = document.getElementsByClassName('js-swiper-alt');

          if (_els.length > 0) {
              for (var _i5 = 0; _i5 < _els.length; _i5++) {
                  if (_els[_i5].classList.contains('product-recommendations-wrapper') === false || _els[_i5].classList.contains('js-swiper--instagram') === false) {
                      Galleries.initAltSwiperSlider(_els[_i5]);
                  }
              }
          }
      },
      initRecommendations: function initRecommendations() {
          var _els = document.getElementsByClassName('js-swiper');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  if (_els[_i].classList.contains('product-recommendations-wrapper') === true) {
                      Galleries.initSwiperSlider(_els[_i]);
                  }
              }
          }
      },
      initInstagram: function initInstagram() {
          var _els = document.getElementsByClassName('js-swiper--instagram');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  Galleries.initSwiperSlider(_els[_i]);
              }
          }
      },
      initFadeGallery: function initFadeGallery(_el) {
          var _index = Galleries.glide.length;

          _el.setAttribute('data-glide-index', _index);

          Galleries.glide[_index] = new Glide(_el, {
              'type': 'carousel',
              'gap': 0,
              'animationDuration': 1,
              dragThreshold: 60,
              touchDistance: 24,
              perSwipe: 1
          });

          Galleries.glide[_index].on('run', function (_evt) {
              Galleries.checkFadeGalleryIndex();
          });

          Galleries.glide[_index].mount();

          if (_el.closest('.scope-fade-gallery').getElementsByClassName('js-next').length !== 0) {
              var _next = _el.closest('.scope-fade-gallery').getElementsByClassName('js-next')[0];

              _next.setAttribute('data-index', _index);

              _next.addEventListener('click', function (_evt) {
                  _evt.preventDefault();

                  var _thisIndex = this.getAttribute('data-index');

                  Galleries.glide[_thisIndex].go('>');
              });
          }
      },
      checkFadeGalleryIndex: function checkFadeGalleryIndex() {
          setTimeout(function () {
              var _els = document.getElementsByClassName('glide');

              if (_els.length > 0) {
                  for (var _i = 0; _i < _els.length; _i++) {
                      if (_els[_i].classList.contains('js-fade-gallery')) {
                          var _index = Galleries.glide[_i].index + 1;

                          var _counter = _els[_i].closest('.scope-fade-gallery').getElementsByClassName('gallery-current')[0];

                          if (_counter.innerHTML !== _index) {
                              _counter.innerHTML = _index;
                          }
                      }
                  }
              }
          }, 50);
      },
      initSlideGallery: function initSlideGallery(_el) {
          var _index = Galleries.glide.length;

          _el.setAttribute('data-glide-index', _index);

          Galleries.glide[_index] = new Glide(_el, {
              'type': 'carousel',
              'gap': 0,
              'animationDuration': 1600,
              'animationTimingFunc': 'cubic-bezier(0.65, 0, 0.35, 1)',
              dragThreshold: 60,
              touchDistance: 24,
              perSwipe: 1
          });

          Galleries.glide[_index].on('run', function (_evt) {
              Galleries.checkSlideGalleryIndex();
          });

          Galleries.glide[_index].mount();

          if (_el.closest('.scope-slide-gallery').getElementsByClassName('js-next').length !== 0) {
              var _next = _el.closest('.scope-slide-gallery').getElementsByClassName('js-next')[0];

              _next.setAttribute('data-index', _index);

              _next.addEventListener('click', function (_evt) {
                  _evt.preventDefault();

                  var _thisIndex = this.getAttribute('data-index');

                  Galleries.glide[_thisIndex].go('>');
              });
          }
      },
      checkSlideGalleryIndex: function checkSlideGalleryIndex() {
          var _els = document.getElementsByClassName('glide');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  if (_els[_i].classList.contains('js-slide-gallery')) {
                      var _index = Galleries.glide[_i].index + 1;
                  }
              }
          }
      },
      initScentGallery: function initScentGallery(_el) {
          var _index = Galleries.glide.length;

          _el.setAttribute('data-glide-index', _index);

          Galleries.glide[_index] = new Glide(_el, {
              'type': 'carousel',
              'gap': 0,
              'animationDuration': 600,
              'animationTimingFunc': 'cubic-bezier(0.65, 0, 0.35, 1)'
          });

          Galleries.glide[_index].on('run.before', function (_evt) {
              Galleries.checkScentGalleryIndex();
          });

          Galleries.glide[_index].mount();

          if (_el.closest('.scope-scents-gallery').getElementsByClassName('js-prev').length !== 0) {
              var _prev = _el.closest('.scope-scents-gallery').getElementsByClassName('js-prev')[0];

              _prev.setAttribute('data-index', _index);

              _prev.addEventListener('click', function (_evt) {
                  _evt.preventDefault();

                  var _thisIndex = this.getAttribute('data-index');

                  Galleries.glide[_thisIndex].go('<');
              });
          }

          if (_el.closest('.scope-scents-gallery').getElementsByClassName('js-next').length !== 0) {
              var _next = _el.closest('.scope-scents-gallery').getElementsByClassName('js-next')[0];

              _next.setAttribute('data-index', _index);

              _next.addEventListener('click', function (_evt) {
                  _evt.preventDefault();

                  var _thisIndex = this.getAttribute('data-index');

                  Galleries.glide[_thisIndex].go('>');
              });

              Galleries.checkScentGalleryIndex();
          }
      },
      checkScentGalleryIndex: function checkScentGalleryIndex() {
          setTimeout(function () {
              var _els = document.getElementsByClassName('glide');

              if (_els.length > 0) {
                  for (var _i = 0; _i < _els.length; _i++) {
                      if (_els[_i].classList.contains('js-scent-gallery')) {
                          (function () {
                              var _index = Galleries.glide[_i].index + 1;

                              var _subheading = _els[_i].closest('.scope-scents-gallery').getElementsByClassName('js-scent-count')[0];

                              var _heading = _els[_i].closest('.scope-scents-gallery').getElementsByClassName('c-scents__header__heading')[0];

                              var _slide = _els[_i].closest('.scope-scents-gallery').getElementsByClassName('glide__slide')[Galleries.glide[_i].index + 2];

                              var _color = _slide.getAttribute('data-color');

                              var _text = _slide.getAttribute('data-heading');

                              var _wrapper = _els[_i].closest('.c-scents');

                              var _gallery = _els[_i].closest('.c-scents__gallery');

                              var _indicator = _els[_i].closest('.scope-scents-gallery').getElementsByClassName('indicator')[0];

                              for (var _j = 0; _j < 10; _j++) {
                                  _gallery.classList.remove('state-index-' + _j);
                              }

                              _gallery.classList.add('state-index-' + Galleries.glide[_i].index);

                              _indicator.style.left = Galleries.glide[_i].index / 7 * 100 + '%';
                              _wrapper.style.backgroundColor = _color;
                              anime({
                                  targets: _subheading,
                                  opacity: 0,
                                  duration: 300,
                                  complete: function complete() {
                                      _subheading.innerHTML = _index;
                                      anime({
                                          targets: _subheading,
                                          opacity: 1,
                                          duration: 300
                                      });
                                  }
                              });
                              anime({
                                  targets: _heading,
                                  opacity: 0,
                                  duration: 300,
                                  complete: function complete() {
                                      _heading.innerHTML = _text;
                                      anime({
                                          targets: _heading,
                                          opacity: 1,
                                          duration: 300
                                      });
                                  }
                              });
                          })();
                      }
                  }
              }
          }, 50);
      },
      initSwiperSlider: function initSwiperSlider(_el) {
          var _index = Galleries.glide.length;
          Galleries.swiper[Galleries.swiper.length] = new Swiper(_el, {
              direction: 'horizontal',
              loop: false,
              slidesPerView: 1.2,
              spaceBetween: 0,
              observer: true,
              observeParents: true,
              breakpoints: {
                  400: {
                      slidesPerView: 2.4,
                      spaceBetween: 0
                  },
                  760: {
                      slidesPerView: 3,
                      spaceBetween: 0
                  },
                  1240: {
                      slidesPerView: 4,
                      spaceBetween: 0
                  }
              },
              navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev'
              }
          });
          setTimeout(function () {
              if (document.getElementsByClassName('js-force-swiper-fix').length > 0) {
                  for (var _i = 0; _i < document.getElementsByClassName('js-force-swiper-fix').length; _i++) {
                      document.getElementsByClassName('js-force-swiper-fix')[_i].classList.remove('swiper-button-disabled');
                  }
              }
          }, 500);
      },
      initAltSwiperSlider: function initAltSwiperSlider(_el) {
          var _index = Galleries.glide.length;
          Galleries.swiper[Galleries.swiper.length] = new Swiper(_el, {
              direction: 'horizontal',
              loop: false,
              slidesPerView: 1.2,
              spaceBetween: 0,
              observer: true,
              observeParents: true,
              navigation: {
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev'
              }
          });
      }
  };
  var JumpScroll = {
      init: function init() {
          var _els = document.getElementsByClassName('js-scroll');

          if (_els.length !== 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  if (_els[_i].classList.contains('js-setup') === false) {
                      _els[_i].classList.add('js-setup');

                      _els[_i].addEventListener('click', function (_evt) {
                          _evt.preventDefault();

                          var _scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;

                          anime({
                              targets: _scrollElement,
                              scrollTop: Math.ceil(Device.screenHeight / 4) * 4 - document.getElementsByClassName('c-site-header')[0].clientHeight + 4,
                              duration: 800,
                              easing: 'easeInOutQuad'
                          });
                      });
                  }
              }
          }

          _els = document.getElementsByClassName('js-discover-scent');

          if (_els.length !== 0) {
              for (var _i6 = 0; _i6 < _els.length; _i6++) {
                  if (_els[_i6].classList.contains('js-setup') === false) {
                      _els[_i6].classList.add('js-setup');

                      _els[_i6].addEventListener('click', function (_evt) {
                          _evt.preventDefault();

                          var _scrollElement = window.document.scrollingElement || window.document.body || window.document.documentElement;

                          anime({
                              targets: _scrollElement,
                              scrollTop: Helper.getOffsetTop(document.getElementsByClassName('c-scents')[0]) - document.getElementsByClassName('c-site-header')[0].clientHeight,
                              duration: 800,
                              easing: 'easeInOutQuad'
                          });
                      });
                  }
              }
          }
      }
  };
  var Menu = {
      open: false,
      doClick: true,
      pos: 0,
      menuSpeed: 800,
      coverSpeed: 750,
      init: function init() {
          document.getElementsByClassName('c-shop-menu')[0].classList.add('c-shop-menu--items-' + document.getElementsByClassName('c-shop-menu__list__item').length);
          document.getElementsByClassName('c-menu')[0].classList.add('c-menu--items-' + document.getElementsByClassName('c-subscribe c-menu__transition')[0].classList.toString().split('-').pop().trim());
          Menu.updateCartClass();

          var _els = document.getElementsByClassName('js-toggle-menu');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  _els[_i].addEventListener('click', function (_evt) {
                      _evt.preventDefault();

                      if (Menu.doClick === true) {
                          Menu.doClick = false;

                          if (document.body.classList.contains('state-search-open')) {
                              document.body.classList.remove('state-search-open');
                              document.body.classList.remove('state-lock-scroll');
                              Menu.open = false;
                              window.scrollTo(0, Menu.pos);
                          } else if (document.body.classList.contains('state-shop-menu-open')) {
                              document.body.classList.remove('state-shop-menu-open');
                              document.body.classList.remove('state-lock-scroll');
                              Menu.open = false;
                              window.scrollTo(0, Menu.pos);
                          } else if (document.body.classList.contains('state-cart-open')) {
                              document.body.classList.remove('state-cart-open');
                              document.body.classList.remove('state-lock-scroll');
                              Menu.open = false;
                              window.scrollTo(0, Menu.pos);
                          } else if (document.body.classList.contains('state-menu-open')) {
                              document.body.classList.remove('state-menu-open');
                              document.body.classList.remove('state-lock-scroll');
                              Menu.closeShopSubmenu();
                              Menu.open = false;
                              window.scrollTo(0, Menu.pos);
                          } else {
                              Device.refresh();
                              Menu.pos = Math.floor(window.pageYOffset);
                              Menu.open = true;
                              document.body.classList.add('state-menu-open');
                              document.body.classList.remove('state-lock-scroll');
                              setTimeout(function () {
                                  document.body.classList.add('state-lock-scroll');
                              }, Menu.coverSpeed);
                          }

                          setTimeout(function () {
                              Menu.doClick = true;
                          }, 250);
                      }
                  });
              }
          }

          _els = document.getElementsByClassName('js-toggle-search');

          if (_els.length > 0) {
              for (var _i7 = 0; _i7 < _els.length; _i7++) {
                  _els[_i7].addEventListener('click', function (_evt) {
                      _evt.preventDefault();

                      if (Menu.doClick === true) {
                          Menu.doClick = false;

                          if (document.body.classList.contains('state-search-open')) {
                              document.body.classList.remove('state-search-open');
                              document.body.classList.remove('state-lock-scroll');
                              Menu.open = false;
                              window.scrollTo(0, Menu.pos);
                          } else {
                              Device.refresh();
                              Menu.pos = Math.floor(window.pageYOffset);
                              Menu.open = true;
                              document.body.classList.add('state-search-open');
                              setTimeout(function () {
                                  document.body.classList.add('state-lock-scroll');
                              }, Menu.coverSpeed);
                          }

                          setTimeout(function () {
                              Menu.doClick = true;
                          }, 250);
                      }
                  });
              }
          }

          _els = document.getElementsByClassName('js-toggle-cart');

          if (_els.length > 0) {
              for (var _i8 = 0; _i8 < _els.length; _i8++) {
                  _els[_i8].addEventListener('click', function (_evt) {
                      _evt.preventDefault();

                      if (Menu.doClick === true) {
                          Menu.doClick = false;

                          if (document.body.classList.contains('state-cart-open')) {
                              document.body.classList.remove('state-cart-open');
                              document.body.classList.remove('state-lock-scroll');
                              Menu.open = false;
                              window.scrollTo(0, Menu.pos);
                          } else {
                              Device.refresh();
                              Menu.pos = Math.floor(window.pageYOffset);
                              Menu.open = true;
                              document.body.classList.add('state-cart-open');
                              setTimeout(function () {
                                  document.body.classList.add('state-lock-scroll');
                              }, Menu.coverSpeed);
                              Resize.doResize();
                          }

                          setTimeout(function () {
                              Menu.doClick = true;
                          }, 250);
                      }
                  });
              }
          }

          _els = document.getElementsByClassName('js-close-cart');

          if (_els.length > 0) {
              for (var _i9 = 0; _i9 < _els.length; _i9++) {
                  _els[_i9].addEventListener('click', function (_evt) {
                      _evt.preventDefault();

                      if (Menu.doClick === true) {
                          Menu.doClick = false;
                          document.body.classList.remove('state-cart-open');
                          document.body.classList.remove('state-lock-scroll');
                          Menu.open = false;
                          window.scrollTo(0, Menu.pos);
                          setTimeout(function () {
                              Menu.doClick = true;
                          }, 250);
                      }
                  });
              }
          }

          _els = document.getElementsByClassName('js-toggle-shop-menu');

          if (_els.length > 0) {
              for (var _i10 = 0; _i10 < _els.length; _i10++) {
                  _els[_i10].addEventListener('click', function (_evt) {
                      _evt.preventDefault();

                      if (Menu.doClick === true) {
                          Menu.doClick = false;

                          if (document.body.classList.contains('state-shop-menu-open')) {
                              document.body.classList.remove('state-shop-menu-open');
                              document.body.classList.remove('state-lock-scroll');
                              Menu.open = false;
                              window.scrollTo(0, Menu.pos);
                          } else {
                              Device.refresh();
                              Menu.pos = Math.floor(window.pageYOffset);
                              Menu.open = true;
                              document.body.classList.add('state-shop-menu-open');
                              setTimeout(function () {
                                  document.body.classList.add('state-lock-scroll');
                              }, Menu.coverSpeed);
                          }

                          setTimeout(function () {
                              Menu.doClick = true;
                          }, 250);
                      }
                  });
              }
          }

          _els = document.getElementsByClassName('js-toggle-shop-submenu');

          if (_els.length > 0) {
              for (var _i11 = 0; _i11 < _els.length; _i11++) {
                  _els[_i11].addEventListener('click', function (_evt) {
                      _evt.preventDefault();

                      if (Menu.doClick === true) {
                          if (document.body.classList.contains('state-shop-submenu-open')) {
                              document.body.classList.remove('state-shop-submenu-open');
                          } else {
                              document.body.classList.add('state-shop-submenu-open');
                          }

                          setTimeout(function () {
                              Menu.doClick = true;
                          }, 250);
                      }
                  });
              }
          }

          if (document.getElementsByClassName('c-search__form__input').length !== 0) {
              document.getElementsByClassName('c-search__form__input')[0].addEventListener('change', function (_evt) {
                  Menu.doInput();
              });
              document.getElementsByClassName('c-search__form__input')[0].addEventListener('input', function (_evt) {
                  Menu.doInput();
              });
              document.getElementsByClassName('c-search__form__input')[0].addEventListener('blur', function (_evt) {
                  document.getElementsByClassName('c-search__form')[0].classList.remove('state-active-input');
              });
              document.getElementsByClassName('c-search__form__input')[0].addEventListener('focus', function (_evt) {
                  Menu.doInput();
              });
          }
      },
      closeShopSubmenu: function closeShopSubmenu() {
          setTimeout(function () {
              document.body.classList.remove('state-shop-submenu-open');
          }, 800);
      },
      doInput: function doInput() {
          if (document.getElementsByClassName('c-search__form__input')[0].value.length < 1) {
              document.getElementsByClassName('c-search__form')[0].classList.remove('state-active-input');
          } else {
              document.getElementsByClassName('c-search__form')[0].classList.add('state-active-input');
          }
      },
      doResize: function doResize() {
          /* realign shop menu */
          // document.getElementsByClassName('c-shop-menu__button')[0].style.marginLeft = 0;
          // document.getElementsByClassName('c-shop-menu__list')[0].style.marginLeft = 0;
          // document.getElementsByClassName('c-menu__wrapper')[0].style.marginLeft = 0;

          // if (document.getElementsByClassName('js-toggle-shop-menu')[0].offsetParent === null) {
          // /* do nothing */
          // } else {
          // var _targetLeft = Helper.getOffsetLeft(document.getElementsByClassName('js-toggle-shop-menu')[0]);

          // var _currentLeft = Helper.getOffsetLeft(document.getElementsByClassName('c-shop-menu__button')[0]);

          // document.getElementsByClassName('c-shop-menu__button')[0].style.marginLeft = _targetLeft - _currentLeft;
          // document.getElementsByClassName('c-shop-menu__list')[0].style.marginLeft = _targetLeft - _currentLeft;
          // document.getElementsByClassName('c-menu__wrapper')[0].style.marginLeft = _targetLeft - _currentLeft;
          // }
      },
      updateCartClass: function updateCartClass() {
          for (var _i = 0; _i < 20; _i++) {
              document.getElementsByClassName('c-cart')[0].classList.remove('c-cart--items-' + _i);
          }

          var _lastIndex = document.getElementsByClassName('c-cart__transition').length - 1;

          document.getElementsByClassName('c-cart')[0].classList.add('c-cart--items-' + document.getElementsByClassName('c-cart__transition')[_lastIndex].classList.toString().split('-').pop().trim());
      }
  };
  var SectionCheck = {
      init: function init() {
          if (document.getElementsByClassName('c-index').length > 0) {
              if (document.getElementsByClassName('c-index')[0].classList.contains('state-editor') === false) {
                  var _index = document.getElementsByClassName('c-index')[0];
                  var _startPage = '<div class="c-page c-page--no-margin scope-cream-bg js-circle-parent"><div class="c-circle-pattern js-circle"><div class="c-circle-pattern__inner"><div class="c-circle-pattern__circle"></div></div></div>';
                  var _endPage = '</div>';
                  var _html = _startPage;

                  var _sections = _index.getElementsByClassName('shopify-section');

                  if (_sections.length > 0) {
                      for (var _i = 0; _i < _sections.length; _i++) {
                          _html = _html + _sections[_i].innerHTML;
                      }

                      _html = _html + _endPage;
                      _index.innerHTML = _html;
                  }
              }
          }

          if (document.getElementsByClassName('c-product-splash').length !== 0 || document.getElementsByClassName('c-article__splash').length !== 0 || document.getElementsByClassName('c-page__splash').length !== 0) {
              document.body.classList.add('state-reverse');
          }

          if (document.getElementsByClassName('c-home-intro').length !== 0) {
              document.body.classList.add('state-reverse');
              document.body.classList.add('state-home');
          }
      }
  };
  var Cart = {
      currentTotal: 0,
      init: function init() {
          Cart.checkCartStatus();
          Cart.initQtyUpdate();
          Cart.initAdd();
      },
      initQtyUpdate: function initQtyUpdate() {
          if (document.getElementById('cart')) {
              var _els = document.getElementById('cart').getElementsByClassName('c-cart__item__form__qty');

              if (_els.length !== 0) {
                  for (var _i = 0; _i < _els.length; _i++) {
                      _els[_i].addEventListener('change', function (_evt) {
                          Cart.checkQty(_evt.target, false);
                      });
                  }
              }

              _els = document.getElementById('cart').getElementsByClassName('c-cart__item__form__rmv');

              if (_els.length !== 0) {
                  for (var _i12 = 0; _i12 < _els.length; _i12++) {
                      _els[_i12].addEventListener('click', function (_evt) {
                          _evt.preventDefault();

                          var _item = this.closest('.c-cart__item');

                          _item.getElementsByClassName('c-cart__item__form__qty')[0].value = 0;
                          Cart.checkQty(_item.getElementsByClassName('c-cart__item__form__qty')[0], false);
                      });
                  }
              }

              Menu.updateCartClass();
          }
      },
      checkQty: function checkQty(_el, _success) {
          var _object = {};
          _object['quantity'] = parseInt(_el.value);
          _object['line'] = parseInt(_el.getAttribute('data-index'));

          var _json = JSON.stringify(_object);

          var _xhr = new XMLHttpRequest();

          _xhr.onreadystatechange = function () {
              if (_xhr.readyState === 4) {
                  if (_success === true) {
                      Cart.reformatCart(_xhr.responseText, true);
                  } else {
                      Cart.reformatCart(_xhr.responseText, false);
                  }

                  Cart.checkCartStatus();
                  Menu.updateCartClass();
              }
          };

          _xhr.open("POST", '/cart/change.js', true);

          _xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

          _xhr.send(_json);
      },
      reformatCart: function reformatCart(_json, _successBanner) {
          if (_json) {
              var _data = JSON.parse(_json);

              var _els = document.getElementsByClassName('c-cart__item');

              var _index = 0;

              if (_data['items']) {
                  var _total = parseInt(_data['total_price']);

                  var _items = parseInt(_data['item_count']);

                  document.getElementsByClassName('c-cart__panel__heading')[0].innerHTML = 'Checkout â€”  $' + Number(_total / 100).toFixed(2);

                  var _counts = document.getElementsByClassName('js-cart-count');

                  if (_counts.length > 0) {
                      if (_successBanner === true && Cart.currentTotal < _items) {
                          document.body.classList.remove('state-full-inventory');
                          document.body.classList.add('state-show-notification');
                          setTimeout(function () {
                              document.body.classList.remove('state-show-notification');
                          }, 5000);
                      } else if (_successBanner === true) {
                          document.getElementById('js-cart-notification').innerHTML = "Sorry. We don't have enough items in stock to add this item to your cart again.";
                          document.body.classList.add('state-full-inventory');
                          document.body.classList.add('state-show-notification');
                          setTimeout(function () {
                              document.body.classList.remove('state-show-notification');
                          }, 5000);
                      }

                      for (var _i = 0; _i < _counts.length; _i++) {
                          _counts[_i].innerHTML = parseInt(_items);
                      }
                  }

                  var _els2 = document.getElementsByClassName('c-cart__item');

                  if (_els2.length !== 0) {
                      for (var _i13 = 0; _i13 < _data['items'].length; _i13++) {
                          var _key = _data['items'][_i13]['key'];

                          for (var _j = 0; _j < _els2.length; _j++) {
                              if (_els2[_j].getAttribute('data-key') == _key) {
                                  var _quantity = _data['items'][_i13]['quantity'];

                                  var _input = _els2[_j].getElementsByClassName('c-cart__item__form__qty')[0];

                                  var _inputKey = _input.getAttribute('data-key');

                                  _input.value = _quantity;

                                  if (parseInt(_input.value) === 0) {
                                      _els2[_j].remove();
                                  }
                              }
                          }
                      }
                  }
              }
          }
      },
      initAdd: function initAdd() {
          if (document.getElementsByClassName('shopify-product-form').length !== 0) {
              document.getElementsByClassName('shopify-product-form')[0].addEventListener('submit', function (_evt) {
                  Cart.currentTotal = parseInt(document.getElementsByClassName('js-cart-count')[0].innerHTML);

                  _evt.preventDefault();

                  var _data = new FormData(this);

                  var _object = {};

                  _data.forEach(function (_value, _key) {
                      _object[_key] = _value;
                  });

                  var _json = JSON.stringify(_object);

                  var _xhr = new XMLHttpRequest();

                  _xhr.onreadystatechange = function () {
                      if (_xhr.readyState === 4) {
                          var _temp = document.createElement("DIV");

                          _temp.innerHTML = _xhr.responseText;
                          document.getElementsByClassName('c-cart__wrapper')[0].innerHTML = _temp.getElementsByClassName('c-cart__wrapper')[0].innerHTML;
                          document.getElementsByClassName('c-cart__panel')[0].innerHTML = _temp.getElementsByClassName('c-cart__panel')[0].innerHTML;
                          Cart.initQtyUpdate();
                          Resize.doResize();

                          var _success = document.getElementById('js-product-title').innerHTML + ' added to Your Order';

                          document.getElementById('js-cart-notification').innerHTML = _success;

                          var _qtyEls = document.getElementsByClassName('c-cart__item__form__qty');

                          if (_qtyEls.length > 0) {
                              for (var _k = 0; _k < _qtyEls.length; _k++) {
                                  Cart.checkQty(document.getElementsByClassName('c-cart__item__form__qty')[_k], true);
                              }
                          }

                          Resize.doResize();
                      }
                  };

                  _xhr.open("POST", this.getAttribute('action'), true);

                  _xhr.setRequestHeader('Content-Type', 'application/json');

                  _xhr.send(_json);
              });
          }
      },
      checkCartStatus: function checkCartStatus() {
          var _els = document.getElementsByClassName('c-cart__item__form__qty');

          if (_els.length !== 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  if (parseInt(_els[_i].value) === 0) {
                      _els[_i].closest('.c-cart__item').remove();
                  }
              }
          }

          _els = document.getElementsByClassName('js-cart-count');

          if (_els.length > 0) {
              for (var _i14 = 0; _i14 < _els.length; _i14++) {
                  if (parseInt(_els[_i14].innerHTML) !== 0) {
                      _els[_i14].parentNode.classList.add('state-active');

                      document.body.classList.remove('state-no-items');
                      Menu.updateCartClass();
                  } else {
                      _els[_i14].parentNode.classList.remove('state-active');

                      document.body.classList.add('state-no-items');
                      Menu.updateCartClass();
                  }
              }
          }
      }
  };
  var Subscribe = {
      init: function init() {
          Subscribe.bindInput();
          Subscribe.bindSubmit();
      },
      bindInput: function bindInput() {
          var _els = document.getElementsByClassName('c-subscribe__input');

          for (var _i = 0; _i < _els.length; _i++) {
              _els[_i].addEventListener('keydown', function (_evt) {
                  Subscribe.doChange(this);
              });

              _els[_i].addEventListener('change', function (_evt) {
                  Subscribe.doChange(this);
              });

              _els[_i].addEventListener('input', function (_evt) {
                  Subscribe.doChange(this);
              });

              _els[_i].addEventListener('blur', function (_evt) {
                  Subscribe.doChange(this);
              });
          }
      },
      doChange: function doChange(_el) {
          var _email = _el.value;

          if (/(^\w.*@\w+\.\w)/.test(_email)) {
              _el.closest('.c-subscribe__form').classList.add('state-valid');
          } else {
              _el.closest('.c-subscribe__form').classList.remove('state-valid');
          }
      },
      bindSubmit: function bindSubmit() {
          var _els = document.getElementsByClassName('c-subscribe__form');

          var _i = 0;

          for (_i = 0; _i < _els.length; _i++) {
              _els[_i].addEventListener('submit', function (_evt) {
                  _evt.preventDefault();

                  if (this.classList.contains('state-valid')) {
                      Subscribe.ajaxPost(this);
                  }
              });
          }

          _els = document.getElementsByClassName('js-submit');

          for (_i = 0; _i < _els.length; _i++) {
              _els[_i].addEventListener('click', function (_evt) {
                  _evt.preventDefault();

                  if (this.closest('.c-subscribe__form').classList.contains('state-valid')) {
                      Subscribe.ajaxPost(this.closest('.c-subscribe__form'));
                  }
              });
          }
      },
      ajaxPost: function ajaxPost(_form) {
          var _url = _form.getAttribute('action');

          _url = _url.replace('/post?u=', '/post-json?u=');
          _url += Subscribe.serialize(_form) + '&c=displayMailChimpStatus';

          var _script = window.document.createElement('script');

          _script.src = _url;
          var _ref = window.document.getElementsByTagName('script')[0];

          _ref.parentNode.insertBefore(_script, _ref);

          _script.onload = function () {
              this.remove();
          };
      },
      serialize: function serialize(_form) {
          var _serialized = ''; // Loop through each field in the form

          for (var _i = 0; _i < _form.elements.length; _i++) {
              var _field = _form.elements[_i];
              if (!_field.name || _field.disabled || _field.type === 'file' || _field.type === 'reset' || _field.type === 'submit' || _field.type === 'button') continue;

              if (_field.type !== 'checkbox' && _field.type !== 'radio' || _field.checked) {
                  _serialized += '&' + encodeURIComponent(_field.name) + "=" + encodeURIComponent(_field.value);
              }
          }

          return _serialized;
      }
  };

  var displayMailChimpStatus = function displayMailChimpStatus() {
      PopupForm.setCookie('provider-signed-up', 'done', 365);
      document.body.classList.add('state-subscribe-submitted');
  };

  var PopupForm = {
      doPopup: false,
      init: function init() {
          var _signedUp = PopupForm.getCookie('provider-signed-up');

          var _cookie = PopupForm.getCookie('provider-popup');

          if (_cookie !== 'shown' && _signedUp !== 'done') {
              PopupForm.doPopup = true;
          }
      },
      triggerPopup: function triggerPopup() {
          if (PopupForm.doPopup === true && Scroll.scrollPos > Device.screenHeight) {
              PopupForm.doPopup = false;

              var _els = document.getElementsByClassName('js-close-sign-up');

              if (_els.length !== 0) {
                  for (var _i = 0; _i < _els.length; _i++) {
                      _els[_i].addEventListener('click', function (_evt) {
                          _evt.preventDefault();

                          document.body.classList.remove('state-show-popup');
                      });
                  }
              }

              PopupForm.setCookie('provider-popup', 'shown', 1);
              document.body.classList.add('state-show-popup');
          }
      },
      setCookie: function setCookie(cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
          var expires = "expires=" + d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      },
      getCookie: function getCookie(cname) {
          var name = cname + "=";
          var decodedCookie = decodeURIComponent(document.cookie);
          var ca = decodedCookie.split(';');

          for (var i = 0; i < ca.length; i++) {
              var c = ca[i];

              while (c.charAt(0) == ' ') {
                  c = c.substring(1);
              }

              if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
              }
          }

          return "";
      }
  };
  var Variants = {
      timer: null,
      colors: [],
      currentIndex: 0,
      init: function init() {
          if (document.getElementsByClassName('js-select-option').length > 1 && document.getElementsByClassName('c-scents__gallery').length > 0 && document.getElementsByClassName('c-variants__menu').length > 0) {
              (function () {
                  Variants.currentIndex = document.getElementById('js-variation-select').selectedIndex;
                  var _headings = [];
                  var _subheadings = [];

                  var _options = document.getElementsByClassName('js-select-option');

                  var _slides = document.getElementsByClassName('c-scents__gallery')[0].getElementsByClassName('glide__slide');

                  var _disabled = [];

                  for (var _i = 0; _i < _options.length; _i++) {
                      _headings[_i] = _options[_i].innerHTML;
                      Variants.colors[_i] = '#596460';
                      _subheadings[_i] = '';

                      if (_options[_i].getAttribute('disabled') === 'disabled') {
                          _disabled[_i] = 'state-disabled';
                      } else {
                          _disabled[_i] = '';
                      }

                      for (var _j = 0; _j < _slides.length; _j++) {
                          if (_slides[_j].getAttribute('data-heading') === _headings[_i]) {
                              Variants.colors[_i] = _slides[_j].getAttribute('data-color');

                              var _text = _slides[_j].getElementsByClassName('c-scents__item__text');

                              if (_text.length > 0) {
                                  for (var _k = 0; _k < _text.length; _k++) {
                                      if (_k !== 0) {
                                          _subheadings[_i] = _subheadings[_i] + ' / ';
                                      }

                                      _subheadings[_i] = _subheadings[_i] + _text[_k].getElementsByTagName('h4')[0].innerHTML;
                                  }
                              }
                          }
                      }
                  }

                  var _menu = document.getElementsByClassName('c-variants__menu')[0];
                  var _html = '';

                  for (var _i15 = 0; _i15 < _headings.length; _i15++) {
                      _html = _html + '<li class="c-variants__menu__item c-variants__transition c-variants__transition--index-' + (_i15 + 1) + '">';
                      _html = _html + '<a href="#" class="c-variants__menu__link js-select-toggle ' + _disabled[_i15] + '" data-index="' + _i15 + '" data-color="' + Variants.colors[_i15] + '">';

                      if (_disabled[_i15] === 'state-disabled') {
                          _html = _html + '<span class="c-variants__menu__link__count">N<sup>o</sup> 0' + (_i15 + 1) + '</span>' + _headings[_i15] + '<span class="c-variants__menu__link__subheading">Currently unavailable</span>';
                      } else {
                          _html = _html + '<span class="c-variants__menu__link__count">N<sup>o</sup> 0' + (_i15 + 1) + '</span>' + _headings[_i15] + '<span class="c-variants__menu__link__subheading">' + _subheadings[_i15] + '</span>';
                      }

                      _html = _html + '</a>';
                      _html = _html + '</li>';
                  }

                  document.getElementsByClassName('c-variants')[0].classList.add('c-variants--items-' + _headings.length);
                  _menu.innerHTML = _html;
                  document.getElementsByClassName('c-variants__cover')[0].style.backgroundColor = Variants.colors[Variants.currentIndex];
                  document.getElementsByClassName('c-product-splash__buttons__select__text')[0].innerHTML = _options[Variants.currentIndex].innerHTML;
                  document.getElementsByClassName('c-product-splash__buttons__select__text')[0].addEventListener('click', function (_evt) {
                      _evt.preventDefault();

                      Device.refresh();
                      Menu.pos = Math.floor(window.pageYOffset);
                      document.body.classList.add('state-variants-open');
                      setTimeout(function () {
                          document.body.classList.add('state-lock-scroll');
                      }, Menu.coverSpeed);
                  });

                  var _links = document.getElementsByClassName('c-variants__menu__link');

                  if (_links.length > 0) {
                      for (var _i16 = 0; _i16 < _links.length; _i16++) {
                          _links[_i16].addEventListener('click', function (_evt) {
                              _evt.preventDefault;

                              if (this.classList.contains('state-disabled')) {
                                  document.getElementsByClassName('c-variants')[0].classList.remove('state-active-menu');
                                  document.body.classList.remove('state-variants-open');
                                  window.scrollTo(0, Menu.pos);
                              } else {
                                  Variants.currentIndex = parseInt(this.getAttribute('data-index'));
                                  document.getElementsByClassName('c-variants__cover')[0].style.backgroundColor = Variants.colors[Variants.currentIndex];
                                  document.getElementById('js-variation-select').selectedIndex = Variants.currentIndex;
                                  document.getElementsByClassName('c-product-splash__buttons__select__text')[0].innerHTML = _options[Variants.currentIndex].innerHTML;
                                  document.body.classList.remove('state-variants-open');
                                  document.body.classList.remove('state-lock-scroll');
                                  window.scrollTo(0, Menu.pos);
                              }
                          });

                          _links[_i16].addEventListener('mouseenter', function (_evt) {
                              if (Variants.timer !== null) {
                                  clearTimeout(Variants.timer);
                                  Variants.timer = null;
                              }

                              var _index = parseInt(this.getAttribute('data-index'));

                              document.getElementsByClassName('c-variants__cover')[0].style.backgroundColor = Variants.colors[_index];
                          });

                          _links[_i16].addEventListener('mouseleave', function (_evt) {
                              if (Variants.timer !== null) {
                                  clearTimeout(Variants.timer);
                                  Variants.timer = null;
                              }

                              Variants.timer = setTimeout(function () {
                                  document.getElementsByClassName('c-variants__cover')[0].style.backgroundColor = Variants.colors[Variants.currentIndex];
                              }, 250);
                          });
                      }
                  }
              })();
          }
      }
  };
  var Resize = {
      timer: null,
      init: function init() {
          window.addEventListener('resize', Resize.doResize);
      },
      doResize: function doResize() {
          Device.refresh();
          LoadMedia.doResize();
          Menu.doResize();
          Baseline.init();
          EqualHeight.init();
          Scroll.doResize();

          if (Resize.timer !== null) {
              clearTimeout(Resize.timer);
              Resize.timer = null;
          }

          Resize.timer = setTimeout(function () {
              LoadMedia.doResize();
              setTimeout(function () {
                  LoadMedia.doResize();
              }, 250);
          }, 800);
      }
  };
  var Controller = {
      doingResize: false,
      init: function init() {
          Controller.doFrame();
      },
      doFrame: function doFrame() {
          if (Scroll.resizing === false) {
              Scroll.doScroll();
              // Scroll.doPage();
              // Scroll.doLoad();
              Scroll.doParallax();
              // Scroll.doParallaxImg();
              // Scroll.doCircs();
              // Scroll.doHeader();
          } else {
              Scroll.lastScrollPos = -1;
          }
          requestAnimationFrame(Controller.doFrame);
      }
  };
  var Mouse = {
      cursor: null,
      mouseActive: false,
      init: function init() {
          if (Device.touch === false) {
              Mouse.cursor = document.getElementsByClassName('js-cursor')[0];
              document.body.addEventListener('mousemove', function (_event) {
                  Mouse.cursor.style.transform = 'translate3d(' + _event.x + 'px,' + _event.y + 'px,0px)';

                  if (Mouse.mouseActive === false) {
                      Mouse.mouseActive = true;
                      document.body.classList.add('state-show-mouse');
                  }
              });
              document.body.addEventListener('mouseleave', function (_event) {
                  Mouse.cursor.style.transform = 'translate3d(' + _event.x + 'px,' + _event.y + 'px,0px)';
                  Mouse.mouseActive = false;
                  document.body.classList.remove('state-show-mouse');
              });
          }
      },
      bindEvents: function bindEvents() {
          var _els = document.getElementsByTagName('a');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  if (_els[_i].classList.contains('js-hover-setup') === false) {
                      _els[_i].classList.add('js-hover-setup');

                      _els[_i].addEventListener('mouseover', function (_evt) {
                          if (_evt.target.classList.contains('js-hover-next') || _evt.target.classList.contains('swiper-button-next')) {
                              document.body.classList.add('state-hover-next');
                              document.body.classList.remove('state-hover-prev');
                              document.body.classList.add('state-mouse-hover');
                          } else if (_evt.target.classList.contains('js-hover-prev') || _evt.target.classList.contains('swiper-button-prev')) {
                              document.body.classList.remove('state-hover-next');
                              document.body.classList.add('state-hover-prev');
                              document.body.classList.add('state-mouse-hover');
                          } else {
                              document.body.classList.remove('state-hover-prev');
                              document.body.classList.remove('state-hover-next');
                              document.body.classList.add('state-mouse-hover');
                          }
                      });

                      _els[_i].addEventListener('mouseout', function (_evt) {
                          document.body.classList.remove('state-mouse-hover');
                          document.body.classList.remove('state-hover-next');
                          document.body.classList.remove('state-hover-prev');
                      });
                  }
              }
          }

          _els = document.getElementsByTagName('button');

          if (_els.length > 0) {
              for (var _i17 = 0; _i17 < _els.length; _i17++) {
                  if (_els[_i17].classList.contains('js-hover-setup') === false) {
                      _els[_i17].classList.add('js-hover-setup');

                      _els[_i17].addEventListener('mouseover', function (_evt) {
                          if (_evt.target.classList.contains('js-hover-next') || _evt.target.classList.contains('next') || _evt.target.classList.contains('swiper-button-next')) {
                              document.body.classList.add('state-hover-next');
                              document.body.classList.remove('state-hover-prev');
                              document.body.classList.add('state-mouse-hover');
                          } else if (_evt.target.classList.contains('js-hover-prev') || _evt.target.classList.contains('previous') || _evt.target.classList.contains('swiper-button-prev')) {
                              document.body.classList.remove('state-hover-next');
                              document.body.classList.add('state-hover-prev');
                              document.body.classList.add('state-mouse-hover');
                          } else {
                              document.body.classList.remove('state-hover-prev');
                              document.body.classList.remove('state-hover-next');
                              document.body.classList.add('state-mouse-hover');
                          }
                      });

                      _els[_i17].addEventListener('mouseout', function (_evt) {
                          document.body.classList.remove('state-mouse-hover');
                          document.body.classList.remove('state-hover-next');
                          document.body.classList.remove('state-hover-prev');
                      });
                  }
              }
          }
      }
  };
  var DJHover = {
      timer: null,
      init: function init() {
          if (Device.touch === false) {
              var _els = document.getElementsByClassName('js-disjointed-hover');

              if (_els.length > 0) {
                  for (var _i = 0; _i < _els.length; _i++) {
                      if (_els[_i].classList.contains('js-dj-setup') === false) {
                          _els[_i].classList.add('js-dj-setup');

                          _els[_i].addEventListener('mouseover', function () {
                              var _id = this.getAttribute('data-djh');

                              if (DJHover.timer !== null) {
                                  clearTimeout(DJHover.timer);
                                  DJHover.timer = null;
                              }

                              DJHover.timer = setTimeout(function () {
                                  document.getElementById(_id).classList.add('state-show-image');
                              }, 400);
                          });

                          _els[_i].addEventListener('mouseout', function () {
                              if (DJHover.timer !== null) {
                                  clearTimeout(DJHover.timer);
                                  DJHover.timer = null;
                              }

                              var _DJels = document.getElementsByClassName('js-disjointed-hover');

                              if (_DJels.length > 0) {
                                  for (var _j = 0; _j < _DJels.length; _j++) {
                                      var _id = _DJels[_j].getAttribute('data-djh');

                                      document.getElementById(_id).classList.remove('state-show-image');
                                  }
                              }
                          });
                      }
                  }
              }
          }
      }
  };
  /* Accordion scripts */

  var Accordion = {
      count: 0,
      init: function init() {
          var _els = document.getElementsByClassName('js-accordion__trigger');

          if (_els.length > 0) {
              for (var _i = 0; _i < _els.length; _i++) {
                  Accordion.setup(_els[_i]);
              }
          }
      },
      setup: function setup(_el) {
          if (!_el.classList.contains('js-setup')) {
              var _id = 'accordion-' + Accordion.count;

              _el.classList.add('js-setup');

              var _parent = _el.closest('.js-accordion');

              var _body = _parent.getElementsByClassName('js-accordion__body')[0];

              var _inner = _parent.getElementsByClassName('js-accordion__inner')[0];

              _el.setAttribute('role', 'button');

              _el.setAttribute('aria-expanded', 'false');

              _el.setAttribute('aria-controls', _id);

              _body.setAttribute('id', _id);

              _body.setAttribute('aria-hidden', 'true');

              _el.addEventListener('click', function (_evt) {
                  _evt.preventDefault();

                  var _trigger = this;

                  var _parent = _trigger.closest('.js-accordion');

                  var _body = _parent.getElementsByClassName('js-accordion__body')[0];

                  var _inner = _parent.getElementsByClassName('js-accordion__inner')[0];

                  var _height = _inner.clientHeight;

                  if (_parent.classList.contains('state-accordion-open') === false) {
                      _parent.classList.add('state-accordion-open');

                      _trigger.classList.add('state-accordion-open');

                      _trigger.setAttribute('aria-expanded', 'true');

                      _body.setAttribute('aria-hidden', 'false');

                      anime({
                          targets: _body,
                          height: _height,
                          duration: 400,
                          easing: 'easeInCubic',
                          complete: function complete() {
                              Resize.doResize();
                              _body.style.height = 'auto';

                              _parent.classList.add('state-accordion-opened');

                              anime({
                                  targets: _inner,
                                  opacity: 1,
                                  duration: 250,
                                  easing: 'linear'
                              });
                          }
                      });
                  } else {
                      _trigger.setAttribute('aria-expanded', 'false');

                      _body.setAttribute('aria-hidden', 'true');

                      _parent.classList.remove('state-accordion-open');

                      _parent.classList.remove('state-accordion-opened');

                      _trigger.classList.remove('state-accordion-open');

                      _body.style.height = _height + 'px';
                      anime({
                          targets: _inner,
                          opacity: 0,
                          duration: 250,
                          easing: 'linear',
                          complete: function complete() {
                              anime({
                                  targets: _body,
                                  height: 0,
                                  duration: 400,
                                  easing: 'easeInCubic',
                                  complete: function complete() {
                                      Resize.doResize();
                                  }
                              });
                          }
                      });
                  }
              });

              _inner.style.opacity = 0;
              _body.style.height = '0px';
              Accordion.count = Accordion.count + 1;
          }
      }
  };
  var Filters = {
      init: function init() {
          if (document.getElementsByClassName('js-filters').length !== 0 && document.getElementsByClassName('js-filter').length !== 0) {
              var _words = [];
              var _i = 0;

              for (_i = 0; _i < document.getElementsByClassName('js-filter').length; _i++) {
                  _words[_i] = document.getElementsByClassName('js-filter')[_i].getAttribute('data-type').charAt(0).toUpperCase() + document.getElementsByClassName('js-filter')[_i].getAttribute('data-type').slice(1);

                  document.getElementsByClassName('js-filter')[_i].setAttribute('data-type', _words[_i]);
              }

              var _uniqWords = _toConsumableArray(new Set(_words));

              _uniqWords.sort();

              if (_uniqWords.length > 2) {
                  var _html = '<li class="c-cats__item"><a href="#" class="c-cats__button state-active js-trigger-filter js-trigger-filter-all">View All</a></li>';

                  for (_i = 0; _i < _uniqWords.length; _i++) {
                      if (_uniqWords[_i].length > 2) {
                          _html = _html + '<li class="c-cats__item"><a href="#" class="c-cats__button js-trigger-filter" data-type="' + _uniqWords[_i] + '">' + _uniqWords[_i] + '</a></li>';
                      }
                  }

                  document.getElementsByClassName('js-filters')[0].innerHTML = _html;

                  var _triggers = document.getElementsByClassName('js-trigger-filter');

                  for (_i = 0; _i < _triggers.length; _i++) {
                      _triggers[_i].addEventListener('click', function (_evt) {
                          _evt.preventDefault();

                          var _filter = 'all';

                          if (!this.classList.contains('js-trigger-filter-all')) {
                              _filter = this.getAttribute('data-type');
                          }

                          var _els = document.getElementsByClassName('js-filter');

                          for (var _j = 0; _j < _els.length; _j++) {
                              if (_filter === 'all' || _els[_j].getAttribute('data-type') === _filter) {
                                  _els[_j].closest('.l-grid__col').style.display = 'block';
                              } else {
                                  _els[_j].closest('.l-grid__col').style.display = 'none';
                              }
                          }

                          _els = document.getElementsByClassName('js-trigger-filter');

                          for (var _j5 = 0; _j5 < _els.length; _j5++) {
                              _els[_j5].classList.remove('state-active');
                          }

                          this.classList.add('state-active');
                          Resize.doResize();
                      });
                  }
              }
          }
      }
  };
  var Insta = {
      init: function init() {
          if (document.getElementsByClassName('c-instagram').length > 0) {
              var _access_token = 'IGQVJYY3h1NDdEbmRwWVpwUTRuSUkzZAkgxSi1oY0FzR2ZAOVmM5NF9YejdyOFhiLU0tbFJpcWxIbm5aTS1NRjhqelFnTm84WmpEU1U5MGJCTGNtZAlMzX21VTkhiMXFOc2R1Nnh3Sk55X09KcDR6XzNFYQZDZD';

              var _url = 'https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,username,timestamp,caption&access_token=' + _access_token;

              var _xhr = new XMLHttpRequest();

              _xhr.onload = function (e) {
                  if (_xhr.readyState === 4) {
                      if (_xhr.status === 200) {
                          var _data = JSON.parse(_xhr.responseText);

                          var _html = '';

                          for (var _i = 0; _i < 8; _i++) {
                              document.getElementsByClassName('c-instagram__item__image')[_i].innerHTML = '<figure class="u-figure js-scroll-load" data-img-w-0="480" data-img-h-0="480" data-img-s-0="' + _data['data'][_i]['media_url'] + '" data-img-w-1="480" data-img-h-1="480" data-img-s-1="' + _data['data'][_i]['media_url'] + '" data-img-w-2="480" data-img-h-2="480" data-img-s-2="' + _data['data'][_i]['media_url'] + '" data-img-w-3="480" data-img-h-3="480" data-img-s-3="' + _data['data'][_i]['media_url'] + '" data-img-w-4="480" data-img-h-4="480" data-img-s-4="' + _data['data'][_i]['media_url'] + '" data-img-w-5="480" data-img-h-5="480" data-img-s-5="' + _data['data'][_i]['media_url'] + '"></figure>';
                              document.getElementsByClassName('c-instagram__item')[_i].getElementsByTagName('a')[0].innerHTML = 'View on Instagram';

                              document.getElementsByClassName('c-instagram__item')[_i].getElementsByTagName('a')[0].setAttribute('href', _data['data'][_i]['permalink']);

                              document.getElementsByClassName('c-instagram__item')[_i].getElementsByTagName('a')[0].setAttribute('target', '_blank');

                              document.getElementsByClassName('c-instagram__item')[_i].getElementsByClassName('top-space')[0].innerHTML = _data['data'][_i]['caption'];

                              var _date = new Date(_data['data'][_i]['timestamp']);

                              var _year = _date.getFullYear();

                              var _month = _date.getMonth() + 1;

                              var _dt = _date.getDate();

                              var _monthText = 'January';

                              if (_month === 2) {
                                  _monthText = 'February';
                              } else if (_month === 3) {
                                  _monthText = 'March';
                              } else if (_month === 4) {
                                  _monthText = 'April';
                              } else if (_month === 5) {
                                  _monthText = 'May';
                              } else if (_month === 6) {
                                  _monthText = 'June';
                              } else if (_month === 7) {
                                  _monthText = 'July';
                              } else if (_month === 8) {
                                  _monthText = 'August';
                              } else if (_month === 9) {
                                  _monthText = 'September';
                              } else if (_month === 10) {
                                  _monthText = 'October';
                              } else if (_month === 11) {
                                  _monthText = 'November';
                              } else if (_month === 12) {
                                  _monthText = 'December';
                              }

                              document.getElementsByClassName('c-instagram__item')[_i].getElementsByClassName('light')[0].innerHTML = _monthText + ' ' + _dt + ', ' + _year;
                          }

                          Galleries.initInstagram();
                          Resize.doResize();
                      }
                  }
              };

              _xhr.open("GET", _url, true);

              _xhr.send();
          }
      }
  };
  /* Helpers - a bunch of helpful functions that can be reused */

  var Helper = {
      isVisible: function isVisible(_el) {
          return _el.offsetWidth > 0 && _el.offsetHeight > 0;
      },
      docReady: function docReady(_fn) {
          if (document.readyState === "complete" || document.readyState === "interactive") {
              setTimeout(_fn, 1);
          } else {
              document.addEventListener("DOMContentLoaded", _fn);
          }
      },
      getOffsetLeft: function getOffsetLeft(_el) {
          var _offsetLeft = 0;

          do {
              if (!isNaN(_el.offsetLeft)) {
                  _offsetLeft += _el.offsetLeft;
              }
          } while (_el = _el.offsetParent);

          return _offsetLeft;
      },
      getOffsetTop: function getOffsetTop(_el) {
          var _offsetTop = 0;

          do {
              if (!isNaN(_el.offsetTop)) {
                  _offsetTop += _el.offsetTop;
              }
          } while (_el = _el.offsetParent);

          return _offsetTop;
      },
      delegate: function delegate(_el, _evt, _sel, _handler) {
          _el.addEventListener(_evt, function (_event) {
              var _t = _event.target;

              while (_t && _t !== this) {
                  if (_t.matches(_sel)) {
                      _handler.call(_t, _event);
                  }

                  _t = _t.parentNode;
              }
          });
      }
  };

  var CheckLinks = {
      init: function init() {
          if (document.getElementsByClassName('c-site-header__logo__inner').length > 0) {
              var _url = document.getElementsByClassName('c-site-header__logo__inner')[0].getAttribute('href');

              var _links = document.getElementsByTagName('a');

              for (var _i = 0; _i < _links.length; _i++) {
                  try {
                      if (_links[_i].getAttribute('href').indexOf(_url) === -1 && _links[_i].getAttribute('href').indexOf('/') !== 0 && _links[_i].getAttribute('href') !== '#') {
                          _links[_i].setAttribute('target', '_blank');
                      }
                  } catch (_e) { }
              }
          }
      }
  };
  /* Boot - boot the site when the DOM is ready */

  var Boot = {
      loaderEl: null,
      startPercent: 25,
      endPercent: 25,
      pageLoaded: true,
      site: function site() {
          Boot.loaderEl = document.getElementsByClassName('c-page-loader')[0];
          setTimeout(function () {
              window.scrollTo(0, 0);
              Device.init();
              // CheckLinks.init();
              // Insta.init();
              // Filters.init();
              // SectionCheck.init();
              // Variants.init();
              // Cart.init();
              Scroll.init();
              // Menu.init();
              // Subscribe.init();
              // Galleries.init();
              Controller.init();
              // JumpScroll.init();
              // DJHover.init();
              // Accordion.init();
              // Resize.init();
              Resize.doResize();
              // Boot.checkLoader();
              // LoadMedia.loadFirst();
              // Mouse.init();
          }, 100);
      },
      checkLoader: function checkLoader() {
          if (document.body.classList.contains('state-page-loaded') === false) {
              Boot.loaderEl.style.width = Boot.startPercent + '%';

              var _els = document.getElementsByClassName('js-state-load-first');

              var _speed = 100;

              if (_els) {
                  var _count = 0;
                  var _done = true;

                  for (var _i = 0; _i < _els.length; _i++) {
                      if (_els[_i].classList.contains('state-media-loaded') === false) {
                          _done = false;
                      } else {
                          _count = _count + 1;
                      }
                  }

                  if (_done === true) {
                      Boot.loaderEl.style.width = '100%';
                      setTimeout(function () {
                          window.scrollTo(0, 0);
                          Boot.loaderEl.style.left = 'auto';
                          Boot.loaderEl.style.right = 0;
                          Boot.loaderEl.style.width = '0%';
                          Galleries.initRecommendations();
                          Resize.doResize();

                          if (document.getElementsByClassName('js-intro-splash').length === 0) {
                              document.body.classList.add('state-no-splash');
                          }

                          document.body.classList.add('state-site-loaded');
                          document.body.classList.add('state-page-loaded');
                          Boot.pageLoaded = true;
                          Mouse.bindEvents();
                          PopupForm.init();
                      }, _speed);
                  } else {
                      Boot.loaderEl.style.width = Boot.startPercent + (100 - Boot.startPercent - Boot.endPercent) / _els.length * _count + '%';
                  }
              } else {
                  Boot.loaderEl.style.width = '100%';
                  setTimeout(function () {
                      window.scrollTo(0, 0);
                      Boot.loaderEl.style.left = 'auto';
                      Boot.loaderEl.style.right = 0;
                      Boot.loaderEl.style.width = '0%';
                      Galleries.initRecommendations();
                      Resize.doResize();

                      if (document.getElementsByClassName('js-intro-splash').length === 0) {
                          document.body.classList.add('state-no-splash');
                      }

                      document.body.classList.add('state-site-loaded');
                      document.body.classList.add('state-page-loaded');
                      Boot.pageLoaded = true;
                      Mouse.bindEvents();
                      PopupForm.init();
                  }, _speed);
              }
          }
      }
  };
  /* Abracadabra */

  Helper.docReady(Boot.site);
}

const bannerKeepPos = {
  init: function () {
      // var target = $('.js-keep-pos');
      // $(window).on('resize scroll', function(){
      //     target.css('transform', 'translateY('+ (window.pageYOffset * 0.6) +'px)')
      // })  
  }
}

const fixedPageMenu = {
  el: {
      menu: $('.fixed-page-menu')
  },
  init: function () {
      var that = this;

      var targets = $('.fixed-page-menu').find('.logo, .page-menu-list .list-link, .language-grape, .divider-line, .menu-foot-txt, .contact-list .list-link, .social-grape li');

      anime({
          targets: targets.toArray(),
          opacity: [0, 1],
          translateX: [40, 0],
          delay: anime.stagger(50, { start: 0 })
      });

      if (!Device.is_agent_mobile) {
          var instance = new SimpleBar($('.fixed-page-menu-scroller')[0], {
              autoHide: false,
              scrollbarMinSize: 5,
              forceVisible: true,
          });
      }

      $(window).on('resize', function(){

          // mobile -> pc 處裡
          if (!Device.is_agent_mobile && that.el.menu.find('[data-simplebar]').length == 0) {
              var instance = new SimpleBar($('.fixed-page-menu-scroller')[0], {
                  autoHide: false,
                  scrollbarMinSize: 5,
                  forceVisible: true,
              });

              that.el.menu.find('.fixed-page-menu-scroller').css('overflow-y', '')
          }

      })

      if (Device.is_agent_mobile) {
          $('.fixed-page-menu-scroller').css('overflow-y', 'auto')
      }

      $('.mob-menu-toggle').click(function () {
          if (that.is_show()) {
              that.hide();
              $(this).removeClass('open')
              $(this).blur()
              $(this).removeClass('is-active')
          } else {
              $(this).addClass('open')
              that.show();
              this.blur()
              $(this).addClass('is-active')
          }
      })

  },
  is_show: function () {
      return $(this.el.menu).is('.is-show')
  },
  show: function () {
      this.el.menu.addClass('is-show')
      Backdrop.show();
      $('.header.mobile').addClass('sty-mob-menu-open')

  },
  hide: function () {
      this.el.menu.removeClass('is-show')
      Backdrop.hide();
      $('.header.mobile').removeClass('sty-mob-menu-open')
  },
}

const cursorObj = {
  el: $('.cursor-obj'),
  targetList: {
      // 放大
      scaleUp: [
          '.js-cursor-obj-lg',
          'img',
          '.img',
          '.user-intro-box .box-media',
      ],
      // 緊貼
      stickUp: [
          '.language-grape li',
      ],
      // 顯示 viewText
      viewText: [
          '.js-cursor-view',
          '.news-box .box-media',
          '.product-detailed-block .tag-img-box',
          '.inquiry-box .col-media',
          '.product-box .box-media'
      ],
      // 隱藏
      disable: [
          '.js-cursor-disable',
          '.pagination-link',
          '.input-group',
          '.cbp-basic-nav',
          '.navigator-function',
          '.inquiry-list'
      ],
      // 箭頭
      arrow: [
          // '.js-cursor-arrow',
          // '.info-display-list'
      ]
  },
  testTarget:function(currentEl, AniType) {

      var selectorList = this.targetList[AniType];

      if (!selectorList) return;

      var result = false;

      selectorList.some(function(aniTargetSelector, idx){
         
          if (
              $(currentEl).is(aniTargetSelector) ||
              $(aniTargetSelector).has(currentEl).length > 0
              ) {
              result = true;
              return;
          }
      })

      return result
  },
  init: function () {
      var that = this;

      var curosr_current_ani;


      $('body').on('click', function () {

          that.el.addClass('is-click')
          that.el.one('animationend', function () {
              that.el.removeClass('is-click')
          })
      })

      $('body').on('mousemove', function (e) {

          var x = e.clientX;
          var y = e.clientY;

          var cursor_w = 16;
          var cursor_h = 16;

          var current_el = document.elementFromPoint(x, y);

          // 圓圈貼合
          if ( that.testTarget(current_el, 'stickUp') && that.el.width() !== 16) {
              cursor_w = $('.menu-foot .language-link').width();
              cursor_h = $('.menu-foot .language-link').height();
              y = parseInt($('.language-link')[0].getBoundingClientRect().y);
          }

          // 圓圈放大
          if (
              that.testTarget(current_el, 'scaleUp')
          ) {
              cursor_w = 46;
              cursor_h = 46;
          }

          // 變形箭頭
          if (
              that.testTarget(current_el, 'arrow')
          ) {
              if ( !$(that.el).is('.is-arrow') ) {
                  $(that.el).addClass('is-arrow')
              }
          } else{
              if ( $(that.el).is('.is-arrow') ) {
                  $(that.el).removeClass('is-arrow')
              }
          }

          // 變形View
          
          if (
              that.testTarget(current_el, 'viewText')
          ) {

              cursor_w = 46;
              cursor_h = 46;

              if (!$(that.el).is('.is-view')) {
                  $(that.el).addClass('is-view')
              }
          } else {
              if ($(that.el).is('.is-view')) {
                  $(that.el).removeClass('is-view')
              }
          }

          // disable
          if (
              that.testTarget(current_el, 'disable')
          ) {
              if (!$(that.el).is('.is-disable')) {
                  $(that.el).addClass('is-disable')
              }
          } else {
              if ($(that.el).is('.is-disable')) {
                  $(that.el).removeClass('is-disable')
              }
          }


          if ($(current_el).is('.language-grape li') || $('.language-grape li').has(current_el).length > 0) {

              var el_bd = current_el.getBoundingClientRect();
              var lagnuage_link = $('.language-grape .language-link')

              if (curosr_current_ani) {
                  curosr_current_ani.pause();
              };

              curosr_current_ani = anime({
                  targets: [that.el[0]],
                  opacity: 1,
                  left: el_bd.x + 1 + (lagnuage_link.width() * 0.55),
                  top: el_bd.y + 1 + (lagnuage_link.height() * 0.55),
                  width: $(lagnuage_link).outerWidth(),
                  height: $(lagnuage_link).outerHeight(),
              });

          } else {

              if (curosr_current_ani) {
                  curosr_current_ani.pause();
              }

              // only wdith / height animate
              if (cursor_w !== $(that.el).width()) {
                  curosr_current_ani = anime({
                      targets: [that.el[0]],
                      width: cursor_w,
                      height: cursor_h,
                  })
              };

              anime.set(that.el[0], {
                  opacity: 1,
                  left: x,
                  top: y,
              });
          }

      })

  }
}

const brusNewAniBox = {
  init: function () {

      function update() {
          $('.brush-new-ani-box').each(function (e) {
              var img_default = $(this).find('.img-default');

              $(this).find('.img-show').css({
                  height: img_default.height(),
                  width: img_default.width(),
              })
          })
      }

      update();

      $(window).on('resize', function () {
          update();
      })
  }
}

const textShowUp = {
  selector: '.js-txt-showup-ani',
  init: function(){
      var that = this;
      var targets = $(this.selector);

      if (!targets.length) return;


      var fz = ToolBox.getFontSize(targets.first()[0]);

      targets.each(function(idx, target){
          var target = $(target);
          var showUpContent = $(target).find('.showup-content');
          showUpContent[0].innerHTML = showUpContent[0.].textContent.replace(/\S/g, "<span class='letter' style='transform:translateY(100%); display:inline-block;' >$&</span>");

          var strokeStyleEl = showUpContent.clone();
          var strokeStyle = Device.is_ie ? { /* IE 不支援 stroke*/ } : { color: 'transparent', '-webkit-text-stroke': '1px #ffb300'};

          strokeStyleEl.addClass('sty-stroke').find('.letter').css(strokeStyle);
          $(target).prepend(strokeStyleEl[0]);
          $(target).append(showUpContent.clone()[0]);
      });

      targets.css('opacity', 1);

      var ani = anime({
          targets: targets.find('.showup-content:first-child .letter').toArray(),
          translateY: ['100%' , 0],
          opacity: 1,
          delay: anime.stagger(20),
          autoplay: false,
          complete: function() {
              anime({
                  targets: targets.find('.showup-content:first-child .letter').toArray(),
                  translateY: [0, '-100%'],
                  opacity: 1,
                  delay: anime.stagger(20),
              })

              anime({
                  targets: targets.find('.showup-content:nth-child(2) .letter').toArray(),
                  translateY: ['100%', '-100%'],
                  opacity: 1,
                  delay: anime.stagger(20),
              })

              anime({
                  targets: targets.find('.showup-content:nth-child(3) .letter').toArray(),
                  translateY: ['100%', 0],
                  opacity: 1,
                  delay: anime.stagger(20),
                  complete: function(){

                      targets.addClass('is-inited');
                  }
              });

          }
      })

      setTimeout(function(){
          ani.play();
      }, 1000)
  }
}

const BannerSing = {
  selector: '.banner-sign',
  init: function(){
      var targets = $(this.selector);

      if (!targets.length) return;


      targets.each(function(idx, target){
          var target = $(target);
          
          $(target).on('mouseenter', function () {

              var aniSubTargets = $(this).find('.js-txt-showup-ani');
              
              
              aniSubTargets.each(function(idx, subtarget) {

                  if (!aniSubTargets.is('.is-inited')) return;

                  var subtarget = $(subtarget)

                  anime({
                      targets: subtarget.find('.showup-content:nth-child(2) .letter').toArray(),
                      translateY: ['-100%', '-200%'],
                      opacity: 1,
                      delay: anime.stagger(20),
                  })

                  anime({
                      targets: subtarget.find('.showup-content:nth-child(3) .letter').toArray(),
                      translateY: [0, '-100%'],
                      opacity: 1,
                      delay: anime.stagger(20),
                  })
              })
          })

          $(target).on('mouseleave', function () {

              var aniSubTargets = $(this).find('.js-txt-showup-ani');

              aniSubTargets.each(function (idx, subtarget) {

                  var subtarget = $(subtarget)

                  if (!aniSubTargets.is('.is-inited')) return;

                  anime({
                      targets: subtarget.find('.showup-content:nth-child(3) .letter').toArray(),
                      translateY: ['-100%', 0],
                      opacity: 1,
                      delay: anime.stagger(20),
                  })

                  anime({
                      targets: subtarget.find('.showup-content:nth-child(2) .letter').toArray(),
                      translateY: ['-200%', '-100%'],
                      opacity: 1,
                      delay: anime.stagger(20),
                  })
              })

          })
      })
  }
}

const ContentViewerBox = {
  selector: '.content-viewer-box',
  init: function(){
      // var that = this;
      // this.update();
      // $(window).on('resize', function(){
      //     that.update()
      // })
  },
  update: function() {
      var targets = $(this.selector);
      var vh30pcrt = window.innerHeight * 0.30;

      targets.each(function (idx, target) {
          var target = $(target);
          target.css('max-height', vh30pcrt);
      })
  }
}

const ShopCart = {
  selector: '.fab-cart-btn',
  init: function(){

      var target = $(this.selector);
      
      setTimeout(function(){
          target.one('animationend', function(){
              target.removeClass('is-ani')
          });
          
          target.css('opacity', 1)
          target.addClass('is-ani')
      }, 1000)

  },
  // 取值
  getNum: function(){
      return parseInt($(this.selector).find('[data-num]').attr('data-num'));
  },
  // 設值
  setNum: function(num){
      $(this.selector).find('[data-num]').attr('data-num', parseInt(num));
      this.bounce()
  },
  // 動畫
  bounce: function(){
      var that = this;

      $(this.selector).removeClass('is-ani');

      setTimeout(function(){
          $(that.selector).addClass('is-ani').one('animationend', function () {
              $(that).removeClass('is-ani')
          });
      },100)
  }
}

var Scroll = {
  heightForcer: null,
  siteWrap: null,
  wrapHeight: 0,
  lastScrollPos: -1,
  scrollPos: 0,
  adjustScrollPos: 0,
  posOffset: 0,
  maxScrollPos: 0,
  fixedEls: [],
  loadObs: [],
  circObs: [],
  resizing: false,
  scrollDown: true,
  headerEl: null,
  menuButtonEl: null,
  headerScrollUp: false,
  headerAtTop: true,
  headerTimer: null,
  hasSplash: false,
  shopButton: null,
  notificationEl: null,
  init: function init() {
      Scroll.heightForcer = document.getElementById('js-height-forcer');
      Scroll.siteWrap = document.getElementsByClassName('c-site-wrapper')[0];
      Scroll.notificationEl = document.getElementsByClassName('c-cart-notification')[0];
      /* Call the resize event to set everything up */

      Scroll.doResize();
  },
  setupPage: function setupPage() {
      Scroll.fixedEls = document.getElementsByClassName('js-fixed-el');
      Scroll.heightForcer.style.display = 'none';

      if (Device.parallax === true) {
          Scroll.heightForcer.style.display = 'block';
          Scroll.wrapHeight = Scroll.siteWrap.clientHeight;
          Scroll.heightForcer.style.height = Scroll.wrapHeight + 'px';
          Scroll.siteWrap.classList.add('state-parallax-fixed');
          Scroll.maxScrollPos = Math.floor(Scroll.wrapHeight - Device.screenHeight);
      } else {
          Scroll.siteWrap.classList.remove('state-parallax-fixed');
          Scroll.siteWrap.removeAttribute('style');

          for (var _i = 0; _i < Scroll.fixedEls.length; _i++) {
              Scroll.fixedEls[_i].removeAttribute('style');
          }
      }

      if (document.getElementsByClassName('c-brand-pos').length !== 0) {
          Scroll.checkReverse = true;
          Scroll.doReverse();
      } else {
          Scroll.checkReverse = false;
          document.body.classList.remove('state-reverse-header');
      }
  },
  doPage: function doPage() {
      if (Device.parallax === true && Menu.open === false) {
          Scroll.siteWrap.style.transform = 'translate3d(0px,' + (0 - Scroll.scrollPos) + 'px,0px)';

          for (var _i = 0; _i < Scroll.fixedEls.length; _i++) {
              Scroll.fixedEls[_i].style.transform = 'translate3d(0px,' + Scroll.scrollPos + 'px,0px)';
          }

          Scroll.notificationEl.style.transform = 'translate3d(0px,' + Scroll.scrollPos + 'px,0px)';
      }
  },
  doScroll: function doScroll() {
      Scroll.lastScrollPos = Scroll.scrollPos;

      var _newPos = Math.floor(window.pageYOffset);

      if (Boot.pageLoaded === false) {
          _newPos = 0;
      }

      if (Scroll.lastScrollPos !== _newPos && Menu.open === false) {
          if (_newPos < Scroll.scrollPos) {
              if (Scroll.scrollDown !== false) {
                  document.body.classList.add('state-scroll-up');
              }

              Scroll.scrollDown = false;
          } else {
              if (Scroll.scrollDown !== true) {
                  document.body.classList.remove('state-scroll-up');
              }

              Scroll.scrollDown = true;
          }

          Scroll.scrollPos = _newPos;

          if (Device.portrait === false && Device.touch === false) {
              Scroll.posOffset = Scroll.scrollPos;
          } else {
              Scroll.posOffset = 0;
          }

          PopupForm.triggerPopup();
      }
  },
  doHeaderResize: function doHeaderResize() {
      if (document.getElementsByClassName('c-site-header').length > 0) {
          Scroll.menuButtonEl = document.getElementsByClassName('c-menu-button')[0];
          Scroll.headerEl = document.getElementsByClassName('c-site-header')[0];
          Scroll.hasSplash = false;
          Scroll.shopButton = document.getElementsByClassName('c-shop-menu__button')[0];

          if (document.getElementsByClassName('js-intro-splash').length > 0) {
              Scroll.hasSplash = Device.screenHeight - document.getElementsByClassName('c-site-header')[0].clientHeight;
          }
      }
  },
  doHeader: function doHeader() {
      if (Scroll.headerEl !== null) {
          var _offset = Scroll.scrollPos;

          if (_offset < 0) {
              _offset = 0;
          }

          var _headerAtTop = false;

          if (Scroll.hasSplash === false) {
              _headerAtTop = false;
          } else {
              if (Scroll.scrollPos < Scroll.hasSplash) {
                  _headerAtTop = true;
              }
          }

          if (Scroll.headerAtTop !== _headerAtTop) {
              Scroll.headerAtTop = _headerAtTop;

              if (Scroll.headerAtTop === false) {
                  document.body.classList.add('state-header-scrolled');
              } else {
                  document.body.classList.remove('state-header-scrolled');
              }
          }

          if (Device.parallax === true) {
              Scroll.headerEl.style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
              Scroll.menuButtonEl.style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
          }
      }
  },
  getLoadOffset: function getLoadOffset() {
      Scroll.loadObs = [];

      var _main = document.querySelector('main');

      var _loadEls = document.getElementsByClassName('js-scroll-load');

      if (_loadEls) {
          for (var _i = 0; _i < _loadEls.length; _i++) {
              Scroll.loadObs[_i] = [];
              Scroll.loadObs[_i]['el'] = _loadEls[_i];
              Scroll.loadObs[_i]['offset'] = Helper.getOffsetTop(Scroll.loadObs[_i]['el']) - Device.screenHeight * 4;

              if (Boot.pageLoaded === false && Helper.getOffsetTop(Scroll.loadObs[_i]['el']) < Device.screenHeight * 1.25 && _main.contains(Scroll.loadObs[_i]['el'])) {
                  Scroll.loadObs[_i]['el'].classList.add('js-state-load-first');
              }

              if (Scroll.loadObs[_i]['el'].classList.contains('js-state-load-media')) {
                  Scroll.loadObs[_i]['loaded'] = true;
              } else {
                  Scroll.loadObs[_i]['loaded'] = false;
              }
          }
      }
  },
  doLoad: function doLoad() {
      if (Scroll.loadObs) {
          for (var _i = 0; _i < Scroll.loadObs.length; _i++) {
              if (Scroll.loadObs[_i]['offset'] < Scroll.scrollPos && Scroll.loadObs[_i]['loaded'] === false && Boot.pageLoaded === true) {
                  Scroll.loadObs[_i]['el'].classList.add('js-state-load-media');

                  Scroll.loadObs[_i]['loaded'] = true;
                  LoadMedia.doLoad(Scroll.loadObs[_i]['el']);
              }
          }
      }
  },
  getCircs: function getCircs() {
      Scroll.circObs = [];

      var _els = document.getElementsByClassName('js-circle-parent');

      if (_els) {
          for (var _i = 0; _i < _els.length; _i++) {
              Scroll.circObs[_i] = [];
              Scroll.circObs[_i]['parent'] = _els[_i];
              Scroll.circObs[_i]['el'] = _els[_i].getElementsByClassName('js-circle')[0];
              Scroll.circObs[_i]['start'] = Math.floor(Helper.getOffsetTop(_els[_i]));
              Scroll.circObs[_i]['end'] = Math.floor(Scroll.circObs[_i]['start'] + _els[_i].clientHeight - Device.screenHeight);
          }

          ;
      }
  },
  doCircs: function doCircs() {
      for (var _i = 0; _i < Scroll.circObs.length; _i++) {
          if (Device.parallax === true) {
              var _pos = Scroll.scrollPos - Scroll.circObs[_i]['start'];

              Scroll.circObs[_i]['el'].style.transform = 'translate3d(0px,' + _pos + 'px,0px)';
          }
      }
  },
  getParallax: function getParallax() {
      Scroll.parallaxObs = [];

      var _parents = document.getElementsByClassName('js-parallax-parent');

      if (_parents) {
          for (var _i = 0; _i < _parents.length; _i++) {
              if (_parents[_i].classList.contains('js-setup') === false) {
                  _parents[_i].classList.add('js-setup');

                  var _children = _parents[_i].querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,hr, small, .c-button, .c-media__inner, .flag');

                  if (_children) {
                      for (var _j = 0; _j < _children.length; _j++) {
                          _children[_j].classList.add('js-parallax');
                      }
                  }
              }
          }
      }

      var _els = document.getElementsByClassName('js-parallax');

      if (_els) {
          var _j2 = 0;

          for (var _i2 = 0; _i2 < _els.length; _i2++) {
              if (Helper.getOffsetLeft(_els[_i2]) < Device.screenWidth) {
                  Scroll.parallaxObs[_j2] = [];
                  Scroll.parallaxObs[_j2]['el'] = _els[_i2];
                  Scroll.parallaxObs[_j2]['el'].style.transform = 'translate3d(0px,0px,0px)';
                  var _speed = 0.4;

                  var _speedAdjust = Helper.getOffsetLeft(Scroll.parallaxObs[_j2]['el']) / Device.screenWidth;

                  _speed = _speed * _speedAdjust + 0.1;
                  var _adjust = 0.6;
                  Scroll.parallaxObs[_j2]['end'] = Math.floor(Helper.getOffsetTop(Scroll.parallaxObs[_j2]['el']) - Device.screenHeight * _adjust);
                  Scroll.parallaxObs[_j2]['speed'] = _speed;
                  Scroll.parallaxObs[_j2]['start'] = Math.floor(Scroll.parallaxObs[_j2]['end'] - Device.screenHeight);
                  Scroll.parallaxObs[_j2]['finished'] = false;
                  Scroll.parallaxObs[_j2]['endless'] = Scroll.parallaxObs[_j2]['el'].classList.contains('js-parallax--endless');
                  Scroll.parallaxObs[_j2]['image'] = Scroll.parallaxObs[_j2]['el'].classList.contains('js-parallax--image');

                  if (Scroll.parallaxObs[_j2]['endless'] === true) {
                      Scroll.parallaxObs[_j2]['speed'] = 0.125;
                      Scroll.parallaxObs[_j2]['end'] = Math.floor(Helper.getOffsetTop(Scroll.parallaxObs[_j2]['el']) - Device.screenHeight * 0.5);
                      Scroll.parallaxObs[_j2]['start'] = Scroll.parallaxObs[_j2]['end'] - Device.screenHeight;
                  }

                  if (Scroll.parallaxObs[_j2]['image'] === true) {
                      Scroll.parallaxObs[_j2]['speed'] = 0.5;
                      Scroll.parallaxObs[_j2]['endless'] = true;
                      Scroll.parallaxObs[_j2]['end'] = Math.floor(Helper.getOffsetTop(Scroll.parallaxObs[_j2]['el']));
                      Scroll.parallaxObs[_j2]['start'] = Math.floor(Scroll.parallaxObs[_j2]['end'] - Device.screenHeight);
                  }

                  _j2 = _j2 + 1;
              } else {
                  _els[_i2].style.transform = 'none';
              }
          }

          ;
      }
  },
  doParallax: function doParallax() {
      for (var _i = 0; _i < Scroll.parallaxObs.length; _i++) {
          var _offset = 0;

          if (Scroll.scrollPos > Scroll.parallaxObs[_i]['end'] && Scroll.parallaxObs[_i]['finished'] === false) {
              if (Scroll.parallaxObs[_i]['endless'] === true && Device.parallax === true) {
                  _offset = Math.floor((Scroll.scrollPos - Scroll.parallaxObs[_i]['end']) * Scroll.parallaxObs[_i]['speed']);
                  Scroll.parallaxObs[_i]['el'].style.willChange = 'transform';
                  Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
              } else {
                  Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,0px,0px)';
                  Scroll.parallaxObs[_i]['finished'] = true;

                  Scroll.parallaxObs[_i]['el'].classList.add('state-parallax-done');
              }
          } else if (Scroll.scrollPos >= Scroll.parallaxObs[_i]['start'] && Scroll.scrollPos <= Scroll.parallaxObs[_i]['end']) {
              Scroll.parallaxObs[_i]['finished'] = false;

              Scroll.parallaxObs[_i]['el'].classList.remove('state-parallax-done');

              if (Device.parallax === true) {
                  if (Scroll.parallaxObs[_i]['endless'] === true) {
                      _offset = Math.floor((Scroll.scrollPos - Scroll.parallaxObs[_i]['end']) * Scroll.parallaxObs[_i]['speed']);
                  } else {
                      _offset = Math.abs(Math.floor((Scroll.scrollPos - Scroll.parallaxObs[_i]['end']) * Scroll.parallaxObs[_i]['speed']));
                  }

                  Scroll.parallaxObs[_i]['el'].style.willChange = 'transform';
                  Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
              }
          } else if (Scroll.parallaxObs[_i]['finished'] === false) {
              if (Scroll.parallaxObs[_i]['endless'] === true && Device.parallax === true) {
                  _offset = Math.floor((Scroll.scrollPos - Scroll.parallaxObs[_i]['end']) * Scroll.parallaxObs[_i]['speed']);
                  Scroll.parallaxObs[_i]['el'].style.willChange = 'transform';
                  Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
              } else {
                  Scroll.parallaxObs[_i]['el'].style.transform = 'translate3d(0px,0px,0px)';
                  Scroll.parallaxObs[_i]['finished'] = true;

                  Scroll.parallaxObs[_i]['el'].classList.add('state-parallax-done');
              }
          }
      }
  },
  getParallaxImg: function getParallaxImg() {
      Scroll.pImgObs = [];

      if (Device.parallax === true) {
          var _pImgEls = document.getElementsByClassName('js-img-parallax');

          for (var _i = 0; _i < _pImgEls.length; _i++) {
              Scroll.pImgObs[_i] = [];
              Scroll.pImgObs[_i]['el'] = _pImgEls[_i];

              var _height = Math.ceil(Scroll.pImgObs[_i]['el'].parentElement.clientHeight);

              var _imgHeight = Math.ceil(_height * Scroll.pImgRatio);

              var _offset = Helper.getOffsetTop(Scroll.pImgObs[_i]['el'].parentElement);

              var _midPoint = _offset + _height * 0.5 - Device.screenHeight * 0.5;

              Scroll.pImgObs[_i]['el'].style.position = 'absolute';
              Scroll.pImgObs[_i]['el'].style.width = '100%';
              Scroll.pImgObs[_i]['el'].style.height = _imgHeight + 'px';
              Scroll.pImgObs[_i]['el'].style.top = '0';
              Scroll.pImgObs[_i]['el'].style.left = '0';
              Scroll.pImgObs[_i]['start'] = Math.floor(_midPoint - Device.screenHeight * 1 - 16);
              Scroll.pImgObs[_i]['end'] = Math.ceil(_midPoint + Device.screenHeight * 1 + 16);
              Scroll.pImgObs[_i]['height'] = _height;
              Scroll.pImgObs[_i]['imgHeight'] = _imgHeight;
          }
      }
  },
  doParallaxImg: function doParallaxImg() {
      if (Device.parallax === true) {
          for (var _i = 0; _i < Scroll.pImgObs.length; _i++) {
              if (Scroll.adjustScrollPos < Scroll.pImgObs[_i]['start']) {
                  Scroll.pImgObs[_i]['el'].style.transform = 'translate3d(0px,' + (Scroll.pImgObs[_i]['height'] - Scroll.pImgObs[_i]['imgHeight']) + 'px,0px)';
              } else if (Scroll.adjustScrollPos > Scroll.pImgObs[_i]['end']) {
                  Scroll.pImgObs[_i]['el'].style.transform = 'translate3d(0px,0px,0px)';
              } else {
                  var _ratio = (Scroll.pImgObs[_i]['end'] - Scroll.adjustScrollPos) / (Scroll.pImgObs[_i]['end'] - Scroll.pImgObs[_i]['start']);

                  var _offset = 0 - Math.round((Scroll.pImgObs[_i]['imgHeight'] - Scroll.pImgObs[_i]['height']) * _ratio);

                  Scroll.pImgObs[_i]['el'].style.transform = 'translate3d(0px,' + _offset + 'px,0px)';
              }
          }
      }
  },
  doResize: function doResize() {
      Scroll.resizing = true;
      Scroll.setupPage();
      Scroll.doScroll();
      Scroll.doHeaderResize();
      Scroll.getParallax();
      Scroll.getParallaxImg();
      Scroll.getLoadOffset();
      Scroll.getCircs();
      Scroll.lastScrollPos = -1;
      Scroll.resizing = false;
  }
};

const HistoryDisplayBox = {
  init: function(){

      $('.history-display-box table .item-title, .history-display-box table .item-content').on('mouseenter', function(){

          $('.history-display-box table th, .history-display-box table td').removeClass('is-hover')

          $(this).addClass('is-hover');

          if ( $(this).is('.item-title')) {

              $(this).next().addClass('is-hover')

          } else {

              $(this).prev().addClass('is-hover')
          }

      });

      $('.history-display-box table').on('mouseleave', function() {
          $('.history-display-box table th, .history-display-box table td').removeClass('is-hover')
      })

  }
}

const ProductBox = {
  init: function(){

      $('body').on('click', '.product-box', function(e){

          if ($(e.target).is('.add-cart')) {

              return false;
          }

      })

  }
}

// 取得scrolllbar width
function getScrollbarWidth() {
  const scrollDiv = document.createElement('div')
  scrollDiv.className = "modal-scrollbar-measure"
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

// simplebar
function createSimplebar(target, setting) {
  var target = $(target);
  var defaultSetting = {
      autoHide: false,
      scrollbarMinSize: 5,
      forceVisible: true,
  }

  var newSetting = $.extend(true, {}, defaultSetting, setting);

  const monitorScrollBarVisible = function(cotnentWrapperEl){
      if (cotnentWrapperEl.clientHeight < cotnentWrapperEl.scrollHeight) {
          $(cotnentWrapperEl).closest('[data-simplebar="init"]').addClass('is-scrollbar')
      } else {
          $(cotnentWrapperEl).closest('[data-simplebar="init"]').removeClass('is-scrollbar')
      }
  }

  target.each(function (idx, block) {
      var blockEl = $(block);
      var blockHeight = blockEl.height();
      var instance = blockEl.data('simplebar');

      if ( instance ) {
          // unMont first
          instance.unMount();
      }

      var instance = new SimpleBar(block, newSetting);

      var contentWrapperEl = instance.contentWrapperEl;
      monitorScrollBarVisible(contentWrapperEl);
      
      $(window).on('resize', function(){
          monitorScrollBarVisible(contentWrapperEl);
      });

      blockEl.data('simplebar', instance)
  });
}

// view Detector
function ViewDetector(setting) {
  var view = (setting.view && $(setting.view)) || $(window);
  var targets = $(setting.targets) || null;
  
  var offsetMethod = setting.offsetMethod || 'offset'

  var direction = 'indeterminate';
  var prevPosition = $(view).scrollTop();
  var inViewEls = [];
  var extendProp = setting.extendProp || null;

  // 改為自定array
  if (targets) {
      targets = targets.map(function (idx, target) {
          return {
              target: $(target),
              extendProp: ('function' === typeof extendProp) ? extendProp(target) : null
          }
      });
  }

  if (targets) {
      view.on('scroll resize DOMContentLoaded', _detect_position);
      view.on('scroll resize DOMContentLoaded', _detect_direction);
      return {
          get inViewEls() {
              return inViewEls;
          },
          get direction() {
              return direction;
          },
          unBindEvent: function () {
              view.unbind('scroll resize DOMContentLoaded', _detect_position);
              view.unbind('scroll resize DOMContentLoaded', _detect_direction);
          }
      }
  }
  function _detect_direction() {
      var currentPosition = view.scrollTop();

      if (currentPosition < prevPosition) {
          direction = 'up';
      } else if (currentPosition > prevPosition) {
          direction = 'down';
      } else {
          direction - 'indeterminate';
      }

      prevPosition = currentPosition;
  }


  function _detect_position() {
      inViewEls = [];

      var viewScrollTop = $(view).scrollTop();
      var viewHeight = $(view).innerHeight();
      var viewBottom = viewScrollTop + viewHeight;
      targets.each(function (idx, targetObj) {
          var target = targetObj.target;
          var targetOffset = target[setting.offsetMethod]();
          var targetTop = targetOffset.top;
          var targetHeight = $(target).innerHeight();
          var targetBottom = targetTop + targetHeight;

          var insideTop = (viewScrollTop > targetTop) && (viewScrollTop < targetBottom);
          var insideBottom = (viewBottom < targetBottom) && (viewBottom > targetTop);
          // Target 整個在view裡
          var fullInside = (viewScrollTop < targetTop) && (viewBottom > targetBottom);
          // Tgaget 滿溢佔滿view
          var fullOverflow = (targetTop < viewScrollTop) && (targetBottom > viewBottom)
          // Target 部分在view裡
          var partInside = !(insideTop && insideBottom) && (insideTop || insideBottom);

          if (fullInside || fullOverflow) {
              var portion = targetHeight / viewHeight;
              inViewEls.push({
                  el: target,
                  portion: portion > 1 ? 1 : portion,
                  extendProp: targetObj.extendProp
              });
          }
          if (partInside) {
              if (insideTop) {
                  inViewEls.push({
                      el: target,
                      portion: (targetBottom - viewScrollTop) / viewHeight,
                      extendProp: targetObj.extendProp
                  });
              } else if (insideBottom) {
                  inViewEls.push({
                      el: target,
                      portion: (viewBottom - targetTop) / viewHeight,
                      extendProp: targetObj.extendProp
                  });
              }
          }
      });
  }

}

// 卡片離場效果
function item_leave(target, setting) {
  // 預設值
  this.default = {
      // 外面多包一層避免晃動
      action_wrap: false,
      on_leaved: function () {

      }
  }

  var new_setting = $.extend(true, {}, this.default, setting);

  var target = $(target);

  if (new_setting.action_wrap) {
      target.wrap('<div></div>')
      target = target.parent()
  }

  target.css('position', 'relative').animate({
      left: '-200%'
  }, 300, function () {
      target.slideUp(function () {
          target.remove();

          // on_leaved
          if (new_setting.on_leaved) {
              new_setting.on_leaved()
          }
      });
  })
}



$(function(){

  Device.init();

  Boot.init();

  websiteBg.init();

  ProductBox.init();

  $('.box-media').on('mouseenter', function(){
      anime({
          targets: $('.js-img-clip path')[0],
          d: "M 0 173.5 C -0.4 156.6 4.1 140.7 7.4 124.2 C 14.6 105 23.3 91.8 32.4 76.2 C 38.3 66.1 47 57.2 53.9 47.7 C 66.1 35.1 75.1 28.9 87.4 20.2 C 115.5 5.9 115.5 5.9 143.9 1.2 C 153.1 -0.3 174.4 -0.2 194 1.7 C 211.8 3 220.9 7.6 237.9 13.7 C 257.8 20.9 271.7 27.9 293.7 42.6 C 312.9 59.1 327.3 67.6 332.9 91.7 C 333.6 110.2 330.1 123.1 322.9 142.2 C 319 154.2 308.3 172.5 300.9 188.2 C 295.9 208.3 292.5 211.3 283 240 C 273.6 263.9 270.5 277.2 247.1 291.2 C 211.4 302.8 204.9 299 183.7 295.5 C 159.9 287.7 127.9 276.7 104.9 263.2 C 81.8 254 60.9 246.2 37.9 237.7 C 22 226.1 16.9 226.2 4.9 202.2 C 1.9 190.2 0.2 183.5 -0 173.5 Z",
          easing: 'easeOutExpo'
      })
      anime({
          targets: $(this).find('image')[0],
          scale: 1.1,
          easing: 'easeOutExpo'
      })
  })

  $('.box-media').on('mouseleave', function(){
      anime({
          targets: $('.js-img-clip path')[0],
          d: "M 0.108 188.081 C -0.339 171.219 0.542 154.424 3.808 137.873 C 7.367 119.809 17.16 104.454 26.299 88.896 C 32.247 78.768 38.975 69.137 45.891 59.632 C 55.013 47.095 68.191 39.621 80.478 30.908 C 104.378 13.956 131.483 5.68 159.892 0.944 C 169.076 -0.586 178.503 0.05 187.75 0.722 C 205.581 2.022 223.227 4.765 240.138 10.901 C 260.019 18.114 278.912 27.201 295.089 41.156 C 314.26 57.697 324.189 79.481 329.751 103.521 C 334.065 122.151 333.562 140.988 331.279 159.905 C 329.835 171.881 329.33 184.005 326.404 195.736 C 321.372 215.87 310.511 232.994 297.78 249.067 C 277.49 266.915 257.2 284.763 236.91 302.611 C 219.526 312.929 201.687 322.752 181.455 325.766 C 149.916 330.466 118.978 327.359 89.141 315.475 C 66.012 306.263 43.784 295.475 26.486 276.948 C 11.058 260.424 1.866 241.134 0.997 218.014 C 0.623 208.038 0.287 198.061 0.108 188.081 Z",
          easing: 'easeOutExpo'
      })
      anime({
          targets: $(this).find('image')[0],
          scale: 1,
          easing: 'easeOutExpo'
      })
  })

  /*-----------------------------------------------------------------
      滑動至指定區塊
  -----------------------------------------------------------------*/
  $('a[href^=#]').on('click', function () {
      var speed = 500;
      var href = $(this).attr("href");
      // 是否為Anchor
      if (!$(this).is('.js-go')) return;
      // 頂端# 或 指定目標#-
      var target = $(href == "#" || href == "" ? 'html' : href);
      var position = target.offset().top;
      $("html, body").animate({ scrollTop: position }, speed, "swing");
      return false;
  });


  /*-----------------------------------------------------------------
      使用者捲動偵測 On Scroll
      -----------------------------------------------------------------*/
      $(window).on('load scroll', function (e) {
      var top = $(window).scrollTop();
      var footerTop = $('.footer').offset().top;
      var bottom = window.innerHeight + top;

      if (top > 20 ) {
          $('body').addClass('is-scrolling');
      } else {
          $('body').removeClass('is-scrolling');
      }

      if (bottom > footerTop) {
          $('body').addClass('is-reach-footer');
      } else {
          $('body').removeClass('is-reach-footer');
      }
  });


  /*-----------------------------------------------------------------
      手機選單 Mobile Menu
  -----------------------------------------------------------------*/
  $('.header .fa-bars').on('click',function(e){
      $('.col-right').toggleClass('is-opened');
  });

  $('.header .backdrop').on('click', function (e) {
      $('.header .fa-bars').click();
  });

  // $(window).on('load resize',function(e){
  //     if ( $(window).width() > 1200 ) {
  //         $('.col-right').removeClass('is-opened');
  //     }
  // });

  $('.menu-item-link').click(function(e){
      if ($(window).innerWidth() <= 992 && $(this).is('.has-submenu')) {
          e.preventDefault();
          $(this).toggleClass('active');
          $(this).siblings('.menu-sec-wrap').slideToggle();
      }
  });


  /*-----------------------------------------------------------------
      頁面內側選單 Side Menu
  -----------------------------------------------------------------*/
  $('.sidemenu-simple').on('click', 'li > a', function (e) {
      // 有子選單才執行打開動作
      if ($(this).siblings('ul').length > 0){
          $(this).closest('li').toggleClass('open').find('> ul').slideToggle();
      }
  });

  $('.sidemenu-simple').on('click', '.sidemenu-simple-title', function (e) {
      $(this).toggleClass('open');
      $(this).siblings('.sidemenu-simple-body').slideToggle();
  });

  //直接進子選單，則打開母選單
  $(function (e) {
      var active = $('.sidemenu-simple .active');
      if (active.length !== 0) {
          active.parents('li').addClass('open').find('ul').each(function(idx,val){
              if ( $(val).find('.active').length !== 0) { // 假如這個子選單包含active
                  $(val).slideDown(0);
              }
          });
      }
  });


  /*-----------------------------------------------------------------
      加入收藏 Add Favorite
  -----------------------------------------------------------------*/
  $('.add-favorite').click(function(e){
      e.preventDefault();
      $(this).toggleClass('favorited');
  });


  /*-----------------------------------------------------------------
      彈跳視窗 Light Box
  -----------------------------------------------------------------*/
  $(function () {

      // YoutubeID轉網址
      function YouTubeGetID(url,command) {
          VID_REGEX = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          var rs = VID_REGEX.exec(url);

          if (command == 'get_id') {
              return rs[1];

          } else if (command == 'get_iframe') {

              if (rs != null) {
                  return '<div class="item"><iframe width="560" height="315" src="https://www.youtube.com/embed/' + url.match(VID_REGEX)[1] + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
              } else {
                  swal({
                      title: 'Youtube網址抓取錯誤，煩請重新輸入',
                      type: 'warning',
                      confirmButtonText: '確定',
                      confirmButtonClass: 'btn btn-primary　mr5'
                  })
              }
          }
      }
      // YoutubeID轉網址(end)

      // 為Video 生成 Poster
      $('[data-vid]').each(function(index,el){
          var url = $(el).data('vid');
          var id = YouTubeGetID(url, 'get_id');
          var src = 'https://img.youtube.com/vi/'+id+'/0.jpg';

          $(el).find('img').attr('src',src);

      });

      // 為Video 生成 Poster(end)

      // $('.slider-owl').owlCarousel({
      //     loop: false,
      //     margin: 10,
      //     nav: true,
      //     responsive: {
      //         0: {
      //             items: 1
      //         },
      //         600: {
      //             items: 3
      //         },
      //         1000: {
      //             items: 5
      //         }
      //     }
      // });

      var owl = $('.media-modal-owl');
      $('.media-card .card-head').on('click', function () {
          var is_vid=false;
          var str = $(this).data('img');
          if (str == undefined) {
              str = $(this).data('vid');
              is_vid = true;
          }
          var arr = str.split(",");
          var html = '';
          var htmlOption = '';
          var title = $(this).parents('.card').find('.card-title').text();


          if (is_vid) {
              html = YouTubeGetID(str,'get_iframe');
          } else {

              arr.forEach(function (item, index) {
                  var num = index + 1;
                  html += '<div class="item"><img src="' + item + '"></div>';
                  htmlOption += '<option value="' + num + '">' + num + '</option>'
              })
          }


          $('.media-modal .title').text(title);
          $('.media-modal-img-now').html(htmlOption);
          $('.media-modal-img-total').html(arr.length);
          owl.html(html);
          var loop=true,nav=true;
          if (is_vid) {
              loop = nav = false;
              $('.select-page').hide();
          }
          // owl.owlCarousel({
          //     loop: loop,
          //     margin: 10,
          //     nav: nav,
          //     responsive: {
          //         0: {
          //             items: 1
          //         }
          //     }
          // });
          setTimeout(function () { owl.addClass('show') }, 500);
      });

      $('.media-modal-img-now').on('change', function () {
          var index = $(this).val() - 1;
          owl.trigger('to.owl.carousel', [index, 300]);
      });

      owl.on('changed.owl.carousel', function (event) {
          var index = event.page.index + 1;
          if (index > 0) {
              $('.media-modal-img-now').val(index);
          }
      });

      $('#mediaModal').on('hidden.bs.modal', function (e) {
          // $('.media-modal-owl').fadeIn('fast').owlCarousel('destroy').removeClass('show');
      });
  });


  /*-----------------------------------------------------------------
      自動產生日期
  -----------------------------------------------------------------*/
  $.fn.date_dropdown = function (setting) {
      var today = new Date(),
          year = today.getFullYear();

      for (var i = 100; i >= 0; i--) {
          if (i !== 0) {
              $(setting['year']).append("<option value='" + (year - i) + "'> " + (year - i) + "年</option>");
              // $(setting['year']).append("<option value='" + (year - i) + "'> 民國" + (year - 1911 - i) + "</option>");
          } else {
              $(setting['year']).append("<option value='" + (year - i) + "' selected='selected'> " + (year - i) + "年</option>");
              // $(setting['year']).append("<option value='" + (year - i) + "' selected='selected'> 民國" + (year - 1911 - i) + "</option>");
          }
      }
      for (var i = 1; i <= 12; i++) {
          $(setting['month']).append("<option value='" + i + "'>" + i + "月</option>");
      }

      // 日期選擇器，改變月份時判斷當月天數
      function change_days(y,m,d) {
          var days = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
          var year = $(y).val();
          var month = $(m).val();
          var day = $(d);
          // var year = $('#' + id_prefix + '_year').val();
          // var month = $('#' + id_prefix + '_month').val();

          // 判斷2月份是28天還是29天
          if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
              days[1] = 29;
          }

          var i_end = days[month - 1];
          var days_select = '<option value="">請選擇</option>';
          for (var i = 1; i <= i_end; i++) {
              days_select += '<option value="' + i + '">' + i + '日</option>';
          }
          if(day.length > 0) day.html(days_select);
      }

      $(setting['month']).change(function(e){
          change_days(setting['year'], setting['month'], setting['day']);
      });
  };

  // 個人資料修改
  $('.form-group birthday').date_dropdown({
      year:'.dropdown #year',
      month:'.dropdown #month',
      day:'.dropdown #day'
  });

  /*-----------------------------------------------------------------
      Simplebar
  -----------------------------------------------------------------*/
  createSimplebar($('.simplebar-init'));


  // parallaxPlugin();

  if (!Device.is_agent_mobile && !Device.is_ie) {
      pageScroller.init({
          target: document.querySelector(".scroll-container")
      });
  }

  $(window).on('resize', function(){
      // mobile => pc 處理
      if (!Device.is_agent_mobile) {
          setTimeout(function(){
              pageScroller.init({
                  target: document.querySelector(".scroll-container")
              }, true);
          }, 1000)
      }
  })


  bannerKeepPos.init();

  brusNewAniBox.init();

  BannerSing.init();

  ContentViewerBox.init();

  ShopCart.init();



  setTimeout(function () {
      fixedPageMenu.init();
  }, 1500)

  textShowUp.init();

  HistoryDisplayBox.init();

  if (!Device.is_agent_mobile) {
      cursorObj.init();
  }

  if (!Device.is_agent_mobile) {
      var s = skrollr.init({
          forceHeight: false,
          mobileCheck: function () {
              return false;
          },
      });
  }

  // 動畫 class 監視
  const animateClassMonit = function(){

      var ani_class_detect = ViewDetector({
          // view: '.viewport',
          targets: '[data-aos]',
          // offset 取得方式
          offsetMethod: 'position'
      });
      
      $(window).on('scroll', function () {
          ani_class_detect.inViewEls.forEach(function(item, idx){
              if ( !$(item.el).is('.aos-animate')) {
                  $(item.el).addClass('aos-animate')
              }
          });
      });

  }

  // 手機板使用 VidwDetector
  if (Device.is_agent_mobile) {
      animateClassMonit();
  }

  // PC 版使用 AOS
  if (!Device.is_agent_mobile) {
      AOS.init({
          once: true,
          offset: 200,
      });
  }

  // 使用 viewport 自訂滑動下果時 safari pageYOffset始終為0 故手動賦值 給aos用
  if (Device.is_ios && !Device.is_agent_mobile) {
      $('.viewport').on('scroll', function () {
          window.pageYOffset = this.scrollTop;
          AOS.refresh();
      })
  }

  // global class
  $('body').addClass('is-ready');
  setTimeout(function(){
      $('body').addClass('is-ani-ready');
  }, 300)

}); 
