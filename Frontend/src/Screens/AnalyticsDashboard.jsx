import React, { useEffect, useState } from 'react';
import { Line, Bar, Radar, Doughnut, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { format, parseISO } from 'date-fns';

Chart.register(...registerables);

// Safe date formatting helper
const formatDateSafe = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');
        
        const decoded = jwtDecode(token);
        const userId = decoded._id;
        
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/stt/getUserPerformance/${userId}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) throw new Error(await response.text());
        
        const data = await response.json();
        setAnalytics(data.analytics);
      } catch (error) {
        toast.error(`Failed to load analytics: ${error.message}`);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <ErrorState onRetry={() => window.location.reload()} />;

  const prepareScoreDistributionData = () => {
    return {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [{
        label: 'Interview Scores',
        data: analytics.answerAnalytics?.scoreDistribution || Array(11).fill(0),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }]
    };
  };

  const prepareProgressChartData = () => {
    const labels = (analytics.progressTrends?.monthlyTrends || []).map(t => {
      try {
        return format(parseISO(`${t.date}-01`), 'MMM yyyy');
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Interview Scores',
          data: (analytics.progressTrends?.monthlyTrends || []).map(t => t.interviewScore || 0),
          borderColor: 'rgb(236, 72, 153)',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgb(236, 72, 153)',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Mock Scores',
          data: (analytics.progressTrends?.monthlyTrends || []).map(t => t.mockScore || 0),
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgb(139, 92, 246)',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.3
        }
      ]
    };
  };

  const prepareCategoryRadarData = () => {
    const categories = Object.keys(analytics.categoryPerformance || {});
    
    return {
      labels: categories,
      datasets: [
        {
          label: 'Average Score',
          data: categories.map(cat => analytics.categoryPerformance[cat]?.average || 0),
          backgroundColor: 'rgba(139, 92, 246, 0.4)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: '#fff',
          borderJoinStyle: 'round',
          pointBorderColor: 'rgba(139, 92, 246, 1)',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: 'rgba(139, 92, 246, 1)',
          pointHoverBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  const prepareFeedbackSourceData = () => {
    return {
      labels: ['Interview Feedback', 'Mock Feedback'],
      datasets: [{
        data: [
          analytics.feedbackAnalysis?.interviewFeedbacks?.length || 0,
          analytics.feedbackAnalysis?.sessionFeedbacks?.length || 0
        ],
        backgroundColor: [
          'rgba(236, 72, 153, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderColor: [
          'rgba(236, 72, 153, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1,
        hoverOffset: 8
      }]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-8 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-700 p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white">Interview Performance Analytics</h1>
                  <div className="flex items-center mt-2">
                    <div className="bg-purple-900 bg-opacity-50 px-3 py-1 rounded-full text-purple-100 text-sm mr-3">
                      {analytics.interviewCount || 0} Interviews • {analytics.sessionCount || 0} Mocks
                    </div>
                    <p className="text-purple-100">
                      {formatDateSafe(analytics.firstActivityDate)} - {formatDateSafe(analytics.lastActivityDate)}
                    </p>
                  </div>
                </div>
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1 text-sm"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Overall Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {Object.entries(analytics.overallScores || {}).map(([category, data]) => (
                <ScoreCard 
                  key={category}
                  title={category.split(/(?=[A-Z])/).join(' ')}
                  score={data.average}
                  maxScore={10}
                  trend={getTrendEmoji(category, analytics.progressTrends?.monthlyTrends || [])}
                />
              ))}
            </div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ChartContainer title="Score Progress Over Time" icon="📈">
                <Line 
                  data={prepareProgressChartData()}
                  options={chartOptions.line}
                />
              </ChartContainer>
              
              <ChartContainer title="Score Distribution" icon="📊">
                <Bar 
                  data={prepareScoreDistributionData()}
                  options={{
                    ...chartOptions.bar,
                    scales: {
                      ...chartOptions.bar.scales,
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Answers',
                          color: 'rgba(229, 231, 235, 1)'
                        }
                      },
                      x: {
                        title: {
                          display: true,
                          text: 'Score (0-10)',
                          color: 'rgba(229, 231, 235, 1)'
                        }
                      }
                    }
                  }}
                />
              </ChartContainer>
            </div>

            {/* Feedback Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <ChartContainer title="Feedback Sources" icon="🗂️">
                <Doughnut 
                  data={prepareFeedbackSourceData()}
                  options={chartOptions.pie}
                />
              </ChartContainer>
              
              <div className="md:col-span-2">
                <FeedbackAnalysis 
                  strengths={analytics.feedbackAnalysis?.topStrengths || []}
                  weaknesses={analytics.feedbackAnalysis?.topWeaknesses || []}
                  interviewFeedbacks={(analytics.feedbackAnalysis?.interviewFeedbacks || []).slice(0, 3)}
                />
              </div>
            </div>

            {/* Category Performance */}
            <div className="mb-8">
              <ChartContainer title="Category Performance" icon="🎯">
                <Radar 
                  data={prepareCategoryRadarData()}
                  options={chartOptions.radar}
                />
              </ChartContainer>
            </div>

            {/* Timing Metrics */}
            <TimingMetrics metrics={analytics.timingMetrics || {}} />

            {/* Recommendations */}
            <RecommendationsSection 
              recommendations={analytics.recommendations || []} 
              commonThemes={analytics.feedbackAnalysis?.commonThemes || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
    <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-purple-100">Loading your analytics...</p>
        <p className="text-gray-400 mt-2 text-sm">Preparing your personalized insights</p>
      </div>
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
    <div className="bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">Failed to load analytics</h2>
        <p className="text-gray-400 mb-6">Please check your connection and try again</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
          Retry
        </button>
      </div>
    </div>
  </div>
);

const ScoreCard = ({ title, score, maxScore, trend }) => {
  const percentage = (score / maxScore) * 100;
  let colorClass = 'text-red-500';
  let gradientClass = 'from-red-500 to-red-600';
  
  if (percentage > 65) {
    colorClass = 'text-yellow-500';
    gradientClass = 'from-yellow-500 to-yellow-600';
  }
  if (percentage > 80) {
    colorClass = 'text-green-500';
    gradientClass = 'from-green-500 to-green-600';
  }

  return (
    <div className="bg-gray-700 rounded-xl shadow-lg border border-gray-600 p-5 hover:border-purple-500 transition-all hover:shadow-purple-900/20 hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="text-gray-200 font-medium">{title}</h3>
        <span className="text-xl">{trend}</span>
      </div>
      <div className="mt-3">
        <div className="flex items-end">
          <p className={`text-4xl font-bold ${colorClass}`}>{score.toFixed(1)}</p>
          <p className="text-gray-400 text-sm ml-2 mb-1">/ {maxScore}</p>
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-800 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-3 rounded-full bg-gradient-to-r ${gradientClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, icon, children }) => (
  <div className="bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-600 transition-all hover:border-purple-500 hover:shadow-purple-900/10 hover:shadow-lg">
    <div className="flex items-center mb-4">
      <span className="mr-2">{icon}</span>
      <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
    </div>
    <div className="h-80">
      {children}
    </div>
  </div>
);

const FeedbackAnalysis = ({ strengths = [], weaknesses = [], interviewFeedbacks = [] }) => (
  <div className="bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-600 transition-all hover:border-purple-500 hover:shadow-purple-900/10 hover:shadow-lg h-full">
    <div className="flex items-center mb-4">
      <span className="mr-2">💬</span>
      <h3 className="text-xl font-semibold text-gray-200">Feedback Analysis</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-gray-800 bg-opacity-70 p-5 rounded-lg border border-gray-600 hover:border-green-500 transition-all">
        <h4 className="font-medium text-green-400 mb-3 flex items-center">
          <span className="w-6 h-6 mr-2 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          Top Strengths
        </h4>
        <ul className="space-y-3">
          {strengths.length > 0 ? (
            strengths.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No strength data available</li>
          )}
        </ul>
      </div>
      <div className="bg-gray-800 bg-opacity-70 p-5 rounded-lg border border-gray-600 hover:border-red-500 transition-all">
        <h4 className="font-medium text-red-400 mb-3 flex items-center">
          <span className="w-6 h-6 mr-2 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center">
            <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
          Areas to Improve
        </h4>
        <ul className="space-y-3">
          {weaknesses.length > 0 ? (
            weaknesses.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-red-500 mr-2 mt-1">•</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No weakness data available</li>
          )}
        </ul>
      </div>
    </div>
    {interviewFeedbacks && interviewFeedbacks.length > 0 && (
      <div className="bg-gray-800 bg-opacity-70 p-5 rounded-lg border border-gray-600">
        <h4 className="font-medium text-purple-400 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Recent Interview Feedback
        </h4>
        <div className="space-y-3">
          {interviewFeedbacks.map((feedback, i) => (
            <div key={i} className="border-l-4 border-purple-500 pl-3 py-1">
              <p className="text-gray-300 italic">"{feedback.feedback}"</p>
              {feedback.score && (
                <div className="text-purple-400 text-sm mt-1">
                  Score: {feedback.score}/10
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const TimingMetrics = ({ metrics = {} }) => (
  <div className="bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-600 transition-all hover:border-purple-500 hover:shadow-purple-900/10 hover:shadow-lg mb-8">
    <div className="flex items-center mb-4">
      <span className="mr-2">⏱️</span>
      <h3 className="text-xl font-semibold text-gray-200">Timing Metrics</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard 
        title="Total Questions" 
        value={metrics.totalQuestions || 0} 
        description="Answered across all sessions"
        icon="❓"
      />
      <MetricCard 
        title="Avg Response Time" 
        value={`${metrics.averageResponseTime || 0}ms`} 
        description="Time to answer questions"
        icon="⚡"
      />
      <MetricCard 
        title="Evaluated Answers" 
        value={metrics.totalQuestions || 0} 
        description="With detailed feedback"
        icon="📝"
      />
    </div>
  </div>
);

const MetricCard = ({ title, value, description, icon }) => (
  <div className="bg-gray-800 bg-opacity-70 p-5 rounded-lg border border-gray-600 hover:border-indigo-500 transition-all">
    <div className="flex items-center">
      <span className="w-8 h-8 mr-3 rounded-lg bg-indigo-500 bg-opacity-20 flex items-center justify-center text-lg">
        {icon}
      </span>
      <div>
        <h4 className="text-gray-300 font-medium text-sm">{title}</h4>
        <p className="text-2xl font-bold text-indigo-400 my-1">{value}</p>
        <p className="text-gray-500 text-xs">{description}</p>
      </div>
    </div>
  </div>
);

const RecommendationsSection = ({ recommendations = [], commonThemes = [] }) => (
  <div className="bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-600 transition-all hover:border-purple-500 hover:shadow-purple-900/10 hover:shadow-lg">
    <div className="flex items-center mb-4">
      <span className="mr-2">💡</span>
      <h3 className="text-xl font-semibold text-purple-400">Personalized Recommendations</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 bg-opacity-70 p-5 rounded-lg border border-gray-600">
        <h4 className="font-medium text-purple-300 mb-3">Based on your performance</h4>
        <ul className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <li key={i} className="flex items-start">
                <span className="bg-purple-900 text-purple-300 rounded-lg p-1.5 mr-3 mt-0.5 shadow-inner shadow-purple-700/30">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="text-gray-300">{rec}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No recommendations available</li>
          )}
        </ul>
      </div>
      {commonThemes && commonThemes.length > 0 && (
        <div className="bg-gray-800 bg-opacity-70 p-5 rounded-lg border border-gray-600">
          <h4 className="font-medium text-blue-300 mb-3">Common Feedback Themes</h4>
          <ul className="space-y-3">
            {commonThemes.map((theme, i) => (
              <li key={i} className="flex items-start">
                <span className="bg-blue-900 text-blue-300 rounded-lg p-1.5 mr-3 mt-0.5 shadow-inner shadow-blue-700/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <span className="text-gray-300">{theme}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

// Helper functions
const getTrendEmoji = (category, trends) => {
  if (!trends || trends.length < 2) return '➖';
  
  const firstScore = trends[0]?.[category] || 0;
  const lastScore = trends[trends.length - 1]?.[category] || 0;
  
  if (lastScore > firstScore + 1) return '📈';
  if (lastScore < firstScore - 1) return '📉';
  return '➖';
};


const chartOptions = {
  line: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timeline',
          color: 'rgba(229, 231, 235, 1)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.15)',
          tickLength: 8
        },
        ticks: {
          color: 'rgba(229, 231, 235, 0.8)',
          padding: 10
        }
      },
      y: {
        min: 0,
        max: 10,
        title: {
          display: true,
          text: 'Score (1-10)',
          color: 'rgba(229, 231, 235, 1)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.15)',
          tickLength: 8
        },
        ticks: {
          color: 'rgba(229, 231, 235, 0.8)',
          padding: 10,
          stepSize: 2
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'rgba(229, 231, 235, 1)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        caretSize: 6,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}/10`
        }
      }
    },
    elements: {
      line: {
        tension: 0.3
      }
    }
  },
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'rgba(229, 231, 235, 1)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        caretSize: 6
      }
    }
  },
  radar: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        pointLabels: {
          color: 'rgba(229, 231, 235, 1)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        suggestedMin: 0,
        suggestedMax: 10,
        ticks: {
          stepSize: 2,
          color: 'rgba(229, 231, 235, 0.8)',
          backdropColor: 'transparent',
          z: 10,
          font: {
            size: 10
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'rgba(229, 231, 235, 1)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        caretSize: 6,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}/10`
        }
      }
    }
  },
  pie: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'rgba(229, 231, 235, 1)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8,
        caretSize: 6,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} items`;
          }
        }
      }
    }
  }
};

export default AnalyticsDashboard;