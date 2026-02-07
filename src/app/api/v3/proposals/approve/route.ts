import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    var body = await request.json();
    var proposalId = body.proposalId;
    var approved = body.approved;
    var approvedBy = body.approvedBy || 'user';
    
    if (!proposalId) {
      return NextResponse.json(
        { error: 'proposalId is required' },
        { status: 400 }
      );
    }
    
    var fs = require('fs');
    var proposalsFile = 'path.join(process.cwd(), 'data')/proposals.json';
    var tasksFile = 'path.join(process.cwd(), 'data')/tasks.json';
    
    var proposals: any[] = [];
    try {
      if (fs.existsSync(proposalsFile)) {
        proposals = JSON.parse(fs.readFileSync(proposalsFile, 'utf-8'));
      }
    } catch (e) {}
    
    var proposal = proposals.find((p: any) => p.id === proposalId);
    
    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }
    
    proposal.status = approved ? 'approved' : 'rejected';
    proposal.approvedBy = approvedBy;
    proposal.approvedAt = new Date().toISOString();
    
    var remaining = proposals.filter((p: any) => p.id !== proposalId);
    fs.writeFileSync(proposalsFile, JSON.stringify([...remaining, proposal], null, 2));
    
    // Save approved task
    if (approved) {
      var tasks: any[] = [];
      try {
        if (fs.existsSync(tasksFile)) {
          tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
        }
      } catch (e) {}
      
      var task = {
        id: 'task_' + Date.now(),
        proposalId: proposalId,
        agent: proposal.agent,
        task: proposal.task,
        reason: proposal.reason,
        expectedOutcome: proposal.expectedOutcome,
        status: 'in_progress',
        startedAt: new Date().toISOString()
      };
      
      tasks.unshift(task);
      fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
    }
    
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
