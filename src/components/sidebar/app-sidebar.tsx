"use client"

import * as React from "react"
import {
  Accessibility,
  BugPlay,
  Code,
  Codesandbox,
  CodeXml,
  Computer,
  FileType,
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
      title: "Front-End",
      url: "#",
      icon: CodeXml,
      isActive: true,
      items: [
        {
          title: "React",
          url: "#",
        },
        {
          title: "React Native",
          url: "#",
        },
        {
          title: "Angular",
          url: "#",
        },
      ],
    },
    {
      title: "Backend",
      url: "#",
      icon: BugPlay,
      items: [
        {
          title: "Node.js",
          url: "#",
        },
        {
          title: "Java",
          url: "#",
        },
        {
          title: "Python",
          url: "#",
        },
      ],
    },
    {
      title: "DevOps",
      url: "#",
      icon: Codesandbox,
      items: [
        {
          title: "Docker",
          url: "#",
        },
        {
          title: "AWS",
          url: "#",
        },
        {
          title: "Kubernetes",
          url: "#",
        },
        {
          title: "",
          url: "#",
        },
      ],
    },
    {
      title: "Data Analyst",
      url: "#",
      icon: Computer,
      items: [
        {
          title: "SQL",
          url: "#",
        },
        {
          title: "Python",
          url: "#",
        },
        {
          title: "R",
          url: "#",
        },
        {
          title: "Data Structures",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "JavaScript",
      url: "#",
      icon: Code,
    },
    {
      name: "Typescript",
      url: "#",
      icon: FileType,
    },
    {
      name: "PHP",
      url: "#",
      icon: Accessibility,
    },
  ],
}

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
