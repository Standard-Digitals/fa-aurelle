"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div>
      <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-white">
        Newsletter
      </h3>
      <p className="mb-6 text-[13px] font-light leading-relaxed text-white/45">
        Receive exclusive updates on new collections and rituals.
      </p>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          aria-label="Email address"
          className="w-full border-b border-white/20 bg-transparent pb-3 text-[13px] font-light text-white placeholder:text-white/40 focus:border-white focus:outline-none transition-colors duration-500"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="absolute bottom-3 right-0 text-white/50 transition-colors duration-500 hover:text-white"
        >
          <ArrowRight size={16} strokeWidth={1.2} />
        </button>
      </form>
    </div>
  );
}
