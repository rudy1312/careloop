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
import Cookies from "js-cookie";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  useEffect(() => {
    // Check if admin is logged in

    const adminData = Cookies.get("adminLoginData");

    if (adminData) {
      const parsedData = JSON.parse(adminData);
      setAdminInfo(parsedData);
    } else {
      console.warn("No patient cookie found. Redirecting to login.");
      navigate("/login/admin");
      return;
    }

    setAdminInfo(JSON.parse(adminData));

    // Set feedback data based on the department filter
    if (selectedDepartment === "all") {
      setFeedbackList(mockFeedbackData);
    } else {
      setFeedbackList(
        mockFeedbackData.filter(
          (item) => item.department === selectedDepartment
        )
      );
    }
  }, [navigate, selectedDepartment]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/bloom/v1/api/admin/out",
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
  };

  const handleDownloadActionPlan = () => {
    // In a real application, this would generate and download a report
    toast({
      title: "Action Plan Generated",
      description: "Weekly action plan has been downloaded successfully.",
    });
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
                  <h3 className="text-2xl font-bold">{feedbackList.length}</h3>
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
                      feedbackList.filter((f) => f.sentiment === "positive")
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
                      feedbackList.filter((f) => f.sentiment === "neutral")
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
                      feedbackList.filter((f) => f.sentiment === "negative")
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
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-3 font-medium">Patient</th>
                        <th className="pb-3 font-medium">Department</th>
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Feedback</th>
                        <th className="pb-3 font-medium">Sentiment</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbackList.map((feedback) => (
                        <tr
                          key={feedback.id}
                          className="border-b last:border-b-0"
                        >
                          <td className="py-4">
                            <div>
                              <div className="font-medium">
                                {feedback.patientName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {feedback.patientId}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">{feedback.departmentName}</td>
                          <td className="py-4">
                            <div className="flex items-center">
                              {getTypeIcon(feedback.type)}
                              <span className="ml-1 capitalize">
                                {feedback.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 max-w-[300px] truncate">
                            {feedback.type === "text" ? (
                              feedback.content
                            ) : (
                              <Button variant="outline" size="sm">
                                View{" "}
                                {feedback.type === "voice" ? "Audio" : "Video"}
                              </Button>
                            )}
                          </td>
                          <td className="py-4">
                            {getSentimentBadge(feedback.sentiment)}
                          </td>
                          <td className="py-4 text-gray-600">
                            {feedback.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
    </div>
  );
};

export default AdminDashboard;
