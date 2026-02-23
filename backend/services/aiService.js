const OpenAI = require('openai');

// Check if open ai is enabled
const useMockAI = !process.env.OPENAI_API_KEY;

let openai;
if (!useMockAI) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
}

exports.generateInsights = async (expenses) => {
    if (useMockAI) {
        return "Mock Insight: Your top spending category is Food. Consider reducing dining out to save 15% this month.";
    }

    try {
        const expData = expenses.map(e => `${e.date.toISOString().split('T')[0]}: $${e.amount} on ${e.category}`).join('\n').substring(0, 1500); // limit tokens
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "You are a helpful financial advisor. Provide a short 2-3 sentence financial insight and budget suggestion based on the user's recent expenses." },
                { "role": "user", "content": `Here are my recent expenses:\n${expData}\nProvide insight:` }
            ],
            max_tokens: 100
        });
        return response.choices[0].message.content.trim();
    } catch (err) {
        console.error(err);
        return "Unable to generate insights at this time.";
    }
};

exports.autoCategorize = async (description) => {
    if (useMockAI) {
        const desc = description.toLowerCase();
        if (desc.includes('uber') || desc.includes('gas')) return 'Transportation';
        if (desc.includes('burger') || desc.includes('food') || desc.includes('restaurant')) return 'Food';
        return 'Miscellaneous';
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "You are an expense categorizer. Categorize the given description into exactly one of these: Food, Transportation, Housing, Utilities, Entertainment, Healthcare, Shopping, Debt, Miscellaneous." },
                { "role": "user", "content": `Description: ${description}` }
            ],
            max_tokens: 10
        });
        return response.choices[0].message.content.trim().replace(/[^a-zA-Z]/g, '');
    } catch (err) {
        return 'Miscellaneous';
    }
}

exports.detectUnusual = async (amount, category, existingExpenses) => {
    // Mock logic: If amount > 2x average of category
    if (existingExpenses.length === 0) return false;
    const total = existingExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const avg = total / existingExpenses.length;

    return amount > (avg * 2.5);
}

exports.predictExpenses = async (expenses) => {
    if (useMockAI) {
        return "Mock Prediction: Expect to spend $400 on housing and $150 on food next week based on your current trend.";
    }

    try {
        const expData = expenses.map(e => `${e.date.toISOString().split('T')[0]}: $${e.amount} on ${e.category}`).join('\n').substring(0, 1500);
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { "role": "system", "content": "You are a financial forecaster. Give a 1-sentence prediction of next month's spending based on the history." },
                { "role": "user", "content": `History:\n${expData}` }
            ],
            max_tokens: 50
        });
        return response.choices[0].message.content.trim();
    } catch (err) {
        return "Unable to generate prediction at this time.";
    }
}
