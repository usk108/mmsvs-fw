// モーダルの定義の仕方
var mode_image_search = {
	// モード名
	name: 'image_search',
	// モード名(日本語)
	nameJapanese: '画像で検索モード',
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
		}
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
			$('#image_searched_word').val(sel);
			console.log('target text: ' + self.target_word);
		});
		document.body.addEventListener('keyup', function(){
			var sel = document.getSelection().toString();
			if (!sel.length) return;
			self.target_word = sel;
			$('#image_searched_word').val(sel);
			console.log('target text: ' + self.target_word);
		});
	},
	run : function() {
	    console.log("selected word is "+this.target_word);

		if (this.target_word.length <= 0) {
			var input_word = $('#image_searched_word').val();
			this.target_word = input_word;
			console.log("selected word is "+this.target_word);
			if(input_word.length <= 0){
				this.output_area.text("検索ワードが入力/選択されていません");
				return;
			}
		}

        console.log("selected word is "+this.target_word);
        var image_search_url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCs2UG6E7-IwudiuCoeOsd-iG9PcfFM2KU&cx=013619658451633440601:nmmf6rj1hsc&searchType=image&q=' + this.target_word;
        var self = this;
        $.ajax({
            type: "get",
            dataType: "jsonp",
            url: image_search_url,
            success: function(json) {
				console.log(json);
				images = json.items;
				self.showImages(images);
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
	arrangeView: function() {
		var imagesArea = $('<div>')
			.attr('id', 'images-list');
		$('.main_view', this.view).append(imagesArea);

		var self = this;
		$('<form>', {id: 'image_search_form', onSubmit:'mode_image_search.run(); return false;'})
			.append(($('<input/>', {type: 'text', id: 'image_searched_word', placeholder: '検索ワードを入力/選択'})))
			.append(($('<input/>', {type: 'submit', value: '検索'})))
			.insertBefore(self.output_area);
	},
	//検索結果のリストをもらってそれを表示する
	showImages: function(images){
		$('#images-list').empty();
		for(var i = 0; i < images.length; i++){
			var a = $('<a>')
				.attr('href', images[i].image.contextLink)
				.attr('target', '_blank');
			var img = $('<img>')
				.attr('class', 'image')
				.attr('alt', images[i].title)
				.attr('src', images[i].link);
			console.log(img);
			a.append(img);
			$('#images-list').append(a);
		}
	}
};
