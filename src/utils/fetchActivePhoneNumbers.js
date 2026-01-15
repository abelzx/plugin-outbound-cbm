import { Manager } from "@twilio/flex-ui";

const manager = Manager.getInstance();

export const fetchActivePhoneNumbers = async () => {
  const body = {
    Token: manager.store.getState().flex.session.ssoTokenPayload.token,
  };

  const options = {
    method: "POST",
    body: new URLSearchParams(body),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
  };
  try {
    const response = await fetch(
      `${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}/getActivePhoneNumbers`,
      options
    );

    const data = await response.json();
    return data.phoneNumbers;
  } catch (error) {
    console.error("Error fetching active phone numbers:", error);
    return [];
  }
};
