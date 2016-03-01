/**
Some rules from this file, otherwise some client interpretation might break parsing the file:
- use \n or \r\n for newline, the client might need to remove these before using the file!
- don't use // for comment
- Escape delimiters eg \"
*/
document.addEventListener('DOMContentLoaded', function(event) {
    console.info('JS loaded');
    UR.onPageFinished();
});
document.onreadystatechange = function() {
    console.info('JS onreadystatechange' + document.readyState);
    UR.onPageFinished();
    if (document.readyState == "interactive") {
        console.info('JS loaded');
    }
};

var UR = new function() {
    var bookmarkedImage;
    var notBookmarkedImage;
    var programIsBookmarkedFlag;
    var iconListenerAdded=false;
    var captionListenerAdded=false;
    var addPlayButtonAdded = false;

    /* Get the page icon image eg "http://assets.ur.se/id/187968/images/1_l.jpg" */
    this.getIconImage = function(){
        var og = document.querySelector("meta[property='og:image']");
        var ogImageUrl = og.getAttribute('content');
        return ogImageUrl;
    };

    /* Add a listener to the icon image to start the player */
    this.addIconListener = function(){
        //var iconIsEmpty = (Object.keys(icon).length == 0);

        var icon = document.getElementById('mediaplayer-play-button-id');
        console.info("looking for mediaplayer-play-button-id:" +icon);
        var iconIsInvalid = (icon===null || icon.length===0 || icon===undefined);

        if (iconIsInvalid) {
            console.error('can_t find the icon ID on the page,can_t add listener');
            return;
        }

        if( UR.iconListenerAdded===true ){
            console.info("addIconListener,already added listener");
            return;
        }
		UR.iconListenerAdded=true;

		icon.addEventListener("click", function(){
			UR.startNativeMediaPlayer(UR.getPartialHlsUrl(),UR.getPartial_HD_HlsUrl(),UR.getProgramId(),UR.getPageUrl());
		});

    }

    //Add a click listener to the language caption selection element for set "active" on the current choice
    this.addCaptionListener = function(){
        if( UR.captionListenerAdded===true ){
            console.info("addCaptionListener,already added listener");
            return;
        }
		UR.captionListenerAdded=true;

        var captions = document.getElementsByClassName('captions');
            if ((captions === undefined) || (captions === null) || captions.isEmptyObject) {
                console.error('can_t find the captions ID on the page,can_t add captions listener');
                return;
            }
            var listElements = captions[0].getElementsByTagName('li');
            captions[0].addEventListener('click', function (event) {
                    console.info(event.target);
                    UR.activateChildNode(event.target);
            }, false);
    }

    /* Utility function for activate the right language caption */
    this.activateChildNode = function(dataId){
        var captions = document.getElementsByClassName('captions');
        if ((captions === undefined) || (captions === null) || captions.isEmptyObject) {
                console.error('can_t find the captions ID on the page,can_t add captions listener');
                return;
        }
        var listElements = captions[0].getElementsByTagName('li');
        for (var index = 0; index < listElements.length; ++index) {
            listElements[index].childNodes[1].setAttribute('class','');
        }
        dataId.setAttribute('class','active');
    }

    /* Get the url for the currently selected clip
        eg "urplay/_definst_/mp4:se/187000-187999/187968-29.mp4/playlist.m3u8"
    */
    this.getPartialHlsUrl = function(){
        //Using the "captions" list of languages in the webpage to get the selected language,
        //if no language is selected the first language in the list is used
        var captions = document.getElementsByClassName('captions')[0];
        //var okLength = ( (captions!==undefined) && (captions!==null) && (captions.length!==0) );
        if( (captions === undefined) || (captions === null) /*|| ( okLength===false )*/ ) {
            console.error("getPartialHlsUrl, can't find the caption element, can't get a hls url");
            return null;
        }

        var languageElement = captions.getElementsByClassName('active');
        var okLength = ( (languageElement!==undefined) && (languageElement!==null) && (languageElement.length!==0) );
        if((languageElement === undefined) || (languageElement === null) || ( okLength===false ) ){
            console.info("getPartialHlsUrl, can't find a active language, will use the first language in the list");
            languageElement = captions.firstElementChild.children;

            //var okLength = ( (languageElement!==undefined) && (languageElement!==null) && (languageElement.length!==0) );
            if((languageElement === undefined) || (languageElement === null) /*|| ( okLength===false ) */){
                console.error("getPartialHlsUrl, can't find a language element, can't get a HLS address");
                return null;
            }

        }

        var html = languageElement[0];
        //var okLength = ( (html!==undefined) && (html!==null) && ( html.attributes.length!==0 ) );
        if ((html === undefined) || (html === null) /* || ( okLength==false ) */ ) {
            console.error("getPartialHlsUrl, can't get a find a list element to get language url, can't get a hls url");
            return null;
        }

        var url = null;
        try{
            url = html.getAttribute('data-stream');
        }catch(error){
            if(error instanceof TypeError){
                console.info("getPartialHlsUrl, got a "+( typeof error )+", this might happen");
            }else{
                console.info("getPartialHlsUrl, got a "+( typeof error )+", this should not happen");
            }

            console.error("getPartialHlsUrl, the attribute data-stream couldn't be found, can't get a hls url");
            return null;
        }

        if ((url === undefined) || (url === null) ) {
            console.error("getPartialHlsUrl, Couldn't get the hls stream from the web element");
            return null;
        }
        if(url.length===0){
            console.info("getPartialHlsUrl, got a empty hls url, this is ok");
            return ""
        }

        var MANIFEST = "playlist.m3u8";
        return url + MANIFEST

    }

    this.getPartial_HD_HlsUrl = function(){
        //Using the "captions" list of languages in the webpage to get the selected language,
        //if no language is selected the first language in the list is used
        var captions = document.getElementsByClassName('captions')[0];
        //var okLength = ( (captions!==undefined) && (captions!==null) && (captions.length!==0) );
        if( (captions === undefined) || (captions === null) /*|| ( okLength===false )*/ ) {
            console.error("getPartial_HD_HlsUrl, can't find the caption element, can't get a hls url");
            return null;
        }

        var languageElement = captions.getElementsByClassName('active');
        var okLength = ( (languageElement!==undefined) && (languageElement!==null) && (languageElement.length!==0) );
        if((languageElement === undefined) || (languageElement === null) || ( okLength===false ) ){
            console.info("getPartial_HD_HlsUrl, can't find a active language, will use the first language in the list");
            languageElement = captions.firstElementChild.children;

            //var okLength = ( (languageElement!==undefined) && (languageElement!==null) && (languageElement.length!==0) );
            if((languageElement === undefined) || (languageElement === null) /*|| ( okLength===false ) */){
                console.error("getPartial_HD_HlsUrl, can't find a language element, can't get a HLS address");
                return null;
            }

        }

        var html = languageElement[0];
        //var okLength = ( (html!==undefined) && (html!==null) && ( html.attributes.length!==0 ) );
        if ((html === undefined) || (html === null) /* || ( okLength==false ) */ ) {
            console.error("getPartial_HD_HlsUrl, can't get a find a list element to get language url, can't get a hls url");
            return null;
        }

        var url = null;
        try{
            url = html.getAttribute('data-hdstream');
        }catch(error){
            if(error instanceof TypeError){
                console.info("getPartial_HD_HlsUrl, got a "+( typeof error )+", this might happen");
            }else{
                console.info("getPartial_HD_HlsUrl, got a "+( typeof error )+", this should not happen");
            }

            console.error("getPartial_HD_HlsUrl, the attribute data-stream couldn't be found, can't get a hls url");
            return null;
        }

        if ((url === undefined) || (url === null) ) {
            console.error("getPartial_HD_HlsUrl, Couldn't get the hls stream from the web element");
            return null;
        }
        if(url.length===0){
            console.info("getPartial_HD_HlsUrl, got a empty hls url, this is ok");
            return ""
        }

        var MANIFEST = "playlist.m3u8";
        return url + MANIFEST

    }

    /* Start the media player
     @param partialHlsUrl hls address without media server eg "urplay/_definst_/mp4:se/187000-187999/187968-29.mp4/playlist.m3u8"
     @param partialHD_HlsUrl hls address without media server for HD eg "urplay/_definst_/mp4:se/187000-187999/187968-29.mp4/playlist.m3u8"
     @param programId a valid program id
     @param hlsAssociatedWebpage a webpage that should be associated with the HLS information
     */
    this.startNativeMediaPlayer = function(partialHlsUrl,partialHD_HlsUrl,programId,hlsAssociatedWebpage){
 	  console.info("Starting native player with url:"+partialHlsUrl + " partialHD_HlsUrl:"+partialHD_HlsUrl+" program id:"+programId+" hlsAssociatedWebpage:"+hlsAssociatedWebpage);
      if(UR.isAndroid()){
        AndroidMediaplayer.play(partialHlsUrl,partialHD_HlsUrl,programId,hlsAssociatedWebpage);
      }else if(UR.isIOS()){
          streamData = {
              'PartialHlsUrl':partialHlsUrl,
              'ProgramId':programId,
              'PartialHD_HlsUrl':partialHD_HlsUrl,
              'HlsAssociatedWebpage':hlsAssociatedWebpage
          };
          
        webkit.messageHandlers.startNativeMediaPlayer.postMessage(streamData);
      }else{
        console.error('unknown player environment')
      }
     }


    /* Preload the images for a smoother highlighting when a page is bookmarked */
    this.loadImages = function(){
        bookmarkedImage = new Image();
        //bookmarkedImage.src = "https://cdn1.iconfinder.com/data/icons/fatcow/32x32/star.png";
        bookmarkedImage.src = "https://raw.githubusercontent.com/sveriges-utbildningsradio/kuben_app_web/master/Assets/sparatTextActive.png";
        notBookmarkedImage = new Image();
        //notBookmarkedImage.src = "http://png-5.findicons.com/files/icons/2227/picol/32/star_outline_32.png";
        notBookmarkedImage.src = "https://raw.githubusercontent.com/sveriges-utbildningsradio/kuben_app_web/master/Assets/sparaText.png";
    };

    this.getBookmarkUrl = function(){
        return document.baseURI;
    };

    /**
        Get the program ID from the IMAGE data from the OG data
        @return a program ID or NULL if no ID was found
    */
    this.getProgramId = function(){
        //parsing the ID from a source that is not the baseUrl, in this case the IMAGE of the Open Graph
        var og = document.querySelector("meta[property='og:image']");
        var ogImageUrl = og.getAttribute('content');

        var parser = document.createElement('a');
        parser.href = ogImageUrl;

        //get the path part of the URL
        var urlPath= parser.pathname;

        //Check for expected url format
        var expectedRe = new RegExp("/id/[0-9]{6}/images/");
        var expectedUrl = ogImageUrl.match(expectedRe).toString();
        if( (expectedUrl === null) || (expectedUrl === undefined) ){
            console.error("Can't extract a ID, got an unexpected URL:"+ogImageUrl);
            return null;
        }

        //found an expected format, get ID
        var re = new RegExp("[0-9]{6}");
        var idString = expectedUrl.match(re);
        return idString[0];
    };

    this.getPageUrl = function(){
        return document.baseURI;
    }

    /* Add and show the bookmark button */
    this.addPlayButton= function(){
        console.info("addPlayButton");
        if(addPlayButtonAdded === true){
            console.info("button already added");
            return;
        }
        addPlayButtonAdded=true;

        var containers = document.getElementsByClassName('player-container');
        if (containers.length > 0) {
            containers[0].style.position = 'relative';
            var button = document.createElement('div');
            button.id='mediaplayer-play-button-id'
            button.style.position = 'absolute';
            button.style.top = 0;
            button.style.bottom = 0;
            button.style.left = 0;
            button.style.right = 0;
            //Seemed like a temporary link but gave a good quality so include the SVG here
            //button.style.backgroundImage='url("data:image/svg+xml;utf8,<svg version=\'1.1\' id=\'Lager_1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\'	 viewBox=\'0 0 100 100\' enable-background=\'new 0 0 100 100\' xml:space=\'preserve\' width=\'100\' height=\'100\'><circle opacity=\'0.4\' fill=\'#1D1D1B\' cx=\'50\' cy=\'50\' r=\'46\'/><path fill=\'#FFFFFF\' d=\'M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0z M50,96C24.6,96,4,75.4,4,50S24.6,4,50,4	s46,20.6,46,46S75.4,96,50,96z\'/><polygon fill=\'#FFFFFF\' points=\'40.2,31.6 40.2,68.4 69,51.8 \'/></svg>")';
	    button.style.backgroundImage='url("data:image/svg+xml;utf8,<svg width=\'91px\' height=\'91px\' viewBox=\'0 0 91 91\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' xmlns:sketch=\'http://www.bohemiancoding.com/sketch/ns\'> <title>Group</title> <g id=\'Ikoner\' stroke=\'none\' stroke-width=\'1\' fill=\'none\' fill-rule=\'evenodd\' sketch:type=\'MSPage\'>        <g id=\'ikoner_png\' sketch:type=\'MSArtboardGroup\' transform=\'translate(-22.000000, -474.000000)\'>            <g id=\'Group\' sketch:type=\'MSLayerGroup\' transform=\'translate(22.000000, 474.000000)\'>                <g id=\'Play_big\' fill=\'#F13A43\' sketch:type=\'MSShapeGroup\' opacity=\'0.9\'>                    <circle id=\'Oval\' cx=\'45.5\' cy=\'45.5\' r=\'45.5\'></circle>                </g>                <path d=\'M38,27 L47.9821489,45.6658579 L38.8645804,63.8729884 L44.7927865,63.8729884 L54.000169,45.4364942 L44.0771718,27 L38,27 Z\' id=\'Page-1\' fill=\'#FFFFFF\' sketch:type=\'MSShapeGroup\'></path>            </g>        </g>    </g></svg>")';
            button.style.backgroundPosition = 'center';
            button.style.backgroundRepeat = 'no-repeat';
            containers[0].appendChild(button);
        }

    }

    /* Add and show the bookmark button */
    this.addBookmarkButton= function(){
        var bookmarkbuttonExists = document.getElementById('bookmarkButton');

        if( typeof bookmarkbuttonExists !== 'undefined' && bookmarkbuttonExists !== null ){
            return;
        }

        var productButtons = document.getElementsByClassName('product-buttons')[0];
        var url = document.baseURI;

        if ((typeof productButtons === 'undefined') || (productButtons === null)) {
            console.error("can't find product-buttons");
            return;
        }

        /* Create bookmarkButton
            Note: Instead of adding style attribs to inline markup we should use appendChild(style)
         */
        
        bookmarkButton = document.createElement('button');
        bookmarkButton.type = 'button';
        bookmarkButton.name = 'bookmark';
        bookmarkButton.id='bookmarkButton';
        bookmarkButton.style.display = 'inline-block';
        bookmarkButton.style.backgroundPosition = '10px center';
        bookmarkButton.style.backgroundRepeat = 'no-repeat';
        bookmarkButton.style.backgroundColor = '#dfe0e1';
        bookmarkButton.style.paddingLeft = '43px';
        bookmarkButton.style.padding = '12px 24px';
        bookmarkButton.style.fontFamily = 'Open Sans';
        bookmarkButton.style.borderRadius = '2px';
        bookmarkButton.style.height ='41px';
        bookmarkButton.style.width ='74px';
        bookmarkButton.style.backgroundSize = "8px 12px";
        bookmarkButton.style.fontSize = '1.4rem';
        bookmarkButton.style.fontWeight = '600';
        //bookmarkButton.style.marginLeft = '0.4em';
        
        bookmarkButton.addEventListener('click', function() {
            if(UR.programIsBookmarkedFlag === false){
                UR.Bookmark.save( UR.getProgramId() , UR.getBookmarkUrl() );
            }else if(UR.programIsBookmarkedFlag === true){
                UR.Bookmark.remove( UR.getProgramId() , UR.getBookmarkUrl() );
            }else{
                 console.info('can_t determine if the page is bookmarked, UR.programIsBookmarkedFlag:'+UR.programIsBookmarkedFlag);
            }
        });

        var bookmarkButtonText = document.createTextNode("Spara");
        bookmarkButton.appendChild(bookmarkButtonText);

        /*Add bookmarkButton to product-buttons*/
        productButtons.appendChild(bookmarkButton)

        /* check program is already bookmarked */
        UR.Bookmark.isBookmarked( UR.getProgramId(), UR.getBookmarkUrl() );
    };

    this.programIsBookmarked= function(){
        var bookmarkButton = document.getElementById('bookmarkButton');
        bookmarkButton.style.backgroundImage = "url('https://raw.githubusercontent.com/sveriges-utbildningsradio/kuben_app_web/master/Assets/shapeCopy3.png')";
        bookmarkButton.style.backgroundColor = '#4DAC6F';
        bookmarkButton.style.color = '#FFFFFF';
        UR.programIsBookmarkedFlag = true;
    };

    this.programIsNotBookmarked = function() {
        var bookmarkButton = document.getElementById('bookmarkButton');
        bookmarkButton.style.backgroundImage = "url('https://raw.githubusercontent.com/sveriges-utbildningsradio/kuben_app_web/master/Assets/shapeCopy4.png')";
        bookmarkButton.style.backgroundColor = '#dfe0e1';
        bookmarkButton.style.color = '#232730';
        UR.programIsBookmarkedFlag = false;
    };

    this.allwaysShowCaptionBtn = function () {
        //document.getElementsByName("captions")[0].style.display = "inline-block";
    };

    /* Called when the page has finished loaded, might be called several times!! */
    this.onPageFinished = function() {
        /*hideURHeader();*/
        UR.allwaysShowCaptionBtn();
        UR.loadImages();
        UR.addBookmarkButton();

        UR.addPlayButton();
        //adding listners
        UR.addIconListener();
        UR.addCaptionListener();

    };
    
    
    /* function that enables the UI element in the html page that shows that a page has been  bookmarked */
    this.showPageBookmarked = function() {
        console.info('showPageBookmarked');
        UR.programIsBookmarked();
    };

    /* function that disables the UI element in the html page that shows that a page has been  bookmarked */
    this.showPageNotBookmarked = function() {
        console.info('showPageNotBookmarked');
        UR.programIsNotBookmarked();
    };

    /* Show the bookmark UI on the webpage */
    this.showBookmarkUI = function() {
        console.info('showBookmarkUI');
    };

    this.isIOS = function() {
        //Look for the webkit feature that IOS is using.
        if (typeof webkit === 'undefined' || typeof webkit.messageHandlers === 'undefined')
            return false;

        var isIOS = true;
        return isIOS;
    };

    this.isAndroid = function() {
        //Check for the bookmark feature that the Android application exposes
        if (typeof AndroidBookmark !== 'undefined')
            return true;
         else
            return false;

    };

    this.BookmarkResponds = {
        /**
        Called as a responds to Bookmark.save(..) with the stutus of the save

        pageId = UR id of the program REQUESTED eg 189895
        pageUrl = the main URL of webpage REQUESTED eg http://urplay.ur.se/program/189895-aarons-nya-land-i-krigets-skugga
        status = the status of the bookmark save operation, TRUE IFF the bookmark has been save else FALSE
        */
        bookmarkSaved: function(pageId, pageUrl, savedStatus) {
            console.info('bookmarkresponds bookmarkSaved pageId:' + pageId + ' pageUrl:' + pageUrl + "status: " + savedStatus);
            if (document.baseURI !== pageUrl) {
                console.error("Url error when bookmarking a page, wrong url, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                UR.showPageNotBookmarked();
                return;
            }
            if (savedStatus === true || savedStatus === 'true' ) {
                UR.showPageBookmarked();
                return;
            }else if (savedStatus === false || savedStatus === 'false' ) {
                console.error("Status error:"+savedStatus+" when saving bookmarking of a page, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                UR.showPageNotBookmarked();
                return;
            }else{
                console.error("Status error:"+savedStatus+" when saving bookmarking of a page, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                UR.showPageNotBookmarked();
                return;
            }
        },
        bookmarkRemoved: function(pageId, pageUrl, removedStatus) {
            console.info('bookmarkresponds bookmarkRemoved id:' + pageId + ' url:' + pageUrl + "status: " + removedStatus);
            if (document.baseURI !== pageUrl) {
                console.error("Url error when removing the bookmark of a page, wrong url, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                UR.showPageNotBookmarked();
                return;
            }
            if (removedStatus === false || removedStatus === 'false') {
                console.error("Status error:"+removedStatus+" when removing the bookmark of a page, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                UR.showPageNotBookmarked();
                return;
            }else if (removedStatus === true || removedStatus === 'true') {
                UR.showPageNotBookmarked();
                return;
            }else{
                console.error("Status error:"+removedStatus+" when removing the bookmark of a page, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                UR.showPageNotBookmarked();
                return;
            }

        },
        /**
        Called as a responds to Bookmark.isBookmarked(..) with the information if the bookmark was found or not

        pageId = UR id of the program REQUESTED eg 189895
        pageUrl = the main URL of webpage REQUESTED eg http://urplay.ur.se/program/189895-aarons-nya-land-i-krigets-skugga
        bookmarkFound = TRUE IFF the bookmark was found else FALSE
        */
        isBookmarked: function(pageId, pageUrl, bookmarkFound) {
            var found = bookmarkFound.valueOf();
            console.info('bookmarkresponds isBookmarked pageId id:' + pageId + ' pageUrl:' + pageUrl + ' bookmarkFound:' + found);
            if (document.baseURI !== pageUrl) {
                console.error("Url error isBookmarked, wrong url, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                UR.showPageNotBookmarked();
                return;
            }
            if(typeof found === 'undefined'){
                console.error('found was not initiated correctly');
                UR.showPageNotBookmarked();
                return;
            }
            if(found===true || found==='true'){
                UR.showPageBookmarked();
            }else if(found===false || found==='false'){
                UR.showPageNotBookmarked();
            }else{
                UR.showPageNotBookmarked();
                console.error('found was not initiated correctly, found:'+found);
            }

        }
    };
    this.Bookmark = {
        /**
            Will save a bookmark  (on iOS and Android this is done natively),
            BookmarkResponds.bookmarkSaved() is called after a bookmark has been saved.

            pageId = UR id of the program eg 189895
            pageUrl = the main URL of webpage eg http://urplay.ur.se/program/189895-aarons-nya-land-i-krigets-skugga
            */
        save: function(pageId, pageUrl) {
            console.info("bookmark save pageId:" + pageId + " pageUrl:" + pageUrl);
            if (UR.isIOS()) {
                webkit.messageHandlers.saveBookmark.postMessage(pageUrl);
            } else if (UR.isAndroid()) {
               AndroidBookmark.save(pageId, pageUrl);
            }
        },
        /**
            Will remove a bookmark (on iOS and Android this is done natively)
            BookmarkResponds.bookmarkRemoved() is called after a bookmark has been removed.

            pageId = UR id of the program eg 189895
            pageUrl = the main URL of webpage eg http://urplay.ur.se/program/189895-aarons-nya-land-i-krigets-skugga
            saved = the status of the bookmark save operation, TRUE IFF the bookmark has been save else FALSE
            */
        remove: function(pageId, pageUrl) {
            console.info("bookmark remove pageId:" + pageId + " pageUrl:" + pageUrl);
            if (UR.isIOS()) {
                webkit.messageHandlers.removeBookmark.postMessage(pageUrl);
            } else if (UR.isAndroid()) {
                AndroidBookmark.remove(pageId, pageUrl);
            }
        },
        /**
            Will check if a bookmark is saved (on iOS and Android this is done natively)
            BookmarkResponds.isBookmarked() with the result.

            pageId = UR id of the program eg 189895
            */
        isBookmarked: function(pageId,pageUrl) {
            console.info("bookmark isBookmarked id:" + pageId);
            if (UR.isIOS()) {
                webkit.messageHandlers.checkBookmarkStatus.postMessage(pageUrl);
            } else if (UR.isAndroid()) {
                AndroidBookmark.isBookmarked(pageId,pageUrl);
            }
        }
    };
};
