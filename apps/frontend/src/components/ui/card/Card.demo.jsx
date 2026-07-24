import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "./index";
import { Button } from "../button";
import { Input } from "../input";

export default function CardDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Card Component Demo</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">Basic Card</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Workers Directory</CardTitle>
            <CardDescription>Manage your active workforce and their assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              The workers directory allows you to see all the active people currently working on various sites.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>View All</Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">Form Card</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Create Project</CardTitle>
            <CardDescription>Deploy your new project in one-click.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Name" placeholder="Name of your project" />
            <Input label="Framework" placeholder="e.g. React, Vue" />
          </CardContent>
          <CardFooter>
            <Button fullWidth>Deploy</Button>
          </CardFooter>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2 border-gray-200">Grid Layout</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Active users this month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">12,450</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Generated in last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$45,231.89</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>Current paying customers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">+2350</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
