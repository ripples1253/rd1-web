import Image from "next/image";
import Navbar from "@/components/Navbar";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  return (
    <div className="h-screen w-screen pt-24">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-foreground text-4xl">
          Registered Disk One Radio
        </h1>
        <p className="text-foreground text-lg py-2">
        Call me a WiFi Pinapple, cause I'm jammin'
        </p>
        <MusicPlayer />
      </div>
    </div>
  );
}
