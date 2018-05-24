# Gmail Retention Policy

Perhaps you have noticed that you are unable to make a filter with an age interval instead of a fixed date.  Perhaps you have noticed that Gmail likes to keep everything, even things that become meaningless after some time.  Maybe you get an (opt-in) advertisement from a retailer with a coupon code for the next week, do you really need to keep that email forever?  Logic tells me *"no"*, but apparently Gmail says *"YESSS!!  MOAR DATA!!!  KEEP ALL DA EMAILZ!!"*

Even large corporations understand the value of having a retention policy for emails. (Check with yours before you start defining your own rules)


## Pre-Requisites

In order for this script to work as-is you will need the following labels in your Gmail account available to tag emails.  It isn't neccessary to add them all, these are the rules mapped in the source code as it is here. 

- retention
    - keep1day
    - keep3days
    - keep7days
    - keep1month
    - keep3months
    - keep1year

It is beneficial to have these underneath the parent label.  Since these are just for your retention policy and not for categorizing, you could also hide the parent label from your sidebar as well.


## Script Setup

Goto [Google Apps Script](https://script.google.com) and sign in with your Gmail account.  Create a new project, and replace the empty project placeholder with the contents of the localEmailExpiration.js file.  Save this file and give it a memorable name.  The name is so you will know what it is when you see it in your Google Drive.

In the function dropdown select *"Install"* and then click the  *"play"* button (looks like a triangle). The system will ask you to confirm the permissions needed by the script.  Accept these permissions and then click the *play* button one more time.  The script will schedule itself to run each day at midnight.


## Script Removal

When you no longer want the script to purge your expired emails, then log back into Google Apps Script. Edit the project.  Select the *"Uninstall"* function from the dropdown, and click the *"play"* button.  This will remove any scheduled executions of the script.


## Extend Your Script

The script itself has many comments if you would like to adjust it's innerworkings.

### Custom Retention Labels
If you have need of more complex retention durations, the MAP variable near the top can be updated to add additional rules.

~~~
// Map retention labels from Gmail to their lifespan
// Specify the TTL for each label, emails will be deleted after that
var MAP = [
	//the TTL is in days
	{label:"keep1day",	TTL:1},
	{label:"keep3days",	TTL:3},
	{label:"keep7days",	TTL:7},
	{label:"keep1month",	TTL:30},
	{label:"keep3months",	TTL:90},
	{label:"keep1year",	TTL:365},
	//add more if needed
];
~~~

### Keep Unread Email
If you want to keep all unread email regardless of retention label:

```
var KEEP_UNREAD = true;
```
The default is to not retain unread email.
