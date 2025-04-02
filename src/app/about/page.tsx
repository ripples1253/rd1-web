import Navbar from "@/components/Navbar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function About() {
    return (
        <div className="h-screen w-screen pt-24">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-foreground text-4xl mb-8">
                    About
                </h1>
                <Accordion type="single" collapsible className="w-1/2 bg-primary/20 backdrop-blur-[2px] p-4 rounded-lg shadow-md">
                    <AccordionItem value="item-1" className="mb-4">
                        <AccordionTrigger className="text-center text-base flex justify-center">
                            <div className="flex-1 text-center">What is Registered Radio One?</div>
                        </AccordionTrigger>
                        <AccordionContent className="text-center">
                            Registered Radio One is an internet radio station, created as a passion project by <a href="https://github.com/ripples1253" className="text-accent hover:underline">Ripley</a> and their friends.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="mb-4">
                        <AccordionTrigger className="text-center text-base flex justify-center">
                            <div className="flex-1 text-center">What do we play?</div>
                        </AccordionTrigger>
                        <AccordionContent className="text-center">
                            Honestly, it's kinda random. We play a bit of everything, but we lean more towards alternative rock, indie, rap, and vibe-y music.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="mb-4">
                        <AccordionTrigger className="text-center text-base flex justify-center">
                            <div className="flex-1 text-center">How can I suggest a song?</div>
                        </AccordionTrigger>
                        <AccordionContent className="text-center">
                            You can suggest a song by clicking the big button in the bottom right corner of the screen called <span className="font-semibold">Suggest Song</span>. Bruh.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="mb-4">
                        <AccordionTrigger className="text-center text-base flex justify-center">
                            <div className="flex-1 text-center">What's with the name?</div>
                        </AccordionTrigger>
                        <AccordionContent className="text-center">
                            The name comes from a collectable on Ripley's desk. <img src="/images/about/DOOMDisk.webp" alt="A photo of the collectable DOOM Metal Floppy Disk, sold in GAME and other stores." className="w-1/2 mx-auto mt-4" />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5" className="mb-4">
                        <AccordionTrigger className="text-center text-base flex justify-center">
                            <div className="flex-1 text-center">How often is new music added?</div>
                        </AccordionTrigger>
                        <AccordionContent className="text-center">
                            We aim to add new music every week, however, this is not always possible. Please be patient with me, I have a life too!
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
