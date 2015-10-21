//WebSocket関係

var Chat = {};
var userName = "";

Chat.socket = null;

Chat.connect = (function(host) {
    if ('WebSocket' in window) {
        Chat.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        Chat.socket = new MozWebSocket(host);
    } else {
        console.log('Error: WebSocket is not supported by this browser.,,');
        return;
    }

    Chat.socket.onopen = function () {
        console.log("Info: WebSocket connection opened.,,");
        // document.getElementById('chat').onkeydown = function(event) {
        //     if (event.keyCode == 13) {
        //         Chat.sendMessage();
        //     }
        // };
    };

    Chat.socket.onclose = function () {
        document.getElementById('chat').onkeydown = null;
        console.log('Info: WebSocket closed.');
    };

    Chat.socket.onmessage = function (message) {
        console.log(message.data);
        var data = message.data.split(",");
        if(data[2] === "usercheck"){
            userName = data[1];
            console.log("i am ",userName);
        }else if(data[0] === "reqconnect"){
            //deaf側からビデオチャットのために必要なidが送られてきた時
            //messagedata[0]にidが入っている
            //ただしtextに手動でユーザ名にreqconnectと入力されると誤動作が起きる
            var call = peer.call(messagedata[1], myStream);
        }else{
            //ここで何らかの判断材料を用いて各モードreceiveに渡す
            //TextLogArea.log(message.data);
            STTMode.receive(message.data);
        }
    };
});

Chat.initialize = function() {
    if (window.location.protocol == 'http:') {
        //Chat.connect('ws://' + window.location.host + '/examples/websocket/tc7/chat');
        Chat.connect('ws://192.168.0.120:8080/MMSVService/websocket');
    } else {
        //Chat.connect('wss://' + window.location.host + '/examples/websocket/tc7/chat');
        Chat.connect('wss://192.168.0.120:8443/MMSVService/websocket');
    }
};

Chat.sendMessage = (function() {
    var message = document.getElementById('chat').value;
    if (message != '') {
        Chat.socket.send(message);
        document.getElementById('chat').value = '';
    }
});

Chat.initialize();












