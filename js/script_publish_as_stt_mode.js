// モーダルの定義の仕方
var mode_script_publish_as_stt = {
	// モード名
	name: 'script_publish_as_stt',
	// モード名(日本語)
	nameJapanese: '実験用スクリプト配信モード',
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
		var self = this;

		this.attachEvents();
		this.arrangeView();

		// ユーザーがいるように見せる
		var users = ['someone', 'toba', 'toba2', 'shin'];
		for(var i = 0; i < users.length; i++){
			FW.sendObjectToAll("user_register", users[i]);
		}

		var raw_sentences = "toba,勉強会をやろうと思うんですが，どう思いますか？\n" +
			"shin,私は賛成です．\n" +
			"toba2,僕は反対ですね．\n" +
			"toba,excelを使ったことがありますか？\n" +
			"shin,はい、あります。\n";
		var sentences = raw_sentences.split("\n");

		for(var i = 0; i < 5; i++){
			var sentence = sentences[i].split(",");
			var speaker = sentence[0];
			var script = sentence[1];

			var s = $('<span>')
				.html(speaker);

			var p = $('<p>')
				.attr('style','word-wrap: break-word;')
				.html(script);

			//type="button" id="add_mode_stt_cloud" class="btn btn-primary"
			var btn = $('<button>')
				.attr('type','button')
				.attr('class','btn btn-info')
				.html("配信");

			var script_container = $('<div>')
				.attr('class', 'script-container')
				.append(s)
				.append(p)
				.append(btn);

			btn.click(function (){
				var script_to_send = $(this).parent().children("p").html();
				console.log(script_to_send);

				var message_body = {
					recognitionId: new Date().getTime(),
					text: script_to_send,
					confidence: 1.0,
					isFinal: true
				};

				var script_message = {
					userName: $(this).parent().children("span").html(),
					mode: mode_stt_cloud.name,
					body: JSON.stringify(message_body)
				};
				self.sendToAll(script_message);
			});

			$('#scripts-container').append(script_container);
		}

		console.log('initialized');
	},
	attachEvents : function() {
	},

	run : function() {
	},

	stop : function() {
	},

	receive : function(message, userName) {
	},

	sendToAll : function(message) {
		// /MMSVS/websocketへ
		console.log('sent to all from stt mode');
		FW.sendToAll(message);
		console.log('sending' + message);
	},
	arrangeView: function(){
		console.log('xmodal: arrange view');
		var scripts_container = $('<div>')
			.attr('id', 'scripts-container');

		$('.main_view', this.view).append(scripts_container);
	}
};
