"use client";

import React from "react";

interface EmailSentMessageProps {
  email: string;
}

export function EmailSentMessage({ email }: EmailSentMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full space-y-6 px-4">
      {/* Email Sent Icon */}
      <div className="p-4 rounded-full bg-primary/10 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-mail-check"
        >
          <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          <path d="m16 19 2 2 4-4" />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-bold">Verifique seu email</h2>

      {/* Message */}
      <p className="text-sm text-muted-foreground max-w-sm">
        Enviamos um link mágico para <strong>{email}</strong>. Por favor,
        verifique sua caixa de entrada e clique no link para acessar sua conta.
      </p>

      {/* Optional: Add instructions or a link to resend */}
      {/* <p className="text-xs text-muted-foreground mt-4">Não recebeu o email? Verifique sua pasta de spam ou tente novamente.</p> */}
    </div>
  );
}
