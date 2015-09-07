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

    this.getBookmarkId = function(){
        //parsing the ID from a source that is not the baseUrl, in this case the image of the Open Graph
        var og = document.querySelector("meta[property='og:url']");
        var ogImageUrl = og.getAttribute('content');
        var re = new RegExp("[0-9]{6}");
        var idString = ogImageUrl.match(re);
        return idString[0];
    };

    /* Add and show the bookmark button */
    this.addBookmarkButton= function(){
        console.info('addBookmarkButton');
        var bookmarkbuttonExists = document.getElementById('bookmarkButton');

        if( typeof bookmarkbuttonExists !== 'undefined' && bookmarkbuttonExists !== null ){
            console.info('bookmark button already found, will not add it again, bookmarkbuttonExists'+bookmarkbuttonExists);
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
        
    /* hover ?

        bookmarkButton.addEventListener('mouseover', function() {
             bookmarkButton.style.backgroundColor = '#6445ce';
        });
        bookmarkButton.addEventListener('mouseout', function() {
            bookmarkButton.style.backgroundColor = '#dfe0e1';
        });
    */
        bookmarkButton.addEventListener('click', function() {
            if(UR.programIsBookmarkedFlag === false){
                UR.Bookmark.save( UR.getBookmarkId() , UR.getBookmarkUrl() );
            }else if(UR.programIsBookmarkedFlag === true){
                UR.Bookmark.remove( UR.getBookmarkId() , UR.getBookmarkUrl() );
            }else{
                 console.info('can_t determine if the page is bookmarked, UR.programIsBookmarkedFlag:'+UR.programIsBookmarkedFlag);
            }
        });

        var bookmarkButtonText = document.createTextNode("Spara");
        bookmarkButton.appendChild(bookmarkButtonText);

        /*Add bookmarkButton to product-buttons*/
        productButtons.appendChild(bookmarkButton)

        /* check program is already bookmarked */
        UR.Bookmark.isBookmarked( UR.getBookmarkId(), UR.getBookmarkUrl() );
    };

    this.programIsBookmarked= function(){
        var bookmarkButton = document.getElementById('bookmarkButton');
        bookmarkButton.style.backgroundImage = "url('https://raw.githubusercontent.com/sveriges-utbildningsradio/kuben_app_web/master/Assets/shapeCopy4.png')";
        UR.programIsBookmarkedFlag = true;
    };

    this.programIsNotBookmarked = function() {
        var bookmarkButton = document.getElementById('bookmarkButton');
        bookmarkButton.style.backgroundImage = "url('https://raw.githubusercontent.com/sveriges-utbildningsradio/kuben_app_web/master/Assets/shapeCopy3.png')";
        UR.programIsBookmarkedFlag = false;
    };

    this.allwaysShowCaptionBtn = function () {
        document.getElementsByName("captions")[0].style.display = "inline-block";
    };

    /* Remove the UR navigation header from the webpage, this is not suppose to be visible in the APP */
    this.removeUrHeader = function() {
        console.info('running the removeUrHeader function');
        var urPageHeader = document.getElementById('masthead');
        if ((urPageHeader === undefined) || (urPageHeader === null) || urPageHeader.isEmptyObject) {
            console.error('can_t find the masthead ID on the page,can_t remove the UR header');
            return;
        }
        document.body.removeChild(urPageHeader);
        document.body.style.paddingTop = '0px';
    };

    /* Might be a faster way to remove the UR navigation header from the webpage, this is not suppose to be visible in the APP */
    this.hideURHeader = function() {
        var urPageHeader = document.getElementById('masthead');
        if ((urPageHeader === undefined) || (urPageHeader === null) || urPageHeader.isEmptyObject) {
            console.error('can_t find the masthead ID on the page,can_t remove the UR header');
            return;
        }
        urPageHeader.style.backgroundColor = "#000000";

        var divContainer = document.getElementsByClassName('container');
        if ((divContainer === undefined) || (divContainer === null) || divContainer.isEmptyObject) {
            console.error('can_t find the divContainer on the page,can_t hide the UR header');
            return;
        } else {
            console.info("Found container:" + divContainer);
        }
        divContainer[0].remove();
    };

    /* Called when the page has finished loaded, might be called several times!! */
    this.onPageFinished = function() {
        /*hideURHeader();*/
        UR.removeUrHeader();
        UR.allwaysShowCaptionBtn();
        UR.loadImages();
        UR.addBookmarkButton();
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