

// モーダルの定義の仕方
var mode_stt_cloud = {
	// モード名
	name: 'stt_cloud',
	// モード名(日本語)
	nameJapanese: '音声認識チャットモード',
	// 割り当てられたhtml
	view: null,
	// モード追加時に外部から与えられるモードの設定
	config: null,
	// 外部から変更できないモードの設定情報
	stable_config: {
		view: {
			width: 560,	//画面の横幅
			height: 300 	//画面の縦幅
		},
		btn: {
			needRun:true ,	//Runボタンが必要か
			needStop:true 	//Stopボタンが必要か
		}
	},

	//独自フィールド
	output_area : null,
	recognition : null,
	nowRecognition : false,
	rec: null,
	// WebSocketオブジェクト
	webSocket: null,

	init : function(modeconfig) {
		var self = this;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

		function callback(stream) {
			console.log("in callback of stt_cloud");
			var context = new webkitAudioContext();
			console.log(context.sampleRate);
			context.sampleRate = 16000;
			var mediaStreamSource = context.createMediaStreamSource(stream);
			console.log(mediaStreamSource);
			// rec_config = {
			// 	sampleRate: 16000
			// }
			self.rec = new Recorder(mediaStreamSource);
		}


		console.log("in initialization of stt_cloud");
		// ブラウザにより異なるAPIをそれぞれ統一

		navigator.getUserMedia({audio:true}, callback, function(){});


		// 接続先URI
		var uri = '';
		if (window.location.protocol == 'http:') {
			uri = 'ws://192.168.0.120:8080/CloudSpeechService/cloudspeech';
		} else {
			uri = 'wss://192.168.0.120:8443/CloudSpeechService/cloudspeech';
		}

		// WebSocket の初期化
		this.webSocket = new WebSocket(uri);
		// イベントハンドラの設定
		this.webSocket.onopen = onOpen;
		this.webSocket.onmessage = onMessage;
		this.webSocket.onclose = onClose;
		this.webSocket.onerror = onError;

		// 接続イベント
		function onOpen(event) {
			console.log("接続しました。");
		}

		// メッセージ受信イベント
		function onMessage(event) {
			if (event && event.data) {
				console.log(event.data);
			}
		}

		// エラーイベント
		function onError(event) {
			//console.log("エラーが発生しました。");
		}

		// 切断イベント
		function onClose(event) {
			console.log("切断しました。3秒後に再接続します。(" + event.code + ")");
			this.webSocket = null;
			setTimeout("open()", 3000);
		}

		console.log('initialized');
	},
	attachEvents : function() {
		// var self = this;
		// //これはなんのため？
		// this.recognition.onaudioend = function() {
		//     self.recognition.stop();
		//     //setButtonForPlay()
		// };
        //
		// this.recognition.onresult = function(event) {
         //    console.log('result is ...');
		//     var results = event.results;
		//     for (var i = event.resultIndex; i < results.length; i++) {
		//         if (results[i].isFinal) {
		//             var message = results[i][0].transcript;
		//             if (message != '') {
		//                 //Chat.socket.send(message);
		//                 self.sendToAll(message);
		//             }
		//         }
		//     }
		// };
		// console.log('attached');
	},

	run : function() {
		var self = this;

		this.rec.record();
		this.sendToAll("start");
		console.log("start!!");

		// export a wav every second, so we can send it using websockets
		intervalKey = setInterval(function() {
			self.rec.exportWAV(function(blob) {
				// self.rec.clear();
				console.log(blob);
				self.sendToAll(blob);
				self.rec.clear();
			});
		}, 100);
	},

	stop : function() {
		// first send the stop command
		var self = this;
		this.rec.exportWAV(function(blob) {
			// Recorder.forceDownload(blob);
			// exportWAVのヘッダー部分をコメントアウトすればよいっぽい？
			// Recorder.forceDownload(blob,"output.raw");
			console.log(blob);
			// self.sendToAll(blob);
			self.rec.clear();
		});

		this.rec.stop();
		this.sendToAll("stop");

		// this.webSocket = null;

		clearInterval(intervalKey);
		// this.sendToAll("analyze");
		// $("#message").text("");

	    // this.recognition.stop();
	    // this.nowRecognition = false;
	},

	receive : function(message, userName) {
		console.log('receive in stt');
		console.log('message: ' + message + ' userName: ' + userName);
		console.log(this.nowRecognition);

		var textLog = $('#console');
		var p = $('<p>').attr('style','word-wrap: break-word;').html(message);
		var div = $('<div>');
		var wrapdiv = $('<div>');

		if(userName === FW.userID){
			//吹き出し生成
			div.attr('class','balloon balloon-2-right');
			//それを中央寄りにする
			wrapdiv.attr('class','wrap-right');
		}else{
			div.attr('class','balloon balloon-1-left');
			wrapdiv.attr('class','wrap-left');
		}
		div.append(p);
		wrapdiv.append(div);
		textLog.append(wrapdiv);

		while (textLog.children().length > 25) {
			textLog.children().first().remove();
		}
		textLog.scroll(textLog.prop('scrollHeight'));
	},
	sendToAll : function(message) {
		//todo:
		console.log('sent to all from stt mode');
		this.webSocket.send(message);
		// FW.sendObjectToAll(this.name, message);
		//Chat.socket.send(message);
		console.log('sending' + message);
	},
	arrangeView: function(){
		console.log('xmodal: arrange view');
		var text_console = $('<div>')
		.attr('id', 'console-container')
		.append($('<div>').attr('id', 'console'));

		$('.main_view', this.view).append(text_console);
	}
};
