"use client"

import * as React from "react"
import {
  CirclePlus,
  CodeXml,
  FolderSearch,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavUser } from "@/components/sidebar/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Image from "next/image"
import logo from "@/assets/roadmap.png"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      name: "Visualizar todos os Roadmaps",
      url: "/roadmaps",
      icon: CodeXml,
    },
  ],
  projects: [
    {
      name: "Meus Roadmaps",
      url: "/roadmaps/mine",
      icon: FolderSearch,
    },
    {
      name: "Criar novo Roadmap",
      url: "/roadmaps/create",
      icon: CirclePlus,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-16 items-center justify-center mt-2">
        <Image src={logo} alt="logo" width={100}/>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
