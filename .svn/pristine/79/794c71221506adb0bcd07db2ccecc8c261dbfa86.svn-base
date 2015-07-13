
////////////////////////
// 開発者が作ったプラグイン
var xModal = {
	name: 'xModal',
	view: null,
	config: null,
	run: function(){
		console.log('xmodal: run');
		this.view.text(Math.random());
	},
	stop: function(){
		console.log('xmodal: stop');
		this.view.text('　');
	},
	init: function(){
		console.log('xmodal: init');
	},
	stream: function(){
		console.log('xmodal: stream');
	},
};

////////////////////////
// 開発者が作ったプラグイン
var video = {
	name: 'video',
	view: null,
	config: null,
	data: null,
	video: null,
	canvas: null,
	context: null,
	run: function(){
		console.log('video: run');

		//カメラ映像をDOMに反映させる処理
		var self = this;
		navigator.webkitGetUserMedia({video: true}, function(stream) {
			self.video.src = window.webkitURL.createObjectURL(stream);
		}, function() {alert('fail');});
	},
	stop: function(){
		console.log('video: stop');
		this.view.text('　');
	},
	init: function(){
		this.video = $('<video autoplay>').get(0);
		this.view.append(this.video);
		this.canvas = $('<canvas>').get(0);
		this.context = this.canvas.getContext('2d');
		console.log('video: init');
	},
	stream: function(){
		console.log(this);
		this.context.drawImage(this.video, 0, 0, 200, 150);
		var d = this.context.getImageData(0, 0, 200, 150).data;
		console.log(d);
	},
};






///////////////////
// とばおが作る世界（FW）
var FW = {
	modals: [],

	addModal: function(m, config) {
		m.config = config;
		this.modals.push(m);

		// modalごとのviewの作成
		m.view = this.createNewFrame(m.name);
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

	createNewFrame: function(name) {
		var mainf = $('<div>').attr('class', 'modal');
		var cbar = $('<div>')
		.append($('<input>').attr('type', 'button').attr('value', 'run'))
		.append($('<input>').attr('type', 'button').attr('value', 'stop'))
		.append($('<input>').attr('type', 'button').attr('value', 'config'));
		var view = $('<div>').attr('id', name).append(mainf).append(cbar);
		view.appendTo('#mview');
		return mainf;
	}

};


///////////////
// プラグインを足すだけ（アカウントに紐付いてロードする）
var conf1 = {streamInterval: 1000};
var conf2 = {streamInterval: 300};
FW.addModal(xModal, conf1);
FW.addModal(video, conf2);
/*
function ModalLoader(var modalName){
	m =
	return m;
}

*/