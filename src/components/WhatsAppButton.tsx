import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  groupLink?: string; // Direct WhatsApp group link
  message?: string;
  variant?: "floating" | "fixed" | "inline";
  className?: string;
}

// Default WhatsApp group link for the floating button
const DEFAULT_GROUP_LINK = "https://chat.whatsapp.com/FAw73t4bg4a7ZO5dFVN6pC?mode=gi_t";

export function WhatsAppButton({
  phoneNumber,
  groupLink,
  message = "Olá! Gostaria de saber mais sobre o E Vibe Coding 1.0",
  variant = "floating",
  className = "",
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);

  // For floating button, always use group link
  // For other variants, use phone number if provided
  const getUrl = () => {
    if (variant === "floating") {
      return groupLink || DEFAULT_GROUP_LINK;
    }
    if (groupLink) return groupLink;
    if (phoneNumber) return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    return DEFAULT_GROUP_LINK;
  };

  const url = getUrl();
  const baseStyles = "flex items-center gap-2 font-semibold transition-all duration-300";

  const variantStyles = {
    floating: "fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 bg-green-500 text-white animate-pulse hover:animate-none",
    fixed: "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-full shadow-lg hover:shadow-xl bg-accent text-accent-foreground",
    inline: "px-6 py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90",
  };

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles} ${variantStyles.floating} ${className}`}
        aria-label="Entrar no grupo do WhatsApp"
      >
        <MessageCircle size={32} />
      </a>
    );
  }

  if (variant === "fixed") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles} ${variantStyles.fixed} ${className}`}
        aria-label="Entrar em contato via WhatsApp"
      >
        <MessageCircle size={20} />
        <span>Grupo Exclusivo</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variantStyles.inline} ${className}`}
      aria-label="Entrar em contato via WhatsApp"
    >
      <MessageCircle size={18} />
      <span>Entrar no Grupo</span>
    </a>
  );
}
