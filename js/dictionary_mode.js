// モーダルの定義の仕方
var mode_dictionary = {
	// モード名
	name: 'dictionary',
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
	},
	run : function() {
	    console.log("selected word is "+this.target_word);

	    if (this.target_word.length <= 0) {
	        this.output_area.text("文字列が選択されていません");
	        return;
	    }

        console.log("selected word is "+this.target_word);
        var wikiurl = 'http://ja.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&rawcontinue=continue&titles=' + this.target_word;
        var detail;
        var self = this;
        $.ajax({
            type: "get",
            dataType: "jsonp",
            url: wikiurl,
            success: function(json) {
                var jsonString = json.query.pages;
                for (var first in jsonString) break;
                console.log("json is ",jsonString[first].extract);
                self.output_area.text(jsonString[first].extract);
                self.target_word = '';
            }
        });
	},
	// モード独自のイベント処理初期設定
	attachEvents: function(){
		//文字列を選択したら文字を取得
        var self = this;
		document.body.addEventListener('mouseup', function(){
			var sel = document.getSelection().toString();
			if (!sel.length) return;
			self.target_word = sel;
			console.log('target text: ' + self.target_word);
		});
		document.body.addEventListener('keyup', function(){
			var sel = document.getSelection().toString();
			if (!sel.length) return;
			self.target_word = sel;
			console.log('target text: ' + self.target_word);
		});
	},
	// websocket送信処理
	stream: function(){
	},
	// websocket受信処理
	receive: function(){
	},
	arrangeView: function(){
	}
};
