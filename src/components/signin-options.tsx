"use client";

import { signIn } from "next-auth/react";
import { Github as GithubIcon } from "lucide-react";

import { Button } from "@/src/components/ui/button";

const SignInOptions = () => {
  return (
    <div>
      <Button variant="outline" onClick={() => signIn("github")} className="w-80">
        <GithubIcon className={"mr-2 h-5 w-5"} />
        Github
      </Button>
    </div>
  );
};

export default SignInOptions;
