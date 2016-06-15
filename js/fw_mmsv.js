///////////////////
// FW部分
var FW = {
	userID: '',
	modes: [],
	subscribers: {},
	// todo: localstorageで管理
	dataFromModes: [],

	deleteMode: function(m) {
		if($.inArray(m, this.modes) > -1){
			m.view.hide();
			return;
		}
		console.log('this mode does not exist.');
	},

	addMode: function(m, config) {
		if($.inArray(m, this.modes) > -1){
			m.view.show();
			console.log('this mode has already added.');
			return;
		}

		//与えられた設定をモードに追加
		m.config = config;
		this.modes.push(m);

		// モードごとのviewの作成
		m.view = this.createNewFrame(m.name, m.nameJapanese, m.stable_config);
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
			console.log('addin set interval function for '+m.name);
			setInterval(function() {
				if (m.state == 'running') {
					m.stream();
				}
			}, m.config.streamInterval);
		}

		console.log(m);
	},

	//共通部分のview作成
	createNewFrame: function(name, nameJapanese, stable_config) {
		var mode_name = $('<h4>').html(nameJapanese);

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

		//TODO: class = col-md-3 は適当なので調整する
		var view = $('<div>').attr('id', name).attr('class', 'col-md-4 column').append(mode_name).append(mainf).append(cbar);
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
	},

	//tmp実装：websocketにデータをオブジェクトの形式で送信
	sendObjectToAll: function(mode_name, message){
		console.log('send to all from FW');
		console.log(message);
		var data = {
			mode: mode_name,
			userId: this.userID,
			message: null,
			data: message
		};
		console.log(data);
		console.log(JSON.stringify(data));
		Chat.socket.send(message);
	},

	//websocket(nodejs上)からデータを受信
	receiveFromN: function(message){
		console.log('receive in FW');
		var messagedata = message.split(',');
		for(var i in this.modes){
			if(this.modes[i].name === messagedata[2]){
				console.log()
				this.modes[i].receive(messagedata[0], messagedata[1]);
			}
		}
	},
	//websocket(nodejs上)にデータを送信
	stream: function(mode_name, message){
		console.log('send to all from FW');
		Chat.socket.send(message + ',' + this.userID + ',' + mode_name);
	}

};





///////////////////
// モード追加ボタンの処理

//用語解説モードが追加されたら
$('#add_mode_dictionary').click(function() {
	console.log("adding Dictionary");
	//共通のhtmlタグを追加
	var conf = {streamInterval: null};
	FW.addMode(mode_dictionary, conf);
});

$('#add_mode_stt').click(function() {
	console.log("adding STT");
	//共通のhtmlタグを追加
	var conf = {streamInterval: null};
	FW.addMode(mode_stt, conf);
});

$('#add_mode_stt_cloud').click(function() {
	console.log("adding STT_cloud");
	//共通のhtmlタグを追加
	var conf = {streamInterval: null};
	FW.addMode(mode_stt_cloud, conf);
});

$('#add_fd4spkr_mode').click(function() {
	console.log("adding Face4Spkr");
	//共通のhtmlタグを追加
	var conf = {streamInterval: 50};
	FW.addMode(mode_face_display_for_speaker, conf);
});

$('#add_fd4obsr_mode').click(function() {
	console.log("adding Face4Obsr");
	//共通のhtmlタグを追加
	var conf = {streamInterval: null};
	FW.addMode(mode_face_display_for_observer, conf);
});


//用語解説モードが追加されたら
$('#delete_mode_dictionary').click(function() {
	console.log("deleting Dictionary");
	FW.deleteMode(mode_dictionary);
});

$('#delete_mode_stt').click(function() {
	console.log("deleting STT");
	FW.deleteMode(mode_stt);
});

$('#delete_mode_stt_cloud').click(function() {
	console.log("deleting STT_cloud");
	FW.deleteMode(mode_stt_cloud);
});

$('#delete_fd4spkr_mode').click(function() {
	console.log("deleting Face4Spkr");
	FW.deleteMode(mode_face_display_for_speaker);
});

$('#delete_fd4obsr_mode').click(function() {
	console.log("deleting Face4Obsr");
	FW.deleteMode(mode_face_display_for_observer);
});




///////////////////
// 簡易ユーザー認証
$('#add_camera_for_auth').click(function() {
	console.log("adding camera");
	var video = $('<video>')
		.attr('id', 'v_auth')
		.attr('width', '320')
		.attr('height', '240');

	var canvas = $('<canvas>')
		.attr('id', 'c_auth')
		.attr('width', '320')
		.attr('height', '240')
		.hide();

	$('#camera-for-auth').append(video).append(canvas);
	$('#v_auth')[0].autoplay = true;

	var video = document.getElementById('v_auth');

	// Not showing vendor prefixes or code that works cross-browser.
	navigator.webkitGetUserMedia({video: true}, function(stream) {
		video.src = window.webkitURL.createObjectURL(stream);
	}, function() {alert('fail');});

});

$('#take_a_picture').click(function() {
	console.log("taking a picture");
	var canvas = document.getElementById('c_auth');
	// Draw Image
	var ctx = canvas.getContext('2d');

	video = document.getElementById('v_auth');

	ctx.drawImage(video, 0, 0, 200, 150);
	// To Base64
	var base64_png = canvas.toDataURL("image/png");

	FW.sendObjectToAll("user_register", base64_png);
});
