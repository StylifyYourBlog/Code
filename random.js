var postTitleOriginal,  myLink, myDiv, myImage;
var    main;

function getPost(json) {
var s;
    var entry = json.feed.entry[0];
    var postTitle = entry.title.$t;
    postTitleOriginal = postTitle;
    if (isNaN(titleLength) || titleLength == 0) {
        postTitle = '';
    }
    else if (postTitle.length > titleLength) postTitle = postTitle.substring(0, titleLength) + "...";
    var postUrl;
    for (var k = 0; k < entry.link.length; k++) {
        if (entry.link[k].rel == 'replies' && entry.link[k].type == 'text/html') {
            var commentText = entry.link[k].title;
            var commentUrl = entry.link[k].href;
        }
        if (entry.link[k].rel == 'alternate') {
            postUrl = entry.link[k].href;
            break;
        }
    }
    if (showThumbs == true) {
        var thumbUrl = "";
        try {
            thumbUrl = entry.media$thumbnail.url;
            if(imgDim=="80"||imgDim=="85"||imgDim=="90"||imgDim=="95"||imgDim=="100") thumbUrl = thumbUrl.replace("/s72-c/","/s104-c/");
        } catch (error) {
            if ("content" in entry) s = entry.content.$t; else s="";
            if (thumbUrl == "" && mediaThumbsOnly == false) {
                 regex = /http\:\/\/www\.youtube(-nocookie){0,1}\.com\/(v){0,1}(embed){0,1}\/(([^"&?' ]*))/;
                videoIds = s.match(regex);
                if (videoIds != null) {
                    videoId = videoIds[4];
                }
                if (videoIds != null && videoId != null) thumbUrl = "http://img.youtube.com/vi/" + videoId + "/2.jpg"
            }
            if (thumbUrl == "" && mediaThumbsOnly == false) {
                a = s.indexOf("<img");
                b = s.indexOf("src=\"", a);
                c = s.indexOf("\"", b + 5);
                d = s.substr(b + 5, c - b - 5);
                if ((a != -1) && (b != -1) && (c != -1) && (d != "")) thumbUrl = d;

            }

        }
        if (thumbUrl == "" && showNoImage == true) thumbUrl = 'http://1.bp.blogspot.com/_u4gySN2ZgqE/SosvnavWq0I/AAAAAAAAArk/yL95WlyTqr0/s400/noimage.png';
    } //end ifposthumbs
    if (showPostDate == true) {
        var postdate = entry.published.$t;
        var cdyear = postdate.substring(0, 4);
        var cdmonth = postdate.substring(5, 7);
        var cdday = postdate.substring(8, 10);
        var monthnames = new Array();
        monthnames[1] = "Jan";
        monthnames[2] = "Feb";
        monthnames[3] = "Mar";
        monthnames[4] = "Apr";
        monthnames[5] = "May";
        monthnames[6] = "Jun";
        monthnames[7] = "Jul";
        monthnames[8] = "Aug";
        monthnames[9] = "Sep";
        monthnames[10] = "Oct";
        monthnames[11] = "Nov";
        monthnames[12] = "Dec";
    } //end if date
    code = "";
        main = document.getElementById('stylify_random');
        myDiv = document.createElement('div');
        myDiv.setAttribute("class", "stylify_item_title");
         myDiv.style.clear="both";
    myDiv.style.marginTop="4px";
        myLink = createLink(postUrl,"_top",postTitleOriginal)
       
        if(postTitle != '')myDiv.appendChild(myLink);
        main.appendChild(myDiv);if(postTitle != '')myLink.innerHTML = postTitle;





    if (showThumbs == true && thumbUrl != "") {
        myImage = document.createElement('img');
        myImage.style.border = "3px solid transparent";
        myImage.style.margin = "5px";
myImage.style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.3)";

        myImage.setAttribute("src", thumbUrl);
        myImage.style.cssFloat=imgFloat;
        myImage.style.styleFloat=imgFloat;
        //myImage.setAttribute("alt", postTitleOriginal);
        myImage.setAttribute("width", imgDim);
        //myImage.setAttribute("align", imgFloat);
        myImage.setAttribute("height", imgDim);
        myLink = document.createElement('a');
        myLink.setAttribute("href", postUrl+"?utm_source=blog&utm_medium=gadget&utm_campaign=stylify_random");
        myLink.setAttribute("target", "_top");
        myLink.setAttribute("title", postTitleOriginal);
        myLink.appendChild(myImage);

        myDiv = document.createElement('div');
        myDiv.setAttribute("class", "stylify_item_thumb");
        myDiv.appendChild(myLink);
        main.appendChild(myDiv);
    }




    try {
        if ("content" in entry) {
            var postContent = entry.content.$t;
        }
        else if ("summary" in entry) {
            var postContent = entry.summary.$t;
        }
        else var postContent = "";
        var re = /<\S[^>]*>/g;
        postContent = postContent.replace(re, "");


        if (showSummary == true) {
            myDiv = createDiv("stylify_item_summary");
           
                if (postContent.length < summaryLength) {myDiv.innerHTML=postContent;}
            else {
                postContent = postContent.substring(0, summaryLength);
                var quoteEnd = postContent.lastIndexOf(" ");
                postContent = postContent.substring(0, quoteEnd);
                myDiv.innerHTML=postContent + '...';
            }

            main.appendChild(myDiv);
        }
    } //end try
    catch (error) {}

    myDiv =  createDiv("stylify_item_meta");
    myDiv.style.clear="both";
    myDiv.style.marginBottom="4px";

    var flag = 0;
    if (showPostDate == true) {
        myDiv.appendChild(document.createTextNode(monthnames[parseInt(cdmonth, 10)] + '-' + cdday + '-' + cdyear));
        flag = 1;
    }

    if (showCommentCount == true) {
        if (flag == 1) {
            myDiv.appendChild(document.createTextNode(" | "));
        }
        if (commentText == '1 Comments') commentText = '1 Comment';
        if (commentText == '0 Comments') commentText = 'No Comments';
        var myLink = createLink(commentUrl,"_top",commentText + " on " + postTitleOriginal)
        myDiv.appendChild(myLink);
        myLink.innerHTML=commentText;
        flag = 1;;
    }

    if (showReadMore == true) {
        if (flag == 1) {
            myDiv.appendChild(document.createTextNode(" | "));
        }
        var myLink = createLink(postUrl,"_top",postTitleOriginal)
        myDiv.appendChild(myLink);
        myLink.innerHTML = readMore+" &raquo;";
        flag = 1;;
    }



    if (flag == 1 || showSummary || postTitle != "") main.appendChild(myDiv);
    gadgets.window.adjustHeight();

}

function getRandom(json) {
 var feedUrl = '/feeds/posts/default';
    if (mediaThumbsOnly||!showThumbs) feedUrl = feedUrl.replace("posts/default", "posts/summary");
    totalPosts = parseInt(json.feed.openSearch$totalResults.$t);
    var rand = [];
    if (numberOfPosts > totalPosts) numberOfPosts = totalPosts;
    if (numberOfPosts > 15) numberOfPosts = 15;
    while (rand.length < numberOfPosts) {
        var randomNumber = Math.ceil(Math.random() * totalPosts);
        var found = false;
        for (var i = 0; i < rand.length; i++) {
            if (rand[i] == randomNumber) {
                found = true;
                break;
            }
        }
        if (!found) rand[rand.length] = randomNumber;
    }
    var head = document.getElementsByTagName("head")[0] || document.documentElement;

    for (var i = 0; i < rand.length; i++) {

        script = document.createElement("script");
        script.src = feedUrl + "?start-index=" + rand[i] + "&max-results=1&alt=json-in-script&callback=getPost";
        script.charSet = "utf-8";
        head.appendChild(script);
    }

       

}
function createDiv(className)
{
var myDiv = document.createElement('div');
myDiv.setAttribute("class", className);

return myDiv;
}


function createLink(href,target,title)
{

var myLink = document.createElement('a');
if(href.substring(href.length-13,href.length)=="#comment-form")
href= href.substring(0,href.length-13)+"?utm_source=blog&utm_medium=gadget&utm_campaign=stylify_random"+"#comment-form";
else if(href.indexOf("?utm_source=")==-1) href=href+"?utm_source=blog&utm_medium=gadget&utm_campaign=stylify_random";
myLink.setAttribute("href", href);
        myLink.setAttribute("target", target);
        myLink.setAttribute("title", title);
       

return myLink;
}