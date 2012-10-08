/**
 * Github activity feed.
 *
 * Graeme Sutherland, July 2012.
 *
 * Uses .json activity from github to show public commits.
 * Requires jQuery and underscore.js
 *
 */

var GithubActivity = (function($, _) {

    var
        self = {},
        gh = 'http://github.com/',
        default_template = '<li class="action"> \
            <% if (type == "PushEvent") { %> \
                <a href="<%= url %>"><b>pushed</b></a> \
                to <a href="<%= repository.url %><% if (payload.ref != "refs/heads/master") { print("/tree/"); print(payload.ref.replace("refs/heads/", "")); } %>"> \
                <% print(payload.ref.replace("refs/heads/", "")); %></a> \
                at <a href="<%= repository.url %>"> \
                <%= repository.owner %>/<%= repository.name %></a> \
                <dl><% _.each(payload.shas, function(sha) { %> \
                    <dt> \
                    <a href="<%= repository.url %>/commit/<%= sha[0] %>"> \
                    <%= sha[0].substring(0,6) %></a></dt> \
                    <dd><%= (sha[2].split("\\n"))[0] %></dd><% }); %></dl>\
            <% } else if (type == "GistEvent") { %> \
                <b><%= payload.action %>d gist</b>: \
                <a href="<%= payload.url %>"><%= payload.desc %></a> \
            <% } else if (type == "CreateEvent") { %> \
                <b>created <%= payload.ref_type %></b> <a href="<%= url %>"> \
                <%= payload.ref %></a> in <a href="<%= repository.url %>"> \
                <%= repository.name %></a> \
            <% } else if (type == "PullRequestEvent") { %> \
                <b><%= payload.action %> pull request</b> \
                <a href="<%= payload.pull_request.html_url %>"> \
                #<%= payload.number %></a> for \
                <a href="<%= repository.url %>"> \
                <%= repository.owner %>/<%= repository.name %></a>: \
                <%= payload.pull_request.title %></a> \
            <% } else if (type == "IssueCommentEvent") { %> \
                <b>commented on issue</b> <a href="<%= url %>"> \
                #<% print(url.replace(/.*\\/issues\\/(\\d+)#.*/, "$1")); %> \
                </a> in <a href="<%= repository.url%>"> \
                <%= repository.owner %>/<%= repository.name %></a> \
            <% } else if (type == "ForkEvent") { %> \
                <b>forked</b> <a href="<%= repository.url %>"> \
                <%= repository.owner %>/<%= repository.name %></a> \
                to <a href="<%= url %>"> \
                <%= actor %>/<%= repository.name %></a> \
            <% } else if (type == "GollumEvent") { %> \
                <b><%= payload.pages[0].action %></b> the \
                <a href="<%= url %>">"<%= payload.pages[0].page_name %>" \
                wiki page</a> \
                in <a href="<%= repository.url%>"> \
                <%= repository.owner %>/<%= repository.name %></a> \
            <% } else { %> \
                Unknown event type <% type %> \
            <% } %>\
            </li>';               

    /**
     * Fill in activity into selector from public events for username,
     * with optional template selector tmpl_selector.
     */
    self.show_activity = function (username, selector, tmpl_selector) {
        var
            url = 'https://github.com/' + username + '.json?callback=?',
            template = $(tmpl_selector).html() || default_template,
            compiled = _.template(template),
            current_date = '',
            $current_list;

        $.getJSON(url, {}, function (data) {
            $.each(data.slice(0, 6), function(index, commit) {
                var date = commit.created_at.substring(0, 10);
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
