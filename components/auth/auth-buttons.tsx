"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AuthButtons() {
  const router = useRouter();
  
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleGoogleSignIn}
      >
        <Image
          src="/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        Lanjutkan dengan Google
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleGithubSignIn}
      >
        <Github className="w-5 h-5" />
        Lanjutkan dengan GitHub
      </Button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau lanjutkan dengan
          </span>
        </div>
      </div>
    </div>
  );
}