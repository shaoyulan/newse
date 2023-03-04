routes = [
  {
    path: '/',
    url: '/mobile/index',
  },

//各式頁面-----------------------------------------------------------------------------------------------------------
  {
    path: '/f7_start',
    url: '/mobile/f7_start',
  },

//換頁範例頁面-----------------------------------------------------------------------------------------------------------
  {
    path: '/f7_page',
    url: '/mobile/f7_page',
  },
  {
    path: '/login',
    url: '/mobile/login',
  },
  {
    path: '/page',
    url: '/mobile/page',
  },
  {
    path: '/page1',
    url: '/mobile/page1',
  },
  {
    path: '/page1_1',
    url: '/mobile/page1_1',
  },
  {
    path: '/page1_2',
    url: '/mobile/page1_2',
  },
  {
    path: '/page1_3',
    url: '/mobile/page1_3',
  },
  {
    path: '/page2',
    url: '/mobile/page2',
  },
  {
    path: '/page2_1',
    url: '/mobile/page2_1',
  },
  {
    path: '/page2_2',
    url: '/mobile/page2_2',
  },
  {
    path: '/page2_3',
    url: '/mobile/page2_3',
  },
//組件----------------------------------------------------------------------------------------------------------
  {
    path: '/f7_module',
    url: '/mobile/f7_module',
  },
  //組件 - POPUP
  {
    path: '/popup',
    url: '/mobile/popup',
  },
  //組件 - picker
  {
    path: '/picker',
    url: '/mobile/picker',
  },
  //組件 - searchbar
  {
    path: '/searchbar',
    url: '/mobile/searchbar',
  },

//常用 API----------------------------------------------------------------------------------------------------------
  {
    path: '/f7_basic',
    url: '/mobile/f7_basic',
  },

//圖片相關----------------------------------------------------------------------------------------------------------
  {
    path: '/f7_picture',
    url: '/mobile/f7_picture',
  },

  //一般上傳
  {
    path: '/upload_picture',
    url: '/mobile/upload_picture',
  },
  //裁切圖片
  {
    path: '/crop_picture',
    url: '/mobile/crop_picture',
  },
  //多選上傳
  {
    path: '/multi_upload_picture',
    url: '/mobile/multi_upload_picture',
  },
  //讀取 QR Code
  {
    path: '/recode',
    url: '/mobile/recode',
  },

//其他 API----------------------------------------------------------------------------------------------------------
  {
    path: '/f7_other',
    url: '/mobile/f7_other',
  },



//聊聊----------------------------------------------------------------------------------------------------------
  {
    path: '/talk_room',
    url: '/mobile/talk_room',
  },

//地圖相關----------------------------------------------------------------------------------------------------------
  {
    path: '/f7_map',
    url: '/mobile/f7_map',
  },
  {
    path: '/map',
    async(routeTo, routeFrom, resolve, reject) {
      var category_id = 0;
      if (routeTo.query.category_sel) {
          category_id = routeTo.query.category_sel;
      }
      var map_search = '';
      if (routeTo.query.map_search) {
          map_search = routeTo.query.map_search;
      }
      resolve({ url: '/mobile/map/' + category_id + '?map_search=' + map_search });
    },
  },


//地圖相關----------------------------------------------------------------------------------------------------------
  {
    path: '/f7_question',
    url: '/mobile/f7_question',
  },
  {
    path: '/question_detailed',
    async(routeTo, routeFrom, resolve, reject) {
      if (routeTo.query.id) {
        resolve({ url: '/mobile/question_detailed/' + routeTo.query.id });
      } else {
        reject();
      }
    },
  },
  {
    path: '/question_modify',
    async(routeTo, routeFrom, resolve, reject) {
      if (routeTo.query.id) {
        resolve({ url: '/mobile/question_modify/' + routeTo.query.id });
      } else {
        reject();
      }
    },
  },



  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: '/mobile/error',
  },



];
