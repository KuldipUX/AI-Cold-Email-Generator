
const axios = require('axios');
const EmailHistory = require('../models/EmailHistory.js');

exports.generateEmail = async (req, res) => {

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {

        const systemPrompt = `You are an expert cold email copywriter.

Return response strictly in JSON format:

{
 "subject": "Email Subject",
 "emailBody": "Email body content",
 "linkedInDM": "LinkedIn DM content",
 "followUpEmail": "Follow-up email content"
}`;

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 1024,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const aiContent = response.data.choices[0].message.content;

        const cleanContent = aiContent
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const parsed = JSON.parse(cleanContent);

        const { subject, emailBody, linkedInDM, followUpEmail } = parsed;

        const emailHistory = await EmailHistory.create({
            user: req.user._id,
            prompt,
            subject,
            emailBody,
            linkedInDM,
            followUpEmail
        });

        return res.status(200).json({
            message: 'Email generated successfully',
            data: {
                subject,
                emailBody,
                linkedInDM,
                followUpEmail
            }
        });

    } catch (error) {

        console.log('Error generating email:', error.message);

        return res.status(500).json({
            message: 'Error generating email',
            error: error.message
        });
    }
};

exports.getHistory = async(req,res)=>{
    try {
        const history = await EmailHistory.find({user:req.user._id}).sort({createdAt:-1});
    } catch (error) {
        res.status(500).json({message:'Failed to fetch history',error: error.message});
    }
}