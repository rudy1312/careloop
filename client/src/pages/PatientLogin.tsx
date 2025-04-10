import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import axios from "axios";
import Cookies from "js-cookie";

const PatientLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    patientId: "",
    mobileNumber: "",
    hospitalId: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("https://careloop.onrender.com/bloom/v1/api/patient/log", {
        fullName: formData.name,
        patientID: formData.patientId,
        mobile: formData.mobileNumber,
        hospitalID: formData.hospitalId,
      });

      toast({
        title: "Login successful",
        description: response.data.msg,
      });

      navigate("/patient/dashboard");

      const fiveHoursFromNow = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);

      Cookies.set("patientData", JSON.stringify(formData), { expires: fiveHoursFromNow });


    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Patient Feedback</h1>
          <p className="text-gray-600 mt-2">Login to share your experience</p>
        </div>

        <Card className="glass-card border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl">Patient Login</CardTitle>
            <CardDescription>
              Please enter your details to continue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  name="patientId"
                  placeholder="PAT123456"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.mobileNumber}
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

            <CardFooter className="flex-col space-y-4">
              <Button
                type="submit"
                className="w-full btn-hover"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-sm text-center">
                Don't have an account?{" "}
                <Link
                  to="/register/patient"
                  className="text-primary font-medium hover:underline"
                >
                  Register now
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Having trouble logging in? Please contact the hospital reception
            desk.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
