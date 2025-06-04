var baseUrl = 'https://http2.200000001.xyz/xbookb';

$(function() {
    // 获取DOM元素
    var $searchInput = $('#searchInput');
    var $searchButton = $('#searchButton');
    var $keywords = $('#search-hot');
    var $searchResults = $('#searchResults');
    var $resultsList = $('#resultsList');
	
	
    search_hot();
    
    // 搜索按钮点击事件
    $searchButton.on('click', function() {
        performSearch($searchInput.val().trim());
    });
    
    // 回车键搜索
    $searchInput.on('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch($searchInput.val().trim());
        }
    });
    
    // 热门关键词点击事件
    $keywords.on('click', '.keyword', function() {
        var searchTerm = $(this).text();
        $searchInput.val(searchTerm);
        performSearch(searchTerm);
    });
    
    // 执行搜索
    function performSearch(term) {
        if (!term) {
            // 添加输入框抖动效果
            $searchInput.css('border-color', '#e74c3c');
            $searchInput.animate({
                marginLeft: '-=10px'
            }, 50, function() {
                $(this).animate({
                    marginLeft: '+=20px'
                }, 100, function() {
                    $(this).animate({
                        marginLeft: '-=10px'
                    }, 50, function() {
                        $(this).css('border-color', '#eef2f7');
                    });
                });
            });
            return;
        }
		
		$.ajax({
			url: baseUrl,
			type: 'POST',
			contentType: 'application/json',
			beforeSend: function( xhr ) {
				$searchButton.html('<i class="fas fa-spinner fa-spin"></i> 搜索中...');
				$searchButton.prop('disabled', true);
			},
			data: JSON.stringify({
				method: 'GET',
				url: '/vqq',
				headers: { 'user-agent': window.navigator.userAgent },
				params: { q: term },
				data: {},
			}),
			dataType: "json",
			success: function (data, textStatus, xhr) {
				console.log(data);
				displayResults(data['data']['list']);
			},
			error: function (xhr, textStatus, error) {
				alert("Error");
			},
			complete: function(xhr, textStatus) {
				$searchButton.html('<i class="fas fa-search"></i> 搜索');
				$searchButton.prop('disabled', false);
			}
		});
        
    }
    
    // 显示搜索结果
    function displayResults(results) {
        $resultsList.empty();
        
        if (results && results.length > 0) {
            // 显示结果容器
            $searchResults.show();
            
            // 添加结果项
            results.forEach(result => {
				
    				var playlistHtml = '';
    				result.playlist.forEach((item, index) => {
    					playlistHtml += '' +
                                    '<div class="chapter-item">' +
                                    '    <div class="chapter-header">' +
                                    '        <div class="chapter-title">' +
                                    '            <i class="fas fa-bookmark"></i>' +
                                    '' +            result.name + ' ' + (index + 1) +
                                    '        </div>' +
                                    '    </div>' +
                                    '</div>' +
                                '';
    				});
    				
            var resultItem = '' +
    				'<li class="result-item">' +
    				'	<div class="result-image">' +
    				'		<img src="' + result.coverImage + '" alt="' + result.name + '">' +
    				'	</div>' +
    				'   <div class="result-content">' +
    				'		<h3 class="result-title">' +
    				'			<i class="fas fa-file-alt"></i>' +
    				'' +        	result.name + '' +
    				'	 	</h3>' +
    				'	 	<p class="result-description">' + result.descText + '</p>' +
    				'	 	<div class="chapters-container">' +
    				'' +    	playlistHtml + '' +
    				'	 	</div>' +
    				'	</div>' +
    				'</li>' +
    				'';
				
				
                $resultsList.append(resultItem);
            });
        } else {
            // 显示无结果信息
            $searchResults.show();
            $resultsList.html('' +
                '<li class="no-results">' +
                '    <i class="fas fa-search"></i>' +
                '    <p>没有找到相关的结果</p>' +
                '    <p>请尝试其他关键词</p>' +
                '</li>' +
            '');
        }
    }
});

function search_hot() {
	$.ajax({
		url: baseUrl,
		type: 'POST',
		contentType: 'application/json',
		beforeSend: function( xhr ) {
			
		},
		data: JSON.stringify({
			method: 'GET',
			url: '/hotwordlist_vqq',
			headers: { 'user-agent': window.navigator.userAgent },
			params: { },
			data: {},
		}),
		dataType: "json",
		success: function (data, textStatus, xhr) {
			console.log(data);
			if (data.status == 200) {
				var res = data['data'];
				var list = res['list'];
				var html = '';
				for (var idx in list) {
					var item = list[idx];
					html += '<button class="keyword">' + item.searchWord + '</button>';
				}
				$('#search-hot').html(html);
			}
		},
		eerror: function (xhr, textStatus, error) {
			var message = "Error";
			if (textStatus == 400) {
			}
			alert(message);
		}
	});
}
