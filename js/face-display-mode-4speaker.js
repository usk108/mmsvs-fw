// モーダルの定義の仕方
var mode_face_display_for_speaker = {
	// モード名
	name: 'face_display_for_speaker',
	// モード名(日本語)
	nameJapanese: '顔表示モード（話し手用）',
	// 割り当てられたhtml
	view: null,
	// モード追加時に外部から与えられるモードの設定
	config: null,
	// 外部から変更できないモードの設定情報
	stable_config: {
		view: {
			width: 500,		//画面の横幅
			height: 500		//画面の縦幅
		},
		btn: {
			needRun:true ,	//Runボタンが必要か
			needStop:true 	//Stopボタンが必要か
		}
	},
	state: 'waiting',

	//
	room : null,
	video : null,
	//canvas : null,
	context : null,
	broadcasting : false,
	myStream : null,

	client : null,


	init : function() {
		this.room = "demoroom";
		this.client = new BinaryClient('ws://' + window.location.host + ':9001');

		this.arrangeView();
		$('#v')[0].autoplay = true;
		this.video = document.getElementById('v');
		var canvas = document.getElementById('c');
		//console.log(canvas);
		this.context = canvas.getContext('2d');

		this.attachEvents();

	},

	attachEvents : function() {
		var self = this;
		this.client.on('open', function(){
			console.log('in attaching, client is ' + self.client);
			self.myStream = self.client.createStream({room: self.room, type: 'write'});
			console.log('in attaching, myStream is ' + self.myStream);
		});

		// Not showing vendor prefixes or code that works cross-browser.
		navigator.webkitGetUserMedia({video: true}, function(stream) {
			self.video.src = window.webkitURL.createObjectURL(stream);
			console.log('in attachEvents state is '+ self.state);
			// setInterval(self.sendToAll, 50);
		}, function() {alert('fail');});

	},

	arrangeView: function(){
		console.log('xmodal: arrange view');
		var video = $('<video>')
		.attr('id', 'v')
		.attr('width', '320')
		.attr('height', '240');

		var canvas = $('<canvas>')
		.attr('id', 'c')
		.attr('width', '320')
		.attr('height', '240')
		.hide();

		$('.main_view', this.view).append(video).append(canvas);
	},

	run : function() {
		console.log('before, state is '+ this.state);
		this.state = 'running';
		console.log('after, state is '+ this.state);
	},

	stop : function() {
		this.state = 'waiting';
	},

	receive : function(message) {
	},

	//FWから呼ばれる
	stream : function() {
		var self = mode_face_display_for_speaker;
		if(self.state == 'running'){
			self.context.drawImage(self.video, 0, 0, 200, 150);
			var data = self.context.getImageData(0,0, 200,150).data;
			self.myStream.write(data);
		}
	}



};
