import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Heart, Ruler, Scale, Activity } from "lucide-react";

const healthProfileFormSchema = z.object({
  age: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  sex: z.enum(["male", "female", "other"]).optional(),
  heightCm: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  weightKg: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  activityLevel: z.enum(["low", "moderate", "high"]).optional(),
});

type HealthProfileFormValues = z.infer<typeof healthProfileFormSchema>;

interface HealthProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function HealthProfileModal({
  open,
  onOpenChange,
  onComplete,
  onSkip,
}: HealthProfileModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(healthProfileFormSchema),
    defaultValues: {
      age: "",
      sex: undefined as "male" | "female" | "other" | undefined,
      heightCm: "",
      weightKg: "",
      activityLevel: undefined as "low" | "moderate" | "high" | undefined,
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: HealthProfileFormValues) => {
      const res = await apiRequest("PATCH", "/api/me/health-profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({
        title: "Profile saved",
        description: "Your health profile has been updated.",
      });
      onOpenChange(false);
      onComplete?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your health profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const skipMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/me/health-profile/skip");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({
        title: "Skipped for now",
        description: "You can complete your profile anytime in Settings.",
      });
      onOpenChange(false);
      onSkip?.();
    },
  });

  async function onSubmit(data: HealthProfileFormValues) {
    setIsSubmitting(true);
    try {
      await updateProfileMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSkip() {
    skipMutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Set Up Your Health Profile
          </DialogTitle>
          <DialogDescription>
            Add some basic health information to get personalized recommendations.
            You can skip this and complete it later in Settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Age
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        data-testid="input-age"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sex</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-sex">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="heightCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Ruler className="h-3 w-3" />
                      Height (cm)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="170"
                        data-testid="input-height"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      Weight (kg)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="70"
                        data-testid="input-weight"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="activityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Activity Level
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-activity">
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low - Mostly sedentary</SelectItem>
                      <SelectItem value="moderate">Moderate - Some exercise</SelectItem>
                      <SelectItem value="high">High - Very active</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting || skipMutation.isPending}
                data-testid="button-skip"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
