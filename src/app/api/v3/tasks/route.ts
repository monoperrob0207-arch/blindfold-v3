import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  try {
    var tasks: any[] = [];
    try {
      var fs = require('fs');
      var path = require('path');
      var dataDir = path.join(process.cwd(), 'data');
      var tasksFile = path.join(dataDir, 'tasks.json');
      if (fs.existsSync(tasksFile)) {
        tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
      }
    } catch (e) {
      tasks = [];
    }
    
    return NextResponse.json({
      tasks: tasks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
