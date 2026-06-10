export type Job = {
  id: string;
  title: string;
  location: string;
  type: string;
  typeColor: "red" | "navy" | "green";
  eligibility: string;
  highlights: string[];
};

export const JOBS: Job[] = [
  {
    id: "advisory-agent",
    title: "Insurance Advisory Agent",
    location: "Pan-India (Work from Home / Hybrid)",
    type: "Commission-Based",
    typeColor: "red",
    eligibility: "Age 21–55, Min. 10th Pass",
    highlights: [
      "Unlimited commission income",
      "IRDA-certified training provided",
      "Flexible working hours",
      "Growth path to Team Leader",
    ],
  },
  {
    id: "senior-advisor",
    title: "Senior Life Insurance Advisor",
    location: "Metro Cities (Mumbai, Delhi, Chennai, Bangalore)",
    type: "Full-Time",
    typeColor: "navy",
    eligibility: "Age 25–50, Min. Graduate, 1+ year sales exp.",
    highlights: [
      "Fixed salary + performance bonus",
      "Leadership and team building opportunities",
      "Priority client allocation",
      "Fast-track promotion to Branch Manager",
    ],
  },
  {
    id: "women-special",
    title: "Financial Advisory Agent (Women Special)",
    location: "All Tier 1 & Tier 2 Cities",
    type: "Part-Time / Flexible",
    typeColor: "green",
    eligibility: "Women candidates, Age 21–55, Any qualification",
    highlights: [
      "Specially designed for homemakers and part-time workers",
      "Female mentorship program",
      "Work from home friendly",
      "Special incentives for women achievers",
    ],
  },
];
