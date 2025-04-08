import { useState, useCallback } from "react";
import { NotificationMessage } from "../types";

export const useClipboard = () => {
  const [notificationMessage, setNotificationMessage] =
    useState<NotificationMessage>({
      text: "",
      timestamp: 0,
    });

  const copyToClipboard = useCallback(
    (text: string, message: string = "Copied to clipboard!") => {
      if (text) {
        navigator.clipboard.writeText(text).then(
          () => {
            setNotificationMessage({
              text: message,
              timestamp: Date.now(),
            });
            setTimeout(() => {
              setNotificationMessage((prev) =>
                prev.timestamp === Date.now()
                  ? { text: "", timestamp: 0 }
                  : prev
              );
            }, 2000);
          },
          () => {
            setNotificationMessage({
              text: "Failed to copy!",
              timestamp: Date.now(),
            });
            setTimeout(() => {
              setNotificationMessage((prev) =>
                prev.timestamp === Date.now()
                  ? { text: "", timestamp: 0 }
                  : prev
              );
            }, 2000);
          }
        );
      } else {
        setNotificationMessage({
          text: message,
          timestamp: Date.now(),
        });
        setTimeout(() => {
          setNotificationMessage((prev) =>
            prev.timestamp === Date.now() ? { text: "", timestamp: 0 } : prev
          );
        }, 2000);
      }
    },
    []
  );

  return {
    copyToClipboard,
    notificationMessage,
  };
};
