const cleaner = require("js-string-cleaner");
const cleanMD = require("remove-markdown");

module.exports = async (message, Filter) => {
  try {
    let msg = cleanMD(message.content);
    if (msg.length <= 0) msg = message.content;
    if (Filter.isProfane(cleaner(msg))) {
      message.delete();
      message
        .reply("Please don't use profanity.")
        .then((m) => m.delete({ timeout: 3000 }));
    } else return;
  } catch (err) {
    return err;
  }
};
