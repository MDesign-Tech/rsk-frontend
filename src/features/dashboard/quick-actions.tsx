"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Users,
  Briefcase,
  HelpCircle,
  Handshake,
  Newspaper,
  Briefcase as OpportunityIcon,
  Image,
  Settings,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userService } from "@/services/user.service";
import { teamService } from "@/services/team.service";
import { serviceService } from "@/services/service.service";
import { faqService } from "@/services/faq.service";
import { useAuthStore } from "@/stores/auth.store";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  color: string;
  bgColor: string;
}

export function QuickActions() {
  const router = useRouter();
  const { hasPermission } = useAuthStore();

  // Modal states
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addTeamOpen, setAddTeamOpen] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [addFaqOpen, setAddFaqOpen] = useState(false);

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", email: "", role: "member" as "admin" | "member" });
  const [teamForm, setTeamForm] = useState({ name: "", position: "", department: "" });
  const [serviceForm, setServiceForm] = useState({ title: "", description: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

  const actions: QuickAction[] = [
    {
      title: "Add User",
      description: "Create a new admin or member account",
      icon: UserPlus,
      action: () => setAddUserOpen(true),
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Add Team Member",
      description: "Add a new member to your team",
      icon: Users,
      action: () => setAddTeamOpen(true),
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      title: "Add Service",
      description: "Create a new service offering",
      icon: Briefcase,
      action: () => setAddServiceOpen(true),
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      title: "Add FAQ",
      description: "Add a new frequently asked question",
      icon: HelpCircle,
      action: () => setAddFaqOpen(true),
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      title: "Media Library",
      description: "Manage images and media files",
      icon: Image,
      href: "/admin/media-library",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
    },
    {
      title: "Contact Messages",
      description: "View and respond to inquiries",
      icon: Settings,
      href: "/admin/contact",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      title: "News & Articles",
      description: "Manage blog posts and news",
      icon: Newspaper,
      href: "/admin/news",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    },
    {
      title: "Opportunities",
      description: "Manage jobs, tenders, and opportunities",
      icon: OpportunityIcon,
      href: "/admin/opportunities",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/30",
    },
  ];

  const handleAction = (action: QuickAction) => {
    if (action.href) {
      router.push(action.href);
    } else if (action.action) {
      action.action();
    }
  };

  // Form handlers
  const handleAddUser = async () => {
    if (!userForm.name || !userForm.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await userService.create({
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        password: Math.random().toString(36).slice(-8),
      });
      toast.success("User created successfully");
      setAddUserOpen(false);
      setUserForm({ name: "", email: "", role: "member" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTeamMember = async () => {
    if (!teamForm.name || !teamForm.position) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await teamService.create({
        name: teamForm.name,
        position: teamForm.position,
        department: teamForm.department,
        bio: "",
        section: "",
        socialMedia: {},
      });
      toast.success("Team member added successfully");
      setAddTeamOpen(false);
      setTeamForm({ name: "", position: "", department: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddService = async () => {
    if (!serviceForm.title || !serviceForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await serviceService.create({
        title: serviceForm.title,
        description: serviceForm.description,
      });
      toast.success("Service created successfully");
      setAddServiceOpen(false);
      setServiceForm({ title: "", description: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFaq = async () => {
    if (!faqForm.question || !faqForm.answer) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await faqService.create({
        question: faqForm.question,
        answer: faqForm.answer,
      });
      toast.success("FAQ added successfully");
      setAddFaqOpen(false);
      setFaqForm({ question: "", answer: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add FAQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={() => handleAction(action)}
              className="group relative flex flex-col items-start gap-3 rounded-xl border border-border/60 bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 active:scale-[0.98]"
            >
              <div className={`flex size-10 items-center justify-center rounded-lg ${action.bgColor} transition-transform group-hover:scale-110`}>
                <Icon className={`size-5 ${action.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{action.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
              </div>
              <Plus className="absolute top-4 right-4 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          );
        })}
      </div>

      {/* Add User Modal */}
      <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new admin or member account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Full Name</Label>
              <Input
                id="user-name"
                placeholder="John Doe"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="john@example.com"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={userForm.role}
                onValueChange={(value: "admin" | "member") => setUserForm({ ...userForm, role: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Modal */}
      <Dialog open={addTeamOpen} onOpenChange={setAddTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Add a new member to your team.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Full Name</Label>
              <Input
                id="team-name"
                placeholder="Jane Smith"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-position">Position</Label>
              <Input
                id="team-position"
                placeholder="Senior Accountant"
                value={teamForm.position}
                onChange={(e) => setTeamForm({ ...teamForm, position: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-department">Department</Label>
              <Input
                id="team-department"
                placeholder="Finance"
                value={teamForm.department}
                onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTeamOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddTeamMember} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Service Modal */}
      <Dialog open={addServiceOpen} onOpenChange={setAddServiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
            <DialogDescription>Create a new service offering.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-title">Service Title</Label>
              <Input
                id="service-title"
                placeholder="Audit & Assurance"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service-description">Description</Label>
              <Input
                id="service-description"
                placeholder="Comprehensive audit services..."
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddServiceOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddService} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add FAQ Modal */}
      <Dialog open={addFaqOpen} onOpenChange={setAddFaqOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add FAQ</DialogTitle>
            <DialogDescription>Add a new frequently asked question.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="faq-question">Question</Label>
              <Input
                id="faq-question"
                placeholder="What services do you provide?"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-answer">Answer</Label>
              <Input
                id="faq-answer"
                placeholder="We provide a wide range of..."
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFaqOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddFaq} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Add FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
