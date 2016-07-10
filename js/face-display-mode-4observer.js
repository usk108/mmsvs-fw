// モーダルの定義の仕方
var mode_face_display_for_observer = {
	// モード名
	name: 'face_display_for_observer',
	// モード名(日本語)
	nameJapanese: '顔表示モード',
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

	running: false,
	contexts : {},
	streams : {},
	common_name: 'face_display',

	client : null,

	init : function(modeconfig) {
		var wsaddress = '192.168.0.130:443';
		if (window.location.protocol == 'http:') {
			this.client = new BinaryClient('ws://' + wsaddress);
		} else {
			this.client = new BinaryClient('wss://' + wsaddress);
		}

		this.attachEvents();
	},

	attachEvents : function() {
		this.client.on('open', function(){
			console.log('connection with node.js server have opened');
		});
	},

	arrangeView: function(){
	},

	run : function() {
		this.running = true;
		console.log('running is '+this.running);
	},

	stop : function() {
		this.running = false;
	},

	receiveFromNjs : function(message) {
		if(!(message.userName in this.contexts)){
			console.log('creating new frame of ' + message.userName);
			var video = $('<video>')
				.attr('width', '320')
				.attr('height', '240')
				.hide();

			var canvas = $('<canvas>')
				.attr('class', 'col-md-6 column')
				.attr('width', '320')
				.attr('height', '240');

			$('.main_view', this.view).append(video).append(canvas);

			video[0].autoplay = true;
			this.contexts[message.userName] = canvas[0].getContext('2d');
		}

		var t = this.contexts[message.userName].getImageData(0,0, 320, 240);
		t.data.set(new Uint8ClampedArray(message.body));
		this.contexts[message.userName].putImageData(t, 0, 0);
	},

	receive : function(message) {
		console.log('receive in face display mode');
		console.log(message);
		var self = this;

		if(message.body == "notify_speaker"){
			console.log('get notification from ' + message.userName);

			self.running = true;

			self.streams[message.userName] = self.client.createStream({room: "room_" + message.userName, type: 'read'});
			self.streams[message.userName].on('data', function(data) {
				if(self.running){
					self.receiveFromNjs(data);
				}
			});
		}
	},

	sendToAll : function(message) {
		console.log('sent to all from face display mode');
		console.log(message);
		FW.sendToAll(message);
	}
};
