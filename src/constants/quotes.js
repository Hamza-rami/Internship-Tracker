export const MOTIVATIONAL_QUOTES = [
  {
    quote: "Every rejection is redirection. At 1337, you mastered debugging tough segfaults — recruiting is just another problem to iterate on.",
    author: "1337 Peer Wisdom"
  },
  {
    quote: "Consistency beats intensity. One quality, personalized application every day is far better than fifty random clicks.",
    author: "Career Coach"
  },
  {
    quote: "You only need ONE 'Yes'. All the 'No's along the way won't matter the moment you sign your contract.",
    author: "Software Engineer"
  },
  {
    quote: "Recruiting is a skill just like coding in C, Rust, or React. The more reps you do, the sharper your communication becomes.",
    author: "Tech Mentor"
  },
  {
    quote: "Take pride in putting yourself out there. Showing up every day is already proof of your grit.",
    author: "Daily Reminder"
  },
  {
    quote: "Don't measure your worth by response rates. Keep building projects, pushing to GitHub, and showing your passion.",
    author: "Senior Developer"
  },
  {
    quote: "Rest if you need to, but never give up. Progress isn't always linear, but your cumulative effort always compounds.",
    author: "Philosophy of 42/1337"
  },
  {
    quote: "When you reach out with curiosity and genuine interest in a team's tech stack, you stand out from 90% of applicants.",
    author: "Engineering Lead"
  }
];

export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
};
