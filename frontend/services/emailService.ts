import { Notification } from '@/stores/notificationStore';

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type: Notification['type'];
  data?: any;
}

export class EmailService {
  private static instance: EmailService;
  private isEnabled: boolean = true;

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmailNotification(emailNotification: EmailNotification): Promise<boolean> {
    if (!this.isEnabled) {
      console.log('Email service is disabled');
      return false;
    }

    try {
      // TODO: Implement actual email sending logic
      // This could integrate with services like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Firebase Functions
      
      console.log('Sending email notification:', {
        to: emailNotification.to,
        subject: emailNotification.subject,
        type: emailNotification.type,
      });

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // For now, just log the email content
      console.log('Email content:', emailNotification.body);

      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }

  async sendRecipeNotification(
    userEmail: string,
    title: string,
    message: string,
    recipeId?: string
  ): Promise<boolean> {
    const emailNotification: EmailNotification = {
      to: userEmail,
      subject: `New Recipe: ${title}`,
      body: this.formatRecipeEmail(title, message, recipeId),
      type: 'recipe',
      data: { recipeId },
    };

    return this.sendEmailNotification(emailNotification);
  }

  async sendFollowNotification(
    userEmail: string,
    title: string,
    message: string,
    followerId?: string
  ): Promise<boolean> {
    const emailNotification: EmailNotification = {
      to: userEmail,
      subject: `New Follower: ${title}`,
      body: this.formatFollowEmail(title, message, followerId),
      type: 'follow',
      data: { followerId },
    };

    return this.sendEmailNotification(emailNotification);
  }

  async sendLikeNotification(
    userEmail: string,
    title: string,
    message: string,
    recipeId?: string
  ): Promise<boolean> {
    const emailNotification: EmailNotification = {
      to: userEmail,
      subject: `Recipe Liked: ${title}`,
      body: this.formatLikeEmail(title, message, recipeId),
      type: 'like',
      data: { recipeId },
    };

    return this.sendEmailNotification(emailNotification);
  }

  async sendCommentNotification(
    userEmail: string,
    title: string,
    message: string,
    recipeId?: string
  ): Promise<boolean> {
    const emailNotification: EmailNotification = {
      to: userEmail,
      subject: `New Comment: ${title}`,
      body: this.formatCommentEmail(title, message, recipeId),
      type: 'comment',
      data: { recipeId },
    };

    return this.sendEmailNotification(emailNotification);
  }

  async sendSystemNotification(
    userEmail: string,
    title: string,
    message: string
  ): Promise<boolean> {
    const emailNotification: EmailNotification = {
      to: userEmail,
      subject: `Recipix: ${title}`,
      body: this.formatSystemEmail(title, message),
      type: 'system',
    };

    return this.sendEmailNotification(emailNotification);
  }

  async sendReminderNotification(
    userEmail: string,
    title: string,
    message: string
  ): Promise<boolean> {
    const emailNotification: EmailNotification = {
      to: userEmail,
      subject: `Cooking Reminder: ${title}`,
      body: this.formatReminderEmail(title, message),
      type: 'reminder',
    };

    return this.sendEmailNotification(emailNotification);
  }

  private formatRecipeEmail(title: string, message: string, recipeId?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF6B35;">🍳 New Recipe Alert</h2>
        <h3>${title}</h3>
        <p>${message}</p>
        ${recipeId ? `<p><a href="https://recipix.app/recipe/${recipeId}" style="color: #FF6B35;">View Recipe</a></p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">
          You're receiving this email because you have email notifications enabled for new recipes.
          <br>
          <a href="https://recipix.app/settings" style="color: #FF6B35;">Manage Notification Settings</a>
        </p>
      </div>
    `;
  }

  private formatFollowEmail(title: string, message: string, followerId?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">👥 New Follower</h2>
        <h3>${title}</h3>
        <p>${message}</p>
        ${followerId ? `<p><a href="https://recipix.app/user/${followerId}" style="color: #4CAF50;">View Profile</a></p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">
          You're receiving this email because you have email notifications enabled for new followers.
          <br>
          <a href="https://recipix.app/settings" style="color: #4CAF50;">Manage Notification Settings</a>
        </p>
      </div>
    `;
  }

  private formatLikeEmail(title: string, message: string, recipeId?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #E91E63;">❤️ Recipe Liked</h2>
        <h3>${title}</h3>
        <p>${message}</p>
        ${recipeId ? `<p><a href="https://recipix.app/recipe/${recipeId}" style="color: #E91E63;">View Recipe</a></p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">
          You're receiving this email because you have email notifications enabled for recipe likes.
          <br>
          <a href="https://recipix.app/settings" style="color: #E91E63;">Manage Notification Settings</a>
        </p>
      </div>
    `;
  }

  private formatCommentEmail(title: string, message: string, recipeId?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">💬 New Comment</h2>
        <h3>${title}</h3>
        <p>${message}</p>
        ${recipeId ? `<p><a href="https://recipix.app/recipe/${recipeId}" style="color: #2196F3;">View Recipe</a></p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">
          You're receiving this email because you have email notifications enabled for comments.
          <br>
          <a href="https://recipix.app/settings" style="color: #2196F3;">Manage Notification Settings</a>
        </p>
      </div>
    `;
  }

  private formatSystemEmail(title: string, message: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF9800;">ℹ️ Recipix Update</h2>
        <h3>${title}</h3>
        <p>${message}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          You're receiving this email because you have email notifications enabled for system updates.
          <br>
          <a href="https://recipix.app/settings" style="color: #FF9800;">Manage Notification Settings</a>
        </p>
      </div>
    `;
  }

  private formatReminderEmail(title: string, message: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #9C27B0;">⏰ Cooking Reminder</h2>
        <h3>${title}</h3>
        <p>${message}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          You're receiving this email because you have email notifications enabled for cooking reminders.
          <br>
          <a href="https://recipix.app/settings" style="color: #9C27B0;">Manage Notification Settings</a>
        </p>
      </div>
    `;
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  isServiceEnabled(): boolean {
    return this.isEnabled;
  }
}

export const emailService = EmailService.getInstance();
