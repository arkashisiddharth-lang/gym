export const nav = [['/', 'HOME'], ['/programs', 'PROGRAMS'], ['/trainers', 'TRAINERS'], ['/membership', 'MEMBERSHIP'], ['/about', 'ABOUT'], ['/gallery', 'GALLERY'], ['/contact', 'CONTACT']] as const
const P = (title: string, desc: string, difficulty: string, duration: string, style: string, suitable: string) => ({ title, desc, difficulty, duration, style, suitable })
export const programs = [
  P('STRENGTH', 'Barbell-based blocks built on progressive overload. Heavy, measured and coached.', 'Intermediate to advanced', '60 min', 'Squat, press, pull, hinge', 'Lifters who want to get measurably stronger'),
  P('CONDITIONING', 'Engines built under fatigue. Intervals, sleds and circuits that reward consistency.', 'All levels', '45 min', 'Intervals and circuits', 'Anyone building work capacity'),
  P('PERFORMANCE', 'Testing, programming and review for athletes who train toward a number.', 'Advanced', '75 min', 'Power, speed, testing', 'Competitive and sport athletes'),
  P('MOBILITY', 'Joint control and range under load, so you can train hard for years.', 'Beginner friendly', '40 min', 'Flow, loaded stretching', 'Desk-bound and returning members'),
  P('BOXING', 'Technical bag and pad work with footwork, defence and conditioning rounds.', 'All levels', '55 min', 'Technique and rounds', 'Beginners through fighters'),
  P('PERSONAL TRAINING', 'One coach, one plan, one standard. Programming built around your week.', 'Tailored', '60 min', 'One-to-one coaching', 'Members with a specific goal'),
]
export const intensity = ['High', 'Medium', 'Peak']
export const trainers = [
  { name: 'Alex Morgan', role: 'Strength & Conditioning', exp: '12 years', bio: 'Former competitive powerlifter who coaches the main floor.', philosophy: 'Show up on the bad days. That is the program.' },
  { name: 'Maya Carter', role: 'Performance Coach', exp: '9 years', bio: 'Builds testing and sprint programmes for field and court athletes.', philosophy: 'What gets measured gets better.' },
  { name: 'Daniel Brooks', role: 'Boxing & Conditioning', exp: '15 years', bio: 'Amateur boxing coach with a technical, patient approach.', philosophy: 'Technique first, then pressure.' },
  { name: 'Sofia Reed', role: 'Mobility & Recovery', exp: '8 years', bio: 'Movement specialist who keeps members training through the year.', philosophy: 'Recovery is training you do on purpose.' },
]
export const plans = [
  { id: 'district', name: 'DISTRICT', tag: 'The floor, on your schedule.', features: ['Full gym access', 'Open training floor', 'Locker access'] },
  { id: 'performance', name: 'PERFORMANCE', tag: 'Structure and assessment.', features: ['Everything in District', 'Group training', 'Performance assessment'] },
  { id: 'elite', name: 'ELITE', tag: 'Coached end to end.', features: ['Everything in Performance', 'Personal coaching', 'Priority booking', 'Recovery access'] },
]
export const cats = ['ALL', 'TRAINING', 'PEOPLE', 'SPACE', 'COMMUNITY', 'PERFORMANCE']
export const gallery = [
  ['TRAINING', 'Heavy Tuesday'], ['SPACE', 'The main floor'], ['PEOPLE', 'Morning crew'], ['PERFORMANCE', 'Testing day'], ['COMMUNITY', 'Saturday session'], ['TRAINING', 'Bag rounds'],
  ['SPACE', 'Rack row'], ['PEOPLE', 'Coach Alex'], ['PERFORMANCE', 'Sprint block'], ['COMMUNITY', 'Member night'], ['TRAINING', 'Sled push'], ['SPACE', 'Recovery room'],
].map(([cat, title], i) => ({ id: i, cat, title, size: ['tall', 'wide', 'sq'][i % 3] }))
export const plansLabel: Record<string, string> = { district: 'District Membership', performance: 'Performance Membership', elite: 'Elite Membership' }
