export interface AssessmentQuestion {
  id: string
  category: 'energy' | 'information' | 'decisions' | 'structure' | 'communication' | 'stress'
  mbtiDimension: 'E/I' | 'S/N' | 'T/F' | 'J/P'
  scenario: string
  visual: string
  question: string
  options: AssessmentOption[]
}

export interface AssessmentOption {
  id: string
  text: string
  mbtiIndicator: string
  weight: number
}

export interface UserResponse {
  questionId: string
  selectedOptionId: string
  timestamp: Date
}

export interface AssessmentSession {
  id: string
  responses: UserResponse[]
  currentQuestionIndex: number
  startedAt: Date
  completedAt?: Date
  mbtiResult?: MBTIResult
}

export interface MBTIResult {
  type: string
  confidence: number
  dimensions: {
    'E/I': { score: number; preference: 'E' | 'I' }
    'S/N': { score: number; preference: 'S' | 'N' }
    'T/F': { score: number; preference: 'T' | 'F' }
    'J/P': { score: number; preference: 'J' | 'P' }
  }
  superpowerData: SuperpowerData
}

export interface SuperpowerData {
  title: string
  archetype: string
  description: string
  strengths: string[]
  challenges: string[]
  careerPaths: string[]
  workStyle: string
  leadership: string
  teamRole: string
  stressResponse: string
  motivation: string
}

// The 6 Strategic Assessment Questions
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1_energy',
    category: 'energy',
    mbtiDimension: 'E/I',
    scenario: 'Your team is planning the next quarter\'s strategy...',
    visual: '/images/team-meeting.svg',
    question: 'How do you prefer to contribute to strategic planning?',
    options: [
      {
        id: 'q1_a',
        text: 'Lead group discussions and brainstorming sessions',
        mbtiIndicator: 'E',
        weight: 3
      },
      {
        id: 'q1_b',
        text: 'Prepare detailed analysis before presenting to the group',
        mbtiIndicator: 'I',
        weight: 3
      },
      {
        id: 'q1_c',
        text: 'Facilitate small group conversations and build consensus',
        mbtiIndicator: 'E',
        weight: 2
      },
      {
        id: 'q1_d',
        text: 'Provide one-on-one input to key decision makers',
        mbtiIndicator: 'I',
        weight: 2
      }
    ]
  },
  {
    id: 'q2_information',
    category: 'information',
    mbtiDimension: 'S/N',
    scenario: 'When approaching a new project, you typically...',
    visual: '/images/project-planning.svg',
    question: 'What\'s your natural approach to understanding new challenges?',
    options: [
      {
        id: 'q2_a',
        text: 'Research similar past projects and proven methodologies',
        mbtiIndicator: 'S',
        weight: 3
      },
      {
        id: 'q2_b',
        text: 'Envision the big picture and future possibilities',
        mbtiIndicator: 'N',
        weight: 3
      },
      {
        id: 'q2_c',
        text: 'Gather concrete data and current market facts',
        mbtiIndicator: 'S',
        weight: 2
      },
      {
        id: 'q2_d',
        text: 'Explore innovative angles and potential disruptions',
        mbtiIndicator: 'N',
        weight: 2
      }
    ]
  },
  {
    id: 'q3_decisions',
    category: 'decisions',
    mbtiDimension: 'T/F',
    scenario: 'A teammate is struggling with their workload...',
    visual: '/images/stressed-colleague.svg',
    question: 'How do you typically respond to help them?',
    options: [
      {
        id: 'q3_a',
        text: 'Analyze their tasks and suggest efficiency improvements',
        mbtiIndicator: 'T',
        weight: 3
      },
      {
        id: 'q3_b',
        text: 'Offer emotional support and listen to their concerns',
        mbtiIndicator: 'F',
        weight: 3
      },
      {
        id: 'q3_c',
        text: 'Help them prioritize and reallocate resources logically',
        mbtiIndicator: 'T',
        weight: 2
      },
      {
        id: 'q3_d',
        text: 'Check in on their wellbeing and team harmony',
        mbtiIndicator: 'F',
        weight: 2
      }
    ]
  },
  {
    id: 'q4_structure',
    category: 'structure',
    mbtiDimension: 'J/P',
    scenario: 'Your ideal work environment includes...',
    visual: '/images/workspace-split.svg',
    question: 'Which work style environment energizes you most?',
    options: [
      {
        id: 'q4_a',
        text: 'Clear deadlines, structured plans, and organized systems',
        mbtiIndicator: 'J',
        weight: 3
      },
      {
        id: 'q4_b',
        text: 'Flexible timelines, adaptive approaches, and open options',
        mbtiIndicator: 'P',
        weight: 3
      },
      {
        id: 'q4_c',
        text: 'Predictable routines with room for some spontaneity',
        mbtiIndicator: 'J',
        weight: 2
      },
      {
        id: 'q4_d',
        text: 'Dynamic changes with loose structure as needed',
        mbtiIndicator: 'P',
        weight: 2
      }
    ]
  },
  {
    id: 'q5_communication',
    category: 'communication',
    mbtiDimension: 'T/F',
    scenario: 'When presenting ideas to leadership...',
    visual: '/images/presentation.svg',
    question: 'What approach do you find most effective?',
    options: [
      {
        id: 'q5_a',
        text: 'Lead with data, metrics, and logical arguments',
        mbtiIndicator: 'T',
        weight: 3
      },
      {
        id: 'q5_b',
        text: 'Share stories that connect emotionally with values',
        mbtiIndicator: 'F',
        weight: 3
      },
      {
        id: 'q5_c',
        text: 'Build collaborative consensus before presenting',
        mbtiIndicator: 'F',
        weight: 2
      },
      {
        id: 'q5_d',
        text: 'Present clear, direct recommendations with evidence',
        mbtiIndicator: 'T',
        weight: 2
      }
    ]
  },
  {
    id: 'q6_stress',
    category: 'stress',
    mbtiDimension: 'E/I',
    scenario: 'Under a tight deadline with unexpected obstacles...',
    visual: '/images/deadline-pressure.svg',
    question: 'How do you naturally respond to high-pressure situations?',
    options: [
      {
        id: 'q6_a',
        text: 'Rally the team and brainstorm solutions together',
        mbtiIndicator: 'E',
        weight: 3
      },
      {
        id: 'q6_b',
        text: 'Step back, analyze the situation, and plan systematically',
        mbtiIndicator: 'I',
        weight: 3
      },
      {
        id: 'q6_c',
        text: 'Seek input from others while maintaining focus',
        mbtiIndicator: 'E',
        weight: 2
      },
      {
        id: 'q6_d',
        text: 'Work independently to solve problems efficiently',
        mbtiIndicator: 'I',
        weight: 2
      }
    ]
  }
]

// MBTI Superpower Archetypes
export const SUPERPOWER_ARCHETYPES: Record<string, SuperpowerData> = {
  ENFP: {
    title: 'The Innovation Catalyst',
    archetype: 'Sparks creativity and drives positive change',
    description: 'You\'re the spark that ignites creativity in every room! Your enthusiasm for new ideas and natural ability to connect with people makes you a powerful force for positive change.',
    strengths: [
      'Turns brainstorming into breakthrough sessions',
      'Builds bridges between different perspectives', 
      'Spots opportunities others miss'
    ],
    challenges: ['Can lose interest in routine tasks'],
    careerPaths: ['Innovation Consulting', 'Product Management', 'Marketing', 'Entrepreneurship'],
    workStyle: 'Thrives in dynamic, people-focused environments',
    leadership: 'Inspirational leader who motivates through vision',
    teamRole: 'The creative energizer and relationship builder',
    stressResponse: 'Seeks collaboration and brainstorming',
    motivation: 'Making a meaningful impact on people and organizations'
  },
  INTJ: {
    title: 'The System Architect',
    archetype: 'Designs efficient systems and long-term strategies',
    description: 'You see the blueprint others miss! Your strategic mind and systematic approach turn complex challenges into elegant, efficient solutions.',
    strengths: [
      'Creates comprehensive long-term strategies',
      'Optimizes complex systems and processes',
      'Sees patterns and connections others miss'
    ],
    challenges: ['May need to communicate vision more clearly'],
    careerPaths: ['Strategic Planning', 'Systems Architecture', 'Consulting', 'Research & Development'],
    workStyle: 'Independent work with minimal interruptions',
    leadership: 'Visionary leader who plans for the future',
    teamRole: 'The strategic mastermind and systems thinker',
    stressResponse: 'Steps back to analyze and systematically plan',
    motivation: 'Building something meaningful and lasting'
  }
  // Add other 14 types here...
}