///////////////////
// FW部分
var FW = {
	userID: '',
	active_modes: [],
	total_modes: [],
	subscribers: {},
	// todo: localstorageで管理
	dataFromModes: [],
	user_img: {},
	sidebar_flag: true,

	deleteMode: function(m) {
		if($.inArray(m, this.active_modes) > -1){
			m.view.hide();
			this.active_modes.splice(this.active_modes.indexOf(m), 1);
			FW.updateLayout();
			return;
		}
		console.log('this mode does not exist.');
	},

	addMode: function(m, config) {
		if($.inArray(m, this.active_modes) > -1){
			console.log('this mode has already added.');
			return;
		}else if($.inArray(m, this.total_modes) > -1){
			console.log('this mode has already deleted and added.');
			this.active_modes.push(m);
			m.view.show();
			FW.updateLayout();
			return;
		}

		//与えられた設定をモードに追加
		m.config = config;
		this.active_modes.push(m);
		this.total_modes.push(m);

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
		this.updateLayout();

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

		var mainw = $('<div>')
			.attr('class', 'main_view_wrapper')
			.append(mode_name)
			.append(mainf)
			.append(cbar);

		var view = $('<div>')
			.attr('id', name)
			.append(mainw)
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
	//{mode:モード名, userName:ユーザID, body:データ内容}
	//モード名の情報はFWが付与する

	//websocketからデータを受け取る
	receive: function(data){
		// console.log('receive in FW');
		// console.log(data);

		// TODO: オブジェクトをパースしてmode="user_register"だったらuserのurlを管理する連想配列に格納する

		if(data.body == "usercheck"){
			this.userID = data.userName;
			return;
		}

		if(data.mode == "user_register"){
			var body = JSON.parse(data.body);
			console.log(body);
			this.user_img[body.userName] = body.imgURL;

			console.log(this);
			if(data.userName == this.userID){
				this.userID = body.userName;
			}
			console.log(this);

			return;
		}

		for(var i in this.active_modes){
			if(this.active_modes[i].name === data.mode || this.active_modes[i].common_name === data.mode){
				console.log("receive message for " + this.active_modes[i].name);
				this.active_modes[i].receive(data);
			}
		}
	},
	//websocketにデータを送信
	// sendToAll: function(mode_name, message){
	// 	console.log('send to all from FW');
	// 	Chat.socket.send(message + ',' + this.userID + ',' + mode_name);
	// },
	sendToAll: function(message){
		console.log('send to all from FW');
		Chat.socket.send(JSON.stringify(message));
	},

	//tmp実装：websocketにデータをオブジェクトの形式で送信
	sendObjectToAll: function(mode_name, message){
		console.log('send to all from FW');
		console.log(message);
		var data = {
			mode: mode_name,
			userName: this.userID,
			body: message
		};
		// console.log(data);
		// console.log(JSON.stringify(data));
		Chat.socket.send(JSON.stringify(data));
	},

	//websocket(nodejs上)からデータを受信
	receiveFromN: function(message){
		console.log('receive in FW');
		var messagedata = message.split(',');
		for(var i in this.active_modes){
			if(this.active_modes[i].name === messagedata[2]){
				console.log()
				this.active_modes[i].receive(messagedata[0], messagedata[1]);
			}
		}
	},
	//websocket(nodejs上)にデータを送信
	stream: function(mode_name, message){
		// console.log('send to all from FW');
		Chat.socket.send(message + ',' + this.userID + ',' + mode_name);
	},


	//以下サブメソッド

	updateLayout: function(){
		var mode_names = this.active_modes.map(function(m){ return m.name}).sort().join('-');

		$('#modes-container')
			.removeAttr('class')
			.attr('class', mode_names);

		if(mode_names === "face_display_for_observer"){
			$('#face_display_for_observer').removeAttr('class');
			$('canvas')
				.attr('class', 'col-md-4 column');
			return;
		}

		if(mode_names === "stt_cloud"){
			$('#stt_cloud')
				.attr('class', 'col-md-6 col-md-offset-3 column');
			return;
		}

		if(mode_names === "face_display_for_observer-stt_cloud"){
			$('#face_display_for_observer')
				.attr('class', 'col-md-7 column');
			$('canvas')
				.attr('class', 'col-md-6 column');

			$('#stt_cloud')
				.attr('class', 'col-md-5 column');

			$("#face_display_for_observer").after($("#stt_cloud"));

			return;
		}

		if(mode_names === "face_display_for_observer-image_search-stt_cloud"){
			$('#face_display_for_observer')
				.attr('class', 'col-md-7 column');
			$('canvas')
				.attr('class', 'col-md-6 column');

			$('#stt_cloud')
				.attr('class', 'col-md-5 column');

			$('#image_search')
				.attr('class', 'col-md-5');

			$("#face_display_for_observer").after($("#image_search")).after($("#stt_cloud"));

			return;
		}

		if(mode_names === "dictionary-face_display_for_observer-stt_cloud"){
			$('#face_display_for_observer')
				.attr('class', 'col-md-7 column');
			$('canvas')
				.attr('class', 'col-md-6 column');

			$('#stt_cloud')
				.attr('class', 'col-md-5 column');

			$('#dictionary')
				.attr('class', 'col-md-5');

			$("#face_display_for_observer").after($("#dictionary")).after($("#stt_cloud"));

			return;
		}

		if(mode_names === "dictionary-face_display_for_observer-image_search-stt_cloud"){
			$('#face_display_for_observer')
				.attr('class', 'col-md-7 column');
			$('canvas')
				.attr('class', 'col-md-6 column');

			$('#stt_cloud')
				.attr('class', 'col-md-5 column');

			$('#image_search')
				.attr('class', 'col-md-6');

			$('#dictionary')
				.attr('class', 'col-md-6');

			$("#face_display_for_observer").after($("#dictionary")).after($("#image_search")).after($("#stt_cloud"));

			return;
		}
	}

};



$('.show-mode-manage-sidebar').click(function() {
	console.log('show mode manage sidebar');
	console.log(FW.sidebar_flag);
	if (FW.sidebar_flag) {
		$("#sidebar-button").html("閉じる");
		$(".wrapper").animate({
			left: 0
		});
	} else {
		$("#sidebar-button").html("モード管理");
		$(".wrapper").animate({
			left: -300
		});
	}

	FW.sidebar_flag = !FW.sidebar_flag;
})



///////////////////
// モード追加ボタンの処理

//用語解説モードが追加されたら
$('#add_mode_dictionary').click(function() {
	console.log("adding Dictionary");
	//共通のhtmlタグを追加
	var conf = {streamInterval: null};
	FW.addMode(mode_dictionary, conf);
});

$('#add_mode_image_search').click(function() {
	console.log("adding image_search");
	//共通のhtmlタグを追加
	var conf = {streamInterval: null};
	FW.addMode(mode_image_search, conf);
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


//用語解説モードが削除されたら
$('#delete_mode_dictionary').click(function() {
	console.log("deleting Dictionary");
	FW.deleteMode(mode_dictionary);
});

$('#delete_mode_image_search').click(function() {
	console.log("deleting image_search");
	FW.deleteMode(mode_image_search);
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
$('#submit_user_name').click(function() {
	console.log("submitting user name");
	var name = $('#user_name').val();
	FW.sendObjectToAll("user_register", name);
});

// $('#add_camera_for_auth').click(function() {
// 	console.log("adding camera");
// 	var video = $('<video>')
// 		.attr('id', 'v_auth')
// 		.attr('width', '320')
// 		.attr('height', '240');
//
// 	var canvas = $('<canvas>')
// 		.attr('id', 'c_auth')
// 		.attr('width', '320')
// 		.attr('height', '240')
// 		.hide();
//
// 	$('#camera-for-auth').append(video).append(canvas);
// 	$('#v_auth')[0].autoplay = true;
//
// 	var video = document.getElementById('v_auth');
//
// 	// Not showing vendor prefixes or code that works cross-browser.
// 	navigator.webkitGetUserMedia({video: true}, function(stream) {
// 		video.src = window.webkitURL.createObjectURL(stream);
// 	}, function() {alert('fail');});
//
// });
//
// $('#take_a_picture').click(function() {
// 	console.log("taking a picture");
// 	var canvas = document.getElementById('c_auth');
// 	// Draw Image
// 	var ctx = canvas.getContext('2d');
//
// 	video = document.getElementById('v_auth');
//
// 	ctx.drawImage(video, 0, 0, 200, 150);
// 	// To Base64
// 	var base64_png = canvas.toDataURL("image/png");
//
// 	FW.sendObjectToAll("user_register", base64_png);
// });
