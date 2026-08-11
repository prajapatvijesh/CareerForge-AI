import { Request, Response, NextFunction } from 'express';
import { CareerAssistantService } from './career-assistant.service';

export class CareerAssistantController {
  private service = new CareerAssistantService();

  chat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { message, conversationId } = req.body;
      
      const response = await this.service.chat(userId, message, conversationId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.service.getConversations(userId, req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getConversationDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const conversationId = req.params.id;
      const conversation = await this.service.getConversationDetails(conversationId, userId);
      res.status(200).json(conversation);
    } catch (error) {
      next(error);
    }
  };

  deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const conversationId = req.params.id;
      await this.service.deleteConversation(conversationId, userId);
      res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
