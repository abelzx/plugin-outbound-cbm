import { Actions } from "@twilio/flex-ui";
export const handleClose = () => {
  Actions.invokeAction("ToggleOutboundMessagePanel");
};

export const onSendClickHandler = (
  menuItemClicked,
  toNumber,
  messageType,
  messageBody,
  contentTemplateSid,
  fromNumber
) => {
  // Use the selected fromNumber, or fall back to env variables if not provided
  const defaultFromNumber = messageType === "whatsapp"
    ? process.env.FLEX_APP_TWILIO_WHATSAPP_FROM_NUMBER
    : process.env.FLEX_APP_TWILIO_FROM_NUMBER;
  
  const selectedFromNumber = fromNumber || defaultFromNumber;

  let payload = {
    destination: messageType === "whatsapp" ? "whatsapp:" + toNumber : toNumber,
    callerId:
      messageType === "whatsapp"
        ? "whatsapp:" + selectedFromNumber
        : selectedFromNumber,
    body: messageBody,
    contentTemplateSid,
    messageType,
    openChat: true,
    routeToMe: true,
  };

  // defer opening a task until customer replies
  switch (menuItemClicked) {
    case "SEND_MESSAGE_REPLY_ME":
      payload.openChat = false;
      payload.routeToMe = true;
      break;
    case "SEND_MESSAGE":
      payload.openChat = false;
      payload.routeToMe = false;
      break;
    default:
      break;
  }

  Actions.invokeAction("SendOutboundMessage", payload);
  Actions.invokeAction("ToggleOutboundMessagePanel");
};
