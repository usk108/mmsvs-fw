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
        console.log('Error: WebSocket is not supported by this browser.,,system_message');
        return;
    }

    Chat.socket.onopen = function () {
        console.log("Info: WebSocket connection opened.,,system_message");
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
            FW.userID = data[1];
            userName = data[1];
            console.log("i am ",userName);
        }else if(data[2] === "system_message"){
            //システムメッセージをコンソールに吐く
            console.log(data[0]);
        }else{
            //ここで何らかの判断材料を用いて各モードreceiveに渡す
            //TextLogArea.log(message.data);
            //STTMode.receive(message.data);
            console.log('receive in ws.js');
            FW.receive(message.data);
        }
    };
});

Chat.initialize = function() {
    if (window.location.protocol == 'http:') {
        //Chat.connect('ws://' + window.location.host + '/examples/websocket/tc7/chat');
        Chat.connect('ws://192.168.0.120:8080/MMSVS/websocket');
    } else {
        //Chat.connect('wss://' + window.location.host + '/examples/websocket/tc7/chat');
        Chat.connect('wss://192.168.0.120:8443/MMSVS/websocket');
    }
};

Chat.sendMessage = (function() {
    var message = document.getElementById('chat').value;
    if (message != '') {
        Chat.socket.send(message);
    }
});

Chat.initialize();
