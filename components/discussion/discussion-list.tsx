"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDiscussions } from "@/hooks/use-discussions";
import { DiscussionCard } from "./discussion-card";
import { CreateDiscussionDialog } from "./create-discussion-dialog";
import { Search } from "lucide-react";

interface DiscussionListProps {
  courseId: string;
  lessonId?: string;
}

export function DiscussionList({ courseId, lessonId }: DiscussionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { discussions, isLoading, mutate } = useDiscussions(courseId, {
    lessonId,
    searchQuery,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari diskusi..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Mulai Diskusi</Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground">Memuat diskusi...</div>
        ) : discussions?.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Belum ada diskusi. Mulai diskusi pertama!
          </div>
        ) : (
          discussions?.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              onUpdate={() => mutate()}
            />
          ))
        )}
      </div>

      <CreateDiscussionDialog
        courseId={courseId}
        lessonId={lessonId}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {
          setIsCreateOpen(false);
          mutate();
        }}
      />
    </div>
  );
}