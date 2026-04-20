const { Queue, Worker } = require('bullmq');
const redisConnection = require('../config/redis');
const Task = require('../models/Task');
const { sendWebhook } = require('./webhookService');
require('dotenv').config();

// Create the reminder queue
const reminderQueue = new Queue('task-reminders', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  }
});

// Worker to process reminder jobs
const reminderWorker = new Worker('task-reminders', async (job) => {
  const { taskId, userId, title, dueDate } = job.data;

  console.log(`\n⏰ ===== REMINDER TRIGGERED =====`);
  console.log(`Task ID: ${taskId}`);
  console.log(`User ID: ${userId}`);
  console.log(`Title: ${title}`);
  console.log(`Due Date: ${new Date(dueDate).toISOString()}`);
  console.log(`Triggered At: ${new Date().toISOString()}`);
  console.log(`================================\n`);

  // Check if task still exists and is still pending
  try {
    const task = await Task.findById(taskId);
    
    if (!task) {
      console.log(`⚠️  Task ${taskId} no longer exists. Skipping reminder.`);
      return { skipped: true, reason: 'Task deleted' };
    }

    if (task.status === 'completed') {
      console.log(`⚠️  Task ${taskId} already completed. Skipping reminder.`);
      return { skipped: true, reason: 'Task completed' };
    }

    // Log reminder to file (you can also send email, push notification, etc.)
    const reminderLog = {
      timestamp: new Date().toISOString(),
      taskId,
      userId,
      title,
      dueDate,
      message: `Reminder: Task "${title}" is due in 1 hour!`
    };

    // Optional: Send to webhook endpoint for testing
    if (process.env.WEBHOOK_URL) {
      try {
        await sendWebhook(process.env.WEBHOOK_URL, {
          type: 'task_reminder',
          ...reminderLog
        });
        console.log('Reminder sent to webhook');
      } catch (error) {
        console.error('Failed to send reminder to webhook:', error.message);
      }
    }

    return { success: true, reminderLog };
  } catch (error) {
    console.error('Error processing reminder:', error);
    throw error;
  }
}, {
  connection: redisConnection,
  concurrency: 5
});

// Handle worker events
reminderWorker.on('completed', (job) => {
  console.log(`Reminder job ${job.id} completed`);
});

reminderWorker.on('failed', (job, err) => {
  console.error(`Reminder job ${job?.id} failed:`, err.message);
});

/**
 * Schedule a reminder for a task
 */
const scheduleReminder = async (task) => {
  const reminderTime = parseInt(process.env.REMINDER_TIME_BEFORE_DUE || 60); // minutes
  const dueDate = new Date(task.dueDate);
  const reminderDate = new Date(dueDate.getTime() - (reminderTime * 60 * 1000));
  const now = new Date();

  // Only schedule if reminder time is in the future
  if (reminderDate <= now) {
    console.log(` Reminder time for task ${task._id} is in the past. Not scheduling.`);
    return null;
  }

  const delay = reminderDate.getTime() - now.getTime();

  const job = await reminderQueue.add(
    `reminder-${task._id}`,
    {
      taskId: task._id.toString(),
      userId: task.userId,
      title: task.title,
      dueDate: task.dueDate
    },
    {
      delay,
      jobId: `reminder-${task._id}` // Use consistent ID for easy cancellation
    }
  );

  console.log(` Reminder scheduled for task ${task._id} at ${reminderDate.toISOString()}`);
  return job.id;
};

/**
 * Cancel a scheduled reminder
 */
const cancelReminder = async (taskId) => {
  try {
    const jobId = `reminder-${taskId}`;
    const job = await reminderQueue.getJob(jobId);
    
    if (job) {
      await job.remove();
      console.log(`🗑️  Reminder cancelled for task ${taskId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error cancelling reminder for task ${taskId}:`, error);
    return false;
  }
};

/**
 * Reschedule a reminder (cancel old and schedule new)
 */
const rescheduleReminder = async (task) => {
  await cancelReminder(task._id);
  return await scheduleReminder(task);
};

module.exports = {
  reminderQueue,
  reminderWorker,
  scheduleReminder,
  cancelReminder,
  rescheduleReminder
};
