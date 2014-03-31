$(document).ready(function () {
	var githubApiUrl = 'https://api.github.com'
  	var thread = null;
  	
  	var milestone;
  	var issues;

  	function loadRepositories(githubUser) {
  		var repositoriesUrl = githubApiUrl + '/users/' + githubUser + '/repos';
    	$.get(repositoriesUrl, function( data ) {		
    		$("#repository").empty();			
			$.each(data, function(i, item) {
			    var repositoryName = data[i].name;
			    var repositoryHasIssues = data[i].has_issues;
			    if (i == 0) {
			    	loadMilestones(githubUser, repositoryName);
			    }
			    if (repositoryHasIssues == true) {
			    	$("#repository").append('<option value="' + repositoryName + '">' + repositoryName + '</option>');
			    }
		    });
	    });
  	}

  	function loadMilestones(githubUser, repository, state) {
  		state = state || "open";
  		var milestonesUrl = githubApiUrl + '/repos/' + githubUser + '/' + repository + '/milestones?state=' + state;
    	$.get(milestonesUrl, function( data ) {		
    		$("#milestone").empty();	
			$.each(data, function(i, item) {
			    var milestoneTitle = data[i].title;
			    var milestoneNumber = data[i].number;
			    if (i == 0) {
			    	loadIssues(githubUser, repository, milestoneNumber);
			    }
			    $("#milestone").append('<option value="' + milestoneNumber + '">' + milestoneTitle + '</option>');
		    });
	    });
  	}

  	function loadIssues(githubUser, repository, milestoneNumber) {
  		$('#issuesTextList').val('');
  		var issuesUrl = githubApiUrl + '/repos/' + githubUser + '/' + repository + '/issues?milestone=' + milestoneNumber + '&state=all';
    	$.get(issuesUrl, function( data ) {
    		issues = data;
    		$("#issuesRows").empty();
			$.each(data, function(i, item) {
		    	var issueState = data[i].state;
		    	var issueNumber = data[i].number;
		    	var issueTitle = data[i].title;
		    	var badgeClass = 'success';
		    	if (issueState == 'closed') { badgeClass = "primary"; }
		    	$("#issuesRows").append('<tr id="issue' + issueNumber + '" class="' + issueState + '"><td class="issueNumber">' + issueNumber + '</td><td class="issueTitle">' + issueTitle + '</td><td><span class="label label-' + badgeClass + '">' + issueState + '</span></td></tr>');

		    	addToTextList(issueNumber, issueTitle);
		    });
	    });
	    hideButtons($("#issuesFilterAll"));
  	}

  	function showIssues(issueStatus) {
		$("#issuesTextList").val('');
  		issueStatus = issueStatus || "all";
		$('#issuesRows tr').each(function() {
			if (issueStatus == 'all' || $(this).attr('class') == issueStatus) {
				$(this).show();
				addToTextList($(this).find('.issueNumber').html(), $(this).find('.issueTitle').html());
			} else {
				$(this).hide()
			}
		});
  	}

  	function hideButtons(objectToHide) {
  		$("#issuesFilters").find("button").show();
  		objectToHide.hide();
  	}

  	function addToTextList(issueNumber, issueTitle) {
  		currentContent = $('#issuesTextList').val();
  		issueLine = '#' + issueNumber + ' ' + issueTitle;
  		$('#issuesTextList').val(currentContent + issueLine + "\n");
  	}

	$('#listRepositories').click(function() {
		clearTimeout(thread);
		var githubUser = $('#githubUser').val();
		thread = setTimeout(function() { loadRepositories(githubUser); }, 100); 
	});

	$('#repository').change(function() {
		loadMilestones($('#githubUser').val(), $('#repository').val());
	});	
	$('#milestoneFilterOpen').click(function() {
		loadMilestones($('#githubUser').val(), $('#repository').val(), 'open');
	});
	$('#milestoneFilterClosed').click(function() {
		loadMilestones($('#githubUser').val(), $('#repository').val(), 'closed');
	});
	
	$('#milestone').change(function() {
		loadIssues($('#githubUser').val(), $('#repository').val(), $('#milestone').val());
	});
	$('#issuesFilterAll').click(function() {
		hideButtons($(this));
		showIssues('all');
	});
	$('#issuesFilterOpen').click(function() {
		hideButtons($(this));
		showIssues('open');
	});
	$('#issuesFilterClosed').click(function() {
		hideButtons($(this));
		showIssues('closed');
	});
});
