const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(async function (context, event, callback) {
  const response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  response.appendHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, X-Requested-With"
  );
  response.appendHeader("Access-Control-Max-Age", "3600");
  response.appendHeader("Content-Type", "application/json");

  if ((event.method || event.httpMethod || "").toUpperCase() === "OPTIONS") {
    response.setStatusCode(200);
    return callback(null, response);
  }

  try {
    const client = context.getTwilioClient();

    // Fetch incoming phone numbers with SMS capability
    const phoneNumbers = await client.incomingPhoneNumbers.list({
      limit: 1000,
    });

    // Filter and format phone numbers with SMS capability
    const formattedPhoneNumbers = phoneNumbers
      .filter((phoneNumber) => {
        // Check if the phone number has SMS capability
        return phoneNumber.capabilities && phoneNumber.capabilities.sms === true;
      })
      .map((phoneNumber) => ({
        phoneNumber: phoneNumber.phoneNumber,
        friendlyName: phoneNumber.friendlyName || phoneNumber.phoneNumber,
        sid: phoneNumber.sid,
      }));

    response.setStatusCode(200);
    response.setBody({ phoneNumbers: formattedPhoneNumbers });

    return callback(null, response);
  } catch (error) {
    console.error("Error:", error);

    response.setStatusCode(500);
    response.setBody({
      error: true,
      message: error.message,
    });

    return callback(null, response);
  }
});
