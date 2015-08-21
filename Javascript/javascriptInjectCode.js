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
        This class is called with the result after a request has been made to the Bookmark API
    */
    var BookmarkResponds = {
        bookmarkLink: '',
        bookmarkId: '',
        bookmarkSaved: function (bookmarkLink,bookmarkId) {
            this.bookmarkLink = bookmarkLink;
            this.bookmarkId = bookmarkId;
            console.info('bookmarkSaved link:'+bookmarkLink+' id:'+bookmarkId);
        },
        bookmarkFound: function (bookmarkLink,bookmarkId) {
            this.bookmarkLink = bookmarkLink;
            this.bookmarkId = bookmarkId;
            console.info('bookmarkFound link:'+bookmarkLink+' id:'+bookmarkId);
            showPageBookmarked();
        },
        bookmarkNotFound: function (bookmarkLink,bookmarkId) {
            this.bookmarkLink = bookmarkLink;
            this.bookmarkId = bookmarkId;
            console.info('bookmarkNotFound link:'+bookmarkLink+' id:'+bookmarkId);
            showPageNotBookmarked();
        }
    };
