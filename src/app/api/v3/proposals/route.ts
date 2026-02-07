import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

var fs = require('fs');
var path = require('path');

function getProposalsFile() {
  var dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'proposals.json');
}

export function GET() {
  try {
    var proposals: any[] = [];
    try {
      var proposalsFile = getProposalsFile();
      if (fs.existsSync(proposalsFile)) {
        proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'));
      }
    } catch (e) {
      proposals = [];
    }
    
    return NextResponse.json({
      proposals: proposals,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    var body = await request.json();
    var agentName = body.agentName;
    var task = body.task;
    var reason = body.reason || '';
    var expectedOutcome = body.expectedOutcome || '';
    var priority = body.priority || 'medium';
    
    if (!agentName || !task) {
      return NextResponse.json(
        { error: 'agentName and task are required' },
        { status: 400 }
      );
    }
    
    var proposal = {
      id: 'prop_' + Date.now(),
      agent: agentName,
      agentId: agentName.toLowerCase().replace(/\s+/g, '_'),
      task: task,
      reason: reason,
      expectedOutcome: expectedOutcome,
      priority: priority,
      status: 'pending',
      createdAt: new Date().toISOString(),
      votes: [],
      dependencies: []
    };
    
    var proposalsFile = getProposalsFile();
    var proposals: any[] = [];
    try {
      if (fs.existsSync(proposalsFile)) {
        proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'));
      }
    } catch (e) {}
    
    proposals.unshift(proposal);
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals, null, 2));
    
    return NextResponse.json({
      proposal: proposal,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
