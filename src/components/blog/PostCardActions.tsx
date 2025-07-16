import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Share, BookmarkPlus } from "lucide-react";
import { DeletePostDialog } from "./DeletePostDialog";
import { useToast } from "@/hooks/use-toast";

interface PostCardActionsProps {
  postId: string;
  isOwner?: boolean;
  onEdit?: () => void;
  title: string;
}

export const PostCardActions = ({ postId, isOwner, onEdit, title }: PostCardActionsProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: `${window.location.origin}/post/${postId}`,
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
        toast({
          title: "Link copied",
          description: "Post link has been copied to clipboard",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = () => {
    // Implement bookmark functionality
    toast({
      title: "Bookmarked",
      description: "Post has been added to your bookmarks",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleShare}>
          <Share className="mr-2 h-4 w-4" />
          Share Post
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleBookmark}>
          <BookmarkPlus className="mr-2 h-4 w-4" />
          Bookmark
        </DropdownMenuItem>
        
        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </DropdownMenuItem>
            <DeletePostDialog postId={postId}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
              </DropdownMenuItem>
            </DeletePostDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};