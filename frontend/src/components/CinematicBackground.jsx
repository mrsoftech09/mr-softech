const source = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4';

export default function CinematicBackground() {
  return (
    <div className="cinematic-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#071426]">
      <video
        autoPlay
        loop
        muted
        playsInline
        src={source}
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-[#071426]/88" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(71,118,238,.24),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(93,224,255,.15),transparent_30%)]" />
    </div>
  );
}