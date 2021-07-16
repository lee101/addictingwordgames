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
output += "<div class=\"game mdl-shadow--4dp\">\n        <a class=\"game-link\" href=\"/game/";
output += runtime.suppressValue(runtime.memberLookup((l_game),"urltitle", env.autoesc), env.autoesc);
output += "\"\n           title=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"title", env.autoesc), env.autoesc);
output += "\"><img\n                src=\"";
output += runtime.suppressValue((lineno = 4, colno = 40, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"getImgUrl", env.autoesc), "awgutils[\"getImgUrl\"]", [runtime.memberLookup((l_game),"urltitle", env.autoesc)])), env.autoesc);
output += "\"\n                alt=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"title", env.autoesc), env.autoesc);
output += "\" width=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"imgwidth", env.autoesc), env.autoesc);
output += "\"\n                height=\"";
output += runtime.suppressValue(runtime.memberLookup((l_game),"imgheight", env.autoesc), env.autoesc);
output += "\"/></a>\n        <a href=\"/game/";
output += runtime.suppressValue(runtime.memberLookup((l_game),"urltitle", env.autoesc), env.autoesc);
output += "\"\n           title=\"";
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
output += runtime.suppressValue((lineno = 19, colno = 43, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"titleDecode", env.autoesc), "awgutils[\"titleDecod\"]", [t_6])), env.autoesc);
output += "\">";
output += runtime.suppressValue((lineno = 19, colno = 72, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"titleDecode", env.autoesc), "awgutils[\"titleDecod\"]", [t_6])), env.autoesc);
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
output += "<div class=\"game game-featured mdl-shadow--4dp\">\n        <a class=\"game-link\" href=\"/play-game/wordsmashing\"\n           title=\"Word Smashing Puzzle\" target=\"_blank\"><img\n                src=\"/static/img/word-smashing-logo.png\"\n                alt=\"Word Smashing, Addicting Word Puzzle Game\" width=\"250\"\n                height=\"184\"/></a>\n        <a href=\"http://www.wordsmashing.com\" title=\"Play Word Smashing!\"\n           target=\"_blank\">Word Smashing!</a>\n\n        <p class=\"small-description-text\">Additively Fun Free Word Puzzle! Slide\n            Letters Around Making Words! Making\n            Words Will Clear Valuable Space!</p>\n    </div>";
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
output += "<div class=\"game game-featured mdl-shadow--4dp\">\n        <a class=\"game-link\" href=\"/play-game/reword-game\"\n           title=\"reWord Game Word Puzzle\" target=\"_blank\"><img\n                src=\"/static/img/reword-game-logo256.png\"\n                alt=\"reWord Game, Word Swapping Puzzle Game\" width=\"256\"\n                height=\"256\"/></a>\n        <a href=\"/play-game/reword-game\" title=\"Play reWord Game!\"\n           target=\"_blank\">reWord Game!</a>\n\n        <p class=\"small-description-text\">Swap Words to Make Sense of\n            Strangeness in this new word puzzle game! Play\n            reWord Game Free Online!</p>\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showrewordgame");
context.setVariable("showrewordgame", macro_t_8);
output += "\n\n";
var macro_t_9 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div class=\"game game-featured mdl-shadow--4dp\">\n        <a class=\"game-link\" href=\"/play-game/multiplication-master\"\n           title=\"Multiplication Master Multiplication Game\"\n           ><img\n                src=\"/static/img/multiplication-master-promo-256.png\"\n                alt=\"Multiplication Master Maths Game\" width=\"256\"\n                height=\"256\"/></a>\n        <a href=\"/play-game/multiplication-master\"\n           title=\"Play multiplication Master!\" >Multiplication\n            Master!</a>\n\n        <p class=\"small-description-text small-description-text-featured\">Find\n            numbers which work! Multiplication Master\n            makes math fun! Beat the clock in this battle of the brains or\n            create crazy combos! Multiplication Master\n            Means Maths Madness!</p>\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showmultiplicationmaster");
context.setVariable("showmultiplicationmaster", macro_t_9);
output += "\n\n";
var macro_t_10 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div class=\"game game-featured mdl-shadow--4dp\">\n        <a class=\"game-link\" href=\"/play-game/big-multiplayer-chess\"\n           title=\"Big Multiplayer Chess Game\"><img\n                src=\"/static/img/big-multiplayer-chess-logo256.png\"\n                alt=\"Big Multiplayer Chess Game\" width=\"256\"\n                height=\"256\"/></a>\n        <a href=\"/play-game/big-multiplayer-chess\"\n           title=\"Play Big Multiplayer Chess!\">Big Multiplayer\n            Chess!</a>\n\n        <p class=\"small-description-text small-description-text-featured\">\n            Massive 6+ Player Chess Board! Pawns move in any direction! Invade\n            and take over your enemies chess pieces by taking the king!</p>\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showbigmultiplayerchess");
context.setVariable("showbigmultiplayerchess", macro_t_10);
output += "\n\n";
var macro_t_11 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
if(runtime.contextOrFrameLookup(context, frame, "game")) {
output += "\n        <div class=\"game game-panel mdl-shadow--4dp\"\n             style=\"width:";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"width", env.autoesc) + 40, env.autoesc);
output += "px;\">\n            <h2>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"title", env.autoesc), env.autoesc);
output += "</h2>\n\n            <div>\n                ";
output += runtime.suppressValue((lineno = 101, colno = 26, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "renderswf"), "renderswf", [])), env.autoesc);
output += "\n            </div>\n            ";
output += runtime.suppressValue((lineno = 103, colno = 32, runtime.callWrap(runtime.contextOrFrameLookup(context, frame, "shareBtnsHorizontal"), "shareBtnsHorizontal", [runtime.contextOrFrameLookup(context, frame, "url")])), env.autoesc);
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
output += runtime.suppressValue((lineno = 116, colno = 20, runtime.callWrap(macro_t_2, "tagsFor", [runtime.contextOrFrameLookup(context, frame, "game")])), env.autoesc);
output += "\n        </div>\n    ";
;
}
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showmaingame");
context.setVariable("showmaingame", macro_t_11);
output += "\n\n";
var macro_t_12 = runtime.makeMacro(
["num_adds_shown"], 
[], 
function (l_num_adds_shown, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("num_adds_shown", l_num_adds_shown);
var output= "";
if(l_num_adds_shown < 10) {
output += "\n\n        <div class=\"game mdl-shadow--4dp\" style=\"height:250px;min-width:300px\">\n            <script async\n                    src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>\n            <!-- AWG BOX -->\n            <ins class=\"adsbygoogle\"\n                 style=\"display:inline-block;width:300px;height:250px\"\n                 data-ad-client=\"ca-pub-7026363262140448\"\n                 data-ad-slot=\"9106168954\"></ins>\n            <script>\n                (adsbygoogle = window.adsbygoogle || []).push({});\n            </script>\n        </div>\n    ";
;
}
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("showadd");
context.setVariable("showadd", macro_t_12);
output += "\n\n";
var macro_t_13 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div id=\"games\">\n        ";
output += runtime.suppressValue((lineno = 142, colno = 21, runtime.callWrap(macro_t_11, "showmaingame", [])), env.autoesc);
output += "\n        ";
output += runtime.suppressValue((lineno = 143, colno = 25, runtime.callWrap(macro_t_7, "showwordsmashing", [])), env.autoesc);
output += "\n        ";
output += runtime.suppressValue((lineno = 144, colno = 33, runtime.callWrap(macro_t_9, "showmultiplicationmaster", [])), env.autoesc);
output += "\n        ";
output += runtime.suppressValue((lineno = 145, colno = 23, runtime.callWrap(macro_t_8, "showrewordgame", [])), env.autoesc);
output += "\n        ";
output += runtime.suppressValue((lineno = 146, colno = 32, runtime.callWrap(macro_t_10, "showbigmultiplayerchess", [])), env.autoesc);
output += "\n        ";
var t_14;
t_14 = 0;
frame.set("num_adds_shown", t_14);
if(!frame.parent) {
context.setVariable("num_adds_shown", t_14);
context.addExport("num_adds_shown");
}
output += "\n        ";
frame = frame.push();
var t_17 = runtime.contextOrFrameLookup(context, frame, "games");
if(t_17) {for(var t_15=0; t_15 < t_17.length; t_15++) {
var t_18 = t_17[t_15];
frame.set("game", t_18);
output += "\n            ";
output += "\n            ";
output += "\n            ";
output += "\n            ";
output += "\n            ";
output += runtime.suppressValue((lineno = 153, colno = 21, runtime.callWrap(macro_t_1, "showgame", [t_18])), env.autoesc);
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
context.setVariable("showgames", macro_t_13);
output += "\n\n";
var macro_t_19 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<object type=\"application/x-shockwave-flash\"\n            data=\"";
output += runtime.suppressValue((lineno = 160, colno = 37, runtime.callWrap(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "awgutils")),"getSWFUrl", env.autoesc), "awgutils[\"getSWFUrl\"]", [runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"urltitle", env.autoesc)])), env.autoesc);
output += "\"\n            id=\"\"\n            style=\"margin:0 10px;width:";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"width", env.autoesc), env.autoesc);
output += "px;height:";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "game")),"height", env.autoesc), env.autoesc);
output += "px;\"\n            wmode=\"direct\">\n    </object>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("renderswf");
context.setVariable("renderswf", macro_t_19);
output += "\n\n";
var macro_t_20 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<div id=\"main\">\n        <div id=\"logo\">\n            <h1 class=\"header\"><a href=\"/\" title=\"Addicting Word Games\">Addicting<span\n                    style=\"color:gray;display:inline-block;\"> Word Games</span></a>\n            </h1>\n\n            ";
output += "\n            ";
output += "\n            ";
output += "\n            ";
output += "\n            <div class=\"right-nav\">\n                <a id=\"log-out\" href=\"/logout\" onclick=\"signout()\"\n                   style=\"display: none;\">Log out</a>\n                <a id=\"log-in\" href=\"/login\">Login</a>\n                <a id=\"sign-up\" href=\"/sign-up\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--accent\">Sign\n                    Up</a>\n                <a id=\"buy\" href=\"/buy\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--accent\"\n                   style=\"display: none;\">$1.99 Buy All Games</a>\n            </div>\n            <div class=\"clear\"></div>\n        </div>\n        ";
output += "\n        ";
output += "\n        ";
output += "\n    </div>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("topbar");
context.setVariable("topbar", macro_t_20);
output += "\n\n";
var macro_t_21 = runtime.makeMacro(
["ws", "highscores", "achievements"], 
[], 
function (l_ws, l_highscores, l_achievements, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("ws", l_ws);
frame.set("highscores", l_highscores);
frame.set("achievements", l_achievements);
var output= "";
output += "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <link rel=\"shortcut icon\" href=\"/favicon.ico\" type=\"image/x-icon\">\n\n    <link rel=\"stylesheet\"\n          href=\"https://code.getmdl.io/1.3.0/material.cyan-pink.min.css\"/>\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"/static/css/bootstrap.css\"/>\n    <link type=\"text/css\" rel=\"stylesheet\" href=\"/static/css/style.css\"/>\n    <link rel=\"stylesheet\" href=\"/static/css/social-likes.css\">\n    <!--[if IE 8]>\n    <link rel=\"stylesheet\" href=\"/static/css/ie8.css\"\n          type=\"text/css\"/><![endif]-->\n\n\n    <script type=\"text/javascript\"\n            src=\"/static/js/jquery-1.9.1.min.js\"></script>\n    <script type=\"text/javascript\"\n            src=\"/static/js/masonry.pkgd.min.js\"></script>\n\n    <script src=\"/static/js/dialog-polyfill.js\"></script>\n    <script src=\"/static/js/social-likes.min.js\"></script>\n    <script>\n        function signout() {\n            firebase.auth().signOut().then(function () {\n                // Sign-out successful.\n            }).catch(function (error) {\n                // An error happened.\n            });\n        }\n\n        $(function () {\n            var $container = $('#games');\n            // initialize\n            $container.masonry({\n                columnWidth: 300,\n                itemSelector: '.game',\n                \"isFitWidth\": true,\n                \"gutter\": 6\n            });\n\n            $('.search-box').focus();\n\n        });\n        var isfetching = false;\n        var curr_cursor = '";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "next_page_cursor"), env.autoesc);
output += "';\n\n        function newUser(user, token, callback) {\n            \"use strict\";\n\n\n            $.ajax({\n                \"url\": \"/api/create-user\",\n                \"data\": {\n                    'email': user.email,\n                    'emailVerified': user.emailVerified,\n                    'uid': user.uid,\n                    'photoURL': user.photoURL,\n                    'token': token\n                },\n                \"success\": function (data) {\n                    callback(data)\n                },\n                \"type\": \"POST\",\n                \"cache\": false,\n                \"error\": function (xhr, error, thrown) {\n                    if (error == \"parsererror\") {\n                    }\n                    // TODO allways ensure theres a user with getorinsert\n                    callback(error)\n                }\n            });\n        }\n\n        function getUser(email, callback) {\n            \"use strict\";\n\n\n            $.ajax({\n                \"url\": \"/api/get-user\",\n                \"data\": {\n                    'email':email\n                },\n                \"success\": function (data) {\n                    callback(data)\n                },\n                \"type\": \"GET\",\n                \"cache\": false,\n                \"error\": function (xhr, error, thrown) {\n                    if (error == \"parsererror\") {\n                    }\n                    // TODO allways ensure theres a user with getorinsert\n                    callback(error)\n                }\n            });\n        }\n\n        function loadmore() {\n            if (!isfetching) {\n\n                isfetching = true;\n                $('.load-more').attr('disabled', 'disabled');\n                $.ajax({\n                    'url': '/loadgames?cursor=' + curr_cursor + '";
if(runtime.contextOrFrameLookup(context, frame, "urltitle")) {
output += "&title=";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "urltitle"), env.autoesc);
;
}
output += "',\n                    'success': function (data) {\n                        $('.load-more').removeAttr('disabled');\n                        a = $('<div></div>');\n                        a.html(data);\n                        curr_cursor = a.find('#cursor').attr('data-cursor');\n                        items = a.find('.game');\n                        var $games = $('#games');\n                        $games.append(items);\n                        // $('#games').masonry( 'addItems', items );\n                        $games.masonry('appended', items);\n\n                        isfetching = false;\n                    },\n                    'error': function (data) {\n                        var $load = $('.load-more');\n                        $load.removeAttr('disabled');\n                        $load.html('No More Results');\n                    },\n                    cache: false\n                });\n            }\n            return false;\n        }\n    </script>\n    <script>\n        (function (i, s, o, g, r, a, m) {\n            i['GoogleAnalyticsObject'] = r;\n            i[r] = i[r] || function () {\n                (i[r].q = i[r].q || []).push(arguments)\n            }, i[r].l = 1 * new Date();\n            a = s.createElement(o),\n                m = s.getElementsByTagName(o)[0];\n            a.async = 1;\n            a.src = g;\n            m.parentNode.insertBefore(a, m)\n        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');\n\n        ga('create', 'UA-43904545-1', 'addictingwordgames.com');\n        ga('send', 'pageview');\n\n    </script>\n\n\n    <script src=\"https://www.gstatic.com/firebasejs/5.9.1/firebase.js\"></script>\n\n    <script>\n        // Initialize Firebase\n        var config = {\n            apiKey: \"AIzaSyBqfxiizjd4h5z_HOJ-3aCWy2_hgghfOWo\",\n            authDomain: \"addictingwordgames.firebaseapp.com\",\n            databaseURL: \"https://addictingwordgames.firebaseio.com\",\n            projectId: \"addictingwordgames\",\n            storageBucket: \"addictingwordgames.appspot.com\",\n            messagingSenderId: \"972112451973\"\n        };\n        firebase.initializeApp(config);\n        // User\n        window.has_purchased = false;\n        firebase.auth().onAuthStateChanged(function (user) {\n            if (user) {\n                // User is signed in.\n                window.firebaseUser = user\n                $('#sign-up').hide();\n                $('#log-in').hide();\n                $('#log-out').show();\n\n\n                getUser(user.email, function (userData) {\n                    if (!userData.has_purchased) {\n                        $('#buy').show()\n\n                        // set timeout for prompt to pay\n                        window.setTimeout(payPrompt, 60 * 1000)\n                    } else {\n                        window.has_purchased = true;\n\n                        $('#buy').hide()\n                    }\n                })\n            } else {\n\n                // User is signed out.\n                // set timeout for prompt to pay\n                window.setTimeout(payPrompt, 60 * 1000)\n\n            }\n        }, function (error) {\n            console.log(error);\n        });\n\n        function payPrompt() {\n            if (window.has_purchased) {\n                return false;\n            }\n            var dialog = document.querySelector('dialog');\n            if (!dialog.showModal) {\n                dialogPolyfill.registerDialog(dialog);\n            }\n            dialog.showModal();\n            dialog.querySelector('.closes-modal').addEventListener('click', function () {\n                dialog.close();\n            });\n        window.setTimeout(payPrompt, 60 * 1000)\n\n        }\n\n    </script>\n    <script src=\"https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js\"></script>\n    <link type=\"text/css\" rel=\"stylesheet\"\n          href=\"https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css\"/>\n\n    <script defer src=\"https://code.getmdl.io/1.3.0/material.min.js\"></script>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("headers");
context.setVariable("headers", macro_t_21);
output += "\n\n";
var macro_t_22 = runtime.makeMacro(
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
context.setVariable("templates", macro_t_22);
output += "\n\n";
var macro_t_23 = runtime.makeMacro(
[], 
[], 
function (kwargs) {
frame = frame.push();
kwargs = kwargs || {};
var output= "";
output += "<a class=\"btn btn-large btn-primary load-more\" href=\"#\"\n       onclick=\"loadmore();return false;\"\n       title=\"Load Addicting Word Games!\">Load More...</a>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("loadmorebutton");
context.setVariable("loadmorebutton", macro_t_23);
output += "\n\n";
var macro_t_24 = runtime.makeMacro(
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
output += "\n                <a href=\"/terms\" title=\"Terms &amp; Conditions\">Terms &amp;\n                    Conditions</a>\n            ";
;
}
output += "\n\n            ";
if("/privacy-policy" undefined runtime.contextOrFrameLookup(context, frame, "url")) {
output += "\n                <span>Privacy Policy</span>\n            ";
;
}
else {
output += "\n                <a href=\"/privacy-policy\" title=\"Privacy Policy\">Privacy\n                    Policy</a>\n            ";
;
}
output += "\n\n            <span>© 2013 Addicting Word Games</span>\n            <!-- <a href=\"http://www.facebook.com/addictingwordgames\" title=\"Addicting Word Games on Facebook\" target=\"_blank\">\n            <img src=\"/img/facebook.jpg\" alt=\"Addicting Word Games on Facebook\" width=\"144px\" height=\"44px\">\n        </a> -->\n        </p>\n    </div>\n    <dialog class=\"mdl-dialog\">\n        <h4 class=\"mdl-dialog__title\">Please support us!</h4>\n        <div class=\"mdl-dialog__content\">\n            <p>\n                $1.99 to buy all 694 Addicting Word Games forever + any future\n                releases!\n            </p>\n        </div>\n        <div class=\"mdl-dialog__actions\">\n            <a type=\"button\" class=\"mdl-button mdl-button--colored mdl-button--accent mdl-js-button mdl-js-ripple-effect closes-modal\" href=\"/buy\" target=\"_blank\">Buy Now</a>\n        </div>\n    </dialog>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("footer");
context.setVariable("footer", macro_t_24);
var macro_t_25 = runtime.makeMacro(
["url"], 
[], 
function (l_url, kwargs) {
frame = frame.push();
kwargs = kwargs || {};
frame.set("url", l_url);
var output= "";
output += "\n    <div style=\"height:25px\">\n        <span class=\"fb-like\" data-href=\"";
output += runtime.suppressValue(l_url, env.autoesc);
output += "\" data-send=\"true\"\n              data-width=\"380\" data-show-faces=\"true\"></span>\n    </div>\n    <ul class=\"social-likes\">\n        <li class=\"facebook\" title=\"Share link on Facebook\">Facebook</li>\n        <li class=\"twitter\" title=\"Share link on Twitter\">Twitter</li>\n        <li class=\"pinterest\" title=\"Share image on Pinterest\"\n            data-media=\"";
output += runtime.suppressValue(l_url, env.autoesc);
output += "\">Pinterest\n        </li>\n    </ul>";
frame = frame.pop();
return new runtime.SafeString(output);
});
context.addExport("shareBtnsHorizontal");
context.setVariable("shareBtnsHorizontal", macro_t_25);
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
