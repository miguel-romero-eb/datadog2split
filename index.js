const SplitFactory = require("@splitsoftware/splitio").SplitFactory;

const factory = SplitFactory({
  core: {
    authorizationKey: "YOUR_SDK_KEY",
  },
});

// Store the current alert status
let isAlertTriggered = false;

exports.handler = async (event) => {
  const payload = JSON.parse(event.body);
  const client = factory.client();

  // Check if the payload contains an alert event
  if (payload.event_type === "alert_event") {
    // Extract the relevant information from the payload
    const alertName = payload.monitor.name;
    const monitorStatus = payload.status;

    if (monitorStatus === "alert" && !isAlertTriggered) {
      // Kill the feature flag
      client.kill("your_feature_flag_key");
      console.log(`Feature flag killed for alert: ${alertName}`);
      isAlertTriggered = true;
    } else if (monitorStatus === "ok" && isAlertTriggered) {
      // Revert the feature flag
      client.revive("your_feature_flag_key");
      console.log(`Feature flag reverted for alert: ${alertName}`);
      isAlertTriggered = false;
    }
  }

  return {
    statusCode: 200,
    body: "Webhook received successfully",
  };
};
