// モーダルの定義の仕方
var STTMode = {
	output_area : null,
	control_bar : null,
	recognition : null,
	nowRecognition : false,

	init : function(modeconfig) {
		if (!('webkitSpeechRecognition' in window))
		    TextLogArea.log("Sorry. Web Speech API is not supported by this browser.(STT)");
		if (!('speechSynthesis' in window))
		    TextLogArea.log("Sorry. Web Speech API is not supported by this browser.(TTS)");

		this.recognition = new webkitSpeechRecognition();
		this.recognition.lang = "ja-JP";

		// 継続的に処理を行い、不確かな情報も取得可能とする.
		this.recognition.continuous = true;
		this.recognition.interimResults = true;

		//初期値falseだけど念のため明示的にfalseにする
		this.nowRecognition = false;


		this.attachEvents();

		console.log('initialized');
	},

	attachEvents : function() {
		//これはなんのため？
		var self = this;
		this.recognition.onaudioend = function() {
		   self.recognition.stop();
		     //setButtonForPlay()
		 };

		this.recognition.onresult = function(event) {
            console.log('result is ...');
		    var results = event.results;
		    for (var i = event.resultIndex; i < results.length; i++) {
		        if (results[i].isFinal) {
		            var message = results[i][0].transcript;
		            if (message != '') {
		                //Chat.socket.send(message);
		                self.sendToAll(message);
		                console.log(message);
		            }
		        }
		    }
		};
		console.log('attached');
	},

	finalize : function() {
		//このモードの終了？

	},

	run : function() {
		console.log('start recognition');
	    this.recognition.start();
	    this.nowRecognition = true;
	},

	stop : function() {
	    this.recognition.stop();
	    this.nowRecognition = false;
	},

	receive : function(message) {
	    if(this.nowRecognition == false){
			return;
	    }

		//TODO: これやらなくていいようにする
	    var messagedata = message.split(",");


        var TextLog = document.getElementById('console');
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.innerHTML = messagedata[0];
        //p.innerHTML = message;

        var div = document.createElement('div');
        var wrapdiv = document.createElement('div');

        console.log("user is ",messagedata[1]);


        if(messagedata[1] === ""){
            //吹き出し生成
            div.setAttribute("class","balloon balloon-elip");
            //それを中央寄りにする
            wrapdiv.setAttribute("class","wrap-center");
        }else if(messagedata[1] === userName){
            div.setAttribute("class","balloon balloon-2-right");
            wrapdiv.setAttribute("class","wrap-right");
        }else{
            div.setAttribute("class","balloon balloon-1-left");
            wrapdiv.setAttribute("class","wrap-left");
        }
        div.appendChild(p);

        wrapdiv.appendChild(div);

        // TextLogArea.appendChild(p);
        //TextLog.appendChild(div);
        TextLog.appendChild(wrapdiv);
        while (TextLog.childNodes.length > 25) {
            TextLog.removeChild(TextLog.firstChild);
        }
        TextLog.scrollTop = TextLog.scrollHeight;

	},

	sendToAll : function(message) {
		Chat.socket.send(message);
		console.log('sending' + message);
	}

};





// var TextLogArea = {};

// TextLogArea.log = (function(message) {
//     console.log(message);
//     //0:message 1:user (""はシステム) 2:nullなら通常メッセージ，"usercheck"なら認証用
//     var messagedata = message.split(",");

//     console.log("0:"+messagedata[0]+" 1:"+messagedata[1]+" 2:"+messagedata[2])
//     if(messagedata[0] === "reqconnect"){
//         //deaf側からビデオチャットのために必要なidが送られてきた時
//         //messagedata[0]にidが入っている
//         //ただしtextに手動でユーザ名にreqconnectと入力されると誤動作が起きる
//         var call = peer.call(messagedata[1], myStream);
//     }else{
//         var TextLog = document.getElementById('console');
//         var p = document.createElement('p');
//         p.style.wordWrap = 'break-word';
//         p.innerHTML = messagedata[0];
//         //p.innerHTML = message;

//         var div = document.createElement('div');
//         var wrapdiv = document.createElement('div');

//         console.log("user is ",messagedata[1]);


//         if(messagedata[1] === ""){
//             //吹き出し生成
//             div.setAttribute("class","balloon balloon-elip");
//             //それを中央寄りにする
//             wrapdiv.setAttribute("class","wrap-center");
//         }else if(messagedata[1] === userName){
//             div.setAttribute("class","balloon balloon-2-right");
//             wrapdiv.setAttribute("class","wrap-right");
//         }else{
//             div.setAttribute("class","balloon balloon-1-left");
//             wrapdiv.setAttribute("class","wrap-left");
//         }
//         div.appendChild(p);

//         wrapdiv.appendChild(div);

//         // TextLogArea.appendChild(p);
//         //TextLog.appendChild(div);
//         TextLog.appendChild(wrapdiv);
//         while (TextLog.childNodes.length > 25) {
//             TextLog.removeChild(TextLog.firstChild);
//         }
//         TextLog.scrollTop = TextLog.scrollHeight;
//     }

// });