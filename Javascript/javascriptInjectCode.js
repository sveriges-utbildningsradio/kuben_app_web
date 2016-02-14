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
    var playArrowImage = "<svg width='246px' height='125px' viewBox='0 0 246 125' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns'><title>Play_vit_svart_puck</title> <desc>Created with sketchtool.</desc> <defs></defs> <g id='Play_mob' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='Splash' sketch:type='MSArtboardGroup' transform='translate(-79.000000, -251.000000)'> <image id='Play_vit_svart_puck' sketch:type='MSBitmapLayer' x='79' y='251' width='246' height='125' xlink:href='data:image/png;base64,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'></image> </g> </g></svg>";

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
            //Embedded a svg image from betaplay.ur.se/assets/play-03cde168fd331625aa5b6997773f941c.svg
            //Seemed like a temporary link but gave a good quality so include the SVG here
            //button.style.backgroundImage='url("data:image/svg+xml;utf8,<svg version=\'1.1\' id=\'Lager_1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\'	 viewBox=\'0 0 100 100\' enable-background=\'new 0 0 100 100\' xml:space=\'preserve\' width=\'100\' height=\'100\'><circle opacity=\'0.4\' fill=\'#1D1D1B\' cx=\'50\' cy=\'50\' r=\'46\'/><path fill=\'#FFFFFF\' d=\'M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50s50-22.4,50-50S77.6,0,50,0z M50,96C24.6,96,4,75.4,4,50S24.6,4,50,4	s46,20.6,46,46S75.4,96,50,96z\'/><polygon fill=\'#FFFFFF\' points=\'40.2,31.6 40.2,68.4 69,51.8 \'/></svg>")';
            var bg='\'url("data:image/svg+xml;utf8,'+playArrowImage+'")\'';
	    button.style.backgroundImage=bg;
	    console.info("background:"+button.style.backgroundImage);
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
