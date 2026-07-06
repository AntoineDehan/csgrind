import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button/Button";
import Title from "../components/ui/Title/Title";
import Text from "../components/ui/Text/Text";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
    <div className="flex justify-center flex-col items-center pl-70 pr-70 max-lg:px-40">
      <div className="top-content flex justify-between w-full mt-10">
        <div className="w-[40%]">
          <Title>
            See your progress,
            <span className="colored-text"> Fix your mistakes</span>
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
              <Button variant="secondary">Learn more</Button>
            </div>
          </div>
        </div>
        <div>Screen?</div>
      </div>
      <div className="main-content w-full h-104 mt-5">
        <Title level="h2">YOUR OWN REPORTS</Title>
        <div>Bilan img</div>
      </div>
      <div className="middle-content w-full">
        <Title level="h2">HOW TO START</Title>
        <Text>3 easy steps before starting your journey to the top</Text>
        <div className="cards-container flex gap-3 mt-6 justify-between">
          <Card className="aspect-square size-[320px] border-background-secondary-border">
            <CardHeader>
              <CardTitle>
                <Text weight="medium" size="large">
                  Register
                </Text>
              </CardTitle>
              <CardDescription>First step is to register</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>
                Create your account and link you Steam account, your CS2 stats
                sync in automatically, no manual input.
              </Text>
            </CardContent>
          </Card>
          <Card className="aspect-square size-[320px] border-background-secondary-border">
            <CardHeader>
              <CardTitle>
                <Text weight="medium" size="large">
                  Set your Goal
                </Text>
              </CardTitle>
              <CardDescription>
                Set your elo goal and start to grind
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text>
                Choose your target rank on Premier or Faceit, set a deadline,
                and pick how often you want your reports.
              </Text>
            </CardContent>
          </Card>
          <Card className="aspect-square size-[320px] border-background-secondary-border">
            <CardHeader>
              <CardTitle>
                <Text weight="medium" size="large">
                  Receive your Report
                </Text>
              </CardTitle>
              <CardDescription>
                Get a notification for your first report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text>
                On your schedule, get a report with your progress, personalized
                tips, and a to-do list of drills to fix your weak spots.
              </Text>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="bottom-content mt-5 w-full">
        <Title level="h2">MORE THAN SOME STATS</Title>
        <Text>
          The main goal of CSGRIND is to help you track your progress up until
          the completion of your goal
        </Text>
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
      </div>
      <div className="bottom-cta mt-10 w-[50%] flex flex-col justify-center items-center mb-5">
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
