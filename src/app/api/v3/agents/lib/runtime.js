/**
 * Blindfold v3 - Agent Runtime System
 * Agentes proactivos con comunicación, propuestas y colaboración
 */

const fs = require('fs');
const path = require('path');

const AGENTS_DIR = path.join(process.cwd(), 'src/lib/agents');
const PROPOSALS_FILE = '/home/ubuntu/.openclaw/workspace/blindfold-v3/data/proposals.json';
const TASKS_FILE = '/home/ubuntu/.openclaw/workspace/blindfold-v3/data/tasks.json';
const MESSAGES_FILE = '/home/ubuntu/.openclaw/workspace/blindfold-v3/data/agent-messages.json';
const AGENTS_STATE_FILE = '/home/ubuntu/.openclaw/workspace/blindfold-v3/data/agents-state.json';

// Ensure data directories exist
['/home/ubuntu/.openclaw/workspace/blindfold-v3/data'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ============ AGENT CLASS ============
class Agent {
  constructor(name, role, description, color, capabilities = []) {
    this.id = name.toLowerCase().replace(/\s+/g, '_');
    this.name = name;
    this.role = role;
    this.description = description;
    this.color = color;
    this.capabilities = capabilities;
    this.status = 'idle'; // idle, active, thinking, collaborating
    this.currentTask = null;
    this.messages = [];
    this.lastActive = new Date().toISOString();
    this.goals = [];
    this.suggestions = [];
  }

  async think(about) {
    this.status = 'thinking';
    this.lastActive = new Date().toISOString();
    // Simulate thinking time
    await new Promise(r => setTimeout(r, 1000));
    return {
      thought: about,
      timestamp: new Date().toISOString(),
      agent: this.name
    };
  }

  async propose(task, reason, expectedOutcome, priority = 'medium') {
    const proposal = {
      id: 'prop_' + Date.now(),
      agent: this.name,
      agentId: this.id,
      task: task,
      reason: reason,
      expectedOutcome: expectedOutcome,
      priority: priority, // low, medium, high, critical
      status: 'pending', // pending, approved, rejected, completed
      createdAt: new Date().toISOString(),
      votes: [], // Other agents can vote
      dependencies: [],
    };
    
    saveProposal(proposal);
    this.suggestions.push(proposal.id);
    
    // Notify other agents
    broadcastMessage({
      from: this.name,
      type: 'proposal',
      content: `He propuesto: ${task}`,
      proposalId: proposal.id
    });
    
    return proposal;
  }

  async collaborateWith(agentName, task) {
    this.status = 'collaborating';
    broadcastMessage({
      from: this.name,
      to: agentName,
      type: 'collaboration_request',
      content: `¿Podemos trabajar juntos en: ${task}?`,
      task: task
    });
    return { status: 'sent', to: agentName };
  }

  async giveFeedback(toAgent, aboutTask, feedback, rating) {
    const feedbackItem = {
      id: 'fb_' + Date.now(),
      from: this.name,
      to: toAgent,
      aboutTask: aboutTask,
      feedback: feedback,
      rating: rating, // 1-5
      timestamp: new Date().toISOString()
    };
    
    saveAgentFeedback(feedbackItem);
    
    broadcastMessage({
      from: this.name,
      to: toAgent,
      type: 'feedback',
      content: feedback,
      rating: rating
    });
    
    return feedbackItem;
  }
}

// ============ AGENT REGISTRY ============
const agents = {};

function initializeAgents() {
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
  
  const agentConfigs = {
    'Orchestrator': { 
      role: 'AI Orchestrator', 
      desc: 'Coordina múltiples agentes para tareas complejas',
      color: '#ff3366',
      capabilities: ['coordination', 'planning', 'delegation']
    },
    'Frontend Specialist': { 
      role: 'Frontend Developer', 
      desc: 'Experto en React, Vue y frameworks web modernos',
      color: '#00d4ff',
      capabilities: ['react', 'vue', 'css', 'ui_ux']
    },
    'Backend Specialist': { 
      role: 'Backend Developer', 
      desc: 'Desarrollo de APIs y servidor',
      color: '#00d4ff',
      capabilities: ['node', 'python', 'apis', 'databases']
    },
    'Database Architect': { 
      role: 'Database Designer', 
      desc: 'Diseño y optimización de bases de datos',
      color: '#10b981',
      capabilities: ['sql', 'nosql', 'optimization', 'schema']
    },
    'Devops Engineer': { 
      role: 'DevOps Specialist', 
      desc: 'CI/CD e infraestructura',
      color: '#f59e0b',
      capabilities: ['docker', 'kubernetes', 'ci_cd', 'cloud']
    },
    'Penetration Tester': { 
      role: 'Security Expert', 
      desc: 'Testing de seguridad',
      color: '#ff3366',
      capabilities: ['security', 'penetration', 'audit', 'compliance']
    },
    'Qa Automation Engineer': { 
      role: 'QA Engineer', 
      desc: 'Testing automatizado',
      color: '#10b981',
      capabilities: ['testing', 'automation', 'quality', 'coverage']
    },
    'Code Archaeologist': { 
      role: 'Code Analyst', 
      desc: 'Análisis de código legacy',
      color: '#a855f7',
      capabilities: ['refactoring', 'legacy', 'analysis', 'documentation']
    },
    'Performance Optimizer': { 
      role: 'Performance Engineer', 
      desc: 'Optimización de rendimiento',
      color: '#f59e0b',
      capabilities: ['optimization', 'profiling', 'caching', 'speed']
    },
    'Product Owner': { 
      role: 'Product Manager', 
      desc: 'Estrategia de producto',
      color: '#ec4899',
      capabilities: ['strategy', 'requirements', 'roadmap', 'prioritization']
    },
    'Project Planner': { 
      role: 'Project Manager', 
      desc: 'Gestión de proyectos',
      color: '#8b5cf6',
      capabilities: ['planning', 'tracking', 'coordination', 'reporting']
    },
    'Documentation Writer': { 
      role: 'Technical Writer', 
      desc: 'Documentación técnica',
      color: '#6b7280',
      capabilities: ['documentation', 'writing', 'clarity', 'structure']
    },
    'Mobile Developer': { 
      role: 'App Developer', 
      desc: 'Desarrollo móvil',
      color: '#06b6d4',
      capabilities: ['ios', 'android', 'react_native', 'flutter']
    },
    'Game Developer': { 
      role: 'Game Engineer', 
      desc: 'Desarrollo de juegos',
      color: '#22c55e',
      capabilities: ['unity', 'unreal', 'game_design', 'physics']
    },
    'Debugger': { 
      role: 'Bug Hunter', 
      desc: 'Detección de bugs',
      color: '#ef4444',
      capabilities: ['debugging', 'troubleshooting', 'root_cause', 'fixing']
    },
    'Explorer Agent': { 
      role: 'Researcher', 
      desc: 'Investigación',
      color: '#a855f7',
      capabilities: ['research', 'analysis', 'summarization', 'trends']
    },
  };

  files.forEach(file => {
    const name = file.replace('.md', '').replace(/-/g, ' ');
    const displayName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const config = agentConfigs[displayName] || { 
      role: 'AI Agent', 
      desc: 'Agente especializado',
      color: '#00d4ff',
      capabilities: []
    };
    
    agents[displayName] = new Agent(displayName, config.role, config.desc, config.color, config.capabilities);
  });

  return agents;
}

// ============ DATA PERSISTENCE ============
function saveProposal(proposal) {
  let proposals = [];
  try {
    if (fs.existsSync(PROPOSALS_FILE)) {
      proposals = JSON.parse(fs.readFileSync(PROPOSALS_FILE, 'utf-8'));
    }
  } catch (e) {}
  
  proposals.unshift(proposal);
  fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2));
}

function saveAgentFeedback(feedback) {
  let feedbacks = [];
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
      feedbacks = data.feedbacks || [];
    }
  } catch (e) {}
  
  feedbacks.unshift(feedback);
  const data = { feedbacks, messages: [], updatedAt: new Date().toISOString() };
  
  try {
    const existing = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    data.messages = existing.messages || [];
  } catch (e) {}
  
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2));
}

function saveTask(task) {
  let tasks = [];
  try {
    if (fs.existsSync(TASKS_FILE)) {
      tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    }
  } catch (e) {}
  
  tasks.unshift(task);
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function broadcastMessage(msg) {
  let messages = [];
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
      messages = data.messages || [];
    }
  } catch (e) {}
  
  messages.unshift({ ...msg, timestamp: new Date().toISOString() });
  
  let feedbacks = [];
  try {
    const data = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    feedbacks = data.feedbacks || [];
  } catch (e) {}
  
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify({ messages, feedbacks, updatedAt: new Date().toISOString() }, null, 2));
}

// ============ PUBLIC API ============
function getAgentState() {
  initializeAgents();
  
  const agentList = Object.values(agents).map(a => ({
    id: a.id,
    name: a.name,
    role: a.role,
    status: a.status,
    color: a.color,
    capabilities: a.capabilities,
    currentTask: a.currentTask,
    lastActive: a.lastActive,
    suggestionCount: a.suggestions.length
  }));
  
  return agentList;
}

function getProposals() {
  try {
    if (fs.existsSync(PROPOSALS_FILE)) {
      return JSON.parse(fs.readFileSync(PROPOSALS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function getTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
    }
  } catch (e) {}
  return [];
}

function getMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    }
  } catch (e) {}
  return { messages: [], feedbacks: [] };
}

function createProposal(agentName, task, reason, expectedOutcome, priority) {
  initializeAgents();
  if (agents[agentName]) {
    return agents[agentName].propose(task, reason, expectedOutcome, priority);
  }
  return null;
}

function approveProposal(proposalId, approved, approvedBy = 'user') {
  const proposals = getProposals();
  const proposal = proposals.find(p => p.id === proposalId);
  
  if (proposal) {
    proposal.status = approved ? 'approved' : 'rejected';
    proposal.approvedBy = approvedBy;
    proposal.approvedAt = new Date().toISOString();
    
    // Save approved tasks
    if (approved) {
      saveTask({
        id: 'task_' + Date.now(),
        proposalId: proposalId,
        agent: proposal.agent,
        task: proposal.task,
        reason: proposal.reason,
        expectedOutcome: proposal.expectedOutcome,
        status: 'in_progress',
        startedAt: new Date().toISOString()
      });
      
      // Notify agent
      broadcastMessage({
        from: 'system',
        to: proposal.agent,
        type: 'task_assigned',
        content: `Tu propuesta ha sido aprobada: ${proposal.task}`,
        proposalId: proposalId
      });
    }
    
    // Rewrite proposals file
    const remaining = proposals.filter(p => p.id !== proposalId);
    fs.writeFileSync(PROPOSALS_FILE, JSON.stringify([...remaining, proposal], null, 2));
    
    return proposal;
  }
  return null;
}

function completeTask(taskId, result) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (task) {
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    task.result = result;
    
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    
    // Notify completion
    broadcastMessage({
      from: task.agent,
      type: 'task_completed',
      content: `Tarea completada: ${task.task}`,
      taskId: taskId,
      result: result
    });
    
    return task;
  }
  return null;
}

// Auto-generate proposals based on system needs
function generateAutoProposals() {
  initializeAgents();
  
  const autoProposals = [
    {
      agent: 'Explorer Agent',
      task: 'Investigar nuevas tendencias en IA',
      reason: 'Es importante mantenernos actualizados con las últimas tecnologías',
      expectedOutcome: 'Reporte de tendencias con recomendaciones',
      priority: 'medium'
    },
    {
      agent: 'Devops Engineer',
      task: 'Revisar infraestructura de deployment',
      reason: 'Los últimos deploys tuvieron tiempos de build elevados',
      expectedOutcome: 'Optimización de pipeline CI/CD',
      priority: 'high'
    },
    {
      agent: 'Qa Automation Engineer',
      task: 'Aumentar cobertura de tests en API',
      reason: 'La cobertura actual es del 72%, objetivo es 90%',
      expectedOutcome: '50+ nuevos tests unitarios',
      priority: 'medium'
    },
    {
      agent: 'Code Archaeologist',
      task: 'Refactorizar módulo de autenticación',
      reason: 'Código legacy con patrones obsoletos',
      expectedOutcome: 'Código más mantenible y seguro',
      priority: 'low'
    }
  ];
  
  autoProposals.forEach(p => {
    createProposal(p.agent, p.task, p.reason, p.expectedOutcome, p.priority);
  });
  
  return autoProposals;
}

// Initialize on load
initializeAgents();
generateAutoProposals();

module.exports = {
  getAgentState,
  getProposals,
  getTasks,
  getMessages,
  createProposal,
  approveProposal,
  completeTask,
  generateAutoProposals,
  Agent
};
