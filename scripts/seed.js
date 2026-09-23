// Loads the three projects into the database. Safe to run again: it updates by slug.
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('../models/Project');

const projects = [
  {
    slug: 'fire-navigation-robot',
    order: 1,
    title: 'Fire Navigation and Victim Detection Robot',
    status: 'In progress, nearly complete',
    statusTone: 'wip',
    links: [{ label: 'Personal project with one teammate' }, { label: 'GitHub repo coming soon' }],
    sections: [
      { label: 'Problem', text: 'In a fire, a robot could search for people without putting a rescuer at risk. I wanted to see how far a small autonomous robot can get in simulation.' },
      { label: 'What it does', text: 'A simulated robot moves through an environment with obstacles, fire and victims, and detects flames and people using a camera feed.' },
      { label: 'My role', text: 'My teammate and I built every part together over about six months, from the robot model to navigation and detection.' },
      { label: 'Key features', items: ['Robot model and navigation system in ROS 2 and Gazebo', 'Flame and human victim detection with OpenCV', 'Automated alert message when a detection happens'] },
      { label: 'Tech', chips: ['ROS 2', 'Gazebo', 'Python', 'OpenCV'] },
      { label: 'Status', text: 'Simulation only, no physical robot. Still being finished.' },
    ],
  },
  {
    slug: 'eduaccess-ai',
    order: 2,
    title: 'EduAccess AI',
    status: 'Hackathon prototype, submitted',
    statusTone: 'ok',
    links: [
      { label: 'Frontend repository', url: 'https://github.com/Dhakshatha2007/Nitrostack_frontend' },
      { label: 'Backend and AI agents are not in this repo' },
    ],
    sections: [
      { label: 'Event', text: 'NitroStack Agentic AI Hackathon. Team of four; I took part and the team submitted a working prototype. No result to report.' },
      { label: 'Problem', text: 'Study material is often hard to use for learners who are visually or hearing impaired, or who read in a different language.' },
      { label: 'Solution', text: 'A platform that turns study material into accessible formats: text-to-speech, speech-to-text and translation.' },
      { label: 'My role', text: "I built the frontend: a multi-page interface from login through to the core features, in TypeScript. My teammates built the accessibility logic and AI side, so I don't claim those parts." },
      { label: 'Tech', chips: ['TypeScript', 'Frontend development'] },
    ],
  },
  {
    slug: 'studyplanner',
    order: 3,
    title: 'StudyPlanner',
    status: 'Working backend',
    statusTone: 'ok',
    links: [{ label: 'Personal project, solo' }, { label: 'Repository is private; I can share access on request' }],
    sections: [
      { label: 'Problem', text: 'Exam preparation is easier when the time you have is split across subjects, and doing that by hand is tedious.' },
      { label: 'Solution', text: 'You enter your subjects, the days left before exams and the hours you can study, and it returns a study plan.' },
      { label: 'My role', text: 'I built all of it myself. It is a Python backend with no frontend. It calls the OpenAI API to generate the plan, and uses JSON for structured input and output.' },
      { label: 'Tech', chips: ['Python', 'OpenAI API', 'JSON', 'MCP'] },
    ],
  },
];

(async () => {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set.');
  await mongoose.connect(process.env.MONGODB_URI);
  for (const p of projects) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
    console.log('Saved:', p.title);
  }
  await mongoose.disconnect();
})().catch((err) => { console.error(err.message); process.exit(1); });
