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
