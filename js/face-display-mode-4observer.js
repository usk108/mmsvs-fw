// モーダルの定義の仕方
var mode_face_display_for_observer = {
	// モード名
	name: 'face_display_for_observer',
	// モード名(日本語)
	nameJapanese: '顔表示モード（見る人用）',
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
	contexts : {},
	broadcasting : false,
	myStream : null,
	stream0 : null,
	stream1 : null,

	client : null,

	init : function(modeconfig) {
		this.room = "demoroom";
		var wsaddress = '192.168.0.130:443';
		if (window.location.protocol == 'http:') {
			this.client = new BinaryClient('ws://' + wsaddress);
		} else {
			this.client = new BinaryClient('wss://' + wsaddress);
		}


		// this.arrangeView();
		// $('#v')[0].autoplay = true;
		// this.video = document.getElementById('v');
		// var canvas = document.getElementById('c');
		// //console.log(canvas);
		// this.context = canvas.getContext('2d');

		this.attachEvents();
	},

	attachEvents : function() {

		var self = this;
		// this.client.on('open', function() {
		// 	self.myStream = self.client.createStream({room: self.room, type: 'read'});
		// 	self.myStream.on('data', function (data) {
		// 		if (self.state == 'running') {
		// 			console.log('in attachEvents state is ' + self.state);
		// 			self.receiveFromNjs(data);
		// 		}
		// 	});
		// });
		this.client.on('open', function(){
			self.stream0 = self.client.createStream({room: "room0", type: 'read'});
			self.stream0.on('data', function(data) {
				if(self.state == 'running'){
					console.log('in stream0 state is '+self.state);
					self.receiveFromNjs(data);
				}
			});

			self.stream1 = self.client.createStream({room: "room1", type: 'read'});
			self.stream1.on('data', function(data) {
				if(self.state == 'running'){
					console.log('in stream1 state is '+self.state);
					self.receiveFromNjs(data);
				}
			});
		});
	},

	arrangeView: function(){
		console.log('xmodal: arrange view');
		// var video = $('<video>')
		// 	.attr('id', 'v')
		// 	.attr('width', '320')
		// 	.attr('height', '240')
		// 	.hide();
        //
		// var canvas = $('<canvas>')
		// 	.attr('id', 'c')
		// 	.attr('width', '320')
		// 	.attr('height', '240');
        //
		// $('.main_view', this.view).append(video).append(canvas);
	},

	run : function() {
		this.state = 'runnning';
		console.log('state is '+this.state);
	},

	stop : function() {
		this.state = 'waiting';
	},

	receiveFromNjs : function(message) {
		console.log(message);

		if(!(message.userName in this.contexts)){
			var video = $('<video>')
				.attr('id', 'v')
				.attr('width', '320')
				.attr('height', '240')
				.hide();

			var canvas = $('<canvas>')
				.attr('id', 'c')
				.attr('width', '320')
				.attr('height', '240');

			$('.main_view', this.view).append(video).append(canvas);

			video[0].autoplay = true;
			this.contexts[message.userName] = canvas[0].getContext('2d');
		}

		var t = this.contexts[message.userName].getImageData(0,0, 200, 1600);
		t.data.set(new Uint8ClampedArray(message.body));
		this.contexts[message.userName].putImageData(t, 0, 0);
	}
};
