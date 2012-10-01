/**
 * Pinboard recent bookmarks feed. Modified from:
 * Github activity feed.
 *
 * Graeme Sutherland, July 2012.
 *
 * Uses .json activity from github to show public commits.
 * Requires jQuery and underscore.js
 *
 */

var PinboardActivity = (function($, _) {

    // {"u":"http://www.h-online.com/developer/news/item/SubGit-1-0-stress-free-Subversion-to-Git-migration-1717931.html","d":"SubGit 1.0: \"stress-free\" Subversion to Git migration - The H Developer: News and Features","n":"RT @_doherty: This could be fun at work:  #git #svn","dt":"2012-09-28T23:48:20Z","a":"doy","t":["git","svn"]}
    var
        self = {},
        default_template = '<li class="action"> \
            <a class="pin-title" href="<%= u %>"><%= d %></a> \
            <% if (n) { %> \
                <br /> \
                <%= n %> \
            <% } %> \
            <% if (t.length > 1 || (t.length == 1 && t[0] != "")) { %> \
                <br /> tags: \
                <% _.each(t, function (item) { %> \
                    <a class="pin-tag" href="https://pinboard.in/u:<%= a %>/t:<%= item %>"><%= item %></a> \
                <% }); %> \
            <% } %> \
        </li>';

    /**
     * Fill in activity into selector from public events for username,
     * with optional template selector tmpl_selector.
     */
    self.show_activity = function (username, selector, tmpl_selector) {
        var
            url = 'https://feeds.pinboard.in/json/v1/u:' + username + '/?count=5&cb=?',
            template = $(tmpl_selector).html() || default_template,
            compiled = _.template(template),
            current_date = '',
            $current_list;

        $.getJSON(url, {}, function (data) {
            $.each(data, function(index, commit) {
                var date = commit.dt.substring(0, 10);
                if (date != current_date) {
                    if (current_date) {
                        var $new_item = $('<li class="date"></li>');
                        $new_item.append('<h5>' + current_date + '</h5>');
                        var $div = $('<div class="actions"></div>');
                        $div.append($current_list);
                        $new_item.append($div);
                        $(selector).append($new_item);
                    }

                    $current_list = $('<ul></ul>');
                    current_date = date;
                }
                var $action = $(compiled(commit));
                if (index % 2) {
                    $action.addClass('odd')
                }
                $current_list.append($action);
            });
            var $new_item = $('<li class="date"></li>');
            $new_item.append('<h5>' + current_date + '</h5>');
            var $div = $('<div class="actions"></div>');
            $div.append($current_list);
            $new_item.append($div);
            $(selector).append($new_item);
        });
    };

    return self;

}(jQuery, _));
