"use client";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction, signUpAction } from "@/actions/users";

interface Props {
  type: "login" | "signup";
}

const AuthForm = ({ type }: Props) => {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let errorMessage;
      let desc;

      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        desc = "You've been successfully logged in";
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
        desc = "You've been successfully signed up";
      }

      if (!errorMessage) {
        toast.success(desc);
        router.replace("/");
      } else {
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex gap-4 flex-col">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Enter your email"
          name="email"
          type="email"
          required
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="Enter your password"
          name="password"
          type="password"
          required
          disabled={isPending}
        />
      </div>
      <CardFooter className="px-0 mt-4 flex flex-col gap-4">
        <Button type="submit" className="w-full font-semibold cursor-pointer">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          {isLoginForm
            ? "Don't have an accoun yet?"
            : "Already have an account?"}{" "}
          <Link
            className={`text-blue-500 underline ${
              isPending ? "pointer-events-none opacity-30" : ""
            }`}
            href={isLoginForm ? "/sign-up" : "login"}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
};
export default AuthForm;
