import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DiscordRedirect() {
  const router = useRouter();
  useEffect(() => {
    window.location.replace("https://discord.gg/zp4mfdsguA");
  }, []);
  return (
    <div style={{textAlign: 'center', marginTop: '2rem'}}>
      <h1>Redirecting to Discord...</h1>
      <p>If you are not redirected, <a href="https://discord.gg/zp4mfdsguA">click here</a>.</p>
    </div>
  );
}
