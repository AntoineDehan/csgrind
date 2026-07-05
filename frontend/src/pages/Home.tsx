import Button from "../components/ui/Button/Button";
import Title from "../components/ui/Title/Title";
import Text from "../components/ui/Text/Text";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex align-item justify-center flex-col items-center pl-50 pr-50">
      <div className="top-content flex justify-between">
        <div>
          <Title>See your progress, fix your mistakes</Title>
          <div>
            <Text>Description super génial ici</Text>
          </div>
        </div>
        <div>Screen?</div>
      </div>
      <div className="main-content">
        <div>Bilan img</div>
      </div>
      <div className="middle-content w-full h-96">
        <Title>HOW TO START</Title>
        <Text>3 easy steps before starting your journey to the top</Text>
        <div className="cards-container flex gap-3 mt-6 justify-between">
          <Card className="aspect-square size-[320px]">
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>First step is to register</CardDescription>
            </CardHeader>
            <CardContent>First step is to register</CardContent>
          </Card>
          <Card className="aspect-square size-[320px]">
            <CardHeader>
              <CardTitle>Set a Goal</CardTitle>
              <CardDescription>
                Set your elo goal and start to grind
              </CardDescription>
            </CardHeader>
            <CardContent>First step is to register</CardContent>
          </Card>
          <Card className="aspect-square size-[320px]">
            <CardHeader>
              <CardTitle>Receive your Report</CardTitle>
              <CardDescription>
                Get a notification for your first report
              </CardDescription>
            </CardHeader>
            <CardContent>First step is to register</CardContent>
          </Card>
        </div>
      </div>
      <div className="bottom-content">Pas sur ici</div>
      <div>
        <Button variant="cta">Register</Button>
      </div>
      <Title>Home</Title>
    </div>
  );
}
