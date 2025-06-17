"use client";

import * as React from "react";
import {
  CirclePlus,
  CodeXml,
  FolderSearch,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { Sparkles, BrainCircuit, Wand2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "@/assets/roadmap.png";
import { url } from "inspector";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "",
    avatar: "/avatars/shadcn.jpg", 
  });

  React.useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser?.nome || "Usuário",
        avatar: "/avatars/shadcn.jpg",
      });
    }
  }, []);

  const navMain = [
    {
      name: "Visualizar todos os Roadmaps",
      url: "/roadmaps",
      icon: CodeXml,
    },
  ];

  const projects = [
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
    {
      name: "Assistente IA",
      url: "/roadmaps/generate",
      icon: Sparkles,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-16 items-center justify-center mt-2">
          <Image src={logo} alt="logo" width={100} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
