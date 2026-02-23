import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiTrash2, FiEdit2, FiPlus, FiCpu } from 'react-icons/fi';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ amount: '', category: '', date: '', notes: '', paymentMethod: 'Cash' });
    const [aiLoading, setAiLoading] = useState(false);
    const [unusualWarning, setUnusualWarning] = useState(false);

    const fetchExpenses = async () => {
        try {
            const res = await api.get('/expenses');
            setExpenses(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAutoCategorize = async () => {
        if (!formData.notes) return alert('Please enter some notes/description first!');
        setAiLoading(true);
        try {
            const res = await api.post('/ai/categorize', { description: formData.notes });
            setFormData(prev => ({ ...prev, category: res.data.data }));
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

    const checkUnusual = async (amount, category) => {
        try {
            const res = await api.post('/ai/unusual', { amount: Number(amount), category });
            return res.data.data.isUnusual;
        } catch (err) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category || !formData.date) return alert('Fill required fields');

        // Check unusual amount
        const isUnusual = await checkUnusual(formData.amount, formData.category);
        if (isUnusual && !window.confirm('AI Warning: This expense is unusually high for this category. Are you sure you want to add it?')) {
            return;
        }

        try {
            await api.post('/expenses', {
                ...formData,
                amount: Number(formData.amount),
                isUnusual
            });
            setShowModal(false);
            setFormData({ amount: '', category: '', date: '', notes: '', paymentMethod: 'Cash' });
            fetchExpenses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await api.delete(`/expenses/${id}`);
            fetchExpenses();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Manage Expenses</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                >
                    <FiPlus /> Add Expense
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {expenses.map((expense) => (
                            <tr key={expense._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(expense.date).toLocaleDateString()}
                                    {expense.isUnusual && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Unusual</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${expense.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.paymentMethod}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleDelete(expense._id)} className="text-red-600 hover:text-red-900 ml-4"><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                        {expenses.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No expenses found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Add New Expense</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                                    <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Notes / Description</label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="flex-1 block w-full border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g. Uber to airport" />
                                        <button type="button" onClick={handleAutoCategorize} className="inline-flex items-center px-4 py-2 border border-l-0 border-indigo-600 rounded-r-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-medium transition-colors">
                                            <FiCpu className="mr-1" /> {aiLoading ? '...' : 'Auto Categorize'}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                            <option>Cash</option>
                                            <option>Credit Card</option>
                                            <option>Debit Card</option>
                                            <option>Bank Transfer</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6 flex gap-3">
                                    <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm text-center">Save Expense</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
