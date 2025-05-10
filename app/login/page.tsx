import AuthForm from "@/components/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  return (
    <div className="flex items-center mt-20 flex-1 flex-col">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">Login</CardTitle>
        </CardHeader>

        <CardContent>
          <AuthForm type="login" />
        </CardContent>
      </Card>
    </div>
  );
};
export default LoginPage;
