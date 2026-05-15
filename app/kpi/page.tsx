"use client";

import { useApp } from "@/lib/context";
import { KPIEntry } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";
import { useState } from "react";
import { useRef } from "react";

export default function KPIDashboardPage() {
  const { state, updateState } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<KPIEntry>>({
    date: new Date().toISOString().split("T")[0],
    followers: undefined,
    postReach: undefined,
    engagement: undefined,
    emailOpenRate: undefined,
    websiteVisits: undefined,
    donationsReceived: undefined,
    volunteerSignups: undefined,
  });
  const reportRef = useRef<HTMLDivElement>(null);

  const handleAddEntry = () => {
    if (!formData.date) return;

    const newEntry: KPIEntry = {
      date: formData.date,
      followers: formData.followers,
      postReach: formData.postReach,
      engagement: formData.engagement,
      emailOpenRate: formData.emailOpenRate,
      websiteVisits: formData.websiteVisits,
      donationsReceived: formData.donationsReceived,
      volunteerSignups: formData.volunteerSignups,
    };

    updateState({
      kpi: {
        ...state.kpi,
        entries: [...state.kpi.entries, newEntry].sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      },
    });

    setFormData({
      date: new Date().toISOString().split("T")[0],
      followers: undefined,
      postReach: undefined,
      engagement: undefined,
      emailOpenRate: undefined,
      websiteVisits: undefined,
      donationsReceived: undefined,
      volunteerSignups: undefined,
    });
    setShowForm(false);
  };

  const handleDeleteEntry = (date: string) => {
    updateState({
      kpi: {
        ...state.kpi,
        entries: state.kpi.entries.filter((e) => e.date !== date),
      },
    });
  };

  const handleDownloadReport = async () => {
    if (!reportRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 10,
      filename: `kpi-report-${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
    };

    html2pdf().set(opt).from(reportRef.current).save();
  };

  const chartData = state.kpi.entries.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    followers: entry.followers || 0,
    postReach: entry.postReach || 0,
    engagement: entry.engagement || 0,
    emailOpenRate: entry.emailOpenRate || 0,
    websiteVisits: entry.websiteVisits || 0,
    donationsReceived: entry.donationsReceived || 0,
    volunteerSignups: entry.volunteerSignups || 0,
  }));

  const latestEntry = state.kpi.entries[state.kpi.entries.length - 1];
  const previousEntry = state.kpi.entries[state.kpi.entries.length - 2];

  const getChange = (current?: number, previous?: number): number => {
    if (!current || !previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <div className="pt-12">
      {/* Header */}
      <div className="px-6 lg:px-8 py-8 border-b border-border bg-card">
        <h1 className="text-3xl font-bold text-foreground">KPI Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track and measure your communication performance
        </p>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Controls */}
        <div className="flex gap-2 flex-wrap justify-between items-center">
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus size={18} />
              Add KPI Entry
            </Button>
          )}
          <Button
            onClick={handleDownloadReport}
            variant="outline"
            className="gap-2"
          >
            <Download size={18} />
            Download Report
          </Button>
        </div>

        {/* Add Entry Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add KPI Entry</CardTitle>
              <CardDescription>
                Enter your weekly or monthly metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Date
                </label>
                <Input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Followers
                  </label>
                  <Input
                    type="number"
                    value={formData.followers || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        followers: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="Total followers"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Post Reach
                  </label>
                  <Input
                    type="number"
                    value={formData.postReach || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        postReach: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="People reached"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Engagement
                  </label>
                  <Input
                    type="number"
                    value={formData.engagement || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        engagement: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="Likes + comments + shares"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email Open Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={formData.emailOpenRate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emailOpenRate: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="0-100"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Website Visits
                  </label>
                  <Input
                    type="number"
                    value={formData.websiteVisits || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        websiteVisits: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="Number of visits"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Donations Received ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.donationsReceived || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        donationsReceived:
                          parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="Amount in dollars"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Volunteer Signups
                  </label>
                  <Input
                    type="number"
                    value={formData.volunteerSignups || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        volunteerSignups: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder="Number of signups"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      date: new Date().toISOString().split("T")[0],
                      followers: undefined,
                      postReach: undefined,
                      engagement: undefined,
                      emailOpenRate: undefined,
                      websiteVisits: undefined,
                      donationsReceived: undefined,
                      volunteerSignups: undefined,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddEntry}>Add Entry</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Latest Metrics */}
        {latestEntry && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestEntry.followers !== undefined && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Followers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {latestEntry.followers}
                  </p>
                  {previousEntry?.followers !== undefined && (
                    <p
                      className={`text-sm font-medium mt-1 ${getChangeColor(
                        getChange(
                          latestEntry.followers,
                          previousEntry.followers,
                        ),
                      )}`}
                    >
                      {getChange(
                        latestEntry.followers,
                        previousEntry.followers,
                      ) > 0
                        ? "+"
                        : ""}
                      {getChange(
                        latestEntry.followers,
                        previousEntry.followers,
                      )}
                      %
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            {latestEntry.engagement !== undefined && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary">
                    {latestEntry.engagement}
                  </p>
                  {previousEntry?.engagement !== undefined && (
                    <p
                      className={`text-sm font-medium mt-1 ${getChangeColor(
                        getChange(
                          latestEntry.engagement,
                          previousEntry.engagement,
                        ),
                      )}`}
                    >
                      {getChange(
                        latestEntry.engagement,
                        previousEntry.engagement,
                      ) > 0
                        ? "+"
                        : ""}
                      {getChange(
                        latestEntry.engagement,
                        previousEntry.engagement,
                      )}
                      %
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            {latestEntry.donationsReceived !== undefined && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Donations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    ${latestEntry.donationsReceived}
                  </p>
                  {previousEntry?.donationsReceived !== undefined && (
                    <p
                      className={`text-sm font-medium mt-1 ${getChangeColor(
                        getChange(
                          latestEntry.donationsReceived,
                          previousEntry.donationsReceived,
                        ),
                      )}`}
                    >
                      {getChange(
                        latestEntry.donationsReceived,
                        previousEntry.donationsReceived,
                      ) > 0
                        ? "+"
                        : ""}
                      {getChange(
                        latestEntry.donationsReceived,
                        previousEntry.donationsReceived,
                      )}
                      %
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            {latestEntry.volunteerSignups !== undefined && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Volunteers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">
                    {latestEntry.volunteerSignups}
                  </p>
                  {previousEntry?.volunteerSignups !== undefined && (
                    <p
                      className={`text-sm font-medium mt-1 ${getChangeColor(
                        getChange(
                          latestEntry.volunteerSignups,
                          previousEntry.volunteerSignups,
                        ),
                      )}`}
                    >
                      {getChange(
                        latestEntry.volunteerSignups,
                        previousEntry.volunteerSignups,
                      ) > 0
                        ? "+"
                        : ""}
                      {getChange(
                        latestEntry.volunteerSignups,
                        previousEntry.volunteerSignups,
                      )}
                      %
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Charts */}
        {chartData.length > 0 && (
          <>
            {/* Followers & Reach */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Followers and reach over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {latestEntry?.followers !== undefined && (
                      <Line
                        type="monotone"
                        dataKey="followers"
                        stroke="#0d5d9e"
                        name="Followers"
                      />
                    )}
                    {latestEntry?.postReach !== undefined && (
                      <Line
                        type="monotone"
                        dataKey="postReach"
                        stroke="#6d8c3e"
                        name="Post Reach"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement & Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement & Impact</CardTitle>
                <CardDescription>
                  Engagement, donations, and volunteer signups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {latestEntry?.engagement !== undefined && (
                      <Bar
                        dataKey="engagement"
                        fill="#d87e4a"
                        name="Engagement"
                      />
                    )}
                    {latestEntry?.donationsReceived !== undefined && (
                      <Bar
                        dataKey="donationsReceived"
                        fill="#16a34a"
                        name="Donations ($)"
                      />
                    )}
                    {latestEntry?.volunteerSignups !== undefined && (
                      <Bar
                        dataKey="volunteerSignups"
                        fill="#d97706"
                        name="Volunteers"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Data Table */}
        {state.kpi.entries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Followers
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Reach
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Engagement
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Donations
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                        Volunteers
                      </th>
                      <th className="text-left py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.kpi.entries.map((entry) => (
                      <tr
                        key={entry.date}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-3 px-4">{entry.date}</td>
                        <td className="py-3 px-4">{entry.followers || "-"}</td>
                        <td className="py-3 px-4">{entry.postReach || "-"}</td>
                        <td className="py-3 px-4">{entry.engagement || "-"}</td>
                        <td className="py-3 px-4">
                          {entry.donationsReceived
                            ? `$${entry.donationsReceived}`
                            : "-"}
                        </td>
                        <td className="py-3 px-4">
                          {entry.volunteerSignups || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteEntry(entry.date)}
                            className="text-destructive hover:opacity-70"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hidden Report */}
        <div ref={reportRef} className="hidden">
          <div style={{ padding: "20px", fontSize: "12px" }}>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              KPI Report
            </h1>
            <p style={{ marginBottom: "20px" }}>
              Generated: {new Date().toLocaleDateString()} | Organization:{" "}
              {state.organization.name}
            </p>

            {latestEntry && (
              <div style={{ marginBottom: "30px" }}>
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Latest Metrics
                </h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tr>
                    <td
                      style={{ padding: "5px", borderBottom: "1px solid #ccc" }}
                    >
                      Followers: {latestEntry.followers || "N/A"}
                    </td>
                    <td
                      style={{ padding: "5px", borderBottom: "1px solid #ccc" }}
                    >
                      Reach: {latestEntry.postReach || "N/A"}
                    </td>
                    <td
                      style={{ padding: "5px", borderBottom: "1px solid #ccc" }}
                    >
                      Engagement: {latestEntry.engagement || "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ padding: "5px", borderBottom: "1px solid #ccc" }}
                    >
                      Donations: ${latestEntry.donationsReceived || "N/A"}
                    </td>
                    <td
                      style={{ padding: "5px", borderBottom: "1px solid #ccc" }}
                    >
                      Volunteers: {latestEntry.volunteerSignups || "N/A"}
                    </td>
                    <td
                      style={{ padding: "5px", borderBottom: "1px solid #ccc" }}
                    >
                      Email Open Rate: {latestEntry.emailOpenRate || "N/A"}%
                    </td>
                  </tr>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
