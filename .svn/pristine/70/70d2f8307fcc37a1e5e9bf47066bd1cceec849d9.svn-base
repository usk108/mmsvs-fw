/**
 * jQuery.ajax mid - CROSS DOMAIN AJAX 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 12-JAN-10
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
 */

/*
 * 2012/07/11 by shin
 * - 返り値の処理を簡略化
 *    Nativeの $.ajax()コマンドと同じ振る舞いをするように変更
 * 
 * - yqlTypeの固定化，o.typeの簡略化
 * 
 * todo: 呼び出し失敗時に error:function() で受け取れない
 */

/*
 * 2012/05/21 by shin.
 * - yql のリクエストを可能に出来るよう拡張
 *   {yqlType: 'xml'} の指定により取得タイプを変更
 * 
 * - xpathを無効に
 */

jQuery.ajax = (function(_ajax){
    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from xml where url="{URL}" and xpath="*"';
    
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }
    
    return function(o) {
        var url = o.url;
        
        // 2012/07/11 shin
        //   xmlサービスのみを想定し，yqlTypeをxmlに固定
        o.yqlType = 'xml';
        
        var query = 'select * from ' + o.yqlType + ' where url="{URL}"';
        
        // 2012/07/11 shin
        //   o.type の指定を無視
        //if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
		if (!/json/i.test(o.dataType) && isExternal(url) ) {
			
            // Manipulate options so that JSONP-x request is made to YQL
            
            o.url = YQL;
            o.dataType = 'json';
            
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            
            o.success = (function(_success){
                return function(data) {
                    
                    if (_success) {
                    	
                    	//////////////////////////////////////////////////////////////////////////////////
                    	// 2012/07/11 shin
                    	//   responseText等細かな処理を排除
                    	// 
                        // Fake XHR callback.
                        /*
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                        */
                       
                       ////////////////////////////////////////////////////////////////////////////////
                       // シンプルに呼び出し結果を返す
                        _success.call(this, data.results[0], 'success');
                    }
                    
                };
            })(o.success);
            
        }
        
        return _ajax.apply(this, arguments);
        
    };
    
})(jQuery.ajax);