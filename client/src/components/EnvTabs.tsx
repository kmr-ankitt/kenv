import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateSecret from "./secrets/CreateSecret"
import Secrects from "./secrets/Secrects"
import Logs from "./logs/Logs"

export default function EnvTabs() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs defaultValue="create-secret" className="lg:w-1/2 mx-4 flex flex-col items-center justify-center">
        <TabsList className="w-full bg-purple-200">
          <TabsTrigger value="create-secret" >Create Secret</TabsTrigger>
          <TabsTrigger value="retrieve-secret">Retrieve Secret</TabsTrigger>
          <TabsTrigger value="manage-secret">Manage Secret</TabsTrigger>
        </TabsList>
        <TabsContent value="create-secret" className="w-full">
          <CreateSecret />
        </TabsContent>
        <TabsContent value="retrieve-secret" className="w-full">
          <Secrects />
        </TabsContent>
        <TabsContent value="manage-secret" className="w-full">
          <Logs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
