"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

interface DiscussionCardProps {
  discussion: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    replyCount: number;
    author: {
      name: string;
      image: string;
    };
  };
  onUpdate: () => void;
}

export function DiscussionCard({ discussion, onUpdate }: DiscussionCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={discussion.author.image} alt={discussion.author.name} />
          <AvatarFallback>
            {discussion.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{discussion.title}</h3>
              <p className="text-sm text-muted-foreground">
                {discussion.author.name} ·{" "}
                {formatDistanceToNow(new Date(discussion.createdAt), {
                  addSuffix: true,
                  locale: id,
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {discussion.replyCount}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm line-clamp-2">{discussion.content}</p>
          <div className="mt-4">
            <Button variant="link" asChild className="px-0">
              <Link href={`/discussions/${discussion.id}`}>
                Lihat Diskusi
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}