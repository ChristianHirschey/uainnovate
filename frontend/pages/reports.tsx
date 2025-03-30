"use client"

import '../app/globals.css';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, RadialBarChart, RadialBar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { createClient } from '@/lib/supabase/client';

interface Request {
  id: string;
  type: 'supply' | 'maintenance' | 'suggestion' | 'other';
  description: string;
  priority: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  supply_id?: string;
  user_id?: string;
  created_at: string;
  resolved_at?: string;
}

interface Supply {
  id: string;
  name: string;
  current_stock: number;
  max_stock: number;
  threshold: number;
  unit: string;
  purchase_url?: string;
  purchase_price: number;
  created_at: string;
  updated_at: string;
}

interface ChartData {
  feedbackTypeChart: { name: string; value: number }[];
  feedbackStatusChart: { name: string; value: number }[];
  feedbackPriorityChart: { name: string; value: number }[];
  resolutionRate: number;
  supplyStockChart: {
    name: string;
    stockPercentage: number;
    current: number;
    max: number;
    threshold: number;
    fill: string;
  }[];
  belowThresholdItems: Supply[];
  totalInventoryValue: number;
}

const Reports: React.FC = () => {
  // Create Supabase client and fetch the user
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [feedbackData, setFeedbackData] = useState<Request[]>([]);
  const [supplyData, setSupplyData] = useState<Supply[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
      setLoadingUser(false);
    }
    fetchUser();
  }, [supabase]);

  // Fetch reports data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch feedback data
        let feedbackResult: Request[] = [];
        try {
          const feedbackResponse = await fetch('http://localhost:8000/api/requests/all');
          if (feedbackResponse.ok) {
            feedbackResult = await feedbackResponse.json();
          } else {
            console.warn(`Feedback API responded with status: ${feedbackResponse.status}`);
            // Continue with empty array instead of throwing
          }
        } catch (feedbackErr) {
          console.error('Error fetching feedback data:', feedbackErr);
          // Continue with empty array
        }
        
        // Fetch supply data
        let supplyResult: Supply[] = [];
        try {
          const supplyResponse = await fetch('http://localhost:8000/api/supplies');
          if (supplyResponse.ok) {
            supplyResult = await supplyResponse.json();
          } else {
            console.warn(`Supply API responded with status: ${supplyResponse.status}`);
            // Continue with empty array instead of throwing
          }
        } catch (supplyErr) {
          console.error('Error fetching supply data:', supplyErr);
          // Continue with empty array
        }
        
        // Update state with whatever data we managed to get
        setFeedbackData(feedbackResult);
        setSupplyData(supplyResult);
        
        // Show error if both APIs failed
        if (feedbackResult.length === 0 && supplyResult.length === 0) {
          setError('Could not load data from APIs. Using cached data if available.');
        }
      } catch (err) {
        console.error('Unexpected error in data fetching:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data when API data loads
  useEffect(() => {
    // Allow chart preparation even if one data source is empty
    if (feedbackData.length || supplyData.length) {
      const data = prepareChartData();
      setChartData(data);
    }
  }, [feedbackData, supplyData]);

  // Prepare chart data
  const prepareChartData = () => {
    // Feedback metrics - handle empty feedback data
    const feedbackTypeCount = {
      supply: 0,
      maintenance: 0,
      suggestion: 0,
      other: 0
    };

    const feedbackStatusCount = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0
    };

    const feedbackPriorityCount = {
      very_low: 0,
      low: 0,
      medium: 0,
      high: 0,
      very_high: 0
    };

    // Process feedback data if available
    if (feedbackData.length) {
      feedbackData.forEach(feedback => {
        // Use type assertion to tell TypeScript these are valid keys
        feedbackTypeCount[feedback.type as keyof typeof feedbackTypeCount]++;
        feedbackStatusCount[feedback.status as keyof typeof feedbackStatusCount]++;
        feedbackPriorityCount[feedback.priority as keyof typeof feedbackPriorityCount]++;
      });
    }

    const feedbackTypeChartData = Object.keys(feedbackTypeCount).map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: feedbackTypeCount[type as keyof typeof feedbackTypeCount]
    }));

    const feedbackStatusChartData = Object.keys(feedbackStatusCount).map(status => ({
      name: status.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
      value: feedbackStatusCount[status as keyof typeof feedbackStatusCount]
    }));

    const feedbackPriorityChartData = Object.keys(feedbackPriorityCount).map(priority => ({
      name: priority.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
      value: feedbackPriorityCount[priority as keyof typeof feedbackPriorityCount]
    }));

    // Resolution rate - avoid division by zero
    const resolvedCount = feedbackStatusCount.resolved + feedbackStatusCount.closed;
    const resolutionRate = feedbackData.length ? (resolvedCount / feedbackData.length) * 100 : 0;

    // Supply metrics - handle empty supply data
    const supplyStockChartData = supplyData.map(supply => ({
      name: supply.name,
      stockPercentage: (supply.current_stock / supply.max_stock) * 100,
      current: supply.current_stock,
      max: supply.max_stock,
      threshold: supply.threshold,
      fill: supply.current_stock < supply.threshold ? '#FF5733' : '#4CAF50'
    }));

    // Items below threshold
    const belowThresholdItems = supplyData.filter(supply => 
      supply.current_stock < supply.threshold
    );

    // Total inventory value
    const totalInventoryValue = supplyData.reduce((sum, supply) => 
      sum + (supply.current_stock * supply.purchase_price), 0
    );

    return {
      feedbackTypeChart: feedbackTypeChartData,
      feedbackStatusChart: feedbackStatusChartData,
      feedbackPriorityChart: feedbackPriorityChartData,
      resolutionRate,
      supplyStockChart: supplyStockChartData,
      belowThresholdItems,
      totalInventoryValue
    };
  };

  if (loadingUser) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>No user found. Please sign in.</div>;
  }

  // Check admin rights. Adjust the property key if needed.
  // For example, if the admin role is stored in user.app_metadata.role:
  const userRole = user.role?.toString().trim().toLowerCase() || '';
  if (userRole !== 'admin') {
    return (
      <div className="unauthorized">
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  // Colors
  const statusColors = {
    'open': '#FF5733',
    'in_progress': '#FFC300',
    'resolved': '#36A2EB',
    'closed': '#4CAF50'
  };

  const typeColors = {
    'supply': '#8884d8',
    'maintenance': '#82ca9d',
    'suggestion': '#ffc658',
    'other': '#FF8042'
  };

  const priorityColors = {
    'very_low': '#BBDEFB',
    'low': '#90CAF9',
    'medium': '#64B5F6',
    'high': '#2196F3',
    'very_high': '#1976D2'
  };

  return (
    <div className="flex w-full bg-gray-100 min-h-screen">
      <DashboardSidebar open={open} setOpen={setOpen} />
      <div className="flex-1 max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Reports &amp; Analytics</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Loading report data...</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded flex items-center mb-6">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        ) : null}
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{feedbackData.length}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{chartData?.resolutionRate?.toFixed(1)}%</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{chartData?.belowThresholdItems?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">${(chartData?.totalInventoryValue || 0).toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Only render charts if we have data */}
        {chartData && (
          <>
            {/* Feedback Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Feedback Status Chart */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700">Request Status</CardTitle>
                  <CardDescription className="text-sm text-gray-500">Distribution of request statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                            data={chartData.feedbackStatusChart}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            innerRadius={40}
                            paddingAngle={3}
                            fill="#8884d8"
                            dataKey="value"
                            // Custom label positioning to prevent overlaps
                            label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                                // Calculate positioning
                                const RADIAN = Math.PI / 180;
                                const radius = outerRadius * 1.2;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                
                                // Only show label for segments that are visible enough (e.g. > 2%)
                                return percent > 0.02 ? (
                                <text 
                                    x={x} 
                                    y={y} 
                                    fill={statusColors[name.toLowerCase().replace(' ', '_') as keyof typeof statusColors]}
                                    textAnchor={x > cx ? 'start' : 'end'} 
                                    dominantBaseline="central"
                                    fontWeight="bold"
                                    fontSize="13"
                                >
                                    {`${name} ${(percent * 100).toFixed(0)}%`}
                                </text>
                                ) : null;
                            }}
                            >
                            {chartData.feedbackStatusChart.map((entry, index) => (
                                <Cell
                                key={`cell-${index}`}
                                fill={statusColors[entry.name.toLowerCase().replace(' ', '_') as keyof typeof statusColors]}
                                stroke="#ffffff"
                                strokeWidth={2}
                                />
                            ))}
                            </Pie>
                            <Tooltip
                            formatter={(value) => [`${value} Requests`, 'Count']}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                padding: '10px 14px'
                            }}
                            />
                            <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            iconSize={10}
                            wrapperStyle={{ paddingTop: '20px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>               
                    </div>
                </CardContent>
              </Card>

              {/* Feedback Type Chart */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-700">Request Types</CardTitle>
                  <CardDescription className="text-sm text-gray-500">Distribution of request categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.feedbackTypeChart}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {chartData.feedbackTypeChart.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={typeColors[entry.name.toLowerCase() as keyof typeof typeColors]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Requests']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* More charts and tables as needed */}
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;