/**
Some rules from this file, otherwise some client interpretation might break parsing the file:
- use \n or \r\n for newline, the client might need to remove these before using the file!
- don't use // for comment
- Escape delimiters eg \"
*/
    console.info("Loaded the JS content");
    document.addEventListener('DOMContentLoaded',function(event){
        console.info('JS loaded');
        onPageFinished();
    });
    document.onreadystatechange = function () {
    console.info('JS onreadystatechange'+document.readyState);
        removeUrHeader();
        if (document.readyState == "interactive") {
            console.info('JS loaded');
        }
    }

    window.addEventListener("optimizedScroll", function() {
        console.log("optimizedScroll JS");
        //removeUrHeader();
    });
    window.onscroll = function (e) {
        //removeUrHeader();
    }

    function removeUrHeader(){
        console.info('running the removeUrHeader function');
        var urPageHeader=document.getElementById('masthead');
        if((urPageHeader===undefined)||(urPageHeader===null)||urPageHeader.isEmptyObject){
            console.error('can_t find the masthead ID on the page,can_t remove the UR header');
            return;
        }
        document.body.removeChild(urPageHeader);
        document.body.style.paddingTop='0px';
    }
    function hideURHeader(){
        var urPageHeader=document.getElementById('masthead');
        if((urPageHeader===undefined)||(urPageHeader===null)||urPageHeader.isEmptyObject){
            console.error('can_t find the masthead ID on the page,can_t remove the UR header');
            return;
        }
        urPageHeader.style.backgroundColor="#000000";

        var divContainer = document.getElementsByClassName('container');
        if((divContainer===undefined)||(divContainer===null)||divContainer.isEmptyObject){
            console.error('can_t find the divContainer on the page,can_t hide the UR header');
            return;
        }else{
            console.info("Found container:"+divContainer);
        }
        divContainer[0].remove();
    }

    function onPageFinished(){
        //hideURHeader();
        removeUrHeader();
    }
    /* function that shows the page as bookmarked */
    function showPageBookmarked(){
        console.info('showPageBookmarked');
    }
    /* function that shows the page as IS NOT bookmarked */
    function showPageNotBookmarked(){
        console.info('showPageNotBookmarked');
    }
    /* Show the bookmark UI on the webpage */
    function showBookmarkUI(){
        console.info('showBookmarkUI');
    }

    /**
    API for bookmarks:
    This API is not implemented here (on iOS/Android it's implemented and exposed by the platform) but can be used here,
    */

    /**
    Will save a bookmark  (on iOS and Android this is done natively),
    BookmarkResponds.bookmarkSaved() is called after a bookmark has been saved.

    pageId = UR id of the program eg 189895
    pageUrl = the main URL of webpage eg http://urplay.ur.se/program/189895-aarons-nya-land-i-krigets-skugga
    */
    Bookmark.save(pageId,pageUrl)

    /**
    Will remove a bookmark (on iOS and Android this is done natively)
    BookmarkResponds.bookmarkRemoved() is called after a bookmark has been removed.

    pageId = UR id of the program eg 189895
    pageUrl = the main URL of webpage eg http://urplay.ur.se/program/189895-aarons-nya-land-i-krigets-skugga
    saved = the status of the bookmark save operation, TRUE IFF the bookmark has been save else FALSE
    */
    Bookmark.remove(pageId,pageUrl)

    /**
    Will check if a bookmark is saved (on iOS and Android this is done natively)
    BookmarkResponds.isBookmarkedId() with the result.

    pageId = UR id of the program eg 189895
    */
    Bookmark.isBookmarkedId(Id)

    /**
        This class is called with the result after a request has been made to the Bookmark API
    */
    var BookmarkResponds = {
        /**
        Called as a responds to Bookmark.save(..) with the stutus of the save

        pageId = UR id of the program eg 189895
        pageUrl = the main URL of webpage eg http://urplay.ur.se/program/189895-aarons-nya-land-i-krigets-skugga
        saved = the status of the bookmark save operation, TRUE IFF the bookmark has been save else FALSE
        */
        bookmarkSaved: function (pageId,pageUrl,saved) {
            console.info('bookmarkSaved id:'+pageId+' url:'+pageUrl+ "status: "+saved);
        },
        bookmarkRemoved: function (pageId,pageUrl,status) {
            console.info('bookmarkRemoved id:'+pageId+' url:'+pageUrl+ "status: "+saved);
        },
        isBookmarkedId: function (pageId,pageUrl,bookmarkFound) {
            console.info('bookmarkFound id:'+pageId+' url:'+pageUrl+" bookmarkFound:" + bookmarkFound);
            showPageBookmarked();
        }
    };
