import { useCallback, useEffect, useRef } from "react";

const Game: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendMessageToIframe = useCallback(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const iframeWindow = iframeRef.current?.contentWindow;

    if (accessToken && refreshToken && iframeWindow) {
      iframeWindow.postMessage(
        { accessToken, refreshToken },
        "/web-desktop/index.html"
      );
    }
  }, []);

  const handleMessageFromIframe = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== "/web-desktop/index.html") return;

      const { data: message } = event;
      console.log(message);

      if (message === "connected") {
        sendMessageToIframe();
      }
    },
    [sendMessageToIframe]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessageFromIframe);

    return () => {
      window.removeEventListener("message", handleMessageFromIframe);
    };
  }, [handleMessageFromIframe]);

  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <iframe
        ref={iframeRef}
        src="/web-desktop/index.html"
        width="100%"
        height="100%"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
};

export default Game;
