import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import Title from "../../components/ui/Title/Title";
import Text from "../../components/ui/Text/Text";
import Section from "../../components/ui/Section/Section";
import RotatingText from "../../components/ui/RotatingText/RotatingText";
import ReportPreview from "./components/ReportPreview/ReportPreview";
import HeroGoalDemo from "./components/HeroGoalDemo/HeroGoalDemo";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { UserPlus, Target, LineChart } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Register",
    body: "Create your account and link your Steam account — your CS2 stats sync in automatically, no manual input.",
  },
  {
    icon: Target,
    title: "Set your goal",
    body: "Choose your target rank on Premier or Faceit, set a deadline, and pick how often you want your reports.",
  },
  {
    icon: LineChart,
    title: "Receive your report",
    body: "On your schedule, get a report with your progress, personalized tips, and a to-do list of drills to fix your weak spots.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const ACCORDION_FEATURES = [
    {
      title: "Objective tracking",
      detail:
        "Pick your target rank on Premier or Faceit and add a deadline. Every report is measured against that goal, so you always know how close you are and whether you're on pace.",
    },
    {
      title: "Recurrent reports",
      detail:
        "Choose your cadence : every few days, weekly, or monthly. Reports land automatically, straight to your inbox. Each one compares your latest stats to the previous period, so you see exactly what improved and what slipped.",
    },
    {
      title: "Dynamic to do list",
      detail:
        "Each report generates a handful of drills built from your weakest stats, headshot accuracy, reaction time, utility etc... Concrete tasks you can train before the next one, not vague 'get better' advice.",
    },
    {
      title: "Tips",
      detail:
        "On top of the drills, you get tips tailored to what's actually costing you rounds and they scale to your rank and role. A Premier player won't be told to 'lower your sens'.",
    },
  ];
  return (
    <div className="flex justify-center flex-col items-center pl-85 pr-85 max-2xl:max-w-190 max-2xl:mx-auto max-2xl:px-6 max-md:px-4">
      <section className="top-content flex justify-between w-full mt-10 mb-25 max-md:flex-col max-md:gap-10 max-md:mb-12">
        <div className="w-[40%] max-md:w-full">
          <Title>
            See your progress,{" "}
            <RotatingText
              phrases={[
                "Fix your mistakes.",
                "Climb the ranks.",
                "Hit your goal.",
                "Sharpen your aim.",
                "Improve the game.",
              ]}
            />
          </Title>
          <div className="flex flex-col items-center">
            <Text>
              Set a goal. Get reports. Climb. csgrind tracks your progress on
              your own schedule and turns every report into a clear plan to hit
              your target rank.
            </Text>
            <div className="mt-4 flex gap-3.5">
              <Button variant="cta" onClick={() => navigate("/register")}>
                Start now
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  document
                    .getElementById("learn-more")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
        <div className="w-1/2 max-md:w-full">
          <HeroGoalDemo />
        </div>
      </section>
      <Section
        title="YOUR OWN REPORTS"
        subtitle="Know what's working, what's costing you rounds, and what to fix before you queue again."
        className="main-content w-full mb-15"
      >
        <ReportPreview />
      </Section>
      <Section
        title="HOW TO START"
        subtitle="3 easy steps before starting your journey to the top"
        className="middle-content w-full mb-15"
      >
        <div className="cards-container mt-6 flex gap-4 max-md:flex-col">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.title}
                className="flex-1 transition hover:ring-brand/40"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="size-6" strokeWidth={1.5} />
                    </div>
                    <Text span mono size="large" weight="bold" color="brand">
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                  </div>
                  <CardTitle className="mt-3">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text color="secondary">{step.body}</Text>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>
      <Section
        id="learn-more"
        title="MORE THAN SOME STATS"
        subtitle="The main goal of CSGRIND is to help you track your progress up until the completion of your goal"
        className="bottom-content w-full mb-15"
      >
        <Accordion
          multiple={false}
          className="mt-6 rounded-lg border px-4 bg-background-secondary border-background-secondary-border"
        >
          {ACCORDION_FEATURES.map((f, i) => (
            <AccordionItem
              key={f.title}
              value={f.title}
              className="border-background-secondary-border"
            >
              <AccordionTrigger>
                <span className="flex items-center gap-4">
                  <Text span mono color="brand">
                    {String(i + 1).padStart(2, "0")} /
                  </Text>
                  <Text span weight="medium">
                    {f.title}
                  </Text>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Text color="secondary">{f.detail}</Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
      <div className="bottom-cta mt-10 w-[50%] max-md:w-full flex flex-col justify-center items-center mb-10">
        <Title level="h3">READY TO GRIND ?</Title>
        <Text size="small">Time to finally obtain your dream elo</Text>
        <div className="mt-5">
          <Button variant="cta" onClick={() => navigate("/register")}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
