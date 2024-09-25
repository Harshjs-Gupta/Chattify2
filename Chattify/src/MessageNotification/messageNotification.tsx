// Function to send notification to a user
export const sendNotificationToUser = async (
  recipientId: string,
  message: string,
) => {
  try {
    // Fetch the recipient's FCM token from the server/database
    const recipientToken = await fetch(`/api/get-recipient-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipientId }), // Pass recipientId to get the token
    }).then((res) => res.json());

    if (!recipientToken) {
      throw new Error("No token found for recipient");
    }

    const Project_ID = "chattify-7174d";
    // Send the notification using Firebase cloud function endpoint
    const response = await fetch(
      `https://us-central1-${Project_ID}.cloudfunctions.net/sendNotification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientToken, // Use the fetched recipient token
          message, // Message body
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }

    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// Function to send the FCM token to your server
export const sendTokenToServer = async (token: string) => {
  try {
    const response = await fetch("/api/save-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error("Failed to save token");
    }

    const data = await response.json();
    console.log("Token saved successfully:", data);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};
