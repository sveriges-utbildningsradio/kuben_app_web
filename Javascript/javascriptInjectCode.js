/**
Some rules from this file, otherwise some client interpretation might break parsing the file:
- use \n or \r\n for newline, the client might need to remove these before using the file!
- don't use // for comment
- Escape delimiters eg \"
*/
document.addEventListener('DOMContentLoaded', function(event) {
    console.info('JS loaded');
    Mobile.onPageFinished();
});
document.onreadystatechange = function() {
    console.info('JS onreadystatechange' + document.readyState);
    removeUrHeader();
    if (document.readyState == "interactive") {
        console.info('JS loaded');
    }
}
window.addEventListener("optimizedScroll", function() {
    console.log("optimizedScroll JS");
    /*removeUrHeader();*/
});

window.onscroll = function(e) {
    /*removeUrHeader();*/
};

var Mobile = new function() {

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
        removeUrHeader();
    };

    /* function that enables the UI element in the html page that shows that a page has been  bookmarked */
    this.showPageBookmarked = function() {
        console.info('showPageBookmarked');
    };

    /* function that disables the UI element in the html page that shows that a page has been  bookmarked */
    this.showPageNotBookmarked = function() {
        console.info('showPageNotBookmarked');
    };

    /* Show the bookmark UI on the webpage */
    this.showBookmarkUI = function() {
        console.info('showBookmarkUI');
    };

    this.isIOS = function() {
        //Look for the webkit functions that IOS is using.
        if (typeof webkit === 'undefined' || typeof webkit.messageHandlers === 'undefined') return false;

        var isIOS = userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i);
        return isIOS;
    };

    this.isAndroid = function() {
        if (typeof AndroidBookmark !== 'undefined') return true;

    };

    this.BookmarkResponds = {
        /**
        Called as a responds to Bookmark.save(..) with the stutus of the save

        pageId = UR id of the program eg 189895
        pageUrl = the main URL of webpage eg http://urplay.ur.se/program/189895-aarons-nya-land-i-krigets-skugga
        saved = the status of the bookmark save operation, TRUE IFF the bookmark has been save else FALSE
        */
        bookmarkSaved: function(pageId, pageUrl, saved) {
            console.info('bookmarkSaved id:' + pageId + ' url:' + pageUrl + "status: " + saved);
            if (document.baseURI !== pageId) {
                console.error("Url error when bookmarking a page, wrong url, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                return;
            }
            if (saved !== true) {
                console.error("Status error when bookmarking a page, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                return;
            }

            showPageBookmarked();
        },
        bookmarkRemoved: function(pageId, pageUrl, status) {
            console.info('bookmarkRemoved id:' + pageId + ' url:' + pageUrl + "status: " + saved);
            if (document.baseURI !== pageId) {
                console.error("Url error when removing the bookmark of a page, wrong url, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                return;
            }
            if (saved !== true) {
                console.error("Status error when removing the bookmark of a page, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                return;
            }
            showPageNotBookmarked();
        },
        isBookmarkedId: function(pageId, pageUrl, bookmarkFound) {
            console.info('bookmarkFound id:' + pageId + ' url:' + pageUrl + " bookmarkFound:" + bookmarkFound);
            if (document.baseURI !== pageId) {
                console.error("Url error isBookmarkedId, wrong url, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                return;
            }
            if (saved !== true) {
                console.error("Status error isBookmarkedId, baseURI:" + document.baseURI + " bookmarked url:" + pageUrl);
                return;
            }

            showPageBookmarked();
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
            console.info("save pageId:" + pageId + " pageUrl:" + pageUrl);
            if (Mobile.isIOS()) {
                /* save to IOS */
            } else if (Mobile.isAndroid()) {
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
            console.info("remove pageId:" + pageId + " pageUrl:" + pageUrl);
            if (Mobile.isIOS()) {
                /* call ios here */
            } else if (Mobile.isAndroid()) {
                AndroidBookmark.remove(pageId, pageUrl);
            }
        },
        /**
            Will check if a bookmark is saved (on iOS and Android this is done natively)
            BookmarkResponds.isBookmarkedId() with the result.

            pageId = UR id of the program eg 189895
            */
        isBookmarkedId: function(Id) {
            console.info("isBookmarkedId id:" + id);
            if (Mobile.isIOS()) {
                /* call ios here */
            } else if (Mobile.isAndroid()) {
                AndroidBookmark.remove(pageId, pageUrl);
            }
        }
    };
};