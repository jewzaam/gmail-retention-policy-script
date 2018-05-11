/*	Code adapted from https://ctrlq.org/code/19383-bulk-delete-gmail	*/
/*	To use: Select Run > Install  (Accept the requested permissions for the script)	*/
/*	Think carefully about security and company policy before you apply these retention labels	*/

// Map retention labels from Gmail to their lifespan
// Specify the TTL for each label, emails will be deleted after that
var PARENT_LABEL="retention/"
	// If you have the labels below at the root level, set PARENT_LABEL to an empty string.
var MAP = [
	//the TTL is in days
	{label:"keep1day",	TTL:1},
	{label:"keep3days",	TTL:3},
	{label:"keep7days", TTL:7},
	{label:"keep1month", TTL:30},
	{label:"keep3months", TTL:90},
	{label:"keep1year", TTL:365},
	//add more if needed
];

function Intialize() {
	return;
}

function Install() {
	//this is optional, but it will make the script process when it is installed
	//good for validation everything is as you expect it
	ScriptApp.newTrigger("cleanupTags")
			.timeBased()
			.at(new Date((new Date()).getTime() + 1000*60*1))
			.create();
	//schedule the cleanup to run the everyday at midnight
	ScriptApp.newTrigger("cleanupTags")
			.timeBased().everyDays(1).create();
	return;
}

function Uninstall() {
	//locate all the triggers created for the script
	//remove them when uninstalling
	var triggers = ScriptApp.getProjectTriggers();
	for (var i=0; i<triggers.length; i++) {
		ScriptApp.deleteTrigger(triggers[i]);
	}
	//This will need to be run manually if you want to remove the script
	//OR if you alter the script and want to reinstall
	return;
}


function cleanupTags() {
	//iterate through the rules in the MAP
	for (var i=0; i<MAP.length; i++) {
		//prepare the date value for the filter string
		var age = new Date();
		var rule = MAP[i];
		//subtract the TTL days from the current date for the 'before:' clause in the search
		age.setDate(age.getDate() - rule['TTL']);
		//convert to a simple format google will recognise
		var purge  = Utilities.formatDate(age, Session.getScriptTimeZone(), "yyyy-MM-dd");
		//build the filter string
		var search = "label:" + PARENT_LABEL + rule['label'] + " AND before:" + purge;
		//this is just like the filter you would type in manually
		try {
		    //We are processing in pages of 100 messages to prevent script errors
		    //large search results may throw Exceed Maximum Execution Time exception in Apps Script
			var threads = GmailApp.search(search, 0, 100);

			//if there is more than one page of results
			//create another time-based trigger for 'N' minutes from now
			if (threads.length == 100) {
				ScriptApp.newTrigger("cleanupTags")
					.timeBased()				//In this case N = 10
					.at(new Date((new Date()).getTime() + 1000*60*10))
					.create();
			}

			// If nothing matches, just move on
			if (threads.length > 0) {
				// An email thread may have multiple messages and the timestamp of individual messages can be different.
				for (var i=0; i<threads.length; i++) {
					//search returns threads, which may have more than one email
					//pull out the list of messages in the thread
					var messages = GmailApp.getMessagesForThread(threads[i]);
					for (var j=0; j<messages.length; j++) {
						//iterate through the list of messages in the thread
						//pull out each email
						var email = messages[j];
						//make sure to delete only messages in the thread older than the TTL
						if (email.getDate() < age) {
							email.moveToTrash();
						}
					}
				}
			}

		} catch (e) {
			// If the script fails for some reason or catches an exception, it will simply defer auto-purge until the next day.
			// Could add more logic here to notify the user, but that would complicate the script.
		}
		age = null;
		rule = null;
		purge = null;
		search = null;
	}
	return;
}
