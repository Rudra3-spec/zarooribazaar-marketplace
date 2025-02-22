import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';
import { Session } from 'express-session';

// Extend Session type to include passport data
declare module 'express-session' {
  interface Session {
    passport?: {
      user?: number;
    };
  }
}

interface WebSocketWithAuth extends WebSocket {
  userId?: number;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', async (ws: WebSocketWithAuth, req) => {
    // Get session ID from the cookie
    const cookie = req.headers.cookie;
    if (!cookie) {
      ws.close();
      return;
    }

    try {
      const sessionMatch = cookie.match(/connect\.sid=([^;]+)/);
      if (!sessionMatch) {
        ws.close();
        return;
      }

      const sessionId = decodeURIComponent(sessionMatch[1]);
      const session = await storage.getSession(sessionId);

      if (!session?.passport?.user) {
        ws.close();
        return;
      }

      ws.userId = session.passport.user;

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message.toString());

          if (data.type === 'ai_message') {
            // Handle AI chatbot messages
            const response = await handleAIChatbotMessage(data.content);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'ai_response',
                content: response,
              }));
            }
          } else if (data.type === 'chat_message' && data.toUserId) {
            // Broadcast message to the intended recipient
            broadcastMessage(wss, data, ws.userId);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        ws.close();
      });

    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close();
    }
  });
}

function broadcastMessage(wss: WebSocketServer, message: any, fromUserId: number | undefined) {
  wss.clients.forEach((client: WebSocketWithAuth) => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.userId === message.toUserId
    ) {
      client.send(JSON.stringify({
        type: 'chat_message',
        content: message.content,
        fromUserId,
        timestamp: new Date().toISOString(),
      }));
    }
  });
}

async function handleAIChatbotMessage(content: string): Promise<string> {
  // Simple rule-based responses for now
  const normalizedContent = content.toLowerCase();

  if (normalizedContent.includes('hello') || normalizedContent.includes('hi')) {
    return "Hello! I'm your AI assistant. How can I help you today?";
  }

  if (normalizedContent.includes('help')) {
    return "I can help you with: \n" +
           "- Finding business services\n" +
           "- Understanding GST registration\n" +
           "- Marketing tips\n" +
           "- Logistics support\n" +
           "What would you like to know more about?";
  }

  if (normalizedContent.includes('gst')) {
    return "For GST registration, you'll need:\n" +
           "1. PAN Card\n" +
           "2. Business registration documents\n" +
           "3. Address proof\n" +
           "Would you like me to guide you through the registration process?";
  }

  if (normalizedContent.includes('marketing') || normalizedContent.includes('promote')) {
    return "I can suggest several marketing strategies:\n" +
           "1. Social media marketing\n" +
           "2. Content marketing\n" +
           "3. Email campaigns\n" +
           "4. SEO optimization\n" +
           "Which one would you like to explore?";
  }

  return "I'm here to help with your business needs. Could you please be more specific about what you're looking for?";
}