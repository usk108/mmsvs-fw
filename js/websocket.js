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
        console.log('Info: WebSocket closed.');
    };

    Chat.socket.onmessage = function (message) {
        console.log(message.data);
        var data = JSON.parse(message.data);
        FW.receive(data);
    };
});

Chat.initialize = function() {
    var ipAddress = "192.168.0.140:";
    // var ipAddress = "192.168.50.4:";
    var path = "/MMSVS/websocket";
    if (window.location.protocol == 'http:') {
        //Chat.connect('ws://' + window.location.host + '/examples/websocket/tc7/chat');
        Chat.connect('ws://' + ipAddress + "8080" + path);
    } else {
        //Chat.connect('wss://' + window.location.host + '/examples/websocket/tc7/chat');
        Chat.connect('wss://' + ipAddress + "443" + path);
    }
};

Chat.initialize();
