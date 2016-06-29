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
	streams : {},

	common_name: 'face_display',

	client : null,

	init : function(modeconfig) {
		this.room = "demoroom";
		var wsaddress = '192.168.0.130:443';
		if (window.location.protocol == 'http:') {
			this.client = new BinaryClient('ws://' + wsaddress);
		} else {
			this.client = new BinaryClient('wss://' + wsaddress);
		}

		this.attachEvents();
	},

	attachEvents : function() {
		var self = this;

		this.client.on('open', function(){
			console.log('connection with node.js server have opened');

			var message = {
				userName: FW.userID,
				mode: self.common_name,
				body: "look_for_speaker"
			};
			self.sendToAll(message);
		});
	},

	arrangeView: function(){
	},

	run : function() {
		this.state = 'running';
		console.log('state is '+this.state);
	},

	stop : function() {
		this.state = 'waiting';
	},

	receiveFromNjs : function(message) {
		// console.log(message);

		if(!(message.userName in this.contexts)){
			var video = $('<video>')
				.attr('width', '320')
				.attr('height', '240')
				.hide();

			var canvas = $('<canvas>')
				.attr('class', 'col-md-4 column')
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
			self.streams[message.userName] = self.client.createStream({room: "room_" + message.userName, type: 'read'});
			self.streams[message.userName].on('data', function(data) {
				if(self.state == 'running'){
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
