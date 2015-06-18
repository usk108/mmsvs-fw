var ModeConfig = {
	//view1はinitでセットするようにするか
	//そもそもこんな形でデータ持たせることできるのかわからんけど
	output_area: null,
	control_bar: null,
	init : function(view_index) {
		this.output_area = $('.output_area', $('#view'+view_index));
		this.control_bar = $('.control_bar', $('#view'+view_index));
	}

};


//用語解説モードが追加されたら
$('#add_detail_mode').click(function() {
	console.log("adding Dictionay");
	//共通のhtmlタグを追加
	//TODO: 現在のmodeの数を渡して調整
	add_dictionay_mode_area(1);
	//modes[0].run(); // 0はSTTmodalである
	ModeConfig.init(1);
	DictionaryMode.init(ModeConfig);

});


//TODO: 現在のmodeの数を渡して調整
//いまは分割されview1,view2が存在すると仮定する
function add_dictionay_mode_area(view_index){
	var op_ara = $('<div>').attr('class', 'output_area');
	var ctrl_bar = $('<div>').attr('class', 'control_bar');
	var btn = $('<a>').attr('class', 'button button-pill button-action').attr('id', 'runview'+view_index).html('run');
	//var btn = $('<a>').attr('class', 'button button-pill button-action').attr('id', 'runview1').attr('href', '#').attr("onclick","DictionaryMode.run();").html('run');
	$('#view'+view_index).append(op_ara).append(ctrl_bar.append(btn));

	//ボタンクリックアクションを追加
	$('#runview'+view_index).click(function() {
		console.log('button is pushed!');
		DictionaryMode.run();
	});
}



//STTモードが追加されたら
$('#add_stt_mode').click(function() {
	console.log("adding STT");
	//共通のhtmlタグを追加
	//TODO: 現在のmodeの数を渡して調整
	add_stt_mode_area(2);
	//modes[0].run(); // 0はSTTmodalである
	ModeConfig.init(2);
	STTMode.init(ModeConfig);

});


//TODO: 現在のmodeの数を渡して調整
//いまは分割されview1,view2が存在すると仮定する
function add_stt_mode_area(view_index){
	var op_ara = $('<div>').attr('class', 'output_area');
	var ctrl_bar = $('<div>').attr('class', 'control_bar');
	var btn = $('<a>').attr('class', 'button button-pill button-action').attr('id', 'runview'+view_index).html('run');
	var consl = $('<div>').attr('id', 'console');
	var console_container = $('<div>').attr('id', 'console-container').append(consl);
	//var btn = $('<a>').attr('class', 'button button-pill button-action').attr('id', 'runview1').attr('href', '#').attr("onclick","DictionaryMode.run();").html('run');
	$('#view'+view_index).append(console_container).append(op_ara).append(ctrl_bar.append(btn));

	//ボタンクリックアクションを追加
	$('#runview'+view_index).click(function() {
		console.log('button for STT is pushed!');
		STTMode.run();
	});
}






