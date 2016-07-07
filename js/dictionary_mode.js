// モーダルの定義の仕方
var mode_dictionary = {
	// モード名
	name: 'dictionary',
	// モード名(日本語)
	nameJapanese: 'Wikipedia解説モード',
	// 割り当てられたhtml
	view: null,
	// モード追加時に外部から与えられるモードの設定
	config: null,
	// 外部から変更できないモードの設定情報
	stable_config: {
		view: {
			width: 550,	//画面の横幅
			height: 100	//画面の縦幅
		},
		btn: {
			needRun:true ,	//Runボタンが必要か
			needStop:false	//Stopボタンが必要か
		},
		btn_name: null
	},

	//独自のフィールド
	target_word	: '',
	output_area : null,

	// 初期処理
	init : function(modeconfig) {
		this.attachEvents();
		this.arrangeView();
	},
	// モード独自のイベント処理初期設定
	attachEvents: function(){
		//文字列を選択したら文字を取得
        var self = this;
		document.body.addEventListener('mouseup', function(){
			var sel = document.getSelection().toString();
			if (!sel.length) return;
			self.target_word = sel;
			$('#searched_word').val(sel);
			console.log('target text: ' + self.target_word);
		});
		document.body.addEventListener('keyup', function(){
			var sel = document.getSelection().toString();
			if (!sel.length) return;
			self.target_word = sel;
			$('#searched_word').val(sel);
			console.log('target text: ' + self.target_word);
		});
	},
	run : function() {
	    if (this.target_word.length <= 0) {
			var input_word = $('#searched_word').val();
			this.target_word = input_word;
			console.log("selected word is "+this.target_word);
			if(input_word.length <= 0){
				this.output_area.text("検索ワードが入力/選択されていません");
				return;
			}
	    }

		console.log("selected word is "+this.target_word);

		var wikiurl = 'https://ja.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=3&srsearch=' + this.target_word;
		var detail;
		var self = this;
		$.ajax({
			type: "get",
			dataType: "jsonp",
			url: wikiurl,
			success: function(json) {
				console.log(json);
				var results = json.query.search;
				$('.result-wrapper').remove();
				if(results.length === 0){
					$('<div>', {class: 'result-wrapper'})
						.append($('<p>').html('「' + self.target_word+'」に関する検索結果は得られませんでした'))
						.appendTo(self.output_area);
					return;
				}
				for(var i = 0; i < 3; i++){
					$('<div>')
						.attr('class', 'result-wrapper')
						.append($('<h4>').attr('class', 'result-title').html(results[i].title))
						.append($('<p>').html(results[i].snippet+'...'))
						.appendTo(self.output_area);
				}
			},
			complete: function(){
				self.target_word = '';
			}
		});

	},
	// websocket送信処理
	stream: function(){
	},
	// websocket受信処理
	receive: function(){
	},
	arrangeView: function(){
		var self = this;
		$('<form>', {id: 'dictionary_form', onSubmit:'mode_dictionary.run(); return false;'})
			.append(($('<input/>', {type: 'text', id: 'searched_word', placeholder: '検索ワードを入力/選択'})))
			.append(($('<input/>', {type: 'submit', value: '検索'})))
			.insertBefore(self.output_area);
	}
};
