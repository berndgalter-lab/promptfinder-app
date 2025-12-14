'use client';

import { Button } from "@/components/ui/button";

export function ScrollButton() {
  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button 
      size="lg" 
      variant="ghost"
      onClick={scrollToHowItWorks}
      className="!text-white hover:!bg-zinc-800 !border !border-zinc-700 text-base px-8 py-6 transition-all duration-300"
    >
      See How It Works
    </Button>
  );
}

