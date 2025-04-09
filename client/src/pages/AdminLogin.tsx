import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    hospitalId: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);

      // Normally you would validate these credentials against a backend
      // For demo purposes, we'll accept admin@example.com / password
      if (
        formData.email === "admin@example.com" &&
        formData.password === "password"
      ) {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard.",
        });

        // Store admin data in sessionStorage
        sessionStorage.setItem(
          "adminUser",
          JSON.stringify({
            email: formData.email,
            hospitalId: formData.hospitalId,
            name: "Admin User",
          })
        );

        navigate("/admin/dashboard");
      } else {
        toast({
          title: "Login failed",
          description:
            "Invalid credentials. Try using admin@example.com / password",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-gray-600 mt-2">
            Access the feedback management system
          </p>
        </div>

        <Card className="glass-card border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalId">Hospital ID</Label>
                <Input
                  id="hospitalId"
                  name="hospitalId"
                  placeholder="HOSP001"
                  value={formData.hospitalId}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full btn-hover"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-sm text-center">
                <span className="text-gray-600">Demo credentials: </span>
                <span className="font-medium">
                  admin@example.com / password
                </span>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Forgot your password? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
