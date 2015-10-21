// モーダルの定義の仕方
var DictionaryMode = {
	output_area : null,
	control_bar : null,
	target_word	: null,

	init : function(modeconfig) {
		//タグを知る
		this.output_area = modeconfig.output_area;
		this.control_bar = modeconfig.control_bar;


		//選択したら文字取得
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


		//以下デバッグ用
		// console.log(modeconfig);
		// console.log("config is "+modeconfig);
		// console.log(modeconfig.output_area);
		//console.log("op area selecter is "+modeconfig.output_area.selector);
		//console.log(config);
		// modeconfig.output_area.text('hello from config');
		// this.output_area.text('hello from mode');
	},

	finalize : function() {

	},

	run : function() {
		// console.log('area is '+this.output_area);
		// console.log(this.output_area);
		// event.preventDefault();
		this.output_area.text('hello from mode2');

		console.log(this.target_word);

	    //var unknownWord = this.target_word;
	    console.log("selected word is "+this.target_word);
	    console.log("selected word range count is "+this.target_word.length);
	    if (this.target_word.length <= 0) {
	        //mode[this.mode_num].Config.output_area.text("no word is selected.");
	        $('#detail-area').text("no word is selected.");
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
                //detail = jsonString[first].extract;
                //$('#detail-area').text(jsonString[first].extract);
                //以下だとthis == DictionaryModeになっていない
                //this.output_area.text(jsonString[first].extract);
                //かわりにvar self = this を外で宣言することで扱えるようにする
                self.output_area.text(jsonString[first].extract);
                self.target_word = '';
            }
        });
	}

};
