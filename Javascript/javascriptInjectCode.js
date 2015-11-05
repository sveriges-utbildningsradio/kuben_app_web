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
            //button.style.backgroundImage = 'url("http://betaplay.ur.se/assets/play-03cde168fd331625aa5b6997773f941c.svg")';
            button.style.backgroundImage = 'url("data:image/png;base64,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")';
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
        bookmarkButton.style.height ='43px';
        bookmarkButton.style.width ='74px';
        bookmarkButton.style.backgroundSize = "8px 12px";
        bookmarkButton.style.fontSize = '1.4rem';
        bookmarkButton.style.fontWeight = '600';
        bookmarkButton.style.marginLeft = '0.4em';
        
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
        bookmarkButton.style.backgroundColor = '#00C896';
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
