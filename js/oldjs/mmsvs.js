

var $mmsvs = {
    // websocket object
    ws: {
        connect: function(host) {
            var socket = this.socket = null;

            if ('WebSocket' in window) {
                socket = new WebSocket(host);
            } else if ('MozWebSocket' in window) {
                socket = new MozWebSocket(host);
            } else {
                TextLogArea.log('Error: WebSocket is not supported by this browser.,,');
                return;
            }

            socket.onopen = function () {
                TextLogArea.log("Info: WebSocket connection opened.,,");
            };

            socket.onclose = function () {
                TextLogArea.log('Info: WebSocket closed.');
            };

            socket.onmessage = function (message) {
                //TODO: dataの形式をかく
                //data: [, userName, pps_of_message]
                //data: [0:message, 1:user(""はシステム), 2:nullなら通常メッセージで"usercheck"なら認証用]
                var data = message.data.split(",");
                if (data[2] === "usercheck") {
                    userName = data[1];
                } else {
                    TextLogArea.log(message.data);
                }
            };
        },

        initialize: function() {
            var loc = window.location;
            var dirs = window.location.pathname.match(/.*\//)[0];
            var ws_uri = "";
            if (loc.protocol === "https:") {
                ws_uri = "wss:";
            } else {
                ws_uri = "ws:";
            }
            ws_uri += "//" + loc.host + dirs + "websocket";
            this.connect(ws_uri);
        },
/*
        sendMessage: function() {
            //var message = document.getElementById('chat').value;
            var message = $('#chat').value;
            if (message !== '') {
                Chat.socket.send(message);
                document.getElementById('chat').value = '';
            }
        },
*/
    }, //TODO
    userName: "",
    initialize: function() {
        this.ws.initialize();
    },

};


//WebSocket関係
var Chat = {};
var userName = "";


Chat.socket = null;
/*
Chat.connect = function(host) {
    if ('WebSocket' in window) {
        Chat.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        Chat.socket = new MozWebSocket(host);
    } else {
        TextLogArea.log('Error: WebSocket is not supported by this browser.,,');
        return;
    }

    Chat.socket.onopen = function () {
        TextLogArea.log("Info: WebSocket connection opened.,,");
    };

    Chat.socket.onclose = function () {
        TextLogArea.log('Info: WebSocket closed.');
    };

    Chat.socket.onmessage = function (message) {
        //TODO: dataの形式をかく
        //data: [, userName, pps_of_message]
        //data: [0:message, 1:user(""はシステム), 2:nullなら通常メッセージで"usercheck"なら認証用]
        var data = message.data.split(",");
        if(data[2] === "usercheck"){
            userName = data[1];
            //console.log("i am ",userName);
        }else
        TextLogArea.log(message.data);
    };
};
Chat.initialize = function() {
    if (window.location.protocol == 'http:') {
        //Chat.connect('ws://' + window.location.host + '/examples/websocket/tc7/chat');
        Chat.connect('ws://192.168.0.120:8080/MMSVService/websocket');
    } else {
        //Chat.connect('wss://' + window.location.host + '/examples/websocket/tc7/chat');
        Chat.connect('wss://192.168.0.120:8443/MMSVService/websocket');
    }
};

Chat.sendMessage = function() {
    var message = document.getElementById('chat').value;
    if (message != '') {
        Chat.socket.send(message);
        document.getElementById('chat').value = '';
    }
};

*/


//TextLogArea 発言内容を表示
var TextLogArea = {};

TextLogArea.log = (function(message) {
    console.log(message);
    //0:message 1:user (""はシステム) 2:nullなら通常メッセージ，"usercheck"なら認証用
    var messagedata = message.split(",");
    console.log("0:"+messagedata[0]+" 1:"+messagedata[1]+" 2:"+messagedata[2])
    if(messagedata[0] === "reqconnect"){
        //deaf側からビデオチャットのために必要なidが送られてきた時
        //messagedata[0]にidが入っている
        //ただしtextに手動でユーザ名にreqconnectと入力されると誤動作が起きる
        //var call = peer.call(messagedata[1], myStream);
    }else{
        var TextLog = document.getElementById('console');
        var pForMessage = document.createElement('p');
        pForMessage.style.wordWrap = 'break-word';
        pForMessage.innerHTML = messagedata[0];

        var pForUsername = document.createElement('p');
        pForUsername.style.wordWrap = 'break-word';
        pForUsername.innerHTML = messagedata[1];
        //p.innerHTML = message;

        var div = document.createElement('div');
        var wrapdiv = document.createElement('div');

        console.log("user is ",messagedata[1]);

        if(messagedata[1] === ""){
            //システムからのメッセージの場合
            //吹き出し生成
            div.setAttribute("class","balloon balloon-elip");
            //それを中央寄りにする
            wrapdiv.setAttribute("class","wrap-center");
        }else if(messagedata[1] === userName){
            //自分からのメッセージの場合
            div.setAttribute("class","balloon balloon-2-right");
            wrapdiv.setAttribute("class","wrap-right");
        }else{
            //自分以外の発言者からのメッセージの場合
            //TODO: usernameを表示
            div.setAttribute("class","balloon balloon-1-left");
            wrapdiv.setAttribute("class","wrap-left");
        }
        div.appendChild(pForMessage);

        wrapdiv.appendChild(pForUsername);
        wrapdiv.appendChild(div);

        TextLog.appendChild(wrapdiv);
        while (TextLog.childNodes.length > 25) {
            TextLog.removeChild(TextLog.firstChild);
        }
        TextLog.scrollTop = TextLog.scrollHeight;
    }
});

// Chat.initialize();










//Google Speech API

if (!('webkitSpeechRecognition' in window))
    TextLogArea.log("Sorry. Web Speech API is not supported by this browser.(STT)");
if (!('speechSynthesis' in window))
    TextLogArea.log("Sorry. Web Speech API is not supported by this browser.(TTS)");

var recognition = new webkitSpeechRecognition();
recognition.lang = "ja-JP";

// 継続的に処理を行い、不確かな情報も取得可能とする.
recognition.continuous = true;
recognition.interimResults = true;

var nowRecognition = false;

function startRecognition() {

    recognition.start();
    nowRecognition = true;
    //setBut //自分からのメッセージの場合tonForStop()
};

function stopRecognition() {
    recognition.stop();
    nowRecognition = false;
    //setButtonForPlay()
};

//これはなんのため？
recognition.onaudioend = function() {
   recognition.stop();
     //setButtonForPlay()
 };


 recognition.onresult = function(event) {
    var results = event.results;
    for (var i = event.resultIndex; i < results.length; i++) {
        if (results[i].isFinal) {
            var message = results[i][0].transcript;
            if (message != '') {
                Chat.socket.send(message);
            }
        }
    }
};


// ボタンアクションの定義
// document.getElementById("#spkbtn").onclick = function () {
//     // unsupported.
//     if (!'webkitSpeechRecognition' in window) {
//         alert('Web Speech API には未対応です.');
//         return;
//     }
//     if (nowRecognition) {
//         stopRecognition();
//         this.value = '音声認識を継続的に行う';
//         this.className = '';
//     } else {
//         startRecognition();
//         this.value = '音声認識を止める';
//         this.className = 'select';
//     }
// }







//WebRTC

// ベンダプレフィックスの差を吸収する
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

//var myStream;
var peer = new Peer({
    key: 'j4bezk4tb2xfxbt9',    //公開するときは隠蔽すべき？
    debug: 3    //デバッグモード
}); // PeerJSのサイトで取得したAPI keyを設定

//相手の映像を描画？
//ここをうまいこと書いてpeer.on('open',...)の中を少なくしたい
var setOthersStream = function(stream){
    $('#speaker1-video').prop('src', URL.createObjectURL(stream));
};

peer.on('open', function(id){
    $('#peer-id').text(id);
    myId = id;
    console.log("id is ",id);
});

peer.on('call', function(call){

    navigator.getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function(remoteStream) {
        // Show stream in some video/canvas element.
    });
    }, function(err) {
        console.log('Failed to get local stream' ,err);
    });


    console.log("opened");
    // Hang up on an existing call if present
    if (window.existingCall) {
        if(window.existingCall2){
            //2個つながってるとき
            //2個目を切断して新しい接続を確立
            console.log("2 connections");
            console.log("peer: "+call.peer);
            window.existingCall2.close();
            call.on('stream', function(stream) {
                $('#speaker2-video').prop('src', URL.createObjectURL(stream));
            });
            window.existingCall2 = call;
        }else{
            //1個しかつながってないとき
            console.log("1 connection");
            console.log("peer: "+call.peer);
            call.on('stream', function(stream) {
                $('#speaker2-video').prop('src', URL.createObjectURL(stream));
            });
            window.existingCall2 = call;
        }
    }else{
        //1個もつながってないとき
        console.log("0 connection");
        console.log("peer: "+call.peer);
        call.on('stream', function(stream) {
            $('#speaker1-video').prop('src', URL.createObjectURL(stream));
        });
        window.existingCall = call;
    }
});

//fordeafではカメラの認証いらないから消したい
//けど消すと動かない，謎
// $(function(){
//     navigator.getUserMedia({
//         audio: false,
//         video: true
//     },
//     function(){},
//     function(){
//         console.log("video miss! ");
//     });
// });


// $(function(){
//     navigator.getUserMedia({audio: false, video: false}, function(){}, function(){
//         console.log("video miss! ");
// });
// }


// $('#call').on('click', function(){
//       var call = peer.call($('#others-peer-id').val(), myStream);
//       call.on('stream', setOthersStream);
//     });
// });

peer.on('error', function(e){
console.log("error: ",e.message);
});

//websocket経由でspeakerに自分のIDを送ることでwebRTC経由でビデオ映像を取得する
function reqConnect() {
    Chat.socket.send('reqconnect,' + myId);
    $('#connectBtn').hide();
}

function getDetail() {
    var unknownWord = document.getSelection();
    console.log("selected word is "+unknownWord);
    console.log("selected word range count is "+unknownWord.rangeCount);
    if(unknownWord.rangeCount > 0){
        console.log("selected word is "+unknownWord);
        var wikiurl = 'http://ja.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&rawcontinue=continue&titles=' + unknownWord;
        var detail;
        $.ajax({
            type: "get",
            dataType: "jsonp",
            url: wikiurl,
            success: function(json) {
                var jsonString = json.query.pages;
                for (var first in jsonString) break;
                    console.log("json is ",jsonString[first].extract);
                //detail = jsonString[first].extract;
                $('#detail-area').text(jsonString[first].extract);
            }
        });
    }else{
        $('#detail-area').text("no word is selected.");
    }

}
