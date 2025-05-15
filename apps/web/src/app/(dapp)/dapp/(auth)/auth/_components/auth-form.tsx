"use client";

import React from "react";

import { Button, ButtonIcon } from "@design-system/react/components/ui/button";
import { SeparatorWithText } from "@design-system/react/components/ui/separator-with-text";
import { toast } from "@design-system/react/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@design-system/react/components/ui/input";
import { APP_CONFIGS } from "@/boilerplate.config";
import { EmailSentMessage } from "./email-sent-message";
import { sendGTMEvent } from "@next/third-parties/google";
import { useSearchParams } from "next/navigation";

const authFormSchema = z.object({
  email: z.string().email(),
});

type AuthFormSchema = z.infer<typeof authFormSchema>;

export function AuthForm() {
  const searchParams = useSearchParams();
  const form = useForm({
    resolver: zodResolver(authFormSchema),
  });

  const [isLoading, setIsLoading] = React.useState({
    email: false,
  });
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [sentEmail, setSentEmail] = React.useState("");

  const handleSubmit = form.handleSubmit(async (data: AuthFormSchema) => {
    setIsLoading((prev) => ({ ...prev, email: true }));

    try {
      const callbackUrl = searchParams.get("callbackUrl");
      await signIn("email", {
        email: data.email,
        redirect: false,
        callbackUrl: callbackUrl ?? "/",
      });

      sendGTMEvent({
        event: "register",
        value: "lead",
      });

      toast({
        title: "Email enviado",
        description: `Enviamos um email para ${data.email} com um código de verificação.`,
      });
      setSentEmail(data.email);
      setIsEmailSent(true);
    } catch (error) {
      console.log(error);

      toast({
        title: "Erro ao enviar email",
        description: `Ocorreu um erro ao enviar o email para ${data.email}.`,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, email: false }));
    }
  });

  if (isEmailSent) {
    return <EmailSentMessage email={sentEmail} />;
  }

  return (
    <form
      className="flex flex-col items-center justify-center text-center h-full"
      onSubmit={handleSubmit}
    >
      <div className="w-full space-y-8 mb-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-mail"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Acesse sua conta</h2>
            <p className="text-sm text-muted-foreground">
              Enviaremos um link mágico para o seu email para você acessar sua
              conta.
            </p>
          </div>
        </div>

        <Input
          variant="outline"
          placeholder="Seu email"
          className="h-12"
          {...form.register("email")}
        />
      </div>

      <footer className="mt-auto space-y-8 w-full">
        <span className="text-sm opacity-60 max-w-[80%]">
          Ao se inscrever, você concorda com nossos <br />
          termos{" "}
          <a
            href={APP_CONFIGS.app.links.terms}
            target="_blank"
            className="underline"
          >
            <b>Termos de Uso</b>
          </a>
        </span>

        <Button size="lg" className="w-full h-12 rounded-full" type="submit">
          <ButtonIcon className="w-4 h-4 mr-3" isLoading={isLoading.email} />
          Continuar com email
        </Button>
      </footer>
    </form>
  );
}
