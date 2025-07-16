import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikePost } from "@/hooks/usePosts";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LikeButtonProps {
  postId: string;
  likes: number;
  isLiked?: boolean;
  size?: "sm" | "default" | "lg";
}

export const LikeButton = ({ postId, likes, isLiked = false, size = "default" }: LikeButtonProps) => {
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(likes);
  const likePost = useLikePost();

  const handleLike = async () => {
    // Optimistic update
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);

    try {
      const result = await likePost.mutateAsync(postId);
      setLikesCount(result.likes);
    } catch (error) {
      // Revert on error
      setLiked(liked);
      setLikesCount(likes);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            onClick={handleLike}
            disabled={likePost.isPending}
            className={cn(
              "flex items-center gap-1 transition-colors",
              liked && "text-red-500 hover:text-red-600"
            )}
          >
            <Heart
              className={cn(
                "transition-all duration-200",
                size === "sm" && "h-3 w-3",
                size === "default" && "h-4 w-4",
                size === "lg" && "h-5 w-5",
                liked && "fill-current scale-110"
              )}
            />
            <span className={cn(
              "font-medium",
              size === "sm" && "text-xs",
              size === "default" && "text-sm",
              size === "lg" && "text-base"
            )}>
              {likesCount}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{liked ? "Unlike this post" : "Like this post"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};