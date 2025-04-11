import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mic,
  Video,
  Upload,
  Check,
  User,
  Brush,
  CreditCard,
  MessageSquare,
  Zap,
  Utensils,
  Bed,
  Stethoscope,
  Smartphone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { departments } from "@/data/constants";
import Cookies from "js-cookie";
import axios from "axios";

const grievanceAreas = [
  { id: "staff", name: "Staff", icon: User },
  { id: "cleanliness", name: "Cleanliness", icon: Brush }, // Changed from Broom to Brush
  { id: "billing", name: "Billing", icon: CreditCard },
  { id: "communication", name: "Communication", icon: MessageSquare },
  { id: "efficiency", name: "Efficiency", icon: Zap },
  { id: "food-amenities", name: "Food and Amenities", icon: Utensils },
  { id: "comfort-privacy", name: "Comfort and Privacy", icon: Bed },
  { id: "post-discharge", name: "Post-Discharge Care", icon: Stethoscope }, // Changed from FirstAid to Stethoscope
  { id: "digital-experience", name: "Digital Experience", icon: Smartphone },
];

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedGrievanceArea, setSelectedGrievanceArea] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedMedia, setRecordedMedia] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("text");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myFeedbacks, setMyFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async (patientID) => {
      try {
        const res = await axios.post(
          "https://careloop.onrender.com/bloom/v1/api/patient/fetchMy",
          { patientID }
        );
        const response = res.data;
        console.log("✅ Feedbacks fetched:", res.data);
        setMyFeedbacks(response.my_feedbacks);
      } catch (error) {
        console.error("❌ Failed to fetch feedbacks:", error);
      }
    };

    const patientData = Cookies.get("patientData");

    if (patientData) {
      const parsedData = JSON.parse(patientData);
      console.log("Patient data from cookies:", parsedData);
      setPatientInfo(parsedData);

      // Call API only after setting state
      fetchFeedbacks(parsedData.patientId);
    } else {
      console.warn("No patient data found in cookies.");
      navigate("/login/patient");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://careloop.onrender.com/bloom/v1/api/patient/out",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("Logout response:", data);

      // Clear sessionStorage
      sessionStorage.removeItem("adminUser");

      // Remove cookie (in case backend didn't or for double-safety)
      Cookies.remove("patientData");

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const simulateRecording = () => {
    setIsRecording(true);

    // Simulate recording process
    setTimeout(() => {
      setIsRecording(false);
      setRecordedMedia("data:mock");

      toast({
        title: activeTab === "voice" ? "Voice recorded" : "Video recorded",
        description: "Your recording has been captured successfully.",
      });
    }, 3000);
  };

  const clearRecording = () => {
    setRecordedMedia(null);
  };

  const simulateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRecordedMedia(URL.createObjectURL(file));

      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });

      const formData = new FormData();
      formData.append("audio", file);

      try {
        const response = await fetch(
          "https://careloop.onrender.com/bloom/v1/api/upload/audio",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const result = await response.json();
        console.log("Upload Success:", result);

        console.log(result.fileUrl);
        console.log(result.publicId);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    }
  };

  const handleSubmitFeedback = async () => {
    const feedbackData = {
      patientID: patientInfo.patientId,
      hospitalID: patientInfo.hospitalId,
      departmentId: selectedDepartment,
      sentimentIndex: 1,
      topic: selectedGrievanceArea,
      contentTypeIndex: 0,
      textContent: feedbackText,
      mediaContent: null,
    };

    try {
      const response = await axios.post(
        "https://careloop.onrender.com/bloom/v1/api/patient/feed",
        feedbackData
      );

      if (response.status === 201) {
        setSelectedDepartment("");
        setSelectedGrievanceArea("");
        setFeedbackText("");
      }

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });

      window.location.reload();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast({
        variant: "destructive",
        title: "Feedback submission failed",
        description: "Please try again later.",
      });
    }
  };

  if (!patientInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {patientInfo.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-medium">{patientInfo.name}</h1>
                <p className="text-sm text-gray-600">
                  Patient ID: {patientInfo.patientId}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Submit Your Feedback</CardTitle>
            <CardDescription>
              Your feedback helps us improve our services. Please share your
              experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="department">Select Department</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments
                      .filter((dept) => dept.id !== "all")
                      .map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grievance-area">Area of Grievance</Label>
                <Select
                  value={selectedGrievanceArea}
                  onValueChange={setSelectedGrievanceArea}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area of concern" />
                  </SelectTrigger>
                  <SelectContent>
                    {grievanceAreas.map((area) => (
                      <SelectItem
                        key={area.id}
                        value={area.id}
                        className="flex items-center"
                      >
                        <div className="flex items-center gap-2">
                          <area.icon className="h-4 w-4 text-primary mr-2" />
                          {area.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="text">Text Feedback</TabsTrigger>
                <TabsTrigger value="voice">Voice Feedback</TabsTrigger>
                <TabsTrigger value="video">Video Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Please share your experience with us..."
                  className="min-h-[200px]"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="voice" className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  {!recordedMedia ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mic className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">
                          Record Your Voice Feedback
                        </h3>
                        <p className="text-sm text-gray-600">
                          Click the button below to start recording or upload an
                          audio file.
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={simulateRecording}
                          disabled={isRecording}
                          className="space-x-2"
                        >
                          <Mic className="h-4 w-4" />
                          <span>
                            {isRecording ? "Recording..." : "Start Recording"}
                          </span>
                        </Button>
                        <div className="relative">
                          <Button variant="outline" className="space-x-2">
                            <Upload className="h-4 w-4" />
                            <span>Upload Audio</span>
                          </Button>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={simulateFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Audio Ready</h3>
                        <p className="text-sm text-gray-600">
                          Your audio has been recorded successfully.
                        </p>
                      </div>
                      <Button variant="outline" onClick={clearRecording}>
                        Record Again
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  {!recordedMedia ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Video className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">
                          Record Your Video Feedback
                        </h3>
                        <p className="text-sm text-gray-600">
                          Click the button below to start recording or upload a
                          video file.
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button
                          onClick={simulateRecording}
                          disabled={isRecording}
                          className="space-x-2"
                        >
                          <Video className="h-4 w-4" />
                          <span>
                            {isRecording ? "Recording..." : "Start Recording"}
                          </span>
                        </Button>
                        <div className="relative">
                          <Button variant="outline" className="space-x-2">
                            <Upload className="h-4 w-4" />
                            <span>Upload Video</span>
                          </Button>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={simulateFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Video Ready</h3>
                        <p className="text-sm text-gray-600">
                          Your video has been recorded successfully.
                        </p>
                      </div>
                      <Button variant="outline" onClick={clearRecording}>
                        Record Again
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="pt-4">
              <Button
                className="w-full btn-hover"
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {myFeedbacks.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-0">
            {myFeedbacks.map((fb, idx) => (
              <Card
                key={idx}
                className="bg-white shadow-md border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Department: {fb.departmentId}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Topic: {fb.topic}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p>
                      <span className="font-medium text-gray-900">
                        Patient ID:
                      </span>{" "}
                      {fb.patientID}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Hospital ID:
                      </span>{" "}
                      {fb.hospitalID}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Sentiment:
                      </span>{" "}
                      <span
                        className={`${
                          fb.sentimentIndex === -1
                            ? "text-red-500"
                            : fb.sentimentIndex === 1
                            ? "text-green-600"
                            : "text-yellow-600"
                        } font-semibold`}
                      >
                        {fb.sentimentIndex === -1
                          ? "Negative"
                          : fb.sentimentIndex === 1
                          ? "Positive"
                          : "Neutral"}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">
                        Content Type:
                      </span>{" "}
                      {fb.contentTypeIndex === 0
                        ? "Text"
                        : fb.contentTypeIndex === 1
                        ? "Voice"
                        : "Video"}
                    </p>
                  </div>

                  <div>
                    <p>
                      <span className="font-medium text-gray-900">
                        Feedback:
                      </span>{" "}
                      {fb.textContent || "—"}
                    </p>
                  </div>

                  {fb.mediaContent && (
                    <p>
                      <a
                        href={fb.mediaContent}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Media
                      </a>
                    </p>
                  )}

                  <div className="pt-2 border-t border-gray-100">
                    <p>
                      <span className="font-medium text-gray-900">
                        Admin Response:
                      </span>{" "}
                      {fb.response_status ? fb.response : "Not yet responded"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
