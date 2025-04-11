import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  Users,
  MessageSquare,
  Video,
  Mic,
  Filter,
  ClipboardCheck,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  departments,
  mockFeedbackData,
  monthlySentimentData,
  feedbackTopicsData,
  departmentPerformanceData,
  COLORS,
} from "@/data/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import axios from "axios";
import { set } from "date-fns";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [allFeedbacks, setAllFeedbacks] = useState<any[]>([]);
  const [activeResponseIndex, setActiveResponseIndex] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [showActionPlan, setShowActionPlan] = useState(false);

  useEffect(() => {
    const fetchAllFeedbacks = async () => {
      try {
        const res = await axios.get(
          "https://careloop.onrender.com/bloom/v1/api/admin/fetchAll",
          {
            withCredentials: true,
          }
        );
        const data = res.data.allFeedbacks;

        const transformedData = data.map((item) => ({
          ...item,
          id: item._id,
        }));

        setAllFeedbacks(transformedData);
        console.log("Fetched feedbacks:", transformedData);
      } catch (error) {
        console.error("Error fetching feedbacks:", error.message);
      }
    };

    const adminData = Cookies.get("adminLoginData");
    console.log("Admin data from cookie:", adminData);

    if (adminData) {
      const parsedData = JSON.parse(adminData);
      setAdminInfo(parsedData);
      fetchAllFeedbacks();
    } else {
      console.warn("No admin cookie found. Redirecting to login.");
      navigate("/login/admin");
    }
  }, [navigate]);

  // Separate effect for filtering feedbacks based on selectedDepartment and allFeedbacks
  useEffect(() => {
    if (selectedDepartment === "all") {
      setFeedbackList(allFeedbacks);
    } else {
      setFeedbackList(
        allFeedbacks.filter(
          (item) =>
            item.departmentId?.toLowerCase().trim() ===
            selectedDepartment.toLowerCase().trim()
        )
      );
    }
  }, [selectedDepartment, allFeedbacks]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://careloop.onrender.com/bloom/v1/api/admin/out",
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
      Cookies.remove("adminLoginData");

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    console.log("Selected department:", value);
  };

  const handleDownloadActionPlan = () => {
    setShowActionPlan(true);
  };

  const handleCloseActionPlan = () => {
    setShowActionPlan(false);
    toast({
      title: "Action Plan Reviewed",
      description: "Action plan has been successfully reviewed.",
    });
  };

  const handleDownloadPDF = () => {
    // In a real application, this would generate and download a PDF
    toast({
      title: "Action Plan Downloaded",
      description: "Weekly action plan has been downloaded as PDF.",
    });
    setShowActionPlan(false);
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <Badge className="bg-green-500">Positive</Badge>;
      case "neutral":
        return <Badge className="bg-blue-500">Neutral</Badge>;
      case "negative":
        return <Badge className="bg-red-500">Negative</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      case "voice":
        return <Mic className="h-4 w-4 text-gray-500" />;
      case "video":
        return <Video className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const generateActionPlanItems = () => {
    const negativeCount = feedbackList.filter(
      (f) => f.sentiment === "negative"
    ).length;
    const totalCount = feedbackList.length;
    const negativePercentage =
      totalCount > 0 ? Math.round((negativeCount / totalCount) * 100) : 0;

    // Determine which departments have the most negative feedback
    const departmentNegativeCounts: Record<string, number> = {};
    feedbackList.forEach((feedback) => {
      if (feedback.sentiment === "negative") {
        departmentNegativeCounts[feedback.departmentName] =
          (departmentNegativeCounts[feedback.departmentName] || 0) + 1;
      }
    });

    const sortedDepartments = Object.entries(departmentNegativeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => name);

    return [
      {
        id: 1,
        title: "Address Negative Feedback",
        description: `${negativePercentage}% of feedback is negative. Focus on addressing the most common negative feedback topics.`,
        priority: "High",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      },
      {
        id: 2,
        title: "Staff Training Program",
        description: `Implement additional training for staff in ${sortedDepartments.join(
          ", "
        )} departments to improve patient experience.`,
        priority: "Medium",
        icon: <BadgeCheck className="h-5 w-5 text-amber-500" />,
      },
      {
        id: 3,
        title: "Communication Improvement",
        description:
          "Enhance communication channels between departments and with patients to ensure clear and timely information sharing.",
        priority: "Medium",
        icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      },
      {
        id: 4,
        title: "Patient Follow-up System",
        description:
          "Develop a structured follow-up system to check on patients after discharge and collect additional feedback.",
        priority: "Low",
        icon: <ClipboardCheck className="h-5 w-5 text-green-500" />,
      },
    ];
  };

  const handleRespondClick = (index) => {
    setActiveResponseIndex(activeResponseIndex === index ? null : index);
    setResponseMessage("");
  };

  const handleSubmitResponse = async (feedbackID) => {
    try {
      const res = await axios.post(
        "https://careloop.onrender.com/bloom/v1/api/admin/respond",
        {
          feedbackID: feedbackID,
          response: responseMessage,
        }
      );

      if (res.status === 200) {
        setResponseMessage("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response.");
    }
  };

  const filteredFeedbacks = feedbackList.filter(
    (f) => f.hospitalID === adminInfo.hospitalId
  );

  if (!adminInfo) {
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
                A
              </div>
              <div>
                <h1 className="font-medium">
                  {adminInfo.name || "Admin User"}
                </h1>
                <p className="text-sm text-gray-600">{adminInfo.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and analyze patient feedback</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select
                value={selectedDepartment}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleDownloadActionPlan} className="space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Action Plan</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Feedback</p>
                  <h3 className="text-2xl font-bold">
                    {filteredFeedbacks.length}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Positive</p>
                  <h3 className="text-2xl font-bold">
                    {
                      filteredFeedbacks.filter((f) => f.sentimentIndex === 1)
                        .length
                    }
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Neutral</p>
                  <h3 className="text-2xl font-bold">
                    {
                      filteredFeedbacks.filter((f) => f.sentimentIndex === 0)
                        .length
                    }
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Negative</p>
                  <h3 className="text-2xl font-bold">
                    {
                      filteredFeedbacks.filter((f) => f.sentimentIndex === -1)
                        .length
                    }
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="feedback">
          <TabsList className="mb-6">
            <TabsTrigger value="feedback">Feedback List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Patient Feedback</CardTitle>
                <CardDescription>
                  Review and manage feedback from patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {feedbackList.length > 0 && (
                    <div className="mt-12 max-w-5xl mx-auto space-y-6 px-4 sm:px-6 lg:px-0">
                      {feedbackList
                        .filter((fb) => fb.hospitalID === adminInfo.hospitalId)
                        .map((fb, idx) => (
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

                              <div className="pt-2 border-t border-gray-100 flex flex-col gap-5">
                                <div className="flex gap-10 items-center">
                                  <p>
                                    <span className="font-medium text-gray-900">
                                      Admin Response:
                                    </span>{" "}
                                    {fb.response_status
                                      ? fb.response
                                      : "Not yet responded"}
                                  </p>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleRespondClick(idx)}
                                  >
                                    Respond
                                  </Button>
                                </div>
                                {activeResponseIndex === idx && (
                                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                    <input
                                      type="text"
                                      value={responseMessage}
                                      onChange={(e) =>
                                        setResponseMessage(e.target.value)
                                      }
                                      placeholder="Enter your response..."
                                      className="border rounded-md px-4 py-2 w-full sm:w-2/3"
                                    />
                                    <Button
                                      onClick={() =>
                                        handleSubmitResponse(fb.id)
                                      }
                                    >
                                      Submit
                                    </Button>

                                    <Button
                                      onClick={() => handleRespondClick(idx)}
                                      variant="outline"
                                    >
                                      Close
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sentiment Analysis</CardTitle>
                  <CardDescription>
                    Comparison of positive, negative, and neutral feedback over
                    time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlySentimentData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="positive"
                          fill="#22c55e"
                          name="Positive"
                        />
                        <Bar dataKey="neutral" fill="#3b82f6" name="Neutral" />
                        <Bar
                          dataKey="negative"
                          fill="#ef4444"
                          name="Negative"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feedback Topics</CardTitle>
                  <CardDescription>
                    Distribution of feedback by topic categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={feedbackTopicsData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {feedbackTopicsData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} feedbacks`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>
                    Comparison of sentiment across different departments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="department" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="positive"
                          stackId="a"
                          fill="#22c55e"
                          name="Positive"
                        />
                        <Bar
                          dataKey="neutral"
                          stackId="a"
                          fill="#3b82f6"
                          name="Neutral"
                        />
                        <Bar
                          dataKey="negative"
                          stackId="a"
                          fill="#ef4444"
                          name="Negative"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Action Plan Dialog */}
      <Dialog open={showActionPlan} onOpenChange={setShowActionPlan}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-primary" />
              Weekly Action Plan
            </DialogTitle>
            <DialogDescription>
              Based on the collected patient feedback, here are the recommended
              actions for hospital improvement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">
                Hospital: General Hospital
              </h3>
              <p className="text-blue-600">
                Week:{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-blue-600">
                Feedback Analyzed: {feedbackList.length} responses
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-2xl py-5">Department: Emergency</p>
                <p>Issue: Poor communication</p>
                <p>
                  Action: Conduct communication training sessions for emergency
                  staff. Implement a standard patient explanation protocol
                  before any procedure. Assign a dedicated patient liaison in
                  high-pressure departments.
                </p>
              </div>

              <div>
                <p>Issue: Cleanliness concerns</p>
                <p>
                  Action: Increase frequency of restroom cleaning rounds,
                  especially in emergency areas. Introduce a real-time digital
                  checklist for housekeeping. Add QR code-based patient feedback
                  for bathroom cleanliness.
                </p>
              </div>
              <hr />

              <div>
                <p className="text-2xl py-5">Department: Radiology</p>
                <p>
                  Action: Audit and optimize radiology appointment scheduling.
                  Implement triage-based scan prioritization. Add more staff or
                  extend operational hours during peak times.
                </p>
              </div>

              <div>
                <p>Issue: Poor digital experience</p>
                <p>Feedback: “App kept crashing while booking appointment.</p>
                <p>
                  Action: Engage with the app development team to debug and fix
                  crashes. Introduce a fallback web-based booking system.
                  Include a “Report an Issue” option in the app.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleCloseActionPlan}>
              Close
            </Button>
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              <span>Save as PDF</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
