'use strict';

const positive_messages = {
	'created_successfully': 'Created Successfully'
};

const negative_messages = {
	'creation_failed': 'Creation Failed!',
	'already_exists': "Already Exists!"	
};

const user_role = {
	'name': 'User Role'
};

const sms_details = {
SMS_API_URL: 'http://trans.smsfresh.co/api/sendmsg.php',
SMS_USER_ID : 'tripborn01',
SMS_USER_PASSWORD : 123456,
SMS_SENDER : 'BUSNXT'
}

const email_details = {
	email : 'relay7@takniki.com',
	password : 'Takniki@Relay07',
	email_host : 'mail.tripborn.com',
	email_from : 'bus@busnext.com'
}

export {positive_messages,negative_messages,user_role,sms_details,email_details};

