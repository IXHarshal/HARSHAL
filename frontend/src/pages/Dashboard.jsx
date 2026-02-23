import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import api from '../services/api';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [insights, setInsights] = useState('');
    const [predicted, setPredicted] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [expRes, insightsRes, predictRes] = await Promise.all([
                    api.get('/expenses'),
                    api.get('/ai/insights'),
                    api.get('/ai/predict')
                ]);
                setExpenses(expRes.data.data);
                setInsights(insightsRes.data.data);
                setPredicted(predictRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Group by category for Pie Chart
    const categoryTotals = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const pieData = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                data: Object.values(categoryTotals),
                backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#F97316'],
                borderWidth: 1,
            },
        ],
    };

    // Group by date for Line Chart
    const dateTotals = expenses.reduce((acc, curr) => {
        const date = new Date(curr.date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + curr.amount;
        return acc;
    }, {});

    const lineData = {
        labels: Object.keys(dateTotals).reverse(),
        datasets: [
            {
                label: 'Spending Over Time',
                data: Object.values(dateTotals).reverse(),
                borderColor: '#4F46E5',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
            },
        ],
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold border-b pb-4">Financial Dashboard</h1>

            {/* AI Insights Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-start gap-4 shadow-sm transition hover:shadow-md">
                    <FiTrendingUp className="text-indigo-600 text-3xl flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-indigo-900 mb-2">AI Cost Insight</h3>
                        <p className="text-indigo-800 text-sm leading-relaxed">{insights || 'No recent insights.'}</p>
                    </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-start gap-4 shadow-sm transition hover:shadow-md">
                    <FiAlertCircle className="text-emerald-600 text-3xl flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-emerald-900 mb-2">AI Forecast</h3>
                        <p className="text-emerald-800 text-sm leading-relaxed">{predicted || 'Need more data to forecast.'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Total Spent */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                    <h2 className="text-gray-500 font-medium mb-2">Total Spent</h2>
                    <p className="text-5xl font-extrabold text-gray-900">${totalSpent.toFixed(2)}</p>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-1 flex flex-col items-center">
                    <h2 className="text-gray-700 font-semibold mb-4 w-full text-left">Spending by Category</h2>
                    <div className="w-full max-w-[200px]">
                        {expenses.length > 0 ? <Pie data={pieData} /> : <p className="text-gray-500 mt-10">No expenses yet.</p>}
                    </div>
                </div>

                {/* Line Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1 flex flex-col">
                    <h2 className="text-gray-700 font-semibold mb-4">Spending Trend</h2>
                    <div className="w-full flex-grow flex items-center justify-center">
                        {expenses.length > 0 ? <Line data={lineData} options={{ maintainAspectRatio: false }} /> : <p className="text-gray-500">No expenses yet.</p>}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                    {expenses.slice(0, 5).map(exp => (
                        <li key={exp._id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">{exp.category}</span>
                                <span className="text-sm text-gray-500">{new Date(exp.date).toLocaleDateString()} &middot; {exp.paymentMethod}</span>
                            </div>
                            <span className="font-bold text-gray-900">${exp.amount.toFixed(2)}</span>
                        </li>
                    ))}
                    {expenses.length === 0 && <li className="p-6 text-gray-500 text-center">No transactions found. Go add some!</li>}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
