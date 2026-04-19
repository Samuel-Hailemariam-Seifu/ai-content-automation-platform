export type ContentRow = {
  id: string;
  user_id: string;
  input_text: string;
  blog_output: string | null;
  tweets_output: string[] | null;
  linkedin_output: string | null;
  created_at: string;
};

export type ScheduledPostRow = {
  id: string;
  content_id: string;
  platform: "twitter" | "linkedin" | "blog";
  scheduled_time: string;
  created_at?: string;
};
