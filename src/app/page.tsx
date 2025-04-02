import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  return (
    <div className="min-h-screen w-full pt-24">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
        <h1 className="text-foreground text-2xl md:text-4xl text-center drop-shadow-xl px-4">
          Registered Disk One Radio
        </h1>
        <p className="text-foreground text-base md:text-lg py-2 text-center drop-shadow-xl px-4">
          Call me a WiFi Pinapple, cause I'm jammin'
        </p>
        <MusicPlayer />
      </div>
    </div>
  );
}
