const Queue = require("bull");
const { sendPasswordToEmail } = require("./send-mail.utils");

const emailQueue = new Queue("emailQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
    tls: true,
    enableTLSForSentinelMode: false,
  },
});

emailQueue.process(async (job) => {
  const { email, subject, text } = job.data;
  await sendPasswordToEmail(email, subject, text);
});

module.exports = emailQueue;
