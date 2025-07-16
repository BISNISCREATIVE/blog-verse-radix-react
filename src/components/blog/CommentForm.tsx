import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useCreateComment } from "@/hooks/useComments";

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment must be less than 500 characters"),
});

type CommentForm = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

export const CommentForm = ({ postId, onSuccess }: CommentFormProps) => {
  const createComment = useCreateComment();

  const form = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: CommentForm) => {
    try {
      await createComment.mutateAsync({
        postId,
        content: data.content,
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write a comment..."
                  className="min-h-[80px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createComment.isPending || !form.watch("content").trim()}
            size="sm"
          >
            {createComment.isPending ? (
              "Posting..."
            ) : (
              <>
                <Send className="h-3 w-3 mr-1" />
                Post Comment
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};