'use client';

import * as React from 'react';
import {
  Search,
  Star,
  HelpCircle,
  MessageSquare,
  Bell,
  ChevronDown,
  Command,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface CompanyHeaderProps {
  companyName?: string;
  currentTool?: string;
  userInitials?: string;
}

export function CompanyHeader({
  companyName = 'Alleato Group',
  currentTool = 'Home',
  userInitials = 'BC',
}: CompanyHeaderProps) {
  return (
    <header className="h-12 bg-[hsl(var(--procore-header))] text-[hsl(var(--procore-header-text))] flex items-center px-4 justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-sm hidden sm:inline">Alleato AI</span>
        </div>

        {/* Company Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10 px-2"
            >
              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm font-medium">{companyName}</span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuItem>Switch Company</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Company Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Company Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10 px-2"
            >
              <span className="text-xs text-gray-400">Company Tools</span>
              <span className="ml-2 text-sm font-medium">{currentTool}</span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem className="font-semibold">Home</DropdownMenuItem>
            <DropdownMenuItem>Directory</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Admin</DropdownMenuItem>
            <DropdownMenuItem>Reports</DropdownMenuItem>
            <DropdownMenuItem>Workforce Planning</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-8 pl-9 pr-16 bg-white/10 border-0 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-gray-400">
            <Command className="h-3 w-3" />
            <span className="text-xs">K</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
        >
          <Star className="h-4 w-4 mr-1" />
          <span className="text-sm">Favorites</span>
        </Button>

        {/* Apps Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
            >
              <span className="text-xs text-gray-400">Apps</span>
              <span className="ml-1 text-sm">Select an App</span>
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>App Store</DropdownMenuItem>
            <DropdownMenuItem>My Apps</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Icon Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[hsl(var(--procore-header-text))] hover:bg-white/10"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User Avatar */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-primary hover:bg-primary/90 rounded-full ml-2"
        >
          <span className="text-xs font-semibold text-primary-foreground">
            {userInitials}
          </span>
        </Button>
      </div>
    </header>
  );
}
