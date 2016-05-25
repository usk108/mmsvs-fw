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
		this.arrangeView();

		console.log('initialized');
	},
	attachEvents : function() {
		var self = this;
		//これはなんのため？
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
		            }
		        }
		    }
		};
		console.log('attached');
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
		FW.sendToAll(this.name, message);
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
