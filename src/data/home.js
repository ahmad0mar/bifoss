// Copy for the Home page. Edit text here; no need to touch the components.
// Answers marked with a FILL IN comment are safe placeholders: they read correctly
// as they are, and the club should replace them with the real details.

// The commands shown in the home page terminal. Edit the wording here.
// cmd: what is typed. note: grey explanation shown under it (optional).
// output: a line the terminal prints after the command (optional).
export const heroSteps = [
  { cmd: 'git clone <project>', note: 'get a copy of the code' },
  { cmd: 'git switch -c fix-typo', note: 'make your own branch' },
  { cmd: 'git commit -am "Fix typo"', note: 'save your change' },
  { cmd: 'git push -u origin fix-typo', output: "remote: Create a pull request for 'fix-typo'" },
]

export const tools = [
  'Git', 'GitHub', 'Linux', 'Python', 'JavaScript', 'React', 'Rust', 'Docker',
  'Arduino', 'Raspberry Pi', 'VS Code', 'Neovim', 'Blender', 'LibreOffice',
  'Firefox', 'PostgreSQL', 'Node.js', 'Markdown',
]

export const tracks = [
  { title: 'Web and apps', body: 'HTML, CSS, JavaScript and frameworks. Build real sites and tools, then publish the code.' },
  { title: 'Linux and systems', body: 'The terminal, shell scripts, servers and how an operating system really works.' },
  { title: 'Hardware and IoT', body: 'Open hardware with Arduino and Raspberry Pi, plus the firmware that runs on it.' },
  { title: 'Open source contribution', body: 'Learn Git, read other people\'s code and send your first pull request.' },
  { title: 'Design and docs', body: 'Interfaces, graphics and documentation. Projects need more than code.' },
  { title: 'AI and data', body: 'Open models, datasets and notebooks. Learn what is inside the tools you use.' },
]

export const steps = [
  { title: 'Fill in the join form', body: 'It takes two minutes. Tell us your name, branch and what you want to learn.' },
  { title: 'Join the community chat', body: 'We share event updates, questions and project help there.' },
  { title: 'Come to a session', body: 'Pick any workshop or meetup. Beginners are the point, not an exception.' },
  { title: 'Pick a track and a project', body: 'Choose something you care about. Mentors help you scope it small.' },
  { title: 'Ship something in the open', body: 'Put your work on GitHub, write about it and help the next newcomer.' },
]

export const faqs = [
  {
    q: 'Who can join BIFOSS?',
    // FILL IN: say whether students from other colleges and alumni can join.
    a: 'Students of Bearys ICB can join. Details for other colleges and alumni will be posted here.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'No. We run beginner sessions, and designers, writers and curious people are welcome.',
  },
  {
    q: 'What does "free and open source" mean?',
    a: 'Software whose source code anyone can read, use, change and share. Linux, Firefox and Python are well-known examples.',
  },
  {
    q: 'Does it cost anything?',
    // FILL IN: state the membership fee, or that membership is free.
    a: 'Membership details, including any fee, will be announced here before you apply.',
  },
  {
    q: 'How often do you meet?',
    // FILL IN: state the regular meeting day and time.
    a: 'Meeting times are listed on the Events page as soon as they are scheduled.',
  },
  {
    q: 'Can I propose a talk or a project?',
    a: 'Yes. Tell us on the join form or in the community chat and we will find a slot.',
  },
]
