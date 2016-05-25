////////////////////////
// 開発者が作ったプラグインのテンプレ
var xModal = {
	// モード名
	name: 'xModal',
	// 割り当てられたhtml
	view: null,
	// モード追加時に外部から与えられるモードの設定
	config: null,
	// 外部から変更できないモードの設定情報
	stable_config: {
		view: {
			width: 100,		//画面の横幅
			height: 100		//画面の縦幅
		},
		btn: {
			needRun:true ,	//Runボタンが必要か
			needStop:false	//Stopボタンが必要か
		}
	},
	state: 'waiting',
	// 初期処理
	init: function(){
		console.log('xmodal: init');
	},
	// メイン処理
	run: function(){
		console.log('xmodal: run');
		this.view.text(Math.random());
	},
	// メイン処理の停止処理
	stop: function(){
		console.log('xmodal: stop');
		this.view.text('　');
	},
	// モード独自のイベント処理初期設定
	attachEvents: function(){
		console.log('xmodal: attach events');
	},
	// websocket送信処理
	stream: function(){
		console.log('xmodal: stream');
	},
	// websocket受信処理
	receive: function(){
		console.log('xmodal: receive');
	},
	arrangeView: function(){
		console.log('xmodal: arrange view');
	}
};


///////////////////
// FW部分
var FW = {
	userID: '',
	modes: [],
	subscribers: {
		stt: []
	},
	// todo: localstorageで管理
	dataFromModes: [
		{mode: stt, date:"2015-10-21 14:40:56:12", data:"こんにちは"},
		{mode: stt, date:"2015-10-21 14:40:56:12", data:"こんにちは"},
		{mode: stt, date:"2015-10-21 14:40:56:12", data:"こんにちは"}
	],

	addMode: function(m, config) {
		if($.inArray(m, this.modes) > -1){
			console.log('this mode has already added.');
			return;
		}

		//与えられた設定をモードに追加
		m.config = config;
		this.modes.push(m);

		// モードごとのviewの作成
		m.view = this.createNewFrame(m.name, m.stable_config);
		m.output_area = $('.main_view', m.view);


		// モードごとに初期処理
		m.init();

		// buttonへのイベント貼り付け
		$('.run', $('#' + m.name)).click(function() {
			m.run();
			m.state = 'running';
		});
		$('.stop', $('#' + m.name)).click(function() {
			m.stop();
			m.state = 'waiting';
		});

		// streamの設定
		if(m.config.streamInterval != null){
			setInterval(function() {
				if (m.state == 'running') {
					m.stream();
				}
			}, m.config.streamInterval);
		}

		console.log(m);
	},

	//共通部分のview作成
	createNewFrame: function(name, stable_config) {
		var mainf = $('<div>')
		.attr('class', 'main_view')
		.attr('id', 'main_view_' + name)
		.attr('width', stable_config.view.width)
		.attr('height', stable_config.view.height);
		//TODO: width, heightはcssに分離

		var cbar = $('<div>')
		.append($('<input>').attr('type', 'button').attr('value', 'config'));
		if(stable_config.btn.needRun)
			cbar.append($('<input>').attr('type', 'button').attr('value', 'run').attr('class', 'run'))
		if(stable_config.btn.needStop)
			cbar.append($('<input>').attr('type', 'button').attr('value', 'stop').attr('class', 'stop'))

		var view = $('<div>').attr('id', name).append(mainf).append(cbar);
		view.appendTo('#modes-container');
		return view;
	},

	//subscriberからの呼び出しに応じてpublisherの購読者リストにsubsriberを追加
	register: function(publisher, subscriber){
		if(subscriber in this.subscribers[publisher])
			return false;
		this.subscribers[publisher].push(subscribers);
	},

	//publisherからの呼び出しに応じてその購読者リストにデータを配信
	publish: function(publisher, data){
		//TODO: save localstrage
		if(publisher in this.subscribers)
			this.dataFromModes[publisher] = [data];
		else
			this.dataFromModes[publisher].push(data);

		for (var i in this.subscribers[publisher]){
			this.subscribers[i].notify(data);
		}
	},

	//websocket通信のデータ形式
	//'モード名 ユーザID データ内容'
	//モード名の情報はFWが付与する

	//websocketからデータを受け取る
	receive: function(message){
		console.log('receive in FW');
		var messagedata = message.split(',');
		for(var i in this.modes){
			if(this.modes[i].name === messagedata[2]){
				console.log()
				this.modes[i].receive(messagedata[0], messagedata[1]);
			}
		}
	},
	//websocketにデータを送信
	sendToAll: function(mode_name, message){
		console.log('send to all from FW');
		Chat.socket.send(message + ',' + this.userID + ',' + mode_name);
	}


};



///////////////////
// （暫定的実装）
// ws-nodejs.js

var room;
var last;
var ascii;

var client = new BinaryClient('ws://' + window.location.host + ':9001');
var stream;
var room = "demoroom";

client.on('open', function(){
	stream = client.createStream({room: room, type: 'write'});
});


// Not showing vendor prefixes or code that works cross-browser.
//? ここのstreamはもしかして，上のvar streamと関係ない？
navigator.webkitGetUserMedia({video: true}, function(astream) {
	video.src = window.webkitURL.createObjectURL(astream);
    setInterval(myStreaming, 50);

}, function() {alert('fail');});
