import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateSecret from "./secrets/CreateSecret"
import Secrects from "./secrets/Secrects"

export default function EnvTabs() {
  return (
    <div className="flex items-center justify-center h-[80%]">
      <Tabs defaultValue="create-secret" className="w-1/2 flex flex-col items-center justify-center">
        <TabsList className="w-full bg-purple-200">
          <TabsTrigger value="create-secret" >Create Secret</TabsTrigger>
          <TabsTrigger value="retrieve-secret">Retrieve Secret</TabsTrigger>
          <TabsTrigger value="manage-secret">Manage Secret</TabsTrigger>
        </TabsList>
        <TabsContent value="create-secret" className="w-full">
          <CreateSecret />
        </TabsContent>
        <TabsContent value="retrieve-secret">
          <Secrects />
        </TabsContent>
        <TabsContent value="manage-secret">Manage your secrets here.</TabsContent>
      </Tabs>
    </div>
  )
}
