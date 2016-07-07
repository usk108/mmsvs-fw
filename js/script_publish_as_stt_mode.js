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


	scripts : {},
	//シナリオごとの発言数
	script_num : {
		"a1":12,
		"a2":17,
		"a3":11,
		"b1":12,
		"b2":12,
		"b3":8
	},

	init : function(modeconfig) {
		var self = this;

		this.attachEvents();
		this.arrangeView();

		// ユーザーがいるように見せる
		var users = ['someone', 'toba', 'toba2', 'shin'];
		for(var i = 0; i < users.length; i++){
			FW.sendObjectToAll("user_register", users[i]);
		}

		this.getRecognizedScriptCSV("a1");
		this.getIdealScriptCSV("a1");
		this.getRecognizedScriptCSV("a2");
		this.getIdealScriptCSV("a2");
		this.getRecognizedScriptCSV("a3");
		this.getIdealScriptCSV("a3");
		this.getRecognizedScriptCSV("b1");
		this.getIdealScriptCSV("b1");
		this.getRecognizedScriptCSV("b2");
		this.getIdealScriptCSV("b2");
		this.getRecognizedScriptCSV("b3");
		this.getIdealScriptCSV("b3");

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
	},

	getRecognizedScriptCSV: function(filename){
		var self = this;
		var req = [];
		this.scripts[filename] = {};

		var i;

		for(i = 0; i < self.script_num[filename]; i++){
			console.log(filename + '/' + i + ' is loading.');
			req[i] = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
			req[i].open("get", './assets/recognized_scripts/' + filename + '/' + i + '.csv', true); // アクセスするファイルを指定
			req[i].send(null); // HTTPリクエストの発行

			req[i].onload = self.createCallback(filename, i, req[i]);
		}
	},
	setRecognizedScripts: function(csv, filename, sentenceId){
		console.log(filename + '/' + sentenceId + ' is loaded.');
		var self = this;

		this.scripts[filename][sentenceId] = []; // 最終的な二次元配列を入れるための配列
		var tmp = csv.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

		for(var i = 0; i < tmp.length; ++i){
			self.scripts[filename][sentenceId][i] = tmp[i].split(',');
		}
	},
	createCallback: function(filename, i, req){
		var self = this;
		return function(){
			console.log(filename + '/' + i + ' is loaded.');
			self.setRecognizedScripts(req.responseText, filename, i); // 渡されるのは読み込んだCSVデータ
		}
	},
	getIdealScriptCSV: function(filename){
		var self = this;
		var req = [];
		this.scripts[filename] = {};

		var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
		req.open("get", './assets/ideal_scripts/' + filename + '.csv', true); // アクセスするファイルを指定
		req.send(null); // HTTPリクエストの発行

		// レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
		req.onload = function(){
			self.showScripts(req.responseText, filename); // 渡されるのは読み込んだCSVデータ
		}
	},
	showScripts: function(csv, filename){
		var self = this;

		var sentences = csv.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

		//i はsentenc
		for(var sentence_number = 0; sentence_number < sentences.length; ++sentence_number){
			var sentence = sentences[sentence_number].split(",");
			var speaker = sentence[1];
			var script = sentence[2];

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

			btn.click(
				self.createBtnClickCallback(filename, speaker, sentence_number)
			);

			$('#scripts-container').append(script_container);
		}
	},
	publishScript: function(speaker, recognitionId, script){
		console.log(script);

		var message_body = {
			recognitionId: recognitionId,
			text: script,
			confidence: 1.0,
			isFinal: true
		};

		var script_message = {
			userName: speaker,
			mode: mode_stt_cloud.name,
			body: JSON.stringify(message_body)
		};
		this.sendToAll(script_message);
	},
	createBtnClickCallback: function(filename, speaker, sentence_number){
		var self = this;
		return function (){
			for(var recognition_number = 0; recognition_number < self.scripts[filename][sentence_number].length; recognition_number++){
				window.setTimeout(
					self.createPublishScriptCallback,
					self.scripts[filename][sentence_number][recognition_number][2],
					speaker, filename, sentence_number, recognition_number
				);
			}
		}

	},
	createPublishScriptCallback: function(speaker, filename, sentence_number, recognition_number){
		var self = mode_script_publish_as_stt;
		return self.publishScript(
			speaker,
			self.scripts[filename][sentence_number][recognition_number][0],
			self.scripts[filename][sentence_number][recognition_number][1]
		)
	}

};
