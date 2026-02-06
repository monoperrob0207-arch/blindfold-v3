import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  try {
    var communication = { messages: [], feedbacks: [] };
    try {
      var fs = require('fs');
      var messagesFile = '/home/ubuntu/.openclaw/workspace/blindfold-v3/data/agent-messages.json';
      if (fs.existsSync(messagesFile)) {
        communication = JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
      }
    } catch (e) {
      communication = { messages: [], feedbacks: [] };
    }
    
    return NextResponse.json(communication);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
