// "use client";

// import React from "react";
// import { usePathname } from "next/navigation";
// import { motion } from "framer-motion";
// import {
//   Menu,
//   Search,
//   Bell,
//   User,
//   Settings,
//   HelpCircle,
//   Sparkles,
//   Maximize2,
//   Minimize2,
//   LogOut,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";

// interface HeaderProps {
//   onMenuClick: () => void;
//   isSidebarOpen: boolean;
// }

// export const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {
//   const pathname = usePathname();
//   const [isFullscreen, setIsFullscreen] = React.useState(false);
//   const [searchFocused, setSearchFocused] = React.useState(false);

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const getPageTitle = () => {
//     const path = pathname.split("/").pop() || "dashboard";
//     return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
//   };

//   return (
//     <motion.header
//       className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-amber-200/50 dark:border-amber-800/50"
//       initial={{ y: -100 }}
//       animate={{ y: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <div className="flex h-16 items-center gap-4 px-6">
//         {/* Menu Button */}
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={onMenuClick}
//           className="lg:hidden rounded-full hover:bg-amber-100/50"
//         >
//           <Menu className="h-5 w-5" />
//         </Button>

//         {/* Page Title */}
//         <div className="hidden lg:block">
//           <h1 className="text-lg font-semibold bg-gradient-to-r from-amber-700 to-rose-700 dark:from-amber-400 dark:to-rose-400 bg-clip-text text-transparent">
//             {getPageTitle()}
//           </h1>
//           <p className="text-xs text-muted-foreground">
//             {new Date().toLocaleDateString("en-US", {
//               weekday: "long",
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//         </div>

//         {/* Search Bar */}
//         <div className="flex-1 max-w-md mx-auto">
//           <div className={cn(
//             "relative transition-all duration-300",
//             searchFocused && "scale-105"
//           )}>
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search templates, questions..."
//               className="pl-9 pr-4 rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-amber-500"
//               onFocus={() => setSearchFocused(true)}
//               onBlur={() => setSearchFocused(false)}
//             />
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-3">
//           {/* Fullscreen Toggle */}
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={toggleFullscreen}
//             className="rounded-full hover:bg-amber-100/50 hidden lg:flex"
//           >
//             {isFullscreen ? (
//               <Minimize2 className="h-4 w-4" />
//             ) : (
//               <Maximize2 className="h-4 w-4" />
//             )}
//           </Button>

//           {/* Notifications */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-amber-100/50">
//                 <Bell className="h-5 w-5" />
//                 <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center">
//                   3
//                 </span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-80">
//               <DropdownMenuLabel className="flex items-center justify-between">
//                 <span>Notifications</span>
//                 <Badge variant="outline" className="rounded-full text-xs">
//                   3 new
//                 </Badge>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <div className="max-h-96 overflow-y-auto">
//                 {[1, 2, 3].map((i) => (
//                   <DropdownMenuItem key={i} className="flex flex-col items-start p-4 cursor-pointer">
//                     <div className="flex items-center gap-3">
//                       <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center text-white">
//                         {i === 1 ? "📝" : i === 2 ? "👤" : "📊"}
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium">New response received</p>
//                         <p className="text-xs text-muted-foreground">2 minutes ago</p>
//                       </div>
//                     </div>
//                   </DropdownMenuItem>
//                 ))}
//               </div>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="justify-center text-xs text-muted-foreground">
//                 View all notifications
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* User Menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-amber-100/50">
//                 <Avatar className="h-10 w-10 ring-2 ring-amber-500/30">
//                   <AvatarImage src="https://github.com/shadcn.png" />
//                   <AvatarFallback className="bg-gradient-to-br from-amber-400 to-rose-500 text-white">
//                     AD
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>
//                 <div className="flex flex-col">
//                   <span className="font-medium">Admin User</span>
//                   <span className="text-xs text-muted-foreground">admin@uog.edu.et</span>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="cursor-pointer">
//                 <User className="h-4 w-4 mr-2" />
//                 Profile
//               </DropdownMenuItem>
//               <DropdownMenuItem className="cursor-pointer">
//                 <Settings className="h-4 w-4 mr-2" />
//                 Settings
//               </DropdownMenuItem>
//               <DropdownMenuItem className="cursor-pointer">
//                 <HelpCircle className="h-4 w-4 mr-2" />
//                 Help
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="cursor-pointer text-rose-600">
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <motion.div
//         className="h-0.5 bg-gradient-to-r from-amber-500 to-rose-500"
//         initial={{ width: "0%" }}
//         animate={{ width: "65%" }}
//         transition={{ duration: 1, delay: 0.5 }}
//       />
//     </motion.header>
//   );
// };