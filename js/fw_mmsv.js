///////////////////
// FW部分
var FW = {
	modes: [],
	subscribers: {},
	// todo: localstorageで管理
	dataFromModes: [],

	addMode: function(m, config) {
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
		.attr('id', name)
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
	}

};





///////////////////
// モード追加ボタンの処理

//用語解説モードが追加されたら
$('#add_detail_mode').click(function() {
	console.log("adding Dictionay");
	//共通のhtmlタグを追加
	var conf = {streamInterval: null};
	FW.addMode(mode_dictionary, conf);
});


















