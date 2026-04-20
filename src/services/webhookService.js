const axios = require('axios');
require('dotenv').config();

/**
 * Send webhook with exponential backoff retry logic
 */
const sendWebhook = async (url, payload, retries = 0) => {
  const maxRetries = parseInt(process.env.WEBHOOK_RETRY_ATTEMPTS || 3);
  const baseDelay = parseInt(process.env.WEBHOOK_RETRY_DELAY || 1000);

  try {
    console.log(`\n🔔 ===== WEBHOOK TRIGGERED =====`);
    console.log(`URL: ${url}`);
    console.log(`Attempt: ${retries + 1}/${maxRetries + 1}`);
    console.log(`Payload:`, JSON.stringify(payload, null, 2));
    
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'Task-Management-API',
        'X-Attempt': retries + 1
      },
      timeout: 5000 // 5 second timeout
    });

    console.log(`✅ Webhook sent successfully`);
    console.log(`Status: ${response.status}`);
    console.log(`================================\n`);

    return {
      success: true,
      status: response.status,
      attempts: retries + 1
    };
  } catch (error) {
    console.error(`Webhook attempt ${retries + 1} failed:`, error.message);

    // If we haven't exceeded max retries, retry with exponential backoff
    if (retries < maxRetries) {
      const delay = baseDelay * Math.pow(2, retries); // Exponential backoff
      console.log(`Retrying in ${delay}ms...`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return await sendWebhook(url, payload, retries + 1);
    }

    console.error(`Webhook failed after ${maxRetries + 1} attempts`);
    console.log(`================================\n`);

    return {
      success: false,
      error: error.message,
      attempts: retries + 1
    };
  }
};

/**
 * Send task completion webhook
 */
const sendTaskCompletionWebhook = async (task) => {
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('  No webhook URL configured. Skipping webhook.');
    return { success: false, error: 'No webhook URL configured' };
  }

  const payload = {
    event: 'task.completed',
    timestamp: new Date().toISOString(),
    data: {
      taskId: task._id.toString(),
      title: task.title,
      description: task.description,
      userId: task.userId,
      completedAt: task.completedAt || new Date().toISOString(),
      createdAt: task.createdAt,
      dueDate: task.dueDate,
      category: task.category,
      tags: task.tags
    }
  };

  return await sendWebhook(webhookUrl, payload);
};

module.exports = {
  sendWebhook,
  sendTaskCompletionWebhook
};
