(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["macros"] = (function() {function root(env, context, frame, runtime, cb) {
var lineno = null;
var colno = null;
var output = "";
try {
var macro_t_1 = runtime.makeMacro(
["game"], 
[], 
function (l_game, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("game", l_game);
var output= "";
output += "<div class=\"game\">\n        <a class=\"game-link\" href=\"/game/";
output += runtime.suppressValue(runtime.memberLookup((l_game),"urltitle", env.autoesc), env.autoesc);
output += "\" title=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"title", env.autoesc), env.autoesc);
output += "\"><img\n                src=\"";
output += runtime.suppressValue((lineno = 3, colno = 40, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"getImgUrl", env.autoesc), "awgutils[\"getImgUrl\"]", [runtime.memberLookup((l_game),"urltitle", env.autoesc)])), env.autoesc);
output += "\" alt=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"title", env.autoesc), env.autoesc);
output += "\" width=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"imgwidth", env.autoesc), env.autoesc);
output += "\"\n                height=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"imgheight", env.autoesc), env.autoesc);
output += "\"/></a>\n        <a href=\"/game/";
output += runtime.suppressValue(runtime.memberLookup((l_game),"urltitle", env.autoesc), env.autoesc);
output += "\" title=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"title", env.autoesc), env.autoesc);
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((l_game),"title", env.autoesc), env.autoesc);
output += "</a>\n\n        <p class=\"small-description-text\">";
output += runtime.suppressValue(runtime.memberLookup((l_game),"description", env.autoesc), env.autoesc);
output += "</p>\n\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showgame");
context.setVariable("showgame", macro_t_1);
output += "\n\n";
var macro_t_2 = runtime.makeMacro(
["game"], 
[], 
function (l_game, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("game", l_game);
var output= "";
output += "<p class=\"game-tags\">\n        ";
frame = frame.push();
var t_5 = runtime.memberLookup((l_game),"tags", env.autoesc);
if(t_5) {for(var t_3=0; t_3 < t_5.length; t_3++) {
var t_6 = t_5[t_3];
frame.set("tag", t_6);
output += "\n            <a class=\"game-tag\" href=\"/games/";
output += runtime.suppressValue(t_6, env.autoesc);
output += "\"\n               title=\"";
output += runtime.suppressValue((lineno = 16, colno = 43, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"titleDecode", env.autoesc), "awgutils[\"titleDecod\"]", [t_6])), env.autoesc);
output += "\">";
output += runtime.suppressValue((lineno = 16, colno = 72, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"titleDecode", env.autoesc), "awgutils[\"titleDecod\"]", [t_6])), env.autoesc);
output += "</a>\n        ";
;
}
}
frame = frame.pop();
output += "\n    </p>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("tagsFor");
context.setVariable("tagsFor", macro_t_2);
output += "\n\n\n";
var macro_t_7 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div class=\"game game-featured\">\n        <a class=\"game-link\" href=\"http://www.wordsmashing.com\" title=\"Word Smashing Puzzle\" target=\"_blank\"><img\n                src=\"/static/img/word-smashing-logo.png\" alt=\"Word Smashing, Addicting Word Puzzle Game\" width=\"250\"\n                height=\"184\"/></a>\n        <a href=\"http://www.wordsmashing.com\" title=\"Play Word Smashing!\" target=\"_blank\">Word Smashing!</a>\n\n        <p class=\"small-description-text\">Additively Fun Free Word Puzzle! Slide Letters Around Making Words! Making\n            Words Will Clear Valuable Space!</p>\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showwordsmashing");
context.setVariable("showwordsmashing", macro_t_7);
output += "\n\n";
var macro_t_8 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div class=\"game game-featured\">\n        <a class=\"game-link\" href=\"http://www.multiplicationmaster.com\"\n           title=\"Multiplication Master Multiplication Game\" target=\"_blank\"><img\n                src=\"/static/img/multiplication-master-promo-256.png\" alt=\"Multiplication Master Maths Game\" width=\"256\"\n                height=\"256\"/></a>\n        <a href=\"http://www.multiplicationmaster.com\" title=\"Play 1multiplication Master!\" target=\"_blank\">Multiplication\n            Master!</a>\n\n        <p class=\"small-description-text small-description-text-featured\">Find numbers which work! Multiplication Master\n            makes math fun! Beat the clock in this battle of the brains or create crazy combos! Multiplication Master\n            Means Maths Madness!</p>\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showmultiplicationmaster");
context.setVariable("showmultiplicationmaster", macro_t_8);
output += "\n\n";
var macro_t_9 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
if(runtime.contextOrFrameLookup(context, frame, "game")) {
output += "\n        <div class=\"game game-panel\" style=\"width:";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"width", env.autoesc) + 40, env.autoesc);
output += "px;\">\n            <h2>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"title", env.autoesc), env.autoesc);
output += "</h2>\n\n            <div>\n                ";
output += runtime.suppressValue((lineno = 55, colno = 26, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "renderswf"), "renderswf", [])), env.autoesc);
output += "\n            </div>\n            ";
output += runtime.suppressValue((lineno = 57, colno = 32, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "shareBtnsHorizontal"), "shareBtnsHorizontal", [runtime.contextOrFrameLookup(context, frame, "url")])), env.autoesc);
output += "\n            ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"description", env.autoesc)) {
output += "\n                <div class=\"game-panel-description\">\n                    <p>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"description", env.autoesc), env.autoesc);
output += "</p>\n                </div>\n            ";
;
}
output += "\n            ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"instructions", env.autoesc)) {
output += "\n                <div class=\"game-panel-instructions\">\n                    <p class=\"game-panel-instructions-header\">Instructions:</p>\n\n                    <p>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"instructions", env.autoesc), env.autoesc);
output += "</p>\n                </div>\n            ";
;
}
output += "\n            ";
output += runtime.suppressValue((lineno = 70, colno = 20, runtime.callWrap(macro_t_2, "tagsFor", [runtime.contextOrFrameLookup(context, frame, "game")])), env.autoesc);
output += "\n        </div>\n    ";
;
}
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showmaingame");
context.setVariable("showmaingame", macro_t_9);
output += "\n\n";
var macro_t_10 = runtime.makeMacro(
["num_adds_shown"], 
[], 
function (l_num_adds_shown, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("num_adds_shown", l_num_adds_shown);
var output= "";
if(l_num_adds_shown > 3) {
output += "\n        <div class=\"game\" style=\"height:260px\">\n            <script id=\"mNCC\" language=\"javascript\">  medianet_width = '300';\n            medianet_height = '250';\n            medianet_crid = '682942442';  </script>\n            <script id=\"mNSC\" src=\"http://contextual.media.net/nmedianet.js?cid=8CUV76NDB\"\n                    language=\"javascript\"></script>\n        </div>\n    ";
;
}
else {
if(l_num_adds_shown == 3) {
output += "\n        <div class=\"game\" style=\"height: 610px\">\n            <script id=\"mNCC\" language=\"javascript\">  medianet_width = '160';\n            medianet_height = '600';\n            medianet_crid = '151754842';  </script>\n            <script id=\"mNSC\" src=\"http://contextual.media.net/nmedianet.js?cid=8CUV76NDB\"\n                    language=\"javascript\"></script>\n        </div>\n    ";
;
}
else {
if(l_num_adds_shown == 2) {
output += "\n        <div class=\"game\" style=\"height:605px\">\n            <script async src=\"http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>\n            <!-- AWG big v -->\n            <ins class=\"adsbygoogle\"\n                 style=\"display:inline-block;width:160px;height:600px\"\n                 data-ad-client=\"ca-pub-7026363262140448\"\n                 data-ad-slot=\"4293546152\"></ins>\n            <script>\n                (adsbygoogle = window.adsbygoogle || []).push({});\n            </script>\n        </div>\n    ";
;
}
else {
output += "\n        <div class=\"game\">\n            <script async src=\"http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>\n            <!-- AWG BOX -->\n            <ins class=\"adsbygoogle\"\n                 style=\"display:inline-block;width:300px;height:250px\"\n                 data-ad-client=\"ca-pub-7026363262140448\"\n                 data-ad-slot=\"9106168954\"></ins>\n            <script>\n                (adsbygoogle = window.adsbygoogle || []).push({});\n            </script>\n        </div>\n    ";
;
}
;
}
;
}
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showadd");
context.setVariable("showadd", macro_t_10);
output += "\n\n";
var macro_t_11 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div id=\"games\">\n        ";
output += runtime.suppressValue((lineno = 121, colno = 21, runtime.callWrap(macro_t_9, "showmaingame", [])), env.autoesc);
output += "\n        ";
output += runtime.suppressValue((lineno = 122, colno = 25, runtime.callWrap(macro_t_7, "showwordsmashing", [])), env.autoesc);
output += "\n        ";
output += runtime.suppressValue((lineno = 123, colno = 33, runtime.callWrap(macro_t_8, "showmultiplicationmaster", [])), env.autoesc);
output += "\n        ";
var t_12;
t_12 = 0;
frame.set("num_adds_shown", t_12);
if(!frame.parent) {
context.setVariable("num_adds_shown", t_12);
context.addExport("num_adds_shown");
}
output += "\n        ";
frame = frame.push();
var t_15 = runtime.contextOrFrameLookup(context, frame, "games");
if(t_15) {for(var t_13=0; t_13 < t_15.length; t_13++) {
var t_16 = t_15[t_13];
frame.set("game", t_16);
output += "\n            ";
if((lineno = 126, colno = 44, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"shouldShowAddBefore", env.autoesc), "awgutils[\"shouldShow\"]", [t_16]))) {
output += "\n                ";
output += runtime.suppressValue((lineno = 127, colno = 24, runtime.callWrap(macro_t_10, "showadd", [t_12])), env.autoesc);
output += "\n                ";
var t_17;
t_17 = t_12 + 1;
frame.set("num_adds_shown", t_17);
if(!frame.parent) {
context.setVariable("num_adds_shown", t_17);
context.addExport("num_adds_shown");
}
output += "\n            ";
;
}
output += "\n            ";
output += runtime.suppressValue((lineno = 130, colno = 21, runtime.callWrap(macro_t_1, "showgame", [t_16])), env.autoesc);
output += "\n        ";
;
}
}
frame = frame.pop();
output += "\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showgames");
context.setVariable("showgames", macro_t_11);
output += "\n\n";
var macro_t_18 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<object type=\"application/x-shockwave-flash\" data=\"";
output += runtime.suppressValue((lineno = 136, colno = 74, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"getSWFUrl", env.autoesc), "awgutils[\"getSWFUrl\"]", [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"urltitle", env.autoesc)])), env.autoesc);
output += "\"\n            id=\"\" style=\"margin:0 10px;width:";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"width", env.autoesc), env.autoesc);
output += "px;height:";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"height", env.autoesc), env.autoesc);
output += "px;\" wmode=\"direct\">\n    </object>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("renderswf");
context.setVariable("renderswf", macro_t_18);
output += "\n\n";
var macro_t_19 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div id=\"main\">\n        <div id=\"logo\">\n            <h1 class=\"header\"><a href=\"/\" title=\"Addicting Word Games\">Addicting <span\n                    style=\"color:gray;display:inline-block;\">Word Games</span></a></h1>\n\n            <div class=\"header-share\">\n                <div class=\"fb-like\" data-href=\"https://www.facebook.com/addictingwordgames\" data-width=\"400px\"\n                     data-layout=\"standard\" data-action=\"like\" data-show-faces=\"true\" data-share=\"true\"></div>\n            </div>\n        </div>\n        <!-- <div id=\"login\">\n          <fb:login-button autologoutlink=\"true\" scope=\"publish_stream\" width=\"200\" max-rows=\"1\"></fb:login-button>\n        </div> -->\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("topbar");
context.setVariable("topbar", macro_t_19);
output += "\n\n";
var macro_t_20 = runtime.makeMacro(
["ws", "highscores", "achievements"], 
[], 
function (l_ws, l_highscores, l_achievements, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("ws", l_ws);
frame.set("highscores", l_highscores);
frame.set("achievements", l_achievements);
var output= "";
output += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <link rel=\"shortcut icon\" href=\"/favicon.ico\" type=\"image/x-icon\">\n\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"/static/css/bootstrap.css\"/>\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"/static/css/style.css\"/>\n    <link rel=\"stylesheet\" href=\"/static/css/social-likes.css\">\n    <!--[if IE 8]>\n    <link rel=\"stylesheet\" href=\"/static/css/ie8.css\" type=\"text/css\"/><![endif]-->\n\n\n    <script type=\"text/javascript\" src=\"/static/js/jquery-1.9.1.min.js\"></script>\n    <script type=\"text/javascript\" src=\"/static/js/jquery.blockUI.js\"></script>\n    <script type=\"text/javascript\" src=\"/static/js/masonry.pkgd.min.js\"></script>\n\n    <script src=\"/static/js/social-likes.min.js\"></script>\n    <script>\n        $(function () {\n            var $container = $('#games');\n            // initialize\n            $container.masonry({\n                columnWidth: 300,\n                itemSelector: '.game',\n                \"isFitWidth\": true,\n                \"gutter\": 0\n            });\n\n            $('.search-box').focus();\n        });\n        var isfetching = false;\n        var curr_cursor = '";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "next_page_cursor"), env.autoesc);
output += "';\n        function loadmore() {\n            if (!isfetching) {\n\n                isfetching = true;\n                $('.load-more').attr('disabled', 'disabled');\n                $.ajax({\n                    'url': '/loadgames?cursor=' + curr_cursor + '";
if(runtime.contextOrFrameLookup(context, frame, "urltitle")) {
output += "&title=";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "urltitle"), env.autoesc);
;
}
output += "',\n                    'success': function (data) {\n                        $('.load-more').removeAttr('disabled');\n                        a = $('<div></div>');\n                        a.html(data);\n                        curr_cursor = a.find('#cursor').attr('data-cursor');\n                        items = a.find('.game');\n                        var $games = $('#games');\n                        $games.append(items);\n                        // $('#games').masonry( 'addItems', items );\n                        $games.masonry('appended', items);\n\n                        isfetching = false;\n                    },\n                    'error': function (data) {\n                        var $load = $('.load-more');\n                        $load.removeAttr('disabled');\n                        $load.html('No More Results');\n                    },\n                    cache: false\n                });\n            }\n            return false;\n        }\n    </script>\n    <script>\n        (function (i, s, o, g, r, a, m) {\n            i['GoogleAnalyticsObject'] = r;\n            i[r] = i[r] || function () {\n                (i[r].q = i[r].q || []).push(arguments)\n            }, i[r].l = 1 * new Date();\n            a = s.createElement(o),\n                    m = s.getElementsByTagName(o)[0];\n            a.async = 1;\n            a.src = g;\n            m.parentNode.insertBefore(a, m)\n        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');\n\n        ga('create', 'UA-43904545-1', 'addictingwordgames.com');\n        ga('send', 'pageview');\n\n    </script>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("headers");
context.setVariable("headers", macro_t_20);
output += "\n\n";
var macro_t_21 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div id=\"fb-root\"></div>\n    <script>(function (d, s, id) {\n        var js, fjs = d.getElementsByTagName(s)[0];\n        if (d.getElementById(id)) return;\n        js = d.createElement(s);\n        js.id = id;\n        js.src = \"//connect.facebook.net/en_GB/all.js#xfbml=1&appId=138831849632195\";\n        fjs.parentNode.insertBefore(js, fjs);\n    }(document, 'script', 'facebook-jssdk'));</script>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("templates");
context.setVariable("templates", macro_t_21);
output += "\n\n";
var macro_t_22 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<a class=\"btn btn-large btn-primary load-more\" href=\"#\" onclick=\"loadmore();return false;\"\n       title=\"Load Addicting Word Games!\">Load More...</a>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("loadmorebutton");
context.setVariable("loadmorebutton", macro_t_22);
output += "\n\n";
var macro_t_23 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div id=\"footer\">\n        <p>\n            ";
if("/contact" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
output += "\n                <span>Contact</span>\n            ";
;
}
else {
output += "\n                <a href=\"/contact\" title=\"Contact Us\">Contact</a>\n            ";
;
}
output += "\n\n            ";
if("/about" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
output += "\n                <span>About Us</span>\n            ";
;
}
else {
output += "\n                <a href=\"/about\" title=\"About Addicting Word Games\">About Us</a>\n            ";
;
}
output += "\n\n            ";
if("/terms" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
output += "\n                <span>Terms &amp; Conditions</span>\n            ";
;
}
else {
output += "\n                <a href=\"/terms\" title=\"Terms &amp; Conditions\">Terms &amp; Conditions</a>\n            ";
;
}
output += "\n\n            ";
if("/privacy-policy" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
output += "\n                <span>Privacy Policy</span>\n            ";
;
}
else {
output += "\n                <a href=\"/privacy-policy\" title=\"Privacy Policy\">Privacy Policy</a>\n            ";
;
}
output += "\n\n            <span>© 2013 Addicting Word Games</span>\n            <!-- <a href=\"http://www.facebook.com/addictingwordgames\" title=\"Addicting Word Games on Facebook\" target=\"_blank\">\n            <img src=\"/img/facebook.jpg\" alt=\"Addicting Word Games on Facebook\" width=\"144px\" height=\"44px\">\n        </a> -->\n        </p>\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("footer");
context.setVariable("footer", macro_t_23);
var macro_t_24 = runtime.makeMacro(
["url"], 
[], 
function (l_url, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("url", l_url);
var output= "";
output += "\n    <div style=\"height:25px\">\n        <span class=\"fb-like\" data-href=\"";
output += runtime.suppressValue(l_url, env.autoesc);
output += "\" data-send=\"true\" data-width=\"380\" data-show-faces=\"true\"></span>\n    </div>\n    <ul class=\"social-likes\">\n        <li class=\"facebook\" title=\"Share link on Facebook\">Facebook</li>\n        <li class=\"twitter\" title=\"Share link on Twitter\">Twitter</li>\n        <li class=\"plusone\" title=\"Share link on Google+\">Google+</li>\n        <li class=\"pinterest\" title=\"Share image on Pinterest\" data-media=\"";
output += runtime.suppressValue(l_url, env.autoesc);
output += "\">Pinterest</li>\n    </ul>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("shareBtnsHorizontal");
context.setVariable("shareBtnsHorizontal", macro_t_24);
output += "\n\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};
})();
})();
