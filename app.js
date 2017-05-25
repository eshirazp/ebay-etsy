var SPACE_KEY = 13;
var SEARCH_RESULTS_NUM = 10;
var MSECONDS = 1000;

/***********/
/*  ETSY   */
/***********/
function getDataFromEtsyApi(searchTerm, callback) {
  var ETSY_BASE_URL = 'https://openapi.etsy.com/v2/listings/active.js';
  var ETSY_KEY = 'jzmfv2cmv22o122d0jiv7z9m';
  
  var settings = {
    url: ETSY_BASE_URL,
    dataType: 'jsonp',
    data: {
      keywords: searchTerm,
      api_key: ETSY_KEY,
      includes: 'Images',
    },
    success: callback,
  };
  $.ajax(settings);
}
 
function displayEtsySearchData(data) {
  var results = '<div class="jumbotron pre-scrollable"><div class="container-fluid col-xs-12"><div class="container-fluid col-xs-2"><p class="header fontVarela">Image</p></div><div class="container-fluid col-xs-8"><p class="header fontVarela">Title</p></div><div class="container-fluid col-xs-2"><p class="header fontVarela">Price</p></div></div>';
  if (data.ok) {
    for(var i = 0; i < SEARCH_RESULTS_NUM; i++) {
      item = data.results[i];
      results += '<a href="' + item.url + '"><div class="container-fluid col-xs-12 etsy-row"><div class="container-fluid col-xs-2"><img class="img-fluid img-thumbnail" src="' + item.Images[0].url_75x75 + '"></div><div class="container-fluid col-xs-8"><p>' + item.title + '</p></div><div class="container-fluid col-xs-2"><p>$' + item.price + '</p></div></div></a>';
    }
    results += '</div>';
    $('.js-results-etsy').html(results);
    $('.results').fadeIn(MSECONDS, revealEtsySearch);
  }
}

function revealEtsySearch() {
  $('.etsy-search').fadeIn();
  hideSearchingNotify();
}

/***********/
/*  eBay   */
/***********/
function getDataFromEbayApi(searchTerm, callback) {
  var EBAY_BASE_URL = 'http://svcs.ebay.com/services/search/FindingService/v1';
  var EBAY_KEY = 'ElushShi-ebayetsy-PRD-969dbd521-8995d39e';
  
  var settings = {
    url: EBAY_BASE_URL,
    dataType: 'jsonp',
    data: {
      'OPERATION-NAME': 'findItemsByKeywords',
      keywords: searchTerm,
      'SECURITY-APPNAME': EBAY_KEY,
    },
    success: callback,
  };
  $.ajax(settings);
}

function displayEbaySearchData(data) {
  var results = '<div class="jumbotron pre-scrollable"><div class="container-fluid col-xs-12"><div class="container-fluid col-xs-2"><p class="header fontVarela">Image</p></div><div class="container-fluid col-xs-8"><p class="header fontVarela">Title</p></div><div class="container-fluid col-xs-2"><p class="header fontVarela">Price</p></div></div>';
  if(data) {
    for(var i = 0; i < SEARCH_RESULTS_NUM; i++) {
      item = data.findItemsByKeywordsResponse[0].searchResult[0].item[i];
      results += '<a href="' + item.viewItemURL + '"><div class="container-fluid col-xs-12 ebay-row"><div class="container-fluid col-xs-2"><img class="img-fluid img-thumbnail" src="' + item.galleryURL + '"></div><div class="container-fluid col-xs-8"><p>' + item.title + '</p></div><div class="container-fluid col-xs-2"><p>$' + item.sellingStatus[0].currentPrice[0].__value__ + '</p></div></div></a>';
    }
    results += '</div>';
    $('.js-results-ebay').html(results);
    $('.results').fadeIn(MSECONDS, revealEbaySearch);
  }
}

function revealEbaySearch() {
  $('.ebay-search').fadeIn();
}

function revealSearchingNotify() {
  $('.js-search-notify').removeClass("hidden");
}

function hideSearchingNotify() {
  $('.js-search-notify').addClass("hidden");
}

/**********************/
/*  Control Station   */
/**********************/
function watchSubmit() {
  /* Main Search Bar */
  $('.js-query-main').keypress(function(e) {
    if(e.which === SPACE_KEY) {
      var query = $(this).val();
      revealSearchingNotify();
      getDataFromEbayApi(query, displayEbaySearchData);
      getDataFromEtsyApi(query, displayEtsySearchData);
    }
  });

  /* eBay */
  $('.js-query-ebay').keypress(function(e) {
    if(e.which === SPACE_KEY) {
      var query = $(this).val();
      getDataFromEbayApi(query, displayEbaySearchData);
    }
  });

  /* ETSY */
  $('.js-query-etsy').keypress(function(e) {
    if(e.which === SPACE_KEY) {
      var query = $(this).val();
      getDataFromEtsyApi(query, displayEtsySearchData);
    }
  });
}

function revealBannerHeader() {
  $('#bannerHdg').fadeIn(MSECONDS, revealBannerSearch);
}

function revealBannerSearch() {
  $('#bannerSearch').fadeIn((MSECONDS/2), watchSubmit);
}
 
$(function(){
  revealBannerHeader();
});
