import React, { useState } from "react";
import { Tags } from "lucide-react";
import PreferenceModal from "./PreferenceModal";

export default function CreateButtons() {
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-15 lg:bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => setIsPreferenceModalOpen(true)}
          aria-label="Open preferences"
          className="relative flex h-10 md:h-14 w-10 md:w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl outline-none transition-transform duration-200 hover:scale-105"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/30" />
          <span className="relative flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-secondary">
            <Tags className="h-4 md:h-6 w-4 md:w-6" />
          </span>
        </button>
      </div>

      <PreferenceModal
        isOpen={isPreferenceModalOpen}
        onClose={() => setIsPreferenceModalOpen(false)}
      />
    </>
  );
}
