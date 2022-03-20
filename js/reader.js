function RSSReader(src, img=0, desc=0, paging=10) {
    $.ajax({
        url: src,
        dataType: "xml",
        type: "GET",
        success: function (xml) {
            $.each($("item", xml), function(i, e) {
                var imgHTML = (img > 0) ? '<img src="' + $(e).find("image").text() + '" class="post_img">' : '';
                var descHTML = (desc > 0) ? "<p>" + $(e).find("description").text() + "</p>" : '';

                var post = '';
                post += '<tr class="post_wrapper all"><td>';
                post += imgHTML;
                post += '<div class="post_preview">';
                post += '<div class="post_title">';
                post += '<a href="'+ $(e).find("link").text() + '">'+ $(e).find("title").text() + '</a>';
                post += '</div>';
                post += '<div class="post_date" style="color:' + Config.date_color + ';">'+ $(e).find("pubDate").text() + '</div>';
                post += descHTML;
                post += '</div></td></tr>';
                $("#BlogPosts tbody").append(post);

            });
            // Create Datatable
            $('#BlogPosts').dataTable({
                "paging": true,
                "searching":true,
                "sorting":false,
                "info":false,
                "pageLength":paging,
                "lengthChange": false,
                "dom": 'ftilp',
                "language": {
                    "search":"",
                    "searchPlaceholder": "search topic, keyword, or title..."
                },
            });
        },
   });
}

function JSONReader(src, img=0, desc=0, paging=10) {
    $.ajax({
        url: src,
        dataType: "json",
        type: "GET",
        success: function(data) {
            $.each(data, function(i, e) {
                var imgHTML = (img > 0) ? '<img src="' + e["image"] + '" class="post_img">' : '';
                var descHTML = (desc > 0) ? "<p>" + e["description"] + "</p>" : '';

                var post = '';
                post += '<tr class="post_wrapper all"><td>';
                post += imgHTML;
                post += '<div class="post_preview">';
                post += '<div class="post_title">';
                post += '<a href="'+ e["link"] + '">'+ e["title"] + '</a>';
                post += '</div>';
                post += '<div class="post_date" style="color:' + Config.date_color + ';">'+ e["date"] + '</div>';
                post += descHTML;
                post += '</div></td></tr>';
                $("#BlogPosts tbody").append(post);
            })
            // Create Datatable
            $('#BlogPosts').dataTable({
                "paging": true,
                "searching":true,
                "sorting":false,
                "info":false,
                "pageLength":paging,
                "lengthChange": false,
                "dom": 'ftilp',
                "language": {
                    "search":"",
                    "searchPlaceholder": "search topic, keyword, or title..."
                },
            });
        },
    });
}
