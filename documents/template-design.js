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
	// 初期処理
	init: function(){
		console.log('xmodal: init');
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
	stream: function(){
		console.log('xmodal: receive');
	}
};


///////////////////
// FW部分
var FW = {
	modes: [],
	subscribers: {
		stt: []
	},
	dataFromModes: [
		{mode: stt, date:"2015-10-21 14:40:56:12", data:"こんにちは"},
		{mode: stt, date:"2015-10-21 14:40:56:12", data:"こんにちは"},
		{mode: stt, date:"2015-10-21 14:40:56:12", data:"こんにちは"}
	],

	addModal: function(m, config) {
		//与えられた設定をモードに追加
		m.config = config;
		this.modes.push(m);

		// モードごとのviewの作成
		m.view = this.createNewFrame(m.name);

		// モードごとに初期処理
		m.init();

		// buttonへのイベント貼り付け
		$('#' + m.name).find('input[value=run]').click(function() {
			m.run();
			m.state = 'running';
		});
		$('#' + m.name).find('input[value=stop]').click(function() {
			m.stop();
			m.state = '';
		});

		// streamの設定
		setInterval(function() {
			if (m.state == 'running') {
				m.stream();
			}
		}, m.config.streamInterval);
	},

	//部品作成
	createNewFrame: function(name, stable_config) {
		var mainf = $('<div>').attr('class', 'modal');
		var cbar = $('<div>')
		.append($('<input>').attr('type', 'button').attr('value', 'run'))
		.append($('<input>').attr('type', 'button').attr('value', 'stop'))
		.append($('<input>').attr('type', 'button').attr('value', 'config'));
		var view = $('<div>').attr('id', name).append(mainf).append(cbar);
		view.appendTo('#mview');
		return mainf;
	},

	register: function(publisher, subscriber){
		if(subscriber in this.subscribers[publisher])
			return false;
		this.subscribers[publisher].push(subscribers);
	},

	publish: function(modename, data){
		//save localstrage
		for (var i in this.subscribers.modename){
			this.subscribers[i].notify(data);
		}
	}

};
