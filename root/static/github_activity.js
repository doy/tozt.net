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
        default_template = '<li> \
            <% if (type == "PushEvent") { %> \
                <a href="https://github.com/<%= actor %>"><%= actor %></a> \
                <a href="<%= url %>">pushed</a> \
                to <a href="<%= repository.url %>"> \
                <%= repository.name %></a> on \
                <% print(created_at.substring(0, 10)); %>. \
                <ul><% _.each(payload.shas, function(sha) { %> \
                    <li> \
                    <a href="<%= repository.url %>/commit/<%= sha[0] %>"> \
                    <%= sha[0].substring(0,6) %></a> \
                    <%= (sha[2].split("\\n"))[0] %><% }); %></li></ul>\
            <% } else if (type == "GistEvent") { %> \
                <a href="https://github.com/<%= actor %>"><%= actor %></a> \
                <%= payload.action %>d gist: <a href="<%= payload.url %>">\
                <%= payload.desc %></a>.\
            <% } else if (type == "CreateEvent") { %> \
                <a href="https://github.com/<%= actor %>"><%= actor %></a> \
                created <%= payload.ref_type %> <a href="<%= url %>"> \
                <%= payload.ref %></a> in <a href="<%= repository.url %>"> \
                <%= repository.name %></a> on \
                <% print(created_at.substring(0, 10)); %>. \
            <% } else if (type == "PullRequestEvent") { %> \
                <a href="https://github.com/<%= actor %>"><%= actor %></a> \
                <%= payload.action %> pull request \
                <a href="<%= payload.pull_request.html_url %>"> \
                #<%= payload.number %>: <%= payload.pull_request.title %></a> \
                on <% print(created_at.substring(0, 10)); %>. \
            <% } else if (type == "IssueCommentEvent") { %> \
                <a href="https://github.com/<%= actor %>"><%= actor %></a> \
                commented on issue <a href="<%= url %>"> \
                #<% print(url.replace(/.*\\/issues\\/(\\d+)#.*/, "$1")); %> \
                </a> in <a href="<%= repository.url%>"><%= repository.name %> \
                </a> on <% print(created_at.substring(0, 10)); %>. \
            <% } else { %> \
                Unknown event type <% type %>. \
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
            compiled = _.template(template);

        $.getJSON(url, {}, function (data) {
            $.each(data.slice(0, 6), function(index, commit) {
                $(selector).append(compiled(commit));
            });
        });
    };

    return self;

}(jQuery, _));
