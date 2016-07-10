

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
		},
		btn_name: {
			run: '認識開始'
		}
	},

	//独自フィールド
	output_area : null,
	recognition : null,
	nowRecognition : false,
	rec: null,
	// WebSocketオブジェクト
	webSocket: null,

	//デバッグ用
	current: 0,
	previous: 0,

	init : function(modeconfig) {
		var self = this;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

		function callback(stream) {
			console.log("in callback of stt_cloud");
			var context = new window.AudioContext();
			console.log(context.sampleRate);
			var mediaStreamSource = context.createMediaStreamSource(stream);
			console.log(mediaStreamSource);
			self.rec = new Recorder(mediaStreamSource);
		}

		console.log("in initialization of stt_cloud");
		// ブラウザにより異なるAPIをそれぞれ統一

		navigator.getUserMedia({audio:true}, callback, function(){});


		// 接続先URI
		var uri = '';
		// var ipAddress = "192.168.0.140:";
		var ipAddress = "192.168.50.4:";
		var path = "/MMSVS/cloudspeech";
		if (window.location.protocol == 'http:') {
			uri = 'ws://' + ipAddress + '8080' + path;
		} else {
			uri = 'wss://' + ipAddress + '443' + path;
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

			var first_message = {
				userName: FW.userID,
				mode: self.name,
				body: "user_sync"
			};
			self.sendToAPI(JSON.stringify(first_message));
		}

		// メッセージ受信イベント
		function onMessage(event) {
			if (event && event.data) {
				console.log(event.data);
				var data = JSON.parse(event.data);

				//TODO: ユーザー情報をMMSVSに一元化
				if(data.type == "usercheck"){
					console.log("user check now...");
					console.log(FW.userId);
					FW.userID = data.userName;
					console.log(FW.userId);
					return;
				}

				if(data.type == "notify"){
					//必要であればコンソール上にメッセージを表示する
					console.log(data.body);
					return;
				}

				console.log('body: ' + data.body + ' userName: ' + data.userName);

				// if(document.getElementById(data.body.recognitionId) != null){
				// 	$('#'+data.body.recognitionId).html(data.body.text);
				// 	return;
				// }

				self.makeFukidashi(data);
                //
				// var textLog = $('#console');
				// var p = $('<p>').attr('style','word-wrap: break-word;').attr('id', data.body.recognitionId).html(data.body.text);
				// var div_chat = $('<div>');
				// var div_hukidashi = $('<div>');
				// var wrapdiv = $('<div>');
                //
				// console.log("userName is " + data.userName);
				// console.log("FW.userID is " + FW.userID);
                //
				// if(data.userName === FW.userID){
				// 	console.log("i'm speaking");
				// 	//吹き出し生成
				// 	div_chat.attr('class','chat-area');
				// 	div_hukidashi.attr('class','chat-my-hukidashi');
				// 	//それを中央寄りにする
				// 	wrapdiv.attr('class','wrap-right');
				// 	div_hukidashi.append(p);
				// 	div_chat.append(div_hukidashi);
				// 	wrapdiv.append(div_chat);
				// }else{
				// 	console.log("someone is speaking");
				// 	var div_face = $('<div>').attr('class', 'chat-face');
                //
				// 	var img_url = './assets/images/tmp/hatena.jpg';
				// 	if(data.userName in FW.user_img){
				// 		img_url = FW.user_img[data.userName];
				// 	}
                //
				// 	var img_face = $('<img>')
				// 		.attr('width', '60')
				// 		.attr('height', '60')
				// 		.attr('src', img_url);
                //
				// 	div_chat.attr('class','chat-area');
				// 	div_hukidashi.attr('class','chat-hukidashi someone');
				// 	wrapdiv.attr('class','wrap-left');
				// 	div_hukidashi.append(p);
				// 	div_chat.append(div_hukidashi);
				// 	div_face.append(img_face);
				// 	wrapdiv.append(div_face).append(div_chat);
				// }
                //
				// textLog.append(wrapdiv);
                //
				// while (textLog.children().length > 25) {
				// 	textLog.children().first().remove();
				// }
				// textLog.scroll(textLog.prop('scrollHeight'));
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

		this.arrangeView();

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
		//                 self.sendToAPI(message);
		//             }
		//         }
		//     }
		// };
		// console.log('attached');
	},

	run : function() {
		var self = this;

		this.rec.record();

		var start_message = {
			userName: FW.userID,
			mode: this.name,
			body: "start"
		};
		this.sendToAPI(JSON.stringify(start_message));

		console.log("start!!");

		// export a wav every second, so we can send it using websockets
		intervalKey = setInterval(function() {
			self.current = new Date().getTime();
			console.log(self.current + " msec has passed.");
			console.log((self.current - self.previous) + " msec has passed.");
			self.previous = self.current;
			self.rec.exportWAV(function(blob) {
				// self.rec.clear();
				// console.log(blob);
				self.sendToAPI(blob);
				self.rec.clear();
			});
		}, 100);
	},

	stop : function() {
		// first send the stop command
		var self = this;
		this.rec.exportWAV(function(blob) {
			// Recorder.forceDownload(blob,"output.raw");
			// console.log(blob);
			self.sendToAPI(blob);
			self.rec.clear();
		});

		this.rec.stop();


		var stop_message = {
			userName: FW.userID,
			mode: this.name,
			body: "stop"
		};
		this.sendToAPI(JSON.stringify(stop_message));

		clearInterval(intervalKey);
	},

	//stt cloud modeは音声認識とweb socketでのbloadcastを同時にやってるので，このメソッドは使わない
	receive : function(message) {
		message.body = JSON.parse(message.body);
		this.makeFukidashi(message);
	},

	//stt cloud modeは音声認識とweb socketでのbloadcastを同時にやってるので，このメソッドは使わない
	sendToAPI : function(message) {
		// /MMSVS/cloudspeechへ
		//todo:
		console.log('sent to api from stt mode');
		this.webSocket.send(message);
		// FW.sendObjectToAll(this.name, message);
		//Chat.socket.send(message);
		console.log('sending' + message);
	},

	//本来は使わなくてよいメソッドだが，決め打ちスクリプト配信用に使用する
	sendToAll : function(message) {
		// /MMSVS/websocketへ
		console.log('sent to all from stt mode');
		FW.sendToAll(message);
		console.log('sending' + message);
	},

	arrangeView: function(){
		console.log('xmodal: arrange view');
		var text_console = $('<div>')
            .attr('id', 'console-container')
            .append($('<div>').attr('id', 'console'));

		$('.main_view', this.view).append(text_console);
	},
	makeFukidashi: function(data){
		if(document.getElementById(data.body.recognitionId) != null){
			$('#'+data.body.recognitionId).html(data.body.text);
			$('#console').animate({scrollTop: $('#console')[0].scrollHeight}, 'fast');
			return;
		}

		var textLog = $('#console');
		var p = $('<p>').attr('style','word-wrap: break-word;').attr('id', data.body.recognitionId).html(data.body.text);
		var div_chat = $('<div>');
		var div_hukidashi = $('<div>');
		var wrapdiv = $('<div>');

		console.log("userName is " + data.userName);
		console.log("FW.userID is " + FW.userID);

		if(data.userName === FW.userID){
			console.log("i'm speaking");
			//吹き出し生成
			div_chat.attr('class','chat-area');
			div_hukidashi.attr('class','chat-my-hukidashi');
			//それを中央寄りにする
			wrapdiv.attr('class','wrap-right');
			div_hukidashi.append(p);
			div_chat.append(div_hukidashi);
			wrapdiv.append(div_chat);
		}else{
			console.log("someone is speaking");
			var div_face = $('<div>').attr('class', 'chat-face');

			var img_url = './assets/images/tmp/hatena.jpg';
			if(data.userName in FW.user_img){
				img_url = FW.user_img[data.userName];
			}

			var img_face = $('<img>')
				.attr('width', '60')
				.attr('height', '60')
				.attr('src', img_url);

			div_chat.attr('class','chat-area');
			div_hukidashi.attr('class','chat-hukidashi someone');
			wrapdiv.attr('class','wrap-left');
			div_hukidashi.append(p);
			div_chat.append(div_hukidashi);
			div_face.append(img_face);
			wrapdiv.append(div_face).append(div_chat);
		}

		textLog.append(wrapdiv);

		// while (textLog.children().length > 25) {
		// 	textLog.children().first().remove();
		// }

		textLog.scroll(textLog.prop('scrollHeight'));
		$('#console').animate({scrollTop: $('#console')[0].scrollHeight}, 'fast');
	}

};
